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
  clinicServiceId = null;
  isVisible = false;
  clinics = [];
  modalError = '';
  servicePricings = [];
  error = '';
  initLoading = true;
  isCreatingClinicService = new BehaviorSubject(false);
  isBillingCyclesLoading = new BehaviorSubject(false);
  isUpdatingClinicService = new BehaviorSubject(false);
  isServicePricingsLoading = new BehaviorSubject(false);
  isClinicsLoading = new BehaviorSubject(false);
  updateForm: FormGroup;


  constructor(private setup: SetupService, private fb: FormBuilder, private notification: NzNotificationService) { }
  clinicServiceForm: FormGroup;
  ngOnInit() {
    this.clinicServiceForm = this.fb.group({
      clinic_id: [null, Validators.required],
      service_id: [null, Validators.required],
      billing_cycle_id: [null, Validators.required],
      billing_duration: [null, Validators.required]
    });
    this.updateForm = this.fb.group({
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
              this.clinicServiceForm.reset();
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


  update() {
    if (!this.updateForm.valid) {
      this.modalError = 'Name is required';
    } else {
      this.modalError = '';
      this.isUpdatingClinicService.next(true);
      this.setup.updateSetup({
        ...this.updateForm.value
      }, `setups/clinicservices/${this.clinicServiceId}`).pipe(first()).subscribe(
        response => {
          this.isUpdatingClinicService.next(false);
          if (response) {
            this.notification.success('Success', 'Update successful');
            this.getClinics();
          } else {
            this.notification.error('Error', 'Update failed');
          }

        },
        error => {
          this.isUpdatingClinicService.next(false);
          this.notification.error('Error', 'Update failed');
        }
      );
    }


  }
  toggleItem($event: any, clinic: any) {
    this.setup.toggleActive(`setups/clinicservices/${clinic.id}`, $event ? 'ACTIVE' : 'INACTIVE').pipe(first())
      .subscribe(toggled => {
        const index = this.list.findIndex(c => c.id === toggled.id);
        this.list[index].isActivated = toggled.isActivated;
      }, error => {
        console.error(error);
        const index = this.list.findIndex(c => c.id === clinic.id);
        this.list[index].isActivated = !clinic.isActivated;
        this.notification.error('Toggle failed', 'Unable to toggle this item.');
      });
  }
  deleteClinicService(clinicService: any) {
    this.setup.deleteSetup(`setups/clinicservices/${clinicService.id}`).pipe(first()).subscribe(
      res => {
        this.getClinics();
        this.notification.success('Success', 'Deleted');
      },
      error => {
        this.notification.error('Error', 'Could not delete');
      }
    );
  }
  closeModal() {
    this.clinicServiceId = null;
    this.updateForm.reset();
    this.isVisible = false;
    this.isUpdatingClinicService.next(false);
  }
  showModal(clinicService: any) {
    this.isVisible = true;
    const { clinic_id, service_id, billing_cycle_id, billing_duration } = clinicService;
    this.clinicServiceId = clinicService.id as number;
    console.log(this.clinicServiceId);
    this.updateForm.get('clinic_id').setValue(clinic_id);
    this.updateForm.get('service_id').setValue(service_id);
    this.updateForm.get('billing_cycle_id').setValue(billing_cycle_id);
    this.updateForm.get('billing_duration').setValue(billing_duration);
  }
}
