import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { SetupService } from 'src/app/shared/services/setup.service';
import { first, retry, debounceTime } from 'rxjs/operators';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { RecordService } from '../record.service';
import { NzMessageService, NzNotificationService } from 'ng-zorro-antd';

@Component({
  selector: 'app-walkin-registration',
  templateUrl: './walkin-registration.component.html',
  styleUrls: ['./walkin-registration.component.css']
})
export class WalkinRegistrationComponent implements OnInit, AfterViewInit, OnDestroy {

  stepIndex = 0;

  walkinForm: FormGroup = this.fb.group({
    title: this.fb.control(null, [Validators.required]),
    lastName: this.fb.control(null, [Validators.required]),
    firstName: this.fb.control(null, [Validators.required]),
    middleName: this.fb.control(null),
    gender: this.fb.control(null, [Validators.required]),
    dob: this.fb.control(null, [Validators.required]),
    age: this.fb.control(0),
    useAge: this.fb.control(false, [Validators.required]),
    phone: this.fb.control(null, [Validators.required, Validators.minLength(9), Validators.maxLength(9)]),
    countryCode: this.fb.control('+233', [Validators.required]),
    originCountry: [null],
    originRegion: [null],
    homeTown: [null],
  });

  countriesloading = new BehaviorSubject(false);
  titlesLoading = new BehaviorSubject(false);
  townsLoading = new BehaviorSubject(false);
  regionsLoading = new BehaviorSubject(false);
  creating = new BehaviorSubject(false);

  countries = [];
  titles = [];
  towns = [];
  regions = [];

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
    this.fetchTitles();
    this.fetchCountries();
  }

  ngAfterViewInit() {
    this.walkinForm.get('originCountry').valueChanges.pipe(untilComponentDestroyed(this), debounceTime(500))
      .subscribe(countryId => this.fetchRegions(countryId));
    this.walkinForm.get('originRegion').valueChanges.pipe(untilComponentDestroyed(this), debounceTime(500))
      .subscribe((regionId: string) => this.fetchTowns(regionId));
  }

  ngOnDestroy() {
  }

  private fetchTowns(regionId: string) {
    this.walkinForm.get('homeTown').reset();
    this.towns = [];
    if (!regionId) {
      return;
    }
    this.townsLoading.next(true);
    this.setup
      .getTownsByReigion(regionId)
      .pipe(first())
      .subscribe(data => {
        this.townsLoading.next(false);
        this.towns = data.data;
        console.log(this.towns);
      }, error => {
        this.townsLoading.next(false);
      });
  }

  private fetchRegions(countryId: string) {
    this.walkinForm.get('originRegion').reset();
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
    return this.walkinForm.get('dob') as FormControl;
  }

  get ageControl(): FormControl {
    return this.walkinForm.get('age') as FormControl;
  }

  get useAge(): boolean {
    return this.walkinForm.get('useAge').value as boolean;
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
        this.clearForm();
        this.notificationS.success('Success', 'Successfully created patient');
        this.creating.next(false);
      }, e => {
        console.log(e);
        this.notificationS.error('Oops', 'Could not create patient. Please try again');
        this.creating.next(false);
      });
  }

  clearForm() {
    this.walkinForm.reset();
    this.ageControl.patchValue(0);
    this.walkinForm.get('countryCode').patchValue('+233');
  }

  compareFn(c1: any, c2: any): boolean {
    return c1 === c2;
  }

  private processData() {
    let active_cell: string;
    if (this.walkinForm.get('phone').value) {
      active_cell = `${this.walkinForm.get('countryCode').value.replace('+', '')}${this.walkinForm.get('phone').value}`;
    }

    return {
      funding_type_id: 1,
      active_cell: active_cell ? parseInt(active_cell, 10) : null,
      title_id: this.walkinForm.get('title').value as number,
      surname: this.walkinForm.get('lastName').value,
      firstname: this.walkinForm.get('firstName').value,
      middlename: this.walkinForm.get('middleName').value,
      dob: this.formatDate(this.walkinForm.get('dob').value),
      gender: this.walkinForm.get('gender').value,
      origin_country_id: this.walkinForm.get('originCountry').value,
      origin_region_id: this.walkinForm.get('originRegion').value,
      hometown_id: this.walkinForm.get('homeTown').value,
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
