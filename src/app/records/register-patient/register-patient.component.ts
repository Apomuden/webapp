import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-register-patient',
  templateUrl: './register-patient.component.html',
  styleUrls: ['./register-patient.component.css']
})
export class RegisterPatientComponent implements OnInit {

  stepIndex = 2;
  readonly finalStepIndex = 3;

  patientForm: FormGroup;

  formatterAge = (value: number) => `${value} yrs`;
  parserAge = (value: string) => value.replace('years', '');

  constructor(private readonly fb: FormBuilder) {
  }

  pre(): void {
    this.changeContent('previous');
  }

  next(): void {
    this.changeContent('next');
  }

  done(): void {
    if (this.validateNextOfKinInfo()) {
      this.submitForm();
    }
  }

  changeContent(mode: 'next' | 'previous'): void {
    const action = () => mode === 'next' ? this.stepIndex++ : this.stepIndex--;
    switch (this.stepIndex) {
      case 0: {
        if (this.validateBillingInfo()) {
          action();
        }
        break;
      }
      case 1: {
        if (this.validatePatientInfo()) {
          action();
        }
        break;
      }
      case 2: {
        if (this.validateContactInfo()) {
          action();
        }
        break;
      }
      case 3: {
        if (this.validateNextOfKinInfo()) {
          action();
        }
        break;
      }
      default: {
        break;
      }
    }
  }

  ngOnInit() {
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
      return {required: true};
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

  submitForm() {
    //todo get data from form and submit .
  }
}
