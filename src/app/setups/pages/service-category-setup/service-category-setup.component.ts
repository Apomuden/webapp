import { NzNotificationService } from 'ng-zorro-antd';
import { SetupService } from './../../../shared/services/setup.service';
import { first } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-service-category-setup',
  templateUrl: './service-category-setup.component.html',
  styleUrls: ['./service-category-setup.component.css']
})
export class ServiceCategorySetupComponent implements OnInit {
  initLoading = true; // bug
  loadingMore = false;
  isCreatingServiceCategory = new BehaviorSubject(false);
  hospitalServicesLoading = new BehaviorSubject(false);

  data = [];
  list = [];
  error = '';
  name = '';

  hospitalService = null;

  hospitalServices = null;

  componentLabel = 'service category';

  submitForm(): void {
    if (
      this.name == null ||
      this.name === '' ||
      this.hospitalService == null ||
      this.hospitalService === ''
    ) {
      this.error = 'All Fields are required!';
    } else {
      this.error = '';
      this.isCreatingServiceCategory.next(true);
      this.setup
        .createServiceCategory(this.name, this.hospitalService)
        .pipe(first())
        .subscribe(
          success => {
            this.isCreatingServiceCategory.next(false);
            if (success) {
              this.notification.blank(
                'Success',
                `Successfully created ${this.componentLabel}`
              );
              this.getServiceCategories();
              this.name = '';
            } else {
              this.notification.blank(
                'Error',
                `Could not create ${this.componentLabel}`
              );
            }
          },
          error => {
            this.isCreatingServiceCategory.next(false);
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
  ) { }

  getServiceCategories() {
    this.setup
      .getServiceCategories()
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

  getHospitalServices() {
    this.hospitalServicesLoading.next(true);
    this.setup
      .getHospitalServices()
      .pipe(first())
      .subscribe(
        data => {
          this.hospitalServicesLoading.next(false);
          this.hospitalServices = data.data;
        },
        error => {
          this.hospitalServicesLoading.next(false);
          console.log(error);
        }
      );
  }

  ngOnInit() {
    this.getServiceCategories();
    this.getHospitalServices();
  }

  toggleItem($event: any, category: any) {
    this.setup.toggleActive(`setups/categories/${category.id}`, $event ? 'ACTIVE' : 'INACTIVE').pipe(first())
      .subscribe(toggled => {
        const index = this.list.findIndex(i => i.id === toggled.id);
        this.list[index].isActivated = toggled.isActivated;
      }, error => {
        console.error(error);
        const index = this.list.findIndex(i => i.id === category.id);
        this.list[index].isActivated = !category.isActivated;
        this.notification.error('Toggle failed', 'Unable to toggle this item.');
      });
  }
}
