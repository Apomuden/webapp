import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { SetupService } from 'src/app/shared/services/setup.service';
import { first, retry } from 'rxjs/operators';

@Component({
  selector: 'app-walkin-registration',
  templateUrl: './walkin-registration.component.html',
  styleUrls: ['./walkin-registration.component.css']
})
export class WalkinRegistrationComponent implements OnInit {

  stepIndex = 0;

  walkinForm: FormGroup = this.fb.group({
    title: this.fb.control(null, [Validators.required]),
    lastName: this.fb.control(null, [Validators.required]),
    firstName: this.fb.control(null, [Validators.required]),
    middleName: this.fb.control(null, [Validators.required]),
    dob: this.fb.control(null, [Validators.required]),
    age: this.fb.control(0),
    useAge: this.fb.control(false, [Validators.required]),
    location: this.fb.control(null, [Validators.required]),
    phone: this.fb.control(null, [Validators.required, Validators.minLength(9), Validators.maxLength(9)]),
    countryCode: this.fb.control('+233', [Validators.required]),
  });

  countriesloading = new BehaviorSubject(false);
  titlesLoading = new BehaviorSubject(false);

  countries = [];
  titles = [];

  formatterAge = (value: number) => `${value} yrs`;
  parserAge = (value: string) => value.replace('years', '');

  constructor(private readonly fb: FormBuilder, private setup: SetupService) {
  }

  done(): void {
    if (this.validateForm()) {
      this.submitForm();
    }
  }

  ngOnInit() {
    this.fetchTitles();
    this.fetchCountries();
  }

  fetchCountries() {
    this.countriesloading.next(true);
    this.setup
      .getCountries()
      .pipe(first())
      .subscribe(
        data => {
          console.log('data', data);
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

  validateForm(): boolean {
    for (const i of Object.keys(this.walkinForm.controls)) {
      this.walkinForm.controls[i].markAsDirty();
      this.walkinForm.controls[i].updateValueAndValidity();
    }

    return this.walkinForm.valid;
  }

  submitForm() {
    //todo get data from form and submit .
  }
}
