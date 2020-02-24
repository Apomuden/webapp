import { NzNotificationService } from 'ng-zorro-antd';
import { SetupService } from './../../../shared/services/setup.service';
import { first } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-staff-type-setup',
  templateUrl: './staff-type-setup.component.html',
  styleUrls: ['./staff-type-setup.component.css']
})
export class StaffTypeSetupComponent implements OnInit {
  initLoading = true; // bug
  loadingMore = false;
  isCreatingStaffType = new BehaviorSubject(false);

  data = [];
  list = [];
  error = '';
  name = '';
  validityDays = '';

  componentLabel = 'staff type';

  submitForm(): void {
    if (
      this.name == null ||
      this.name === '' ||
      this.validityDays == null ||
      this.validityDays === ''
    ) {
      this.error = 'All Fields are required!';
    } else {
      this.error = '';
      this.isCreatingStaffType.next(true);
      this.setup
        .createStaffType(this.name, this.validityDays)
        .pipe(first())
        .subscribe(
          success => {
            this.isCreatingStaffType.next(false);
            if (success) {
              this.notification.blank(
                'Success',
                `Successfully created ${this.componentLabel}`
              );
              this.getStaffTypes();
              this.name = '';
            } else {
              this.notification.blank(
                'Error',
                `Could not create ${this.componentLabel}`
              );
            }
          },
          error => {
            this.isCreatingStaffType.next(false);
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

  getStaffTypes() {
    this.setup
      .getStaffTypes()
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
    this.getStaffTypes();
  }

  toggleItem($event: any, type: any) {
    this.setup.toggleActive(`setups/stafftypes/${type.id}`, $event ? 'ACTIVE' : 'INACTIVE').pipe(first())
      .subscribe(toggled => {
        const index = this.list.findIndex(i => i.id === toggled.id);
        this.list[index].isActivated = toggled.isActivated;
      }, error => {
        console.error(error);
        const index = this.list.findIndex(i => i.id === type.id);
        this.list[index].isActivated = !type.isActivated;
        this.notification.error('Toggle failed', 'Unable to toggle this item.');
      });
  }
}
