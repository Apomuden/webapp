import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd';
import { SetupService } from './../../../shared/services/setup.service';
import { first } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-staff-type-setup',
  templateUrl: './staff-type-setup.component.html',
  styleUrls: ['./staff-type-setup.component.css']
})
export class StaffTypeSetupComponent implements OnInit {
  initLoading = true; // bug
  loadingMore = false;
  isVisible = false;
  isCreatingStaffType = new BehaviorSubject(false);
  isUpdatingStaffType = new BehaviorSubject(false);
  modalError = '';
  data = [];
  updateForm: FormGroup;
  list = [];
  staffTypeId = null;
  error = '';
  name = '';
  validityDays = '';

  componentLabel = 'staff type';

  submitForm(): void {
    if (
      this.name == null ||
      this.name === '' ||
      this.validityDays == null ||
      this.validityDays === ''
    ) {
      this.error = 'All Fields are required!';
    } else {
      this.error = '';
      this.isCreatingStaffType.next(true);
      this.setup
        .createStaffType(this.name, this.validityDays)
        .pipe(first())
        .subscribe(
          success => {
            this.isCreatingStaffType.next(false);
            if (success) {
              this.notification.blank(
                'Success',
                `Successfully created ${this.componentLabel}`
              );
              this.getStaffTypes();
              this.name = '';
            } else {
              this.notification.blank(
                'Error',
                `Could not create ${this.componentLabel}`
              );
            }
          },
          error => {
            this.isCreatingStaffType.next(false);
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

  getStaffTypes() {
    this.setup
      .getStaffTypes()
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
      validity_days: [null, Validators.required]
    });
    this.getStaffTypes();
  }

  toggleItem($event: any, type: any) {
    this.setup.toggleActive(`setups/stafftypes/${type.id}`, $event ? 'ACTIVE' : 'INACTIVE').pipe(first())
      .subscribe(toggled => {
        const index = this.list.findIndex(i => i.id === toggled.id);
        this.list[index].isActivated = toggled.isActivated;
      }, error => {
        console.error(error);
        const index = this.list.findIndex(i => i.id === type.id);
        this.list[index].isActivated = !type.isActivated;
        this.notification.error('Toggle failed', 'Unable to toggle this item.');
      });
  }
  update() {
    if (!this.updateForm.valid) {
      this.modalError = 'Please fill required fields';
    } else {
      this.modalError = '';
      this.isUpdatingStaffType.next(true);
      this.setup.updateSetup({
        ...this.updateForm.value
      }, `setups/stafftypes/${this.staffTypeId}`).pipe(first()).subscribe(
        response => {
          this.isUpdatingStaffType.next(false);
          if (response) {
            this.notification.success('Success', 'Update successful');
            this.getStaffTypes();
          } else {
            this.notification.error('Error', 'Update failed');
          }

        },
        error => {
          this.isUpdatingStaffType.next(false);
          this.notification.error('Error', 'Update failed');
        }
      );
    }


  }

  deleteStaffType(staffType: any) {
    this.setup.deleteSetup(`setups/stafftypes/${staffType.id}`).pipe(first()).subscribe(
      res => {
        this.getStaffTypes();
        this.notification.success('Success', 'Deleted');
      },
      error => {
        this.notification.error('Error', 'Could not delete');
      }
    );
  }
  closeModal() {
    this.staffTypeId = null;
    this.updateForm.reset();
    this.isVisible = false;
    this.isUpdatingStaffType.next(false);
  }
  showModal(staffType: any) {
    this.isVisible = true;
    const {
      name,
      validity_days
    } = staffType;
    this.staffTypeId = staffType.id as number;
    console.log(this.staffTypeId);
    this.updateForm.get('name').setValue(name);
    this.updateForm.get('validity_days').setValue(validity_days);

  }
}




