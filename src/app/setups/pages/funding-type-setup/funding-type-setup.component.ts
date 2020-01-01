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
  data = [];
  list = [];
  error = '';
  name = '';

  billingCycle = null;
  paymentStyle = null;
  paymentChannel = null;
  billingSystem = null;
  sponsorshipType = null;

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
    private notification: NzNotificationService
  ) {}

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
    this.getFundingTypes();
    this.getBillingCycles();
    this.getPaymentStyles();
    this.getPaymentChannels();
    this.getBillingSystems();
    this.getSponsorshipTypes();
  }
}
