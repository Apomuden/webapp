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
  data = [];
  list = [];
  error = '';
  staffCategory = '';
  componentLabel = 'staff category';

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
    private notification: NzNotificationService
  ) {}
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
    this.getStaffCategories();
  }
}
