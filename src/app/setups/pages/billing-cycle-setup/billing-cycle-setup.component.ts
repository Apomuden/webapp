import { SetupService } from './../../../shared/services/setup.service';
import { NzNotificationService } from 'ng-zorro-antd';
import { first } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-billing-cycle-setup',
  templateUrl: './billing-cycle-setup.component.html',
  styleUrls: ['./billing-cycle-setup.component.css']
})
export class BillingCycleSetupComponent implements OnInit {
  initLoading = true; // bug
  loadingMore = false;
  isCreatingBillingCycle = new BehaviorSubject(false);
  data = [];
  list = [];
  error = '';
  name = '';
  status = 'ACTIVE';
  componentLabel = 'billing cycle';

  submitForm(): void {
    if (
      this.name == null ||
      this.name === '' ||
      this.status == null ||
      this.status === ''
    ) {
      this.error = `All fields are required`;
    } else {
      this.error = '';
      this.isCreatingBillingCycle.next(true);
      this.setup
        .createBillingCycle(this.name, this.status)
        .pipe(first())
        .subscribe(
          success => {
            this.isCreatingBillingCycle.next(false);
            if (success) {
              this.notification.blank(
                'Success',
                `Successfully created ${this.componentLabel}`
              );
              this.getBillingCycles();
              this.name = '';
            } else {
              this.notification.blank(
                'Error',
                `Could not create ${this.componentLabel}`
              );
            }
          },
          error => {
            this.isCreatingBillingCycle.next(false);
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
  getBillingCycles() {
    this.setup
      .getBillingCycles()
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
    this.getBillingCycles();
  }

  toggleItem($event: any, cycle: any) {
    this.setup.toggleActive(`setups/billingcycles/${cycle.id}`, $event ? 'ACTIVE' : 'INACTIVE').pipe(first())
      .subscribe(toggled => {
        const index = this.list.findIndex(c => c.id === toggled.id);
        this.list[index].isActivated = toggled.isActivated;
      }, error => {
        console.error(error);
        const index = this.list.findIndex(c => c.id === cycle.id);
        this.list[index].isActivated = !cycle.isActivated;
        this.notification.error('Toggle failed', 'Unable to toggle this item.');
      });
  }
}
