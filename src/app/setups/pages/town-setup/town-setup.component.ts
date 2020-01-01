import { NzNotificationService } from 'ng-zorro-antd';
import { SetupService } from './../../../shared/services/setup.service';
import { first } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-town-setup',
  templateUrl: './town-setup.component.html',
  styleUrls: ['./town-setup.component.css']
})
export class TownSetupComponent implements OnInit {
  initLoading = true; // bug
  loadingMore = false;
  isCreatingTown = new BehaviorSubject(false);
  districtsLoading = new BehaviorSubject(false);

  data = [];
  list = [];
  error = '';
  name = '';

  district = null;

  districts = null;

  componentLabel = 'town';

  submitForm(): void {
    if (
      this.name == null ||
      this.name === '' ||
      this.district == null ||
      this.district === ''
    ) {
      this.error = 'All Fields are required!';
    } else {
      this.error = '';
      this.isCreatingTown.next(true);
      this.setup
        .createTown(this.name, this.district)
        .pipe(first())
        .subscribe(
          success => {
            this.isCreatingTown.next(false);
            if (success) {
              this.notification.blank(
                'Success',
                `Successfully created ${this.componentLabel}`
              );
              this.getTowns();
              this.name = '';
              this.district = null;
            } else {
              this.notification.blank(
                'Error',
                `Could not create ${this.componentLabel}`
              );
            }
          },
          error => {
            this.isCreatingTown.next(false);
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

  getTowns() {
    this.setup
      .getTowns()
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

  getDistricts() {
    this.districtsLoading.next(true);
    this.setup
      .getDistricts()
      .pipe(first())
      .subscribe(
        data => {
          this.districtsLoading.next(false);
          this.districts = data.data;
        },
        error => {
          this.districtsLoading.next(false);
          console.log(error);
        }
      );
  }

  ngOnInit() {
    this.getTowns();
    this.getDistricts();
  }
}
