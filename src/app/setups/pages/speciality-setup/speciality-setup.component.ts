import { SetupService } from './../../../shared/services/setup.service';
import { first } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NzNotificationService } from 'ng-zorro-antd';

@Component({
  selector: 'app-speciality-setup',
  templateUrl: './speciality-setup.component.html',
  styleUrls: ['./speciality-setup.component.css']
})
export class SpecialitySetupComponent implements OnInit {
  initLoading = true; // bug
  loadingMore = false;
  isCreatingSpecialty = new BehaviorSubject(false);
  data = [];
  list = [];
  error = '';
  specialty = '';
  componentLabel = 'specialty';

  submitForm(): void {
    if (this.specialty == null || this.specialty === '') {
      this.error = `Please enter ${this.componentLabel} name`;
    } else {
      this.error = '';
      this.isCreatingSpecialty.next(true);
      this.setup
        .createSpeciality(this.specialty)
        .pipe(first())
        .subscribe(
          success => {
            this.isCreatingSpecialty.next(false);
            if (success) {
              this.notification.blank(
                'Success',
                `Successfully created ${this.componentLabel}`
              );
              this.getSpecialities();
              this.specialty = '';
            } else {
              this.notification.blank(
                'Error',
                `Could not create ${this.componentLabel}`
              );
            }
          },
          error => {
            this.isCreatingSpecialty.next(false);
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
  getSpecialities() {
    this.setup
      .getSpecialities()
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
    this.getSpecialities();
  }
}
