import { SetupService } from './../../../shared/services/setup.service';
import { first } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-billing-system-setup',
  templateUrl: './billing-system-setup.component.html',
  styleUrls: ['./billing-system-setup.component.css']
})
export class BillingSystemSetupComponent implements OnInit {
  initLoading = true; // bug
  loadingMore = false;
  isCreatingBillingSystem = new BehaviorSubject(false);
  data = [];
  list = [];
  error = '';
  billingSystem = '';
  componentLabel = 'billing system';

  submitForm(): void {
    if (this.billingSystem == null || this.billingSystem === '') {
      this.error = `Please enter ${this.componentLabel} name`;
    } else {
      this.error = '';
      this.isCreatingBillingSystem.next(true);
      this.setup
        .createBillingSystem(this.billingSystem)
        .pipe(first())
        .subscribe(
          success => {
            this.isCreatingBillingSystem.next(false);
            if (success) {
              this.notification.blank(
                'Success',
                `Successfully created ${this.componentLabel}`
              );
              this.getBillingSystems();
              this.billingSystem = '';
            } else {
              this.notification.blank(
                'Error',
                `Could not create ${this.componentLabel}`
              );
            }
          },
          error => {
            this.isCreatingBillingSystem.next(false);
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
  ) { }
  getBillingSystems() {
    this.setup
      .getBillingSystems()
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
    this.getBillingSystems();
  }

  toggleItem($event: any, system: any) {
    this.setup.toggleActive(`setups/billingsystems/${system.id}`, $event ? 'ACTIVE' : 'INACTIVE').pipe(first())
      .subscribe(toggled => {
        console.log(toggled);
        const index = this.list.findIndex(s => s.id === toggled.id);
        this.list[index].isActivated = toggled.isActivated;
      }, error => {
        console.error(error);
        const index = this.list.findIndex(s => s.id === system.id);
        this.list[index].isActivated = !system.isActivated;
        this.notification.error('Toggle failed', 'Unable to toggle this item.');
      });
  }
}
