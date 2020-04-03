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
  clinicTypes = [];
  error = '';
  clinicId = null;
  isVisible = false;
  modalError = '';
  initLoading = true;
  isCreatingClinic = new BehaviorSubject(false);
  isUpdatingClinic = new BehaviorSubject(false);
  isAgeGroupsLoading = new BehaviorSubject(false);
  isClinicTypesLoading = new BehaviorSubject(false);
  updateForm: FormGroup;

  constructor(private setup: SetupService, private fb: FormBuilder, private notification: NzNotificationService) { }
  clinicForm: FormGroup;

  ngOnInit() {

    this.clinicForm = this.fb.group({
      name: [null, Validators.required],
      clinicType: [null, Validators.required],
      age_group_id: [null, Validators.required],
      gender: [null, Validators.required],
      patient_status: [null, Validators.required]
    });

    this.updateForm = this.fb.group({
      name: [null, Validators.required],
      clinic_type_id: [null, Validators.required],
      age_group_id: [null, Validators.required],
      gender: [null, Validators.required],
      patient_status: [null, Validators.required]
    });

    this.getClinics();
    this.getAgeGroups();
    this.getClinicTypes();
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

  getClinicTypes() {
    this.isClinicTypesLoading.next(true);
    this.setup
      .getClinicTypes()
      .pipe(first())
      .subscribe(
        res => {
          this.isClinicTypesLoading.next(false);
          this.clinicTypes = res.data;
        },
        error => {
          this.isClinicTypesLoading.next(false);
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
      const payload = {
        name: this.clinicForm.value.name,
        clinic_type_id: this.clinicForm.value.clinicType,
        age_group_id: this.clinicForm.value.age_group_id,
        gender: this.clinicForm.value.gender.join(', '),
        patient_status: this.clinicForm.value.patient_status.join(', ')
      };


      this.setup
        .createClinic(payload)
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

  update() {
    if (!this.updateForm.valid) {
      this.modalError = 'Name is required';
    } else {
      this.modalError = '';
      this.isUpdatingClinic.next(true);
      this.setup.updateSetup({
        ...this.updateForm.value,
        gender: this.updateForm.get('gender').value.join(),
        patient_status: this.updateForm.get('patient_status').value.join()
      }, `setups/clinics/${this.clinicId}`).pipe(first()).subscribe(
        response => {
          this.isUpdatingClinic.next(false);
          if (response) {
            this.notification.success('Success', 'Update successful');
            this.getClinics();
          } else {
            this.notification.error('Error', 'Update failed');
          }

        },
        error => {
          this.isUpdatingClinic.next(false);
          this.notification.error('Error', 'Update failed');
        }
      );
    }


  }
  deleteClinic(clinic: any) {
    this.setup.deleteSetup(`setups/clinics/${clinic.id}`).pipe(first()).subscribe(
      res => {
        this.getClinics();
        this.notification.success('Success', 'Deleted');
      },
      error => {
        this.notification.error('Error', 'Could not delete');
      }
    );
  }
  closeModal() {
    this.clinicId = null;
    this.updateForm.reset();
    this.isVisible = false;
    this.isUpdatingClinic.next(false);
  }
  showModal(clinic: any) {
    this.isVisible = true;
    const { name, clinic_type_id, age_group_id, gender, patient_status } = clinic;
    this.clinicId = clinic.id as number;
    console.log(this.clinicId);
    this.updateForm.get('name').setValue(name);
    this.updateForm.get('clinic_type_id').setValue(clinic_type_id);
    this.updateForm.get('age_group_id').setValue(age_group_id);
    this.updateForm.get('gender').setValue(gender.split(','));
    this.updateForm.get('patient_status').setValue(patient_status.split(','));
  }
}
