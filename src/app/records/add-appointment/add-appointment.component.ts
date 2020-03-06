import { debounceTime, first, retry } from 'rxjs/operators';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { NzNotificationService } from 'ng-zorro-antd';
import { RecordService } from './../record.service';
import { BehaviorSubject } from 'rxjs';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
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
    clinic_id: [null, [Validators.required]],
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

  countriesloading = new BehaviorSubject(false);
  isLoadingClinics = new BehaviorSubject(false);
  isLoadingDoctors = new BehaviorSubject(false);
  titlesLoading = new BehaviorSubject(false);
  townsLoading = new BehaviorSubject(false);
  regionsLoading = new BehaviorSubject(false);
  creating = new BehaviorSubject(false);
  showModal = false;

  patient: any;
  countries = [];
  titles = [];
  towns = [];
  clinics = [];
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
    this.getClinics();
    this.fetchCountries();
  }

  ngAfterViewInit() {
    this.appointmentForm.get('isExistingPatient').valueChanges.pipe(untilComponentDestroyed(this), debounceTime(100))
      .subscribe(boolVal => {
        this.updateFormValidations(boolVal);
      });

    this.appointmentForm.get('clinic_id').valueChanges.pipe(untilComponentDestroyed(this), debounceTime(100))
      .subscribe(id => {
        this.getDoctorsForClinic(id);
      });
  }

  ngOnDestroy() {
  }

  private updateFormValidations(isExistingPatient: Boolean) {
    if (isExistingPatient) {

      this.appointmentForm.get('patient_id').setValidators([Validators.required]);
      this.appointmentForm.get('enquirer_name').setValidators(null);
      this.appointmentForm.get('enquirer_country_code').setValidators(null);
      this.appointmentForm.get('enquirer_phone').setValidators(null);
      this.appointmentForm.get('enquirer_residence').setValidators(null);
      this.appointmentForm.get('enquirer_email').setValidators(null);

    } else {
      this.appointmentForm.get('patient_id').setValidators(null);
      this.appointmentForm.get('enquirer_name').setValidators([Validators.required]);
      this.appointmentForm.get('enquirer_country_code').setValidators([Validators.required]);
      this.appointmentForm.get('enquirer_phone').setValidators([Validators.required]);
      this.appointmentForm.get('enquirer_residence').setValidators([Validators.required]);
      this.appointmentForm.get('enquirer_email').setValidators([Validators.required]);
    }
  }


  private getDoctorsForClinic(id: number) {
    this.appointmentForm.get('doctor_id').reset();
    this.doctors = [];

    this.isLoadingDoctors.next(true);
    this.setup
      .getDoctorsForClinic(id)
      .pipe(first())
      .subscribe(data => {
        this.regionsLoading.next(false);
        this.regions = data.data;
      }, error => {
        this.regionsLoading.next(false);
      });
  }
  private getClinics() {
    this.isLoadingClinics.next(true);
    this.setup
      .getClinics()
      .pipe(first())
      .subscribe(data => {
        this.isLoadingClinics.next(false);
        this.clinics = data.data;
        console.log(this.clinics);
      }, error => {
        this.isLoadingClinics.next(false);
      });
  }

  private fetchRegions(countryId: string) {
    this.appointmentForm.get('originRegion').reset();
    this.regions = [];
    if (!countryId) {
      return;
    }
    this.regionsLoading.next(true);
    this.setup
      .getRegionsByCountryId(countryId)
      .pipe(first())
      .subscribe(data => {
        this.regionsLoading.next(false);
        this.regions = data.data;
      }, error => {
        this.regionsLoading.next(false);
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

  fetchTitles() {
    this.titlesLoading.next(true);
    this.setup
      .getTitles()
      .pipe(first())
      .subscribe(
        data => {
          this.titlesLoading.next(false);
          this.titles = data.data;
        },
        err => {
          retry(3);
          this.titlesLoading.next(false);
          console.log(err);
        }
      );
  }

  get dobControl(): FormControl {
    return this.appointmentForm.get('dob') as FormControl;
  }

  get ageControl(): FormControl {
    return this.appointmentForm.get('age') as FormControl;
  }

  get useAge(): boolean {
    return this.appointmentForm.get('useAge').value as boolean;
  }

  ageChanged() {
    const age = (this.ageControl.value as number) * 31556952000;
    const today = Date.now();

    const ageDate = new Date(today - age);
    this.dobControl.setValue(ageDate);
  }

  submitForm() {
    // todo get data from form and submit .
    const data = this.processData();
    console.log(data);
    this.creating.next(true);
    this.recordsService.createWalkIn(data)
      .subscribe(res => {
        this.patient = res.data;
        this.clearForm();
        this.notificationS.success('Success', 'Successfully created patient');
        this.showModal = true;
        this.creating.next(false);
      }, e => {
        console.log(e);
        this.notificationS.error('Oops', 'Could not create patient. Please try again');
        this.creating.next(false);
      });
  }

  closeModal() {
    this.showModal = false;
  }

  clearForm() {
    this.appointmentForm.reset();
    this.ageControl.patchValue(0);
    this.appointmentForm.get('countryCode').patchValue('+233');
  }

  compareFn(c1: any, c2: any): boolean {
    return c1 === c2;
  }

  private processData() {
    let active_cell: string;
    if (this.appointmentForm.get('phone').value) {
      active_cell = `${this.appointmentForm.get('countryCode').value.replace('+', '')}${this.appointmentForm.get('phone').value}`;
    }

    return {
      funding_type_id: 1,
      active_cell: active_cell ? parseInt(active_cell, 10) : null,
      title_id: this.appointmentForm.get('title').value as number,
      surname: this.appointmentForm.get('lastName').value,
      firstname: this.appointmentForm.get('firstName').value,
      middlename: this.appointmentForm.get('middleName').value,
      dob: this.formatDate(this.appointmentForm.get('dob').value),
      gender: this.appointmentForm.get('gender').value,
      origin_country_id: this.appointmentForm.get('originCountry').value,
      origin_region_id: this.appointmentForm.get('originRegion').value,
      hometown_id: this.appointmentForm.get('homeTown').value,
      reg_status: 'WALK-IN',
      // folder_type: 'INDIVIDUAL',
    };
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
