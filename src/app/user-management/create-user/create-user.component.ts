import { BehaviorSubject } from 'rxjs';
import { SetupService } from './../../shared/services/setup.service';
import { Component, OnInit } from '@angular/core';
import { first, retry } from 'rxjs/operators';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent implements OnInit {
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
  countryCode = null;
  current = 0;
  staffType = null;
  title = null;
  firstName = '';
  lastName = '';
  middleName = '';
  gender = null;
  dateOfBirth = null;
  religion = null;
  maritalStatus = null;
  profession = '';
  educationalLevel = null;
  residence = '';
  phone = {
    countryCode: '+233',
    number: ''
  };
  email = '';
  emergencyContactFullname = '';
  emergencyPhoneOne = {
    countryCode: '+233',
    number: ''
  };
  emergencyPhoneTwo = {
    countryCode: '+233',
    number: ''
  };
  department = null;
  role = null;
  bankName = null;
  bankBranch = null;
  accountNumber = null;
  expiryDate = null;
  appointmentDate = null;
  pin = null;
  salary = null;
  snnitNumber = null;
  tinNumber = null;
  thirdPartyContribution = null;
  username = null;
  taxOnSalary = null;
  signatory = null;

  index = 'First-content';

  pre(): void {
    this.current -= 1;
  }

  next(): void {
    this.current += 1;
  }

  done(): void { }

  onBirthDateChange(result: Date): void {
    this.dateOfBirth = result;
  }
  onExpiryDateChange(result: Date): void {
    this.expiryDate = result;
  }
  onAppointmentDateChange(result: Date): void {
    this.appointmentDate = result;
  }

  constructor(private setup: SetupService) { }

  ngOnInit() {
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

    this.rolesloading.next(true);
    this.setup
      .getRoles()
      .pipe(first())
      .subscribe(
        data => {
          console.log('data', data);
          this.rolesloading.next(false);
          this.roles = data.data;
        },
        error => {
          this.rolesloading.next(false);
          console.log('error', error);
        }
      );

    this.educationalLevelsLoading.next(true);
    this.setup
      .getEducationalLevels()
      .pipe(first())
      .subscribe(
        data => {
          console.log('data', data);
          this.educationalLevelsLoading.next(false);
          this.educationalLevels = data.data;
        },
        error => {
          this.educationalLevelsLoading.next(false);
          console.log('error', error);
        }
      );

    this.staffTypesLoading.next(true);
    this.setup
      .getStaffTypes()
      .pipe(first())
      .subscribe(
        data => {
          this.staffTypesLoading.next(false);
          this.staffTypes = data.data;
        },
        err => {
          retry(3);
          this.staffTypesLoading.next(false);
          console.log(err);
        }
      );

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

    this.banksloading.next(true);
    this.setup
      .getBanks()
      .pipe(first())
      .subscribe(
        data => {
          console.log('banks', data);
          this.banksloading.next(false);
          this.banks = data.data;
        },
        error => {
          this.banksloading.next(false);
          console.log('error', error);
        }
      );

    this.departmentsloading.next(true);
    this.setup
      .getDepartments()
      .pipe(first())
      .subscribe(
        data => {
          console.log('data', data);
          this.departmentsloading.next(false);
          this.departments = data.data;
        },
        error => {
          this.departmentsloading.next(false);
          console.log('error', error);
        }
      );

    this.bankBranchesLoading.next(true);
    this.setup
      .getBankBranches()
      .pipe(first())
      .subscribe(
        data => {
          console.log('data', data);
          this.bankBranchesLoading.next(false);
          this.bankBranches = data.data;
        },
        error => {
          this.bankBranchesLoading.next(false);
          console.log('error', error);
        }
      );
  }
}
