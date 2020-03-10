import { debounceTime, first, retry } from 'rxjs/operators';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { NzNotificationService } from 'ng-zorro-antd';
import { RecordService } from './../record.service';
import { BehaviorSubject } from 'rxjs';
import { FormGroup, Validators, ValidatorFn, FormBuilder, FormControl, AbstractControl } from '@angular/forms';
import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { SetupService } from 'src/app/shared/services/setup.service';

@Component({
  selector: 'app-add-appointment',
  templateUrl: './add-appointment.component.html',
  styleUrls: ['./add-appointment.component.css']
})
export class AddAppointmentComponent implements OnInit, AfterViewInit, OnDestroy {

  stepIndex = 0;

  appointmentForm: FormGroup = this.fb.group({
    patient_id: [null, [Validators.required]],
    staff_specialty_id: [null, [Validators.required]],
    doctor_id: [null, [Validators.required]],
    comment: [null],
    appointment_date: [null, [Validators.required]],
    isExistingPatient: [true],
    enquirer_name: [null],
    enquirer_country_code: ['+233'],
    enquirer_phone: [null],
    enquirer_residence: [null],
    enquirer_email: [null],
  });

  folderValidationState = null;
  countriesloading = new BehaviorSubject(false);
  isLoadingSpecialities = new BehaviorSubject(false);
  isLoadingDoctors = new BehaviorSubject(false);
  creating = new BehaviorSubject(false);
  showModal = false;

  patient: any;
  countries = [];
  titles = [];
  towns = [];
  specialties = [];
  regions = [];
  doctors = [];

  formatterAge = (value: number) => `${value} yrs`;
  parserAge = (value: string) => value.replace('yrs', '');

  constructor(
    private readonly fb: FormBuilder,
    private setup: SetupService,
    private recordsService: RecordService,
    private notificationS: NzNotificationService,
  ) {
  }

  ngOnInit() {
    this.getSpecialties();
    this.fetchCountries();


  }

  ngAfterViewInit() {
    this.appointmentForm.get('isExistingPatient').valueChanges.pipe(untilComponentDestroyed(this), debounceTime(0))
      .subscribe(boolVal => {
        this.updateFormValidations(boolVal);
      });

    this.appointmentForm.get('staff_specialty_id').valueChanges.pipe(untilComponentDestroyed(this), debounceTime(0))
      .subscribe(id => {
        console.log(id);
        if (this.patient) {
          this.getDoctorsBySpecialty(id);
        }

      });

    this.appointmentForm.get('patient_id').valueChanges.pipe(untilComponentDestroyed(this), debounceTime(300))
      .subscribe(folder_no => {
        this.folderValidationState = 'validating';
        this.getPatient(folder_no);
      });
  }

  ngOnDestroy() {
  }

  private updateFormValidations(isExistingPatient: Boolean) {
    if (isExistingPatient) {

      this.appointmentForm.get('patient_id').setValidators([Validators.required]);
      this.appointmentForm.get('enquirer_name').setValidators(null);
      this.appointmentForm.get('enquirer_name').setValue(null);
      this.appointmentForm.get('enquirer_country_code').setValidators(null);
      this.appointmentForm.get('enquirer_country_code').setValidators(null);
      this.appointmentForm.get('enquirer_phone').setValidators(null);
      this.appointmentForm.get('enquirer_phone').setValue(null);
      this.appointmentForm.get('enquirer_residence').setValidators(null);
      this.appointmentForm.get('enquirer_residence').setValue(null);
      this.appointmentForm.get('enquirer_email').setValidators(null);
      this.appointmentForm.get('enquirer_email').setValue(null);
      this.folderValidationState = null;

    } else {
      this.appointmentForm.get('patient_id').setValidators(null);
      this.appointmentForm.get('patient_id').setValue(null);
      this.patient = null;
      this.appointmentForm.get('patient_id').setValue(null);
      this.appointmentForm.get('enquirer_name').setValidators([Validators.required]);
      this.appointmentForm.get('enquirer_country_code').setValidators([Validators.required]);
      this.appointmentForm.get('enquirer_phone').setValidators([Validators.required]);
      this.appointmentForm.get('enquirer_residence').setValidators([Validators.required]);
      this.appointmentForm.get('enquirer_email').setValidators([Validators.required]);
      this.folderValidationState = null;
    }
  }



  private getPatient(folderNo: string) {
    this.patient = null;
    return this.recordsService.getAllPatients(`/single?folder_no=${folderNo}`).pipe(first()).subscribe(
      res => {
        if (res && res.data) {
          this.folderValidationState = 'success';
          this.patient = res.data;
          this.appointmentForm.get('patient_id').setErrors(null);
          this.appointmentForm.get('patient_id').markAsDirty();

        } else {
          this.folderValidationState = 'error';
          this.appointmentForm.get('patient_id');
          this.patient = null;
          this.appointmentForm.get('patient_id').setErrors({ invalidFolderNumber: 'Folder number is invalid' });
          this.appointmentForm.get('patient_id').markAsDirty();
        }

      },
      error => {
        this.folderValidationState = 'error';
        this.patient = null;
        this.appointmentForm.get('patient_id').setErrors({ invalidFolderNumber: 'Folder number is invalid' });
        this.appointmentForm.get('patient_id').markAsDirty();
      }
    );
  }


  private getDoctorsBySpecialty(id: string) {
    this.appointmentForm.get('doctor_id').reset();
    this.doctors = [];

    this.isLoadingDoctors.next(true);
    this.setup
      .getDoctorsBySpecialty(id)
      .pipe(first())
      .subscribe(data => {
        this.isLoadingDoctors.next(false);
        this.doctors = data.data;
        for (let i = 0; i < this.doctors.length; i++) {
          this.doctors[i].name = `${this.doctors[i].title} ${this.doctors[i].firstname}
          ${this.doctors[i].middlename ? this.doctors[i].middlename : ''}
          ${this.doctors[i].surname}`;
        }
      }, error => {
        this.isLoadingDoctors.next(false);
      });
  }
  private getSpecialties() {
    this.isLoadingSpecialities.next(true);
    this.setup
      .getSpecialities()
      .pipe(first())
      .subscribe(data => {
        this.isLoadingSpecialities.next(false);
        this.specialties = data.data;
        console.log(this.specialties);
      }, error => {
        this.isLoadingSpecialities.next(false);
      });
  }



  fetchCountries() {
    this.countriesloading.next(true);
    this.setup
      .getCountries()
      .pipe(first())
      .subscribe(
        data => {
          this.countriesloading.next(false);
          this.countries = data.data;
        },
        error => {
          this.countriesloading.next(false);
          console.log('error', error);
        }
      );
  }


  get isExistingPatientValue(): Boolean {
    return (this.appointmentForm.get('isExistingPatient') as FormControl).value;
  }


  submitForm() {
    // todo get data from form and submit .
    const data = this.processData();
    console.log(data);
    if (this.isExistingPatientValue && this.patient && this.appointmentForm.valid) {
      this.creating.next(true);
      this.recordsService.createAppointment(data)
        .subscribe(res => {
          this.patient = res.data;
          this.clearForm();
          this.notificationS.success('Success', 'Successfully created appointment');
          this.showModal = true;
          this.creating.next(false);
        }, e => {
          console.log(e);
          this.notificationS.error('Oops', 'Could not create appointment. Please try again');
          this.creating.next(false);
        });
    } else if (!this.isExistingPatientValue && this.appointmentForm.valid) {
      this.creating.next(true);
      this.recordsService.createAppointment(data)
        .subscribe(res => {
          this.patient = res.data;
          this.clearForm();
          this.notificationS.success('Success', 'Successfully created appointment');
          this.showModal = true;
          this.creating.next(false);
        }, e => {
          console.log(e);
          this.notificationS.error('Oops', 'Could not create appointment. Please try again');
          this.creating.next(false);
        });
    } else {
      this.notificationS.error('Error', 'Fill all mandated fields');
    }

  }

  closeModal() {
    this.showModal = false;
  }

  clearForm() {
    this.appointmentForm.reset();
    this.appointmentForm.get('isExistingPatient').setValue(true);
    this.appointmentForm.get('enquirer_country_code').patchValue('+233');
  }

  compareFn(c1: any, c2: any): boolean {
    return c1 === c2;
  }

  private processData() {
    let enquirer_phone: string;
    if (this.appointmentForm.get('enquirer_phone').value) {
      enquirer_phone = `${this.appointmentForm.get('enquirer_country_code').value.replace('+', '')}${this.appointmentForm.get('enquirer_phone').value}`;
    }
    if (this.isExistingPatientValue) {

      return {
        patient_id: this.patient.id,
        doctor_id: this.appointmentForm.get('doctor_id').value,
        comment: this.appointmentForm.get('comment').value,
        staff_specialty_id: this.appointmentForm.get('staff_specialty_id').value,
        appointment_date: this.formatDate(this.appointmentForm.get('appointment_date').value)
      };
    } else {
      return {
        enquirer_name: this.appointmentForm.get('enquirer_name').value,
        enquirer_phone: enquirer_phone,
        enquirer_residence: this.appointmentForm.get('enquirer_residence').value,
        enquirer_email: this.appointmentForm.get('enquirer_email').value,
        doctor_id: this.appointmentForm.get('doctor_id').value,
        comment: this.appointmentForm.get('comment').value,
        staff_speciality_id: this.appointmentForm.get('staff_specialty_id').value,
        appointment_date: this.formatDate(this.appointmentForm.get('appointment_date').value)
      };
    }

  }

  formatDate(date: Date): string {
    if (!date) {
      return null;
    }
    let month = '' + (date.getMonth() + 1);
    let day = '' + date.getDate();
    const year = date.getFullYear();

    if (month.length < 2) {
      month = '0' + month;
    }
    if (day.length < 2) {
      day = '0' + day;
    }

    return [year, month, day].join('-');
  }
}
