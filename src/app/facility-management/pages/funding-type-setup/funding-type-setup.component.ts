import { FormBuilder, FormGroup } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd';
import { SetupService } from './../../../shared/services/setup.service';
import { first } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-funding-type-setup',
  templateUrl: './funding-type-setup.component.html',
  styleUrls: ['./funding-type-setup.component.css']
})
export class FundingTypeSetupComponent implements OnInit {
  initLoading = true; // bug
  loadingMore = false;
  isCreatingFundingType = new BehaviorSubject(false);
  paymentChannelsLoading = new BehaviorSubject(false);
  paymentStylesLoading = new BehaviorSubject(false);
  billingSystemsLoading = new BehaviorSubject(false);
  billingCyclesLoading = new BehaviorSubject(false);
  sponsorshipTypesLoading = new BehaviorSubject(false);
  isUpdatingFundingType = new BehaviorSubject(false);
  data = [];
  list = [];
  error = '';
  modalError = '';
  name = '';
  isVisible = false;
  updateForm: FormGroup;
  billingCycle = null;
  paymentStyle = null;
  paymentChannel = null;
  billingSystem = null;
  sponsorshipType = null;
  fundingTypeId = null;
  billingCycles = null;
  paymentStyles = null;
  paymentChannels = null;
  billingSystems = null;
  sponsorshipTypes = '';
  componentLabel = 'funding type';

  submitForm(): void {
    if (
      this.name == null ||
      this.name === '' ||
      this.billingCycle == null ||
      this.billingCycle === '' ||
      this.billingSystem == null ||
      this.billingSystem === '' ||
      this.paymentStyle == null ||
      this.paymentStyle === '' ||
      this.paymentChannel == null ||
      this.paymentChannel === '' ||
      this.sponsorshipType == null ||
      this.sponsorshipType === ''
    ) {
      this.error = 'All Fields are required!';
    } else {
      this.error = '';
      this.isCreatingFundingType.next(true);
      this.setup
        .createFundingType(
          this.name,
          this.sponsorshipType,
          this.billingCycle,
          this.paymentStyle,
          this.paymentChannel,
          this.billingSystem
        )
        .pipe(first())
        .subscribe(
          success => {
            this.isCreatingFundingType.next(false);
            if (success) {
              this.notification.blank(
                'Success',
                `Successfully created ${this.componentLabel}`
              );
              this.getFundingTypes();
              this.name = '';
            } else {
              this.notification.blank(
                'Error',
                `Could not create ${this.componentLabel}`
              );
            }
          },
          error => {
            this.isCreatingFundingType.next(false);
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

  closeModal() {
    this.fundingTypeId = null;
    this.updateForm.reset();
    this.isVisible = false;
    this.isUpdatingFundingType.next(false);
  }

  showModal(fundingType: any) {

    this.isVisible = true;
    const { name, sponsorship_type_id, billing_cycle_id, payment_style_id, payment_channel_id, billing_system_id } = fundingType;
    this.fundingTypeId = fundingType.id as number;

    this.updateForm.get('name').setValue(name);
    this.updateForm.get('sponsorship_type_id').setValue(sponsorship_type_id);
    this.updateForm.get('billing_cycle_id').setValue(billing_cycle_id);
    this.updateForm.get('payment_style_id').setValue(payment_style_id);
    this.updateForm.get('payment_channel_id').setValue(payment_channel_id);
    this.updateForm.get('billing_system_id').setValue(billing_system_id);

  }


  getFundingTypes() {
    this.setup
      .getFundingTypes()
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

  update() {
    if (!this.updateForm.valid) {
      this.modalError = 'All fields are required';
    } else {
      this.modalError = '';
      this.isUpdatingFundingType.next(true);
      this.setup.updateSetup({
        ...this.updateForm.value
      }, `setups/fundingtypes/${this.fundingTypeId}`).pipe(first()).subscribe(
        response => {
          this.isUpdatingFundingType.next(false);
          if (response) {
            this.notification.success('Success', 'Update successful');
            this.getFundingTypes();
          } else {
            this.notification.error('Error', 'Update failed');
          }

        },
        error => {
          this.isUpdatingFundingType.next(false);
          this.notification.error('Error', 'Update failed');
        }
      );
    }
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


  deleteFundingType(fundingType: any) {
    this.setup.deleteSetup(`setups/fundingtypes/${fundingType.id}`).pipe(first()).subscribe(
      res => {
        this.getFundingTypes();
        this.notification.success('Success', 'Deleted');
      },
      error => {
        this.notification.error('Error', 'Could not delete');
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

  ngOnInit() {
    this.updateForm = this.fb.group({
      name: [null],
      sponsorship_type_id: [null],
      billing_cycle_id: [null],
      payment_style_id: [null],
      payment_channel_id: [null],
      billing_system_id: [null]
    });

    this.getFundingTypes();
    this.getBillingCycles();
    this.getPaymentStyles();
    this.getPaymentChannels();
    this.getBillingSystems();
    this.getSponsorshipTypes();
  }

  toggleItem($event: any, funding: any) {
    this.setup.toggleActive(`setups/fundingtypes/${funding.id}`, $event ? 'ACTIVE' : 'INACTIVE').pipe(first())
      .subscribe(toggled => {
        const index = this.list.findIndex(f => f.id === toggled.id);
        this.list[index].isActivated = toggled.isActivated;
      }, error => {
        console.error(error);
        const index = this.list.findIndex(f => f.id === funding.id);
        this.list[index].isActivated = !funding.isActivated;
        this.notification.error('Toggle failed', 'Unable to toggle this item.');
      });
  }
}
