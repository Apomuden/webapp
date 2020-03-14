import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SetupService } from './../../../shared/services/setup.service';
import { first } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NzNotificationService } from 'ng-zorro-antd';

@Component({
  selector: 'app-staff-category-setup',
  templateUrl: './staff-category-setup.component.html',
  styleUrls: ['./staff-category-setup.component.css']
})
export class StaffCategorySetupComponent implements OnInit {
  initLoading = true; // bug
  loadingMore = false;
  isCreatingStaffCategory = new BehaviorSubject(false);
  isVisible = false;
  isUpdatingStaffCategory = new BehaviorSubject(false);
  data = [];
  list = [];
  error = '';
  staffCategoryId = null;
  modalError = '';
  staffCategory = '';
  componentLabel = 'staff category';
  updateForm: FormGroup;

  submitForm(): void {
    if (this.staffCategory == null || this.staffCategory === '') {
      this.error = `Please enter ${this.componentLabel} name`;
    } else {
      this.error = '';
      this.isCreatingStaffCategory.next(true);
      this.setup
        .createStaffCategory(this.staffCategory)
        .pipe(first())
        .subscribe(
          success => {
            this.isCreatingStaffCategory.next(false);
            if (success) {
              this.notification.blank(
                'Success',
                `Successfully created ${this.componentLabel}`
              );
              this.getStaffCategories();
              this.staffCategory = '';
            } else {
              this.notification.blank(
                'Error',
                `Could not create ${this.componentLabel}`
              );
            }
          },
          error => {
            this.isCreatingStaffCategory.next(false);
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
  getStaffCategories() {
    this.setup
      .getStaffCategories()
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
      name: [null, Validators.required]
    });
    this.getStaffCategories();
  }

  toggleItem($event: any, staffcat: any) {
    this.setup.toggleActive(`setups/staffcategories/${staffcat.id}`, $event ? 'ACTIVE' : 'INACTIVE').pipe(first())
      .subscribe(toggled => {
        const index = this.list.findIndex(i => i.id === toggled.id);
        this.list[index].isActivated = toggled.isActivated;
      }, error => {
        console.error(error);
        const index = this.list.findIndex(i => i.id === staffcat.id);
        this.list[index].isActivated = !staffcat.isActivated;
        this.notification.error('Toggle failed', 'Unable to toggle this item.');
      });
  }
  update() {
    if (!this.updateForm.valid) {
      this.modalError = 'Please fill required fields';
    } else {
      this.modalError = '';
      this.isUpdatingStaffCategory.next(true);
      this.setup.updateSetup({
        ...this.updateForm.value
      }, `setups/staffcategories/${this.staffCategoryId}`).pipe(first()).subscribe(
        response => {
          this.isUpdatingStaffCategory.next(false);
          if (response) {
            this.notification.success('Success', 'Update successful');
            this.getStaffCategories();
          } else {
            this.notification.error('Error', 'Update failed');
          }

        },
        error => {
          this.isUpdatingStaffCategory.next(false);
          this.notification.error('Error', 'Update failed');
        }
      );
    }


  }

  deleteStaffCategory(staffCategory: any) {
    this.setup.deleteSetup(`setups/staffcategories/${staffCategory.id}`).pipe(first()).subscribe(
      res => {
        this.getStaffCategories();
        this.notification.success('Success', 'Deleted');
      },
      error => {
        this.notification.error('Error', 'Could not delete');
      }
    );
  }
  closeModal() {
    this.staffCategoryId = null;
    this.updateForm.reset();
    this.isVisible = false;
    this.isUpdatingStaffCategory.next(false);
  }
  showModal(specialty: any) {
    this.isVisible = true;
    const {
      name
    } = specialty;
    this.staffCategoryId = specialty.id as number;
    console.log(this.staffCategoryId);
    this.updateForm.get('name').setValue(name);

  }
}




