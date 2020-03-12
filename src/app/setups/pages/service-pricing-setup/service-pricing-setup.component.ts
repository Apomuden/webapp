import { NzNotificationService } from 'ng-zorro-antd';
import { first } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SetupService } from 'src/app/shared/services/setup.service';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';

@Component({
  selector: 'app-service-pricing-setup',
  templateUrl: './service-pricing-setup.component.html',
  styleUrls: ['./service-pricing-setup.component.css']
})
export class ServicePricingSetupComponent implements OnInit, OnDestroy {

  constructor(private fb: FormBuilder, private setup: SetupService, private notification: NzNotificationService) { }
  initLoading = true;
  loadingMore = false;
  servicePricingForm: FormGroup;
  updateForm: FormGroup;
  error = '';
  data = [];
  list = [];
  services = [];
  serviceSubCategories = [];
  serviceSubCategoriesForModal = [];
  serviceCategories = [];
  serviceCategoriesForModal = [];
  ageGroups = [];
  fundingTypes = [];
  isVisible = false;
  modalError = null;
  servicePricingId = null;


  //for update modal
  isLoadingServiceCategories = new BehaviorSubject(false);
  isLoadingServiceSubCategories = new BehaviorSubject(false);
  isUpdatingServicePricing = new BehaviorSubject(false);





  //for creation form
  isHospitalServicesLoading = new BehaviorSubject(false);
  isServiceSubCategoriesLoading = new BehaviorSubject(false);
  isServiceCategoriesLoading = new BehaviorSubject(false);
  isAgeGroupsLoading = new BehaviorSubject(false);
  isFundingTypesLoading = new BehaviorSubject(false);
  isCreatingServicePricing = new BehaviorSubject(false);


  ngOnInit() {
    this.servicePricingForm = this.fb.group({
      description: [null, Validators.required],
      hospital_service_id: [null, Validators.required],
      service_category_id: [null, Validators.required],
      service_subcategory_id: [null],
      age_group_id: [null, Validators.required],
      gender: [null, Validators.required],
      status: [null, Validators.required],
      patient_status: [null, Validators.required],
      prepaid_amount: [null, Validators.required],
      postpaid_amount: [null, Validators.required]
    });

    this.updateForm = this.fb.group({
      description: [null, Validators.required],
      hospital_service_id: [null, Validators.required],
      service_category_id: [null, Validators.required],
      service_subcategory_id: [null],
      age_group_id: [null, Validators.required],
      gender: [null, Validators.required],
      status: [null, Validators.required],
      patient_status: [null, Validators.required],
      prepaid_amount: [null, Validators.required],
      postpaid_amount: [null, Validators.required]
    });


    this.getServicePricings();
    this.getAgeGroups();
    this.getHospitalServices();


    this.servicePricingForm.get('service_category_id').valueChanges.pipe(untilComponentDestroyed(this)).subscribe(val => {
      this.getServiceSubCategoriesByCategory(val);
      this.servicePricingForm.get('service_subcategory_id').setValue(null);
    });

    this.updateForm.get('hospital_service_id').valueChanges.pipe(untilComponentDestroyed(this)).subscribe(val => {
      this.getServiceCategoriesByHospitalServiceForModal(val);
      this.updateForm.get('service_category_id').setValue(null);
    });
    this.updateForm.get('service_category_id').valueChanges.pipe(untilComponentDestroyed(this)).subscribe(val => {
      this.getServiceSubCategoriesByCategoryForModal(val);
      this.updateForm.get('service_subcategory_id').setValue(null);
    });

    this.servicePricingForm.get('hospital_service_id').valueChanges.pipe(untilComponentDestroyed(this))
      .subscribe(val => {
        this.servicePricingForm.get('service_category_id').reset();
        if (val) {
          this.getServiceCategories(val);
        }
      });
  }

  ngOnDestroy() { }

  getAgeGroups() {
    this.isAgeGroupsLoading.next(true);
    this.setup.getAgeGroups()
      .pipe(first())
      .subscribe(
        data => {
          this.isAgeGroupsLoading.next(false);
          this.ageGroups = data.data;
        }, error => {
          this.isAgeGroupsLoading.next(false);
          console.log(error);
        }
      );
  }



  getServiceCategories(hospital_service_id: number) {
    this.serviceCategories = [];
    this.isServiceCategoriesLoading.next(true);
    this.setup.getServiceCatByServiceId(hospital_service_id)
      .pipe(first())
      .subscribe(
        data => {
          this.isServiceCategoriesLoading.next(false);
          this.serviceCategories = data.data;
        }, error => {
          this.isServiceCategoriesLoading.next(false);
          console.log(error);
        }
      );
  }


  getServiceSubCategoriesByCategoryForModal(id: number) {
    this.isLoadingServiceSubCategories.next(true);
    this.setup.getServiceSubcategoriesByCategory(id)
      .pipe(first())
      .subscribe(
        data => {
          this.isLoadingServiceSubCategories.next(false);
          this.serviceSubCategoriesForModal = data.data;
        }, error => {
          this.isLoadingServiceSubCategories.next(false);
          console.log(error);
        }
      );
  }
  getServiceCategoriesByHospitalServiceForModal(id: number) {
    this.isLoadingServiceCategories.next(true);
    this.setup.getServiceCategoriesByHospitalService(id)
      .pipe(first())
      .subscribe(
        data => {
          this.isLoadingServiceCategories.next(false);
          this.serviceCategoriesForModal = data.data;
        }, error => {
          this.isLoadingServiceCategories.next(false);
          console.log(error);
        }
      );
  }


  getServiceSubCategoriesByCategory(id: number) {
    this.isServiceSubCategoriesLoading.next(true);
    this.setup.getServiceSubcategoriesByCategory(id)
      .pipe(first())
      .subscribe(
        data => {
          this.isServiceSubCategoriesLoading.next(false);
          this.serviceSubCategories = data.data;
        }, error => {
          this.isServiceSubCategoriesLoading.next(false);
          console.log(error);
        }
      );
  }

  getServicePricings() {
    this.setup
      .getServicePricings()
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
    this.isHospitalServicesLoading.next(true);
    this.setup.getHospitalServices().pipe(first()).subscribe(
      res => {
        this.services = res.data;
        this.isHospitalServicesLoading.next(false);
      },
      error => {
        console.log(error);
        this.isHospitalServicesLoading.next(false);
      }
    );
  }

  createServicePricing(fields: object) {
    this.isCreatingServicePricing.next(true);
    if (this.servicePricingForm.valid) {
      this.setup.createServicePricing(fields).pipe(first()).subscribe(
        res => {
          this.isCreatingServicePricing.next(false);
          if (res) {
            this.notification.blank(
              'Success',
              `Successfully created service pricing`
            );
            this.getServicePricings();

          } else {
            this.notification.blank(
              'Error',
              `Could not create service`
            );

          }
        }, error => {
          this.isCreatingServicePricing.next(false);
          console.log(error);

          this.notification.blank(
            'Error',
            `Could not create service`
          );
        }
      );
    } else {
      this.error = 'Please fill required fields';
    }

  }

  submitForm() {
    const tempPatientStatus = this.servicePricingForm.controls['patient_status'].value;
    const tempGender = this.servicePricingForm.controls['gender'].value;
    const fields = this.servicePricingForm.value;

    if (tempPatientStatus instanceof Array) {
      fields.patient_status = tempPatientStatus.join(',');
    }
    if (tempGender instanceof Array) {
      fields.gender = tempGender.join(',');
    }
    console.log(fields);
    this.createServicePricing(fields);
  }

  toggleItem($event: any, service: any) {
    this.setup.toggleActive(`pricing/services/${service.id}`, $event ? 'ACTIVE' : 'INACTIVE').pipe(first())
      .subscribe(toggled => {
        const index = this.list.findIndex(i => i.id === toggled.id);
        this.list[index].isActivated = toggled.isActivated;
      }, error => {
        console.error(error);
        const index = this.list.findIndex(i => i.id === service.id);
        this.list[index].isActivated = !service.isActivated;
        this.notification.error('Toggle failed', 'Unable to toggle this item.');
      });
  }

  update() {
    if (!this.updateForm.valid) {
      this.modalError = 'Please fill required fields';
    } else {
      this.modalError = '';
      this.isUpdatingServicePricing.next(true);
      this.setup.updateSetup({
        ...this.updateForm.value,
        patient_status: this.updateForm.get('patient_status').value.join(','),
        gender: this.updateForm.get('gender').value.join(',')
      }, `pricing/services/${this.servicePricingId}`).pipe(first()).subscribe(
        response => {
          this.isUpdatingServicePricing.next(false);
          if (response) {
            this.notification.success('Success', 'Update successful');
            this.getServicePricings();
          } else {
            this.notification.error('Error', 'Update failed');
          }

        },
        error => {
          this.isUpdatingServicePricing.next(false);
          this.notification.error('Error', 'Update failed');
        }
      );
    }


  }
  deleteServicePricing(servicePricing: any) {
    this.setup.deleteSetup(`pricing/services/${servicePricing.id}`).pipe(first()).subscribe(
      res => {
        this.getServicePricings();
        this.notification.success('Success', 'Deleted');
      },
      error => {
        this.notification.error('Error', 'Could not delete');
      }
    );
  }
  closeModal() {
    this.servicePricingId = null;
    this.updateForm.reset();
    this.isVisible = false;
    this.isUpdatingServicePricing.next(false);
  }
  showModal(servicePricing: any) {
    this.isVisible = true;
    const { description,
      hospital_service_id,
      service_category_id,
      service_subcategory_id,
      age_group_id,
      gender,
      status,
      patient_status,
      prepaid_amount,
      postpaid_amount
    } = servicePricing;
    this.servicePricingId = servicePricing.id as number;
    console.log(this.servicePricingId);
    this.updateForm.get('description').setValue(description);
    this.updateForm.get('hospital_service_id').setValue(hospital_service_id);
    this.updateForm.get('service_category_id').setValue(service_category_id);
    this.updateForm.get('service_subcategory_id').setValue(service_subcategory_id);
    this.updateForm.get('age_group_id').setValue(age_group_id);
    this.updateForm.get('gender').setValue(gender.split(','));
    this.updateForm.get('status').setValue(status);
    this.updateForm.get('patient_status').setValue(patient_status.split(','));
    this.updateForm.get('prepaid_amount').setValue(prepaid_amount);
    this.updateForm.get('postpaid_amount').setValue(postpaid_amount);
  }
}
