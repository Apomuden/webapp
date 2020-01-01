import { BehaviorSubject } from 'rxjs';
import { first } from 'rxjs/operators';
import { SetupService } from './../../../shared/services/setup.service';
import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd';

@Component({
  selector: 'app-payment-channel-setup',
  templateUrl: './payment-channel-setup.component.html',
  styleUrls: ['./payment-channel-setup.component.css']
})
export class PaymentChannelSetupComponent implements OnInit {
  initLoading = true; // bug
  loadingMore = false;
  isCreatingInputChannel = new BehaviorSubject(false);
  data = [];
  list = [];
  error = '';
  paymentChannel = '';

  submitForm(): void {
    if (this.paymentChannel == null || this.paymentChannel === '') {
      this.error = 'Please enter a payment channel name';
    } else {
      this.error = '';
      this.isCreatingInputChannel.next(true);
      this.setup
        .createPaymentChannel(this.paymentChannel)
        .pipe(first())
        .subscribe(
          success => {
            this.isCreatingInputChannel.next(false);
            if (success) {
              this.notification.blank(
                'Success',
                'Successfully created payment channel'
              );
              this.getPaymentChannels();
              this.paymentChannel = '';
            } else {
              this.notification.blank(
                'Error',
                'Could not create payment channel'
              );
            }
          },
          error => {
            this.isCreatingInputChannel.next(false);
            this.notification.blank(
              'Error',
              'Could not create payment channel'
            );
          }
        );
    }
  }

  constructor(
    private setup: SetupService,
    private notification: NzNotificationService
  ) {}
  getPaymentChannels() {
    this.setup
      .getPaymentChannels()
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
  ngOnInit() {
    this.getPaymentChannels();
  }
}
