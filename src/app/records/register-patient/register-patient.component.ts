import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators} from '@angular/forms';

@Component({
  selector: 'app-register-patient',
  templateUrl: './register-patient.component.html',
  styleUrls: ['./register-patient.component.css']
})
export class RegisterPatientComponent implements OnInit {

  current = 0;
  patientForm: FormGroup;

  constructor(private readonly fb: FormBuilder) {
  }

  pre(): void {
    this.changeContent('previous');
  }

  next(): void {
    this.changeContent('next');
  }

  done(): void {
    this.submitForm();
  }

  changeContent(mode: 'next' | 'previous'): void {
    const action = () => mode === 'next' ? this.current++ : this.current--;
    switch (this.current) {
      case 0: {
        const success = this.validateBillingInfo();
        // if (success) {
          action();
        // }
        break;
      }
      case 1: {
        action();
        break;
      }
      case 2: {
        action();
        break;
      }
      default: {
        break;
      }
    }
  }

  ngOnInit() {
    this.patientForm = this.fb.group({
      billingType: [null, [Validators.required]],
      sponsored: this.fb.group({
        sponsorName: [null, [Validators.required]],
        company: [null, [Validators.required]],
        memberId: [null, [Validators.required]],
        cardSerialNumber: [null, [Validators.required]],
        staffId: [null, [Validators.required]],
        beneficiary: [null, [Validators.required]],
        relation: [null],
        policy: [null, [Validators.required]],
        issuedDate: [null, [Validators.required]],
        expiryDate: [null, [Validators.required]],
      }),
    });
  }

  get billingTypeControl(): FormControl {
    return this.patientForm.get('billingType') as FormControl;
  }

  get isBillingSponsored(): boolean {
    return this.billingTypeControl.value === 'Sponsored';
  }

  get sponsoredForm(): FormGroup {
    return this.patientForm.get('sponsored') as FormGroup;
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

    if(!this.isBeneficiaryDependant) {
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
  RelationValidator(control: AbstractControl): ValidationErrors | null {

    if(!this.isBeneficiaryDependant) {
      return null;
    }

    if(!control.value) {
      return { required: true };
    }

    return null;
  }

  submitForm() {

  }
}
