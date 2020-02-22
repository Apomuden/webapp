import { NzNotificationService } from 'ng-zorro-antd';
import { first, map } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { SetupService } from 'src/app/shared/services/setup.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-clinic-type-setup',
  templateUrl: './clinic-type-setup.component.html',
  styleUrls: ['./clinic-type-setup.component.css']
})
export class ClinicTypeSetupComponent implements OnInit {

  constructor(private fb: FormBuilder, private setup: SetupService, private notification: NzNotificationService) { }
  clinicTypeForm: FormGroup;
  error: String;
  initLoading = true;
  loadingMore = false;
  isCreatingClinicType = new BehaviorSubject(false);

  data = [];
  list = [];

  ngOnInit() {
    this.getClinicTypes();
    this.clinicTypeForm = this.fb.group({
      name: [null, [Validators.required]]
    });
  }
  getClinicTypes() {
    this.setup
      .getClinicTypes()
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
  submitForm() {
    if (this.clinicTypeForm.valid) {
      this.isCreatingClinicType.next(true);
      this.setup.createClinicType(this.clinicTypeForm.value.name).pipe(first()).subscribe(
        success => {
          this.isCreatingClinicType.next(false);
          if (success) {
            this.notification.blank(
              'Success',
              'Successfully created clinic type'
            );
            this.clinicTypeForm.reset();
            this.getClinicTypes();
            this.error = '';
          } else {
            this.notification.blank(
              'Error',
              'Could not create clinic type'
            );
            this.error = '';
          }
        },
        err => {
          this.isCreatingClinicType.next(false);
          this.notification.blank(
            'Error',
            'Could not create clinic type'
          );
        }
      );
    } else {
      this.error = 'Was unable to create clinic type';
    }
  }

}
