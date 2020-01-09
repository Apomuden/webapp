import { first, map } from 'rxjs/operators';
import { SetupService } from './../../shared/services/setup.service';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-register-patient',
  templateUrl: './register-patient.component.html',
  styleUrls: ['./register-patient.component.css']
})
export class RegisterPatientComponent implements OnInit {
  fundingTypes = [];
  titles = [];
  religions = [];
  educationalLevels = [];
  countryCodes = [];
  isLoadingFundingTypes = new BehaviorSubject(false);
  isLoadingTitles = new BehaviorSubject(false);
  isLoadingReligions = new BehaviorSubject(false);
  isLoadingEducationalLevels = new BehaviorSubject(false);
  isLoadingCountryCodes = new BehaviorSubject(false);

  stepIndex = 0;
  readonly finalStepIndex = 3;

  patientForm: FormGroup;

  formatterAge = (value: number) => `${value} yrs`;
  parserAge = (value: string) => value.replace('years', '');

  constructor(private readonly fb: FormBuilder, private setups: SetupService) {
  }

  pre(): void {
    this.changeContent('previous');
  }

  next(): void {
    this.changeContent('next');
  }

  done(): void {
    // if (this.validateNextOfKinInfo()) {
    this.submitForm();
    // }
  }

  changeContent(mode: 'next' | 'previous'): void {
    const action = (valid: boolean) => mode === 'next' ? (valid) ? this.stepIndex++ : null : this.stepIndex--;
    switch (this.stepIndex) {
      case 0: {
        action(this.validateBillingInfo());
        break;
      }
      case 1: {
        action(this.validatePatientInfo());
        break;
      }
      case 2: {
        action(this.validateContactInfo());
        break;
      }
      case 3: {
        action(this.validateContactInfo());
        break;
      }
      default: {
        break;
      }
    }
  }

  ngOnInit() {
    this.getFundingTypes();
    this.getTitles();
    this.getReligions();
    this.getEducationalLevels();
    this.getCountryCodes();

    this.patientForm = this.fb.group({
      // 1.0 Billing Information
      billingInfo: this.fb.group({
        billingType: [null, [Validators.required]],
        sponsored: this.fb.group({
          sponsorName: [null, [Validators.required]],
          company: [null, [Validators.required]],
          memberId: [null, [Validators.required]],
          cardSerialNumber: [null, [Validators.required]],
          staffId: [null, [Validators.required]],
          beneficiary: [null, [Validators.required]],
          relation: [null, [this.relationValidator]],
          // relation: [null],
          policy: [null, [Validators.required]],
          issuedDate: [null, [Validators.required]],
          expiryDate: [null, [Validators.required]],
        }),
      }),
      // 2.0 Patient Information
      patientInfo: this.fb.group({
        firstName: [null, [Validators.required]],
        lastName: [null, [Validators.required]],
        middleName: [null, [Validators.required]],
        title: [null, [Validators.required]],
        dob: [null, [Validators.required]],
        // todo add custom validator for when useAge is selected
        age: [0],
        useAge: [false],
        gender: [null, [Validators.required]],
        maritalStatus: [null, [Validators.required]],
        nationality: [null, [Validators.required]],
        religion: [null, [Validators.required]],
        educationalLevel: [null, [Validators.required]],
        occupation: [null, [Validators.required]],
        oldFolderNumber: [null],
      }),
      // 3.0 Contact Information
      contactInfo: this.fb.group({
        homeAddress: [null, [Validators.required]],
        countryCode: ['+233', [Validators.required]],
        cellPhoneNumber: [null, [Validators.required]],
        emailAddress: [null, [Validators.email]],
      }),
      // 4.0 Next of Kin
      nextOfKin: this.fb.group({
        name: [null, [Validators.required]],
        homeAddress: [null, [Validators.required]],
        countryCode: ['+233', [Validators.required]],
        cellPhoneNumber: [null, [Validators.required]],
        emailAddress: [null, [Validators.email]],
      }),
    });
  }

  get billingTypeControl(): FormControl {
    return this.patientForm.get('billingInfo').get('billingType') as FormControl;
  }

  get isBillingSponsored(): boolean {
    return this.billingTypeControl.value === 'Sponsored';
  }

  get sponsoredForm(): FormGroup {
    return this.patientForm.get('billingInfo').get('sponsored') as FormGroup;
  }

  get beneficiaryControl(): FormControl {
    return this.sponsoredForm.get('beneficiary') as FormControl;
  }

  get isBeneficiaryDependant(): boolean {
    return this.beneficiaryControl.value === 'Dependant';
  }

  get relationControl(): FormControl {
    return this.sponsoredForm.get('relation') as FormControl;
  }

  /*
  * Tracks validity status of form before moving to the
  * next step in patient registration*/
  validateBillingInfo(): boolean {
    if (!this.isBillingSponsored && this.billingTypeControl.value) {
      this.sponsoredForm.reset();
      return true;
    }

    if (!this.isBeneficiaryDependant) {
      this.relationControl.reset();
    }

    for (const i in this.sponsoredForm.controls) {
      this.sponsoredForm.controls[i].markAsDirty();
      this.sponsoredForm.controls[i].updateValueAndValidity();
    }

    this.billingTypeControl.markAsDirty();
    this.billingTypeControl.updateValueAndValidity();

    return this.sponsoredForm.valid && this.billingTypeControl.valid;
  }

  // noinspection JSMethodCanBeStatic
  // TODO fix validator error
  relationValidator = (control: FormControl): { [key: string]: any } | null => {

    if (!this.patientForm) {
      return null;
    }

    if (!this.isBeneficiaryDependant) {
      return null;
    }

    if (!control.value) {
      return { required: true };
    }

    return null;
  };

  get patientInfoForm(): FormGroup {
    return this.patientForm.get('patientInfo') as FormGroup;
  }

  get dobControl(): FormControl {
    return this.patientInfoForm.get('dob') as FormControl;
  }

  get ageControl(): FormControl {
    return this.patientInfoForm.get('age') as FormControl;
  }

  get useAge(): boolean {
    return this.patientInfoForm.get('useAge').value as boolean;
  }

  ageChanged() {
    const age = (this.ageControl.value as number) * 31556952000;
    const today = Date.now();

    const ageDate = new Date(today - age);
    this.dobControl.setValue(ageDate);
  };

  validatePatientInfo(): boolean {
    for (const i in this.patientInfoForm.controls) {
      this.patientInfoForm.controls[i].markAsDirty();
      this.patientInfoForm.controls[i].updateValueAndValidity();
    }

    return this.patientInfoForm.valid;
  }

  get contactInfoForm(): FormGroup {
    return this.patientForm.get('contactInfo') as FormGroup;
  }


  validateContactInfo(): boolean {
    for (const i in this.contactInfoForm.controls) {
      this.contactInfoForm.controls[i].markAsDirty();
      this.contactInfoForm.controls[i].updateValueAndValidity();
    }

    return this.contactInfoForm.valid;
  }

  get nextOfKinInfoForm(): FormGroup {
    return this.patientInfoForm.get('nextOfKin') as FormGroup;
  }

  validateNextOfKinInfo(): boolean {
    for (const i in this.nextOfKinInfoForm.controls) {
      this.nextOfKinInfoForm.controls[i].markAsDirty();
      this.nextOfKinInfoForm.controls[i].updateValueAndValidity();
    }

    return this.nextOfKinInfoForm.valid;
  }
  getFundingTypes() {
    this.isLoadingFundingTypes.next(true);
    this.setups.getFundingTypes().pipe(first()).subscribe(
      res => {
        this.isLoadingFundingTypes.next(false);
        if (res) {
          this.fundingTypes = res.data;
        }

      },
      err => {
        this.isLoadingFundingTypes.next(false);
        console.log(err);
      }
    );
  }

  getTitles() {
    this.isLoadingTitles.next(true);
    this.setups.getTitles().pipe(first()).subscribe(
      res => {
        if (res) {
          this.isLoadingTitles.next(false);
          this.titles = res.data;
        }
      },
      err => {
        console.log(err);
        this.isLoadingTitles.next(false);
      }
    );
  }
  getReligions() {
    this.isLoadingReligions.next(true);
    this.setups.getReligions().pipe(first()).subscribe(
      res => {
        this.isLoadingReligions.next(false);
        if (res) {
          this.religions = res.data;
        }

      },
      err => {
        this.isLoadingReligions.next(false);
        console.log(err);
      }
    );
  }

  getEducationalLevels() {
    this.isLoadingEducationalLevels.next(true);
    this.setups.getEducationalLevels().pipe(first()).subscribe(
      res => {
        if (res) {
          this.isLoadingEducationalLevels.next(false);
          this.educationalLevels = res.data;
        }
      },
      err => {
        this.isLoadingEducationalLevels.next(false);
        console.log(err);
      }
    );
  }

  getCountryCodes() {
    this.isLoadingCountryCodes.next(true);
    this.setups.getCountries().pipe(first()).subscribe(
      res => {
        this.isLoadingCountryCodes.next(false);
        this.countryCodes = res.data.map(item => item.call_code);
      },
      err => {
        this.isLoadingCountryCodes.next(false);
        console.log(err);
      }
    );
  }
  submitForm() {
    //     firstName: "zcvxz"
    // lastName: "rvzvcxz"
    // middleName: "vvsdfzxv"
    // title: 7
    // dob: Wed Jan 22 2020 11:42:50 GMT+0000 (Greenwich Mean Time) {}
    // age: 0
    // useAge: false
    // gender: "FEMALE"
    // maritalStatus: "MARRIED"
    // nationality: "Ghanaian"
    // religion: 3
    // educationalLevel: 8
    // occupation: "zxcvsfd"
    // oldFolderNumber: "zvzvdf"
    console.log(this.patientInfoForm.value);
    let payload = {
      'title_id': 1,
      'folder_id': 7,
      'funding_type_id': 1,
      'ssnit_no': null,
      'tin': null,
      'username': null,
      'surname': 'Samd',
      'middlename': 'Baagyan-Nyamekye',
      'firstname': 'Arhin',
      'dob': '10-01-2021',
      'gender': 'MALE',
      'country_id': null,
      'region_id': null,
      'district_id': null,
      'hometown_id': null,
      'marital': null,
      'profession_id': null,
      'staff_id': null,
      'work_address': null,
      'residence_address': null,
      'native_language_id': null,
      'second_language_id': null,
      'official_language_id': null,
      'id_type_id': 1,
      'id_no': '123456719',
      'id_expiry_date': '01-01-2030',
      'religion_id': null,
      'educational_level_id': null,
      'active_cell': null,
      'email': null,
      'emerg_name': null,
      'emerg_phone': null,
      'emerg_relation_id': null,
      'mortality': 'ALIVE',
      'reg_status': 'OUT-PATIENT',
      'status': 'ACTIVE'
    }
  }
}
