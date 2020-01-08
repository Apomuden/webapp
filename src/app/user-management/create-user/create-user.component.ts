import { BehaviorSubject } from 'rxjs';
import { SetupService } from './../../shared/services/setup.service';
import { Component, OnInit } from '@angular/core';
import { first, retry } from 'rxjs/operators';
import { Validators, FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent implements OnInit {
  stepIndex = 0;

  userForm = this.fb.group({
    // 1 staff type
    staffType: this.fb.group({
      staffType: [null, [Validators.required]],
    }),
    // 2 bio data
    bioData: this.fb.group({
      title: [null, [Validators.required]],
      firstName: [null, [Validators.required]],
      middleName: [null],
      lastName: [null, [Validators.required]],
      userName: [null, [Validators.required]],
      dateOfBirth: [null, [Validators.required]],
      gender: [null, [Validators.required]],
      maritalStatus: [null, [Validators.required]],
      profession: [null, [Validators.required]],
      educationalLevel: [null, [Validators.required]],
      occupation: [null, [Validators.required]],
      residence: [null, [Validators.required]],
    }),
    // 2 contact information
    contactInfo: this.fb.group({
      countryCode: ['+233', [Validators.required]],
      number: [null, [Validators.required, Validators.minLength(9), Validators.maxLength(9)]],
      email: [null, [Validators.email]],
    }),
    // 3 emergency information
    emergency: this.fb.group({
      emergencyContactFullname: [null, [Validators.required]],
      countryCode: ['+233', [Validators.required]],
      countryCodeTwo: ['+233'],
      number: [null, [Validators.required, Validators.minLength(9), Validators.maxLength(9)]],
      numberTwo: [null, [Validators.minLength(9), Validators.maxLength(9)]],
      emailAddress: [null, [Validators.email]],
    }),
    // 4 role and department
    role: this.fb.group({
      role: [null, [Validators.required]],
      department: [null, [Validators.required]],
    }),
    // 5 other information
    other: this.fb.group({
      bankName: [null, [Validators.required]],
      bankBranch: [null, [Validators.required]],
      accountNumber: [null, [Validators.required]],
      pin: [null, [Validators.required]],
      expiryDate: [null, [Validators.required]],
      appointmentDate: [null, [Validators.required]],
      salary: [null, [Validators.required]],
      snnitNumber: [null, [Validators.required]],
      tinNumber: [null, [Validators.required]],
      thirdPartyContribution: [null, [Validators.required]],
      taxOnSalary: [null, [Validators.required]],
      signatory: [null, [Validators.required]],
    }),
  });

  get staffTypeForm(): FormGroup {
    return this.userForm.get('staffType') as FormGroup;
  }
  get bioDataForm(): FormGroup {
    return this.userForm.get('bioData') as FormGroup;
  }
  get contactInfoForm(): FormGroup {
    return this.userForm.get('contactInfo') as FormGroup;
  }
  get emergencyForm(): FormGroup {
    return this.userForm.get('emergency') as FormGroup;
  }
  get roleForm(): FormGroup {
    return this.userForm.get('role') as FormGroup;
  }
  get otherDetailsForm(): FormGroup {
    return this.userForm.get('other') as FormGroup;
  }

  countriesloading = new BehaviorSubject(false);
  departmentsloading = new BehaviorSubject(false);
  rolesloading = new BehaviorSubject(false);
  banksloading = new BehaviorSubject(false);
  staffTypesLoading = new BehaviorSubject(false);
  titlesLoading = new BehaviorSubject(false);
  educationalLevelsLoading = new BehaviorSubject(false);
  bankBranchesLoading = new BehaviorSubject(false);

  countries = [];
  departments = [];
  bankBranches = [];
  roles = [];
  banks = [];
  educationalLevels = [];
  staffTypes = [];
  titles = [];

  constructor(private setup: SetupService, private fb: FormBuilder) { }

  ngOnInit() {
    this.fetchCountries();
    this.fetchStaffType();
  }

  private fetchBankBranches() {
    this.bankBranchesLoading.next(true);
    this.setup
      .getBankBranches()
      .pipe(first())
      .subscribe(data => {
        this.bankBranchesLoading.next(false);
        this.bankBranches = data.data;
      }, error => {
        this.bankBranchesLoading.next(false);
      });
  }

  private fetchDepartments() {
    this.departmentsloading.next(true);
    this.setup
      .getDepartments()
      .pipe(first())
      .subscribe(data => {
        this.departmentsloading.next(false);
        this.departments = data.data;
      }, error => {
        this.departmentsloading.next(false);
      });
  }

  private fetchBanks() {
    this.banksloading.next(true);
    this.setup
      .getBanks()
      .pipe(first())
      .subscribe(data => {
        this.banksloading.next(false);
        this.banks = data.data;
      }, error => {
        this.banksloading.next(false);
      });
  }

  private fetchTitles() {
    this.titlesLoading.next(true);
    this.setup
      .getTitles()
      .pipe(first())
      .subscribe(data => {
        this.titlesLoading.next(false);
        this.titles = data.data;
      }, err => {
        retry(3);
        this.titlesLoading.next(false);
      });
  }

  private fetchStaffType() {
    this.staffTypesLoading.next(true);
    this.setup
      .getStaffTypes()
      .pipe(first())
      .subscribe(data => {
        this.staffTypesLoading.next(false);
        this.staffTypes = data.data;
      }, err => {
        retry(3);
        this.staffTypesLoading.next(false);
      });
  }

  private fetchEducationLevels() {
    this.educationalLevelsLoading.next(true);
    this.setup
      .getEducationalLevels()
      .pipe(first())
      .subscribe(data => {
        this.educationalLevelsLoading.next(false);
        this.educationalLevels = data.data;
      }, error => {
        this.educationalLevelsLoading.next(false);
      });
  }

  private fetchRoles() {
    this.rolesloading.next(true);
    this.setup
      .getRoles()
      .pipe(first())
      .subscribe(data => {
        this.rolesloading.next(false);
        this.roles = data.data;
      }, error => {
        this.rolesloading.next(false);
      });
  }

  private fetchCountries() {
    this.countriesloading.next(true);
    this.setup
      .getCountries()
      .pipe(first())
      .subscribe(data => {
        this.countriesloading.next(false);
        this.countries = data.data;
      }, error => {
        this.countriesloading.next(false);
      });
  }

  pre(): void {
    this.changeContent('previous');
  }

  next(): void {
    this.changeContent('next');
  }

  private changeContent(mode: 'next' | 'previous'): void {
    const action = (valid: boolean) => mode === 'next' ? (valid) ? this.stepIndex++ : null : this.stepIndex--;
    switch (this.stepIndex) {
      case 0: {
        action(this.validateStaffType());
        this.fetchTitles();
        this.fetchEducationLevels();
        break;
      }
      case 1: {
        action(this.validateBioData());
        break;
      }
      case 2: {
        action(this.validateContactInfo());
        break;
      }
      case 3: {
        action(this.validateEmergency());
        this.fetchRoles();
        this.fetchDepartments();
        break;
      }
      case 4: {
        action(this.validateRole());
        this.fetchBanks();
        this.fetchBankBranches();
        break;
      }
      case 5: {
        action(this.validateOtherDetails());
        break;
      }
      default: {
        break;
      }
    }
  }

  validateOtherDetails(): boolean {
    for (const i of Object.keys(this.otherDetailsForm.controls)) {
      this.otherDetailsForm.controls[i].markAsDirty();
      this.otherDetailsForm.controls[i].updateValueAndValidity();
    }
    return this.otherDetailsForm.valid;
  }
  validateRole(): boolean {
    for (const i of Object.keys(this.roleForm.controls)) {
      this.roleForm.controls[i].markAsDirty();
      this.roleForm.controls[i].updateValueAndValidity();
    }
    return this.roleForm.valid;
  }
  validateEmergency(): boolean {
    for (const i of Object.keys(this.emergencyForm.controls)) {
      this.emergencyForm.controls[i].markAsDirty();
      this.emergencyForm.controls[i].updateValueAndValidity();
    }
    return this.emergencyForm.valid;
  }
  validateStaffType(): boolean {
    for (const i of Object.keys(this.staffTypeForm.controls)) {
      this.staffTypeForm.controls[i].markAsDirty();
      this.staffTypeForm.controls[i].updateValueAndValidity();
    }
    return this.staffTypeForm.valid;
  }
  validateBioData(): boolean {
    for (const i of Object.keys(this.bioDataForm.controls)) {
      this.bioDataForm.controls[i].markAsDirty();
      this.bioDataForm.controls[i].updateValueAndValidity();
    }
    return this.bioDataForm.valid;
  }
  validateContactInfo(): boolean {
    for (const i of Object.keys(this.contactInfoForm.controls)) {
      this.contactInfoForm.controls[i].markAsDirty();
      this.contactInfoForm.controls[i].updateValueAndValidity();
    }
    return this.contactInfoForm.valid;
  }

  done(): void {
    // TODO: submit details to backend
  }
}
