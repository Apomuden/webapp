import { NzNotificationService } from 'ng-zorro-antd';
import { first } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SetupService } from 'src/app/shared/services/setup.service';

@Component({
  selector: 'app-service-pricing-setup',
  templateUrl: './service-pricing-setup.component.html',
  styleUrls: ['./service-pricing-setup.component.css']
})
export class ServicePricingSetupComponent implements OnInit {



  constructor(private fb: FormBuilder, private setup: SetupService, private notification: NzNotificationService) { }
  initLoading = true;
  loadingMore = false;
  servicePricingForm: FormGroup;
  error = '';
  data = [];
  list = [];
  services = [];
  serviceSubCategories = [];
  serviceCategories = [];
  ageGroups = [];
  fundingTypes = [];
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
      funding_type_id: [null, Validators.required],
      status: [null, Validators.required],
      patient_status: [null, Validators.required],
      amount: [null, Validators.required]
    });


    this.getServicePricings();
    this.getAgeGroups();
    this.getFundingTypes();
    this.getServiceCategories();
    this.getServiceSubCategories();
    this.getHospitalServices();

    this.servicePricingForm.get("service_category_id").valueChanges.subscribe(val => {
      if (val == null) {
        this.servicePricingForm.get("service_subcategory_id").setValue(null);
      }
    });
  }

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
  getFundingTypes() {
    this.isFundingTypesLoading.next(true);
    this.setup.getFundingTypes()
      .pipe(first())
      .subscribe(
        data => {
          this.isFundingTypesLoading.next(false);
          this.fundingTypes = data.data;
        }, error => {
          this.isFundingTypesLoading.next(false);
          console.log(error);
        }
      );
  }

  getServiceCategories() {
    this.isServiceCategoriesLoading.next(true);
    this.setup.getServiceCategories()
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

  getServiceSubCategories() {
    this.isServiceSubCategoriesLoading.next(true);
    this.setup.getServiceSubcategories()
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
            this.getServicePricings()

          } else {
            this.notification.blank(
              'Error',
              `Could not create service pricing`
            );

          }
        }, error => {
          this.isCreatingServicePricing.next(false);
          console.log(error);

          this.notification.blank(
            'Error',
            `Could not create service pricing`
          );
        }
      )
    } else {
      this.error = 'Please fill required fields';
    }

  }

  submitForm() {
    let tempPatientStatus = this.servicePricingForm.controls['patient_status'].value;
    let tempGender = this.servicePricingForm.controls['gender'].value;
    let fields = this.servicePricingForm.value;

    if (tempPatientStatus instanceof Array) {
      fields.patient_status = tempPatientStatus.join(',');
    }
    if (tempGender instanceof Array) {
      fields.gender = tempGender.join(',');
    }
    console.log(fields);
    this.createServicePricing(fields);
  }

}
