import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd';
import { SetupService } from './../../../shared/services/setup.service';
import { first } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-accreditation-setup',
  templateUrl: './accreditation-setup.component.html',
  styleUrls: ['./accreditation-setup.component.css']
})
export class AccreditationSetupComponent implements OnInit {
  initLoading = true; // bug
  loadingMore = false;
  isCreatingAccreditation = new BehaviorSubject(false);
  isUpdatingAccreditation = new BehaviorSubject(false);
  data = [];
  list = [];
  error = '';
  regBody = '';
  modalError = '';
  regNumber = '';
  isVisible = false;
  tin = '';
  expDate = null;
  registrationDate = null;
  componentLabel = 'accreditation';
  updateForm: FormGroup;
  accreditationId = null;

  constructor(
    private setup: SetupService,
    private notification: NzNotificationService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.updateForm = this.fb.group({
      reg_body: [null, Validators.required],
      reg_no: [null, Validators.required],
      tin: [null, Validators.required],
      reg_date: [null, Validators.required],
      expiry_date: [null, Validators.required]
    });
    this.getAccreditations();
  }

  showModal(accreditation: any) {
    console.log(accreditation);
    this.isVisible = true;
    const { reg_body, reg_no, tin, reg_date, expiry_date } = accreditation;
    this.accreditationId = accreditation.id as number;
    console.log(this.accreditationId);
    this.updateForm.get('reg_body').setValue(reg_body);
    this.updateForm.get('reg_no').setValue(reg_no);
    this.updateForm.get('tin').setValue(tin);
    this.updateForm.get('reg_date').setValue(reg_date);
    this.updateForm.get('expiry_date').setValue(expiry_date);

  }
  closeModal() {
    this.accreditationId = null;
    this.updateForm.reset();
    this.isVisible = false;
    this.isUpdatingAccreditation.next(false);
  }


  submitForm(): void {
    if (this.validateForm()) {
      this.notification.error(`All fields are required!`, `Make sure you've finished the form.`);
    } else {
      this.isCreatingAccreditation.next(true);
      this.setup
        .createAccreditation(
          this.regBody,
          this.regNumber,
          this.registrationDate,
          this.tin,
          this.expDate
        )
        .pipe(first())
        .subscribe(
          success => {
            this.isCreatingAccreditation.next(false);
            if (success) {
              this.notification.success(
                'Success',
                `Successfully created ${this.componentLabel}`
              );
              this.getAccreditations();
              this.tin = '';
              this.regBody = '';
              this.regNumber = '';
              this.expDate = null;
              this.registrationDate = null;
            } else {
              this.notification.error(
                'Error',
                `Could not create ${this.componentLabel}`
              );
            }
          },
          error => {
            this.isCreatingAccreditation.next(false);
            this.notification.error(
              'Error',
              `Could not create ${this.componentLabel}`
            );
          }
        );
    }
  }

  update() {
    if (!this.updateForm.valid) {
      this.modalError = 'All fields are required';
    } else {
      this.modalError = '';
      this.isUpdatingAccreditation.next(true);
      this.setup.updateSetup({
        ...this.updateForm.value,
        reg_date: formatDate(this.updateForm.get('reg_date').value, 'yyyy-MM-dd', 'en'),
        expiry_date: formatDate(this.updateForm.get('expiry_date').value, 'yyyy-MM-dd', 'en')
      }, `setups/accreditations/${this.accreditationId}`).pipe(first()).subscribe(
        response => {
          this.isUpdatingAccreditation.next(false);
          if (response) {
            this.notification.success('Success', 'Update successful');
            this.getAccreditations();
          } else {
            this.notification.error('Error', 'Update failed');
          }

        },
        error => {
          this.isUpdatingAccreditation.next(false);
          this.notification.error('Error', 'Update failed');
        }
      );
    }

  }
  validateForm() {
    return (this.regBody == null ||
      this.regBody === '' ||
      this.tin == null ||
      this.tin === '' ||
      this.registrationDate == null ||
      this.registrationDate === '' ||
      this.expDate == null ||
      this.expDate === '' ||
      this.regNumber == null ||
      this.regNumber === '');
  }

  onRegistrationDateChanged(result: Date): void {
    this.registrationDate = result;
  }

  onExpiryDateChanged(result: Date): void {
    this.expDate = result;
  }

  getAccreditations() {
    this.setup
      .getAccreditations()
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

  toggleItem($event: any, accreditation: any) {
    this.setup.toggleActive(`setups/accreditations/${accreditation.id}`, $event ? 'ACTIVE' : 'INACTIVE').pipe(first())
      .subscribe(toggled => {
        const index = this.list.findIndex(accred => accred.id === toggled.id);
        this.list[index].isActivated = toggled.isActivated;
      }, error => {
        console.error(error);
        const index = this.list.findIndex(accred => accred.id === accreditation.id);
        this.list[index].isActivated = !accreditation.isActivated;
        this.notification.error('Toggle failed', 'Unable to toggle this item.');
      });
  }

  deleteAccreditation(accreditation: any) {
    this.setup.deleteSetup(`setups/accreditations/${accreditation.id}`).pipe(first()).subscribe(
      res => {
        this.getAccreditations();
        this.notification.success('Success', 'Deleted');
      },
      error => {
        this.notification.error('Error', 'Could not delete');
      }
    );
  }
}
