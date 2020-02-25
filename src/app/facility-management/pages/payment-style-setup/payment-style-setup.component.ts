import { SetupService } from './../../../shared/services/setup.service';
import { first } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NzNotificationService } from 'ng-zorro-antd';

@Component({
  selector: 'app-payment-style-setup',
  templateUrl: './payment-style-setup.component.html',
  styleUrls: ['./payment-style-setup.component.css']
})
export class PaymentStyleSetupComponent implements OnInit {
  initLoading = true; // bug
  loadingMore = false;
  isCreatingPaymentStyle = new BehaviorSubject(false);
  data = [];
  list = [];
  error = '';
  paymentStyle = '';

  submitForm(): void {
    if (this.paymentStyle == null || this.paymentStyle === '') {
      this.error = 'Please enter payment style name';
    } else {
      this.error = '';
      this.isCreatingPaymentStyle.next(true);
      this.setup
        .createPaymentStyle(this.paymentStyle)
        .pipe(first())
        .subscribe(
          success => {
            this.isCreatingPaymentStyle.next(false);
            if (success) {
              this.notification.blank(
                'Success',
                'Successfully created payment style'
              );
              this.getPaymentStyles();
              this.paymentStyle = '';
            } else {
              this.notification.blank(
                'Error',
                'Could not create payment style'
              );
            }
          },
          error => {
            this.isCreatingPaymentStyle.next(false);
            this.notification.blank('Error', 'Could not create payment style');
          }
        );
    }
  }

  constructor(
    private setup: SetupService,
    private notification: NzNotificationService
  ) { }
  getPaymentStyles() {
    this.setup
      .getPaymentStyles()
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
    this.getPaymentStyles();
  }

  toggleItem($event: any, style: any) {
    this.setup.toggleActive(`setups/paymentstyles/${style.id}`, $event ? 'ACTIVE' : 'INACTIVE').pipe(first())
      .subscribe(toggled => {
        const index = this.list.findIndex(s => s.id === toggled.id);
        this.list[index].isActivated = toggled.isActivated;
      }, error => {
        console.error(error);
        const index = this.list.findIndex(s => s.id === style.id);
        this.list[index].isActivated = !style.isActivated;
        this.notification.error('Toggle failed', 'Unable to toggle this item.');
      });
  }
}
