import { NzNotificationService } from 'ng-zorro-antd';
import { first, map } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { SetupService } from 'src/app/shared/services/setup.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-clinic-type-setup',
  templateUrl: './clinic-type-setup.component.html',
  styleUrls: ['./clinic-type-setup.component.css']
})
export class ClinicTypeSetupComponent implements OnInit {

  constructor(private fb: FormBuilder, private setup: SetupService, private notification: NzNotificationService) { }
  clinicTypeForm: FormGroup;
  error: String;
  initLoading = true;
  modalError = '';
  updateForm: FormGroup;
  clinicTypeId = null;
  isVisible = false;
  loadingMore = false;
  isCreatingClinicType = new BehaviorSubject(false);
  isUpdatingClinicType = new BehaviorSubject(false);

  data = [];
  list = [];

  ngOnInit() {
    this.getClinicTypes();
    this.clinicTypeForm = this.fb.group({
      name: [null, [Validators.required]]
    });
    this.updateForm = this.fb.group({
      name: [null, [Validators.required]]
    });
  }
  getClinicTypes() {
    this.setup
      .getClinicTypes()
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
  submitForm() {
    if (this.clinicTypeForm.valid) {
      this.isCreatingClinicType.next(true);
      this.setup.createClinicType(this.clinicTypeForm.value.name).pipe(first()).subscribe(
        success => {
          this.isCreatingClinicType.next(false);
          if (success) {
            this.notification.blank(
              'Success',
              'Successfully created clinic type'
            );
            this.clinicTypeForm.reset();
            this.getClinicTypes();
            this.error = '';
          } else {
            this.notification.blank(
              'Error',
              'Could not create clinic type'
            );
            this.error = '';
          }
        },
        err => {
          this.isCreatingClinicType.next(false);
          this.notification.blank(
            'Error',
            'Could not create clinic type'
          );
        }
      );
    } else {
      this.error = 'Was unable to create clinic type';
    }
  }

  toggleItem($event: any, type: any) {
    this.setup.toggleActive(`setups/clinictypes/${type.id}`, $event ? 'ACTIVE' : 'INACTIVE').pipe(first())
      .subscribe(toggled => {
        const index = this.list.findIndex(t => t.id === toggled.id);
        this.list[index].isActivated = toggled.isActivated;
      }, error => {
        console.error(error);
        const index = this.list.findIndex(t => t.id === type.id);
        this.list[index].isActivated = !type.isActivated;
        this.notification.error('Toggle failed', 'Unable to toggle this item.');
      });
  }

  deleteClinicType(clinicType: any) {
    this.setup.deleteSetup(`setups/clinictypes/${clinicType.id}`).pipe(first()).subscribe(
      res => {
        this.getClinicTypes();
        this.notification.success('Success', 'Deleted');
      },
      error => {
        this.notification.error('Error', 'Could not delete');
      }
    );
  }
  closeModal() {
    this.clinicTypeId = null;
    this.updateForm.reset();
    this.isVisible = false;
    this.isUpdatingClinicType.next(false);
  }
  showModal(clinicType: any) {
    this.isVisible = true;
    const { name } = clinicType;
    this.clinicTypeId = clinicType.id as number;
    this.updateForm.get('name').setValue(name);
  }
  update() {
    if (!this.updateForm.valid) {
      this.modalError = 'Name is required';
    } else {
      this.modalError = '';
      this.isUpdatingClinicType.next(true);
      this.setup.updateSetup({
        ...this.updateForm.value
      }, `setups/clinictypes/${this.clinicTypeId}`).pipe(first()).subscribe(
        response => {
          this.isUpdatingClinicType.next(false);
          if (response) {
            this.notification.success('Success', 'Update successful');
            this.getClinicTypes();
          } else {
            this.notification.error('Error', 'Update failed');
          }

        },
        error => {
          this.isUpdatingClinicType.next(false);
          this.notification.error('Error', 'Update failed');
        }
      );
    }


  }
}
