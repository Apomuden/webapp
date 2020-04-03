import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd';
import { SetupService } from './../../../shared/services/setup.service';
import { first } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-medical-sponsor-setup',
  templateUrl: './medical-sponsor-setup.component.html',
  styleUrls: ['./medical-sponsor-setup.component.css']
})
export class MedicalSponsorSetupComponent implements OnInit {
  initLoading = true; // bug
  loadingMore = false;
  isCreatingMedicalSponsor = new BehaviorSubject(false);
  sponsorshipTypesLoading = new BehaviorSubject(false);
  billingSystemsLoading = new BehaviorSubject(false);
  billingCyclesLoading = new BehaviorSubject(false);
  paymentStylesLoading = new BehaviorSubject(false);
  paymentChannelsLoading = new BehaviorSubject(false);
  isUpdatingMedicalSponsor = new BehaviorSubject(false);

  data = [];
  list = [];
  error = '';
  modalError = '';
  medicalSponsorId = null;
  name = '';
  sortCode = '';
  email = '';
  phone = '';
  isVisible = false;
  sponsorshipTypes = [];
  billingSystems = [];
  billingCycles = [];
  paymentStyles = [];
  paymentChannels = [];

  componentLabel = 'medical sponsor';

  medicalSponsorForm = this.fb.group({
    'name': [null, Validators.required],
    'active_cell': [null, Validators.required],
    'alternate_cell': [''],
    'address': [''],
    'email1': ['', [Validators.email, Validators.required]],
    'email2': ['', Validators.email],
    'website': [''],
    'sponsor_code': [null, Validators.required],
    'sponsorship_type_id': [null, Validators.required],
    'billing_system_id': [null, Validators.required],
    'billing_cycle_id': [null, Validators.required],
    'payment_style_id': [null, Validators.required],
    'payment_channel_id': [null, Validators.required]
  });

  updateForm = this.fb.group({
    'name': [null, Validators.required],
    'active_cell': [null, Validators.required],
    'alternate_cell': [''],
    'address': [''],
    'email1': [''],
    'email2': [''],
    'website': [''],
    'sponsor_code': [null, Validators.required],
    'sponsorship_type_id': [null, Validators.required],
    'billing_system_id': [null, Validators.required],
    'billing_cycle_id': [null, Validators.required],
    'payment_style_id': [null, Validators.required],
    'payment_channel_id': [null, Validators.required]
  });

  submitForm(): void {
    console.log(this.medicalSponsorForm.value);
    if (!this.medicalSponsorForm.valid) {
      this.error = 'Fill all required fields!';
    } else {
      this.error = '';
      this.isCreatingMedicalSponsor.next(true);
      this.setup
        .createMedicalSponsor(this.medicalSponsorForm.value)
        .pipe(first())
        .subscribe(
          success => {
            this.isCreatingMedicalSponsor.next(false);
            if (success) {
              this.notification.blank(
                'Success',
                `Successfully created ${this.componentLabel}`
              );
              this.getMedicalSponsors();
              this.medicalSponsorForm.reset();
            } else {
              this.notification.blank(
                'Error',
                `Could not create ${this.componentLabel}`
              );
            }
          },
          error => {
            this.isCreatingMedicalSponsor.next(false);
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
  ) {

  }

  getMedicalSponsors() {
    this.setup
      .getMedicalSponsors()
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

  getSponsorshipTypes() {
    this.sponsorshipTypesLoading.next(true);
    this.setup
      .getSponsorshipTypes()
      .pipe(first())
      .subscribe(
        data => {
          this.sponsorshipTypesLoading.next(false);
          this.sponsorshipTypes = data.data;
        },
        error => {
          this.sponsorshipTypesLoading.next(false);
          console.log(error);
        }
      );
  }
  getBillingSystems() {
    this.billingSystemsLoading.next(true);
    this.setup
      .getBillingSystems()
      .pipe(first())
      .subscribe(
        data => {
          this.billingSystemsLoading.next(false);
          this.billingSystems = data.data;
        },
        error => {
          this.billingSystemsLoading.next(false);
          console.log(error);
        }
      );
  }
  getBillingCycles() {
    this.billingCyclesLoading.next(true);
    this.setup
      .getBillingCycles()
      .pipe(first())
      .subscribe(
        data => {
          this.billingCyclesLoading.next(false);
          this.billingCycles = data.data;
        },
        error => {
          this.billingCyclesLoading.next(false);
          console.log(error);
        }
      );
  }
  getPaymentStyles() {
    this.paymentStylesLoading.next(true);
    this.setup
      .getPaymentStyles()
      .pipe(first())
      .subscribe(
        data => {
          this.paymentStylesLoading.next(false);
          this.paymentStyles = data.data;
        },
        error => {
          this.paymentStylesLoading.next(false);
          console.log(error);
        }
      );
  }
  getPaymentChannels() {
    this.paymentChannelsLoading.next(true);
    this.setup
      .getPaymentChannels()
      .pipe(first())
      .subscribe(
        data => {
          this.paymentChannelsLoading.next(false);
          this.paymentChannels = data.data;
        },
        error => {
          this.paymentChannelsLoading.next(false);
          console.log(error);
        }
      );
  }
  ngOnInit() {
    this.getMedicalSponsors();
    this.getBillingCycles();
    this.getBillingSystems();
    this.getPaymentStyles();
    this.getPaymentChannels();
    this.getSponsorshipTypes();

  }

  toggleItem($event: any, sponsor: any) {
    this.setup.toggleActive(`setups/billingsponsors/${sponsor.id}`, $event ? 'ACTIVE' : 'INACTIVE').pipe(first())
      .subscribe(toggled => {
        const index = this.list.findIndex(b => b.id === toggled.id);
        this.list[index].isActivated = toggled.isActivated;
      }, error => {
        console.error(error);
        const index = this.list.findIndex(b => b.id === sponsor.id);
        this.list[index].isActivated = !sponsor.isActivated;
        this.notification.error('Toggle failed', 'Unable to toggle this item.');
      });
  }
  update() {
    if (!this.updateForm.valid) {
      this.modalError = 'Fill all required fields';
    } else {
      this.modalError = '';
      this.isUpdatingMedicalSponsor.next(true);
      this.setup.updateSetup({
        ...this.updateForm.value
      }, `setups/billingsponsors/${this.medicalSponsorId}`).pipe(first()).subscribe(
        response => {
          this.isUpdatingMedicalSponsor.next(false);
          if (response) {
            this.notification.success('Success', 'Update successful');
            this.getMedicalSponsors();
          } else {
            this.notification.error('Error', 'Update failed');
          }

        },
        error => {
          this.isUpdatingMedicalSponsor.next(false);
          this.notification.error('Error', 'Update failed');
        }
      );
    }


  }

  deleteMedicalSponsor(medicalSponsor: any) {
    this.setup.deleteSetup(`setups/billingsponsors/${medicalSponsor.id}`).pipe(first()).subscribe(
      res => {
        this.getMedicalSponsors();
        this.notification.success('Success', 'Deleted');
      },
      error => {
        this.notification.error('Error', 'Could not delete');
      }
    );
  }
  closeModal() {
    this.medicalSponsorId = null;
    this.updateForm.reset();
    this.isVisible = false;
    this.isUpdatingMedicalSponsor.next(false);
  }
  showModal(medicalSponsor: any) {

    this.isVisible = true;
    const { name, active_cell, alternate_cell, address, email1, email2, website,
      sponsor_code, sponsorship_type_id, billing_system_id,
      billing_cycle_id, payment_style_id, payment_channel_id
    } = medicalSponsor;
    this.medicalSponsorId = medicalSponsor.id as number;
    this.updateForm.get('name').setValue(name);
    this.updateForm.get('active_cell').setValue(active_cell);
    this.updateForm.get('alternate_cell').setValue(alternate_cell);
    this.updateForm.get('address').setValue(address);
    this.updateForm.get('email1').setValue(email1);
    this.updateForm.get('email2').setValue(email2);
    this.updateForm.get('website').setValue(website);
    this.updateForm.get('sponsor_code').setValue(sponsor_code);
    this.updateForm.get('sponsorship_type_id').setValue(sponsorship_type_id);
    this.updateForm.get('billing_system_id').setValue(billing_system_id);
    this.updateForm.get('billing_cycle_id').setValue(billing_cycle_id);
    this.updateForm.get('payment_style_id').setValue(payment_style_id);
    this.updateForm.get('payment_channel_id').setValue(payment_channel_id);

  }
}
