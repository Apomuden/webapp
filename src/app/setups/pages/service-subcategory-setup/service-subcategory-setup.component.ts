import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  isUpdatingServiceSubCategory = new BehaviorSubject(false);
  updateForm: FormGroup;

  data = [];
  list = [];
  error = '';
  name = '';
  isVisible = false;
  modalError = null;
  serviceSubCategoryId = null;

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
    private notification: NzNotificationService,
    private fb: FormBuilder
  ) { }

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
    this.updateForm = this.fb.group({
      name: [null, Validators.required],
      service_category_id: [null, Validators.required]
    })
    this.getServiceSubcategories();
    this.getServiceCategories();
  }

  toggleItem($event: any, sub: any) {
    this.setup.toggleActive(`setups/servicesubcategories/${sub.id}`, $event ? 'ACTIVE' : 'INACTIVE').pipe(first())
      .subscribe(toggled => {
        const index = this.list.findIndex(i => i.id === toggled.id);
        this.list[index].isActivated = toggled.isActivated;
      }, error => {
        console.error(error);
        const index = this.list.findIndex(i => i.id === sub.id);
        this.list[index].isActivated = !sub.isActivated;
        this.notification.error('Toggle failed', 'Unable to toggle this item.');
      });
  }

  update() {
    if (!this.updateForm.valid) {
      this.modalError = 'Please fill required fields';
    } else {
      this.modalError = '';
      this.isUpdatingServiceSubCategory.next(true);
      this.setup.updateSetup({
        ...this.updateForm.value
      }, `setups/servicesubcategories/${this.serviceSubCategoryId}`).pipe(first()).subscribe(
        response => {
          this.isUpdatingServiceSubCategory.next(false);
          if (response) {
            this.notification.success('Success', 'Update successful');
            this.getServiceSubcategories();
          } else {
            this.notification.error('Error', 'Update failed');
          }

        },
        error => {
          this.isUpdatingServiceSubCategory.next(false);
          this.notification.error('Error', 'Update failed');
        }
      );
    }


  }

  deleteServiceSubCategory(serviceSubCategory: any) {
    this.setup.deleteSetup(`setups/servicesubcategories/${serviceSubCategory.id}`).pipe(first()).subscribe(
      res => {
        this.getServiceSubcategories();
        this.notification.success('Success', 'Deleted');
      },
      error => {
        this.notification.error('Error', 'Could not delete');
      }
    );
  }
  closeModal() {
    this.serviceSubCategoryId = null;
    this.updateForm.reset();
    this.isVisible = false;
    this.isUpdatingServiceSubCategory.next(false);
  }
  showModal(serviceSubCategory: any) {
    this.isVisible = true;
    const {
      name,
      service_category_id,
    } = serviceSubCategory;
    this.serviceSubCategoryId = serviceSubCategory.id as number;
    console.log(this.serviceSubCategoryId);
    this.updateForm.get('name').setValue(name);
    this.updateForm.get('service_category_id').setValue(service_category_id)
  }
}

