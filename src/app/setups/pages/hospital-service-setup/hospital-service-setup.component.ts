import { SetupService } from './../../../shared/services/setup.service';
import { first } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NzNotificationService } from 'ng-zorro-antd';

@Component({
  selector: 'app-hospital-service-setup',
  templateUrl: './hospital-service-setup.component.html',
  styleUrls: ['./hospital-service-setup.component.css']
})
export class HospitalServiceSetupComponent implements OnInit {
  initLoading = true; // bug
  loadingMore = false;
  isCreatingHospitalService = new BehaviorSubject(false);
  data = [];
  list = [];
  error = '';
  hospitalService = '';
  componentLabel = 'hospital service';

  submitForm(): void {
    if (this.hospitalService == null || this.hospitalService === '') {
      this.error = `Please enter ${this.componentLabel} name`;
    } else {
      this.error = '';
      this.isCreatingHospitalService.next(true);
      this.setup
        .createHospitalService(this.hospitalService)
        .pipe(first())
        .subscribe(
          success => {
            this.isCreatingHospitalService.next(false);
            if (success) {
              this.notification.blank(
                'Success',
                `Successfully created ${this.componentLabel}`
              );
              this.getHospitalServices();
              this.hospitalService = '';
            } else {
              this.notification.blank(
                'Error',
                `Could not create ${this.componentLabel}`
              );
            }
          },
          error => {
            this.isCreatingHospitalService.next(false);
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
  getHospitalServices() {
    this.setup
      .getHospitalServices()
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
    this.getHospitalServices();
  }

  toggleItem($event: any, service: any) {
    this.setup.toggleActive(`setups/hospitalservices/${service.id}`, $event ? 'ACTIVE' : 'INACTIVE').pipe(first())
      .subscribe(toggled => {
        const index = this.list.findIndex(s => s.id === toggled.id);
        this.list[index].isActivated = toggled.isActivated;
      }, error => {
        console.error(error);
        const index = this.list.findIndex(s => s.id === service.id);
        this.list[index].isActivated = !service.isActivated;
        this.notification.error('Toggle failed', 'Unable to toggle this item.');
      });
  }
}
