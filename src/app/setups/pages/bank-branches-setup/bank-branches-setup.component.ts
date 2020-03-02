import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd';
import { SetupService } from './../../../shared/services/setup.service';
import { first } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-bank-branches-setup',
  templateUrl: './bank-branches-setup.component.html',
  styleUrls: ['./bank-branches-setup.component.css']
})
export class BankBranchesSetupComponent implements OnInit {
  initLoading = true; // bug
  branchId = null;
  loadingMore = false;
  isVisible = false;
  modalError = '';
  updateForm: FormGroup;
  isCreatingBankBranch = new BehaviorSubject(false);
  banksLoading = new BehaviorSubject(false);
  isUpdatingBranch = new BehaviorSubject(false);

  data = [];
  list = [];
  error = '';
  name = '';
  sortCode = '';
  email = '';
  phone = '';
  bank = null;
  banks = null;

  componentLabel = 'bank branch';

  submitForm(): void {
    if (
      this.name == null ||
      this.name === '' ||
      this.bank == null ||
      this.bank === '' ||
      this.phone == null ||
      this.phone === '' ||
      this.email == null ||
      this.email === '' ||
      this.sortCode == null ||
      this.sortCode === ''
    ) {
      this.error = 'All Fields are required!';
    } else {
      this.error = '';
      this.isCreatingBankBranch.next(true);
      this.setup
        .createBankBranch(
          this.name,
          this.sortCode,
          this.bank,
          this.email,
          this.phone
        )
        .pipe(first())
        .subscribe(
          success => {
            this.isCreatingBankBranch.next(false);
            if (success) {
              this.notification.blank(
                'Success',
                `Successfully created ${this.componentLabel}`
              );
              this.getBankBranches();
              this.name = '';
              this.error = '';
              this.name = '';
              this.sortCode = '';
              this.email = '';
              this.phone = '';
              this.bank = null;
            } else {
              this.notification.blank(
                'Error',
                `Could not create ${this.componentLabel}`
              );
            }
          },
          error => {
            this.isCreatingBankBranch.next(false);
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


  showModal(bankBranch: any) {

    this.isVisible = true;
    const { name, sort_code, phone, email } = bankBranch;
    this.branchId = bankBranch.id as number;
    console.log(this.branchId);
    this.updateForm.get('name').setValue(name);
    this.updateForm.get('sort_code').setValue(sort_code);
    this.updateForm.get('phone').setValue(phone);
    this.updateForm.get('email').setValue(email);


  }

  getBankBranches() {
    this.setup
      .getBankBranches()
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

  getBanks() {
    this.banksLoading.next(true);
    this.setup
      .getBanks()
      .pipe(first())
      .subscribe(
        data => {
          this.banksLoading.next(false);
          this.banks = data.data;
        },
        error => {
          this.banksLoading.next(false);
          console.log(error);
        }
      );
  }

  closeModal() {
    this.branchId = null;
    this.updateForm.reset();
    this.isVisible = false;
    this.isUpdatingBranch.next(false);
  }
  ngOnInit() {
    this.updateForm = this.fb.group({
      name: [null, Validators.required],
      sort_code: [null],
      email: [null],
      phone: [null],
    });
    this.getBankBranches();
    this.getBanks();
  }

  toggleItem($event: any, branch: any) {
    this.setup.toggleActive(`setups/bankbranches/${branch.id}`, $event ? 'ACTIVE' : 'INACTIVE').pipe(first())
      .subscribe(toggled => {
        console.log(toggled);
        const index = this.list.findIndex(b => b.id === toggled.id);
        this.list[index].isActivated = toggled.isActivated;
      }, error => {
        console.error(error);
        const index = this.list.findIndex(b => b.id === branch.id);
        this.list[index].isActivated = !branch.isActivated;
        this.notification.error('Toggle failed', 'Unable to toggle this item.');
      });
  }
  update() {
    if (!this.updateForm.valid) {
      this.modalError = 'Name is required';
    } else {
      this.modalError = '';
      this.isUpdatingBranch.next(true);
      this.setup.updateSetup({
        ...this.updateForm.value
      }, `setups/bankbranches/${this.branchId}`).pipe(first()).subscribe(
        response => {
          this.isUpdatingBranch.next(false);
          if (response) {
            this.notification.success('Success', 'Update successful');
            this.getBankBranches();
          } else {
            this.notification.error('Error', 'Update failed');
          }

        },
        error => {
          this.isUpdatingBranch.next(false);
          this.notification.error('Error', 'Update failed');
        }
      );
    }


  }
  deleteBranch(branch: any) {
    this.setup.deleteSetup(`setups/bankbranches/${branch.id}`).pipe(first()).subscribe(
      res => {
        this.getBankBranches();
        this.notification.success('Success', 'Deleted');
      },
      error => {
        this.notification.error('Error', 'Could not delete');
      }
    );
  }
}
