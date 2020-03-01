import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd';
import { SetupService } from './../../../shared/services/setup.service';
import { first } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-bank-setup',
  templateUrl: './bank-setup.component.html',
  styleUrls: ['./bank-setup.component.css']
})
export class BankSetupComponent implements OnInit {
  initLoading = true; // bug
  loadingMore = false;
  isCreatingBank = new BehaviorSubject(false);
  isUpdatingBank = new BehaviorSubject(false);
  bankId = null;
  data = [];
  list = [];
  updateForm: FormGroup;
  error = '';
  modalError = '';
  name = '';
  sortCode = '';
  isVisible = false;
  email = '';
  phone = '';

  componentLabel = 'bank';

  submitForm(): void {
    if (
      this.name == null ||
      this.name === '' ||
      this.sortCode == null ||
      this.sortCode === '' ||
      this.email == null ||
      this.email === '' ||
      this.phone == null ||
      this.phone === ''
    ) {
      this.error = 'All Fields are required!';
    } else {
      this.error = '';
      this.isCreatingBank.next(true);
      this.setup
        .createBank(this.name, this.sortCode, this.email, this.phone)
        .pipe(first())
        .subscribe(
          success => {
            this.isCreatingBank.next(false);
            if (success) {
              this.notification.blank(
                'Success',
                `Successfully created ${this.componentLabel}`
              );
              this.getBanks();
              this.name = '';
              this.sortCode = '';
              this.email = '';
              this.phone = '';
            } else {
              this.notification.blank(
                'Error',
                `Could not create ${this.componentLabel}`
              );
            }
          },
          error => {
            this.isCreatingBank.next(false);
            this.notification.blank(
              'Error',
              `Could not create ${this.componentLabel}`
            );
          }
        );
    }
  }

  constructor(
    private setup: SetupService,
    private notification: NzNotificationService,
    private fb: FormBuilder
  ) { }


  showModal(bank: any) {

    this.isVisible = true;
    const { name, sort_code, phone, email } = bank;
    this.bankId = bank.id as number;
    console.log(this.bankId);
    this.updateForm.get('name').setValue(name);
    this.updateForm.get('sort_code').setValue(sort_code);
    this.updateForm.get('phone').setValue(phone);
    this.updateForm.get('email').setValue(email);


  }

  closeModal() {
    this.bankId = null;
    this.updateForm.reset();
    this.isVisible = false;
    this.isUpdatingBank.next(false);
  }

  update() {
    if (!this.updateForm.valid) {
      this.modalError = 'all fields are required';
    } else {
      this.modalError = '';
      this.isUpdatingBank.next(true);
      this.setup.updateSetup({
        ...this.updateForm.value
      }, `setups/banks/${this.bankId}`).pipe(first()).subscribe(
        response => {
          this.isUpdatingBank.next(false);
          if (response) {
            this.notification.success('Success', 'Update successful');
            this.getBanks();
          } else {
            this.notification.error('Error', 'Update failed');
          }
        },
        error => {
          this.isUpdatingBank.next(false);
          this.notification.error('Error', 'Update failed');
        }
      );
    }


  }
  deleteBank(bank: any) {
    this.setup.deleteSetup(`setups/banks/${bank.id}`).pipe(first()).subscribe(
      res => {
        this.getBanks();
        this.notification.success('Success', 'Deleted');
      },
      error => {
        this.notification.error('Error', 'Could not delete');
      }
    );
  }

  getBanks() {
    this.setup
      .getBanks()
      .pipe(first())
      .subscribe(
        data => {
          this.data = data.data;
          this.list = data.data;
          this.initLoading = false;
          console.log(this.data);
        },
        error => {
          console.log(error);
        }
      );
  }

  ngOnInit() {
    this.updateForm = this.fb.group({
      name: [null, Validators.required],
      sort_code: [null],
      email: [null],
      phone: [null]
    });
    this.getBanks();
  }

  toggleItem($event: any, bank: any) {
    this.setup.toggleActive(`setups/banks/${bank.id}`, $event ? 'ACTIVE' : 'INACTIVE').pipe(first())
      .subscribe(toggled => {
        const index = this.list.findIndex(b => b.id === toggled.id);
        this.list[index].isActivated = toggled.isActivated;
      }, error => {
        console.error(error);
        const index = this.list.findIndex(b => b.id === bank.id);
        this.list[index].isActivated = !bank.isActivated;
        this.notification.error('Toggle failed', 'Unable to toggle this item.');
      });
  }
}
