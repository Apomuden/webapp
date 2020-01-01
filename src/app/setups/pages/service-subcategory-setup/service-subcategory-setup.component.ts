import { NzNotificationService } from 'ng-zorro-antd';
import { SetupService } from './../../../shared/services/setup.service';
import { first } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-service-subcategory-setup',
  templateUrl: './service-subcategory-setup.component.html',
  styleUrls: ['./service-subcategory-setup.component.css']
})
export class ServiceSubcategorySetupComponent implements OnInit {
  initLoading = true; // bug
  loadingMore = false;
  isCreatingServiceSubcategory = new BehaviorSubject(false);
  serviceCategoriesLoading = new BehaviorSubject(false);

  data = [];
  list = [];
  error = '';
  name = '';

  serviceCategory = null;

  serviceCategories = null;

  componentLabel = 'service subcategory';

  submitForm(): void {
    if (
      this.name == null ||
      this.name === '' ||
      this.serviceCategory == null ||
      this.serviceCategory === ''
    ) {
      this.error = 'All Fields are required!';
    } else {
      this.error = '';
      this.isCreatingServiceSubcategory.next(true);
      this.setup
        .createServiceSubcategory(this.name, this.serviceCategory)
        .pipe(first())
        .subscribe(
          success => {
            this.isCreatingServiceSubcategory.next(false);
            if (success) {
              this.notification.blank(
                'Success',
                `Successfully created ${this.componentLabel}`
              );
              this.getServiceSubcategories();
              this.name = '';
            } else {
              this.notification.blank(
                'Error',
                `Could not create ${this.componentLabel}`
              );
            }
          },
          error => {
            this.isCreatingServiceSubcategory.next(false);
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

  getServiceSubcategories() {
    this.setup
      .getServiceSubcategories()
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

  getServiceCategories() {
    this.serviceCategoriesLoading.next(true);
    this.setup
      .getServiceCategories()
      .pipe(first())
      .subscribe(
        data => {
          this.serviceCategoriesLoading.next(false);
          this.serviceCategories = data.data;
        },
        error => {
          this.serviceCategoriesLoading.next(false);
          console.log(error);
        }
      );
  }

  ngOnInit() {
    this.getServiceSubcategories();
    this.getServiceCategories();
  }
}
