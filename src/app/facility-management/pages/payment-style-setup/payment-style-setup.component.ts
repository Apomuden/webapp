import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  isVisible = false;
  paymentStyleId = null;
  updateForm: FormGroup;
  isCreatingPaymentStyle = new BehaviorSubject(false);
  isUpdatingPaymentStyles = new BehaviorSubject(false);
  data = [];
  list = [];
  modalError = '';
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
    private notification: NzNotificationService,
    private fb: FormBuilder
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
    this.updateForm = this.fb.group({
      name: [null, Validators.required]
    });
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
  update() {
    if (!this.updateForm.valid) {
      this.modalError = 'Please fill required fields';
    } else {
      this.modalError = '';
      this.isUpdatingPaymentStyles.next(true);
      this.setup.updateSetup({
        ...this.updateForm.value
      }, `setups/paymentstyles/${this.paymentStyleId}`).pipe(first()).subscribe(
        response => {
          this.isUpdatingPaymentStyles.next(false);
          if (response) {
            this.notification.success('Success', 'Update successful');
            this.getPaymentStyles();
          } else {
            this.notification.error('Error', 'Update failed');
          }

        },
        error => {
          this.isUpdatingPaymentStyles.next(false);
          this.notification.error('Error', 'Update failed');
        }
      );
    }


  }

  deletePaymentStyle(paymentStyle: any) {
    this.setup.deleteSetup(`setups/paymentstyles/${paymentStyle.id}`).pipe(first()).subscribe(
      res => {
        this.getPaymentStyles();
        this.notification.success('Success', 'Deleted');
      },
      error => {
        this.notification.error('Error', 'Could not delete');
      }
    );
  }
  closeModal() {
    this.paymentStyleId = null;
    this.updateForm.reset();
    this.isVisible = false;
    this.isUpdatingPaymentStyles.next(false);
  }
  showModal(paymentStyle: any) {
    this.isVisible = true;
    const {
      name
    } = paymentStyle;
    this.paymentStyleId = paymentStyle.id as number;
    console.log(this.paymentStyleId);
    this.updateForm.get('name').setValue(name);

  }
}
