import { NzNotificationService } from 'ng-zorro-antd';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { SetupService } from './../../../shared/services/setup.service';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-clinic',
  templateUrl: './clinic.component.html',
  styleUrls: ['./clinic.component.css']
})
export class ClinicComponent implements OnInit {
  data = [];
  list = [];
  ageGroups = [];
  error = '';
  initLoading = true;
  isCreatingClinic = new BehaviorSubject(false);
  isAgeGroupsLoading = new BehaviorSubject(false);

  constructor(private setup: SetupService, private fb: FormBuilder, private notification: NzNotificationService) { }
  clinicForm: FormGroup;
  ngOnInit() {
    this.clinicForm = this.fb.group({
      name: [null, Validators.required],
      age_group_id: [null, Validators.required],
      gender: [null, Validators.required],
      patient_status: [null, Validators.required]
    });

    this.getClinics();
    this.getAgeGroups();
  }
  getAgeGroups() {
    this.isAgeGroupsLoading.next(true);
    this.setup.getAgeGroups().pipe(first()).subscribe(
      data => {
        this.isAgeGroupsLoading.next(false);
        this.ageGroups = data.data;
      },
      error => {
        console.log(error);
        this.isAgeGroupsLoading.next(false);
      }
    );
  }
  getClinics() {
    this.setup
      .getClinics()
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
          this.initLoading = false;
        }
      );
  }
  submitForm() {
    if (this.clinicForm.invalid) {
      this.isCreatingClinic.next(false);
      this.error = 'All fields are required';
    } else {
      this.error = '';
      this.isCreatingClinic.next(true);
      this.setup
        .createClinic(this.clinicForm.value)
        .pipe(first())
        .subscribe(
          success => {
            this.isCreatingClinic.next(false);
            if (success) {
              this.notification.blank(
                'Success',
                `Successfully created Clinic`
              );
              this.getClinics();
              this.clinicForm.reset();
            } else {
              this.notification.blank(
                'Error',
                `Could not create Clinic`
              );
            }
          },
          error => {
            this.isCreatingClinic.next(false);
            console.log(error);
            this.notification.blank(
              'Error',
              `Could not create Clinic`
            );
          }
        );
    }
  }


  toggleItem($event: any, clinic: any) {
    this.setup.toggleActive(`setups/clinics/${clinic.id}`, $event ? 'ACTIVE' : 'INACTIVE').pipe(first())
      .subscribe(toggled => {
        const index = this.list.findIndex(c => c.id === toggled.id);
        this.list[index].isActivated = toggled.isActivated;
      }, error => {
        console.error(error);
        const index = this.list.findIndex(c => c.id === clinic.id);
        this.list[index].isActivated = !clinic.isActivated;
        this.notification.error('Toggle failed', 'Unable to toggle this item.');
      });
  }
}
