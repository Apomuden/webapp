import { NzNotificationService } from 'ng-zorro-antd';
import { SetupService } from './../../../shared/services/setup.service';
import { first } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-age-group-setup',
  templateUrl: './age-group-setup.component.html',
  styleUrls: ['./age-group-setup.component.css']
})
export class AgeGroupSetupComponent implements OnInit {
  initLoading = true; // bug
  loadingMore = false;
  isCreatingAgeGroup = new BehaviorSubject(false);
  ageGroups = [];
  name = '';
  minAge: number;
  maxAge: number;
  componentLabel = 'age group';

  constructor(
    private setup: SetupService,
    private notification: NzNotificationService
  ) { }

  ngOnInit() {
    this.getAgeGroups();
  }

  submitForm(): void {
    if (this.validateForm()) {
      this.notification.error(`Please fill the form correctly!`,
        `Check and make sure you've provided all fields and min age is not greater than max age`);
    } else {
      this.isCreatingAgeGroup.next(true);
      this.setup
        .createAgeGroup(this.name, this.minAge, this.maxAge)
        .pipe(first())
        .subscribe(
          success => {
            this.isCreatingAgeGroup.next(false);
            if (success) {
              this.notification.success(
                'Success',
                `Successfully created ${this.componentLabel}`
              );
              this.getAgeGroups();
              this.name = '';
              this.minAge = null;
              this.maxAge = null;
            } else {
              this.notification.error(
                'Error',
                `Could not create ${this.componentLabel}`
              );
            }
          },
          error => {
            this.isCreatingAgeGroup.next(false);
            this.notification.blank(
              'Error',
              `Could not create ${this.componentLabel}`
            );
          }
        );
    }
  }
  validateForm() {
    return (!this.name ||
      !this.minAge ||
      !this.maxAge || this.minAge > this.maxAge);
  }

  getAgeGroups() {
    this.setup
      .getAgeGroups()
      .pipe(first())
      .subscribe(
        data => {
          this.ageGroups = data.data;
          this.initLoading = false;
        },
        error => {
          console.log(error);
        }
      );
  }

  toggleItem($event: any, ageGroup: any) {
    this.setup.toggleActive(`setups/agegroups/${ageGroup.id}`, $event ? 'ACTIVE' : 'INACTIVE').pipe(first())
      .subscribe(toggled => {
        console.log(toggled);
        const index = this.ageGroups.findIndex(group => group.id === toggled.id);
        this.ageGroups[index].isActivated = toggled.isActivated;
      }, error => {
        console.error(error);
        const index = this.ageGroups.findIndex(group => group.id === ageGroup.id);
        this.ageGroups[index].isActivated = !ageGroup.isActivated;
        this.notification.error('Toggle failed', 'Unable to toggle this item.');
      });
  }
}
