import { first } from 'rxjs/operators';
import { NzNotificationService } from 'ng-zorro-antd';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SetupService } from 'src/app/shared/services/setup.service';

@Component({
  selector: 'app-clinic-service-setup',
  templateUrl: './clinic-service-setup.component.html',
  styleUrls: ['./clinic-service-setup.component.css']
})
export class ClinicServiceSetupComponent implements OnInit {
  data = [];
  list = [];
  billingCycles = [];
  clinics = [];
  servicePricings = [];
  error = '';
  initLoading = true;
  isCreatingClinicService = new BehaviorSubject(false);
  isBillingCyclesLoading = new BehaviorSubject(false);
  isServicePricingsLoading = new BehaviorSubject(false);
  isClinicsLoading = new BehaviorSubject(false);

  constructor(private setup: SetupService, private fb: FormBuilder, private notification: NzNotificationService) { }
  clinicServiceForm: FormGroup;
  ngOnInit() {
    this.clinicServiceForm = this.fb.group({
      clinic_id: [null, Validators.required],
      service_id: [null, Validators.required],
      billing_cycle_id: [null, Validators.required],
      billing_duration: [null, Validators.required]
    });

    this.getClinicServices();
    this.getBillingCycles();
    this.getClinics();
    this.getServicePricings();
  }
  getBillingCycles() {
    this.isBillingCyclesLoading.next(true);
    this.setup.getBillingCycles().pipe(first()).subscribe(
      data => {
        this.isBillingCyclesLoading.next(false);
        this.billingCycles = data.data;
      },
      error => {
        console.log(error);
        this.isBillingCyclesLoading.next(false);
      }
    );
  }
  getClinicServices() {
    this.setup
      .getClinicServices()
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
          this.initLoading = false;
        }
      );

  }

  getClinics() {
    this.isClinicsLoading.next(true);
    this.setup
      .getClinics()
      .pipe(first())
      .subscribe(
        res => {
          this.isClinicsLoading.next(false);
          this.clinics = res.data;
        },
        error => {
          this.isClinicsLoading.next(false);
          console.log(error);

        }
      );
  }
  getServicePricings() {
    this.isServicePricingsLoading.next(true);
    this.setup
      .getServicePricings()
      .pipe(first())
      .subscribe(
        res => {
          this.isServicePricingsLoading.next(false);
          this.servicePricings = res.data;
        },
        error => {
          this.isServicePricingsLoading.next(false);
          console.log(error);

        }
      );
  }
  submitForm() {
    if (this.clinicServiceForm.invalid) {
      this.isCreatingClinicService.next(false);
      this.error = 'All fields are required';
    } else {
      this.error = '';
      this.isCreatingClinicService.next(true);


      this.setup
        .createClinicService(this.clinicServiceForm.value)
        .pipe(first())
        .subscribe(
          success => {
            this.isCreatingClinicService.next(false);
            if (success) {
              this.notification.blank(
                'Success',
                `Successfully created Clinic Service`
              );
              this.getClinicServices();
              this.clinicForm.reset();
            } else {
              this.notification.blank(
                'Error',
                `Could not create Clinic Service`
              );
            }
          },
          error => {
            this.isCreatingClinicService.next(false);
            console.log(error);
            this.notification.blank(
              'Error',
              `Could not create Clinic`
            );
          }
        );
    }
  }



}
