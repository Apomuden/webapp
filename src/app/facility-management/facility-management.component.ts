import { BehaviorSubject } from 'rxjs';
import { ViewChild } from '@angular/core';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { first } from 'rxjs/operators';
import { SetupService } from './../shared/services/setup.service';
import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd';

@Component({
  selector: 'app-facility-management',
  templateUrl: './facility-management.component.html',
  styleUrls: ['./facility-management.component.css']
})
export class FacilityManagementComponent implements OnInit {
  registrationNumber = '';
  registeringBodyName = '';
  tinOrPinNumber = '';
  adminLocation = '';
  adminUsername = '';
  adminEmail = '';
  firstName = '';
  middleName = '';
  lastName = '';
  countries = [];
  googleAddress = null;
  countriesloading = new BehaviorSubject(false);
  current = 0;
  registrationDate = null;
  expiryDate = null;
  dateOfBirth = null;
  name = '';
  address = '';
  hospitalPhoneOne = {
    countryCode: '+233',
    number: ''
  };
  hospitalPhoneTwo = {
    countryCode: '+233',
    number: ''
  };
  adminPhoneOne = {
    countryCode: '+233',
    number: ''
  };
  adminPhoneTwo = {
    countryCode: '+233',
    number: ''
  };
  nextOfKingPhone = {
    countryCode: '+233',
    number: ''
  };
  nextOfKingName = '';
  relationship = null;
  facilityType = null;

  @ViewChild('placesRef', { static: false }) placesRef: GooglePlaceDirective;

  public handleAddressChange(address: Address) {
    // Do some stuff
    this.googleAddress = address.url;
  }

  pre(): void {
    this.current -= 1;
  }

  next(): void {
    this.current += 1;
  }

  done(): void {
    this.storeFacilityDetails();
  }

  storeFacilityDetails() {
    const facilityDetails = {
      hospitalData: {
        name: this.name,
        address: this.address,
        phoneOne:
          this.hospitalPhoneOne.countryCode + this.hospitalPhoneOne.number,
        phoneTwo:
          this.hospitalPhoneTwo.countryCode + this.hospitalPhoneTwo.number,
        googleLocation: this.googleAddress
      },
      registrationInfo: {
        nameOfRegisteringBody: this.registeringBodyName,
        registrationNumber: this.registrationNumber,
        registrationDate: this.registrationDate,
        tinOrPin: this.tinOrPinNumber,
        expiryDate: this.expiryDate
      },
      adminInfo: {
        firstName: this.firstName,
        middleName: this.middleName,
        lastName: this.lastName,
        birthdate: this.dateOfBirth,
        phoneOne: this.adminPhoneOne.countryCode + this.adminPhoneOne.number,
        phoneTwo: this.adminPhoneTwo.countryCode + this.adminPhoneTwo.number,
        address: this.adminLocation,
        email: this.adminEmail,
        username: this.adminUsername,
        nextOfKing: {
          name: this.nextOfKingName,
          phone: this.nextOfKingPhone.countryCode + this.nextOfKingPhone.number,
          relationship: this.relationship
        }
      },
      facilityType: this.facilityType
    };
    console.log(facilityDetails);
    localStorage.setItem('facilityDetails', JSON.stringify(facilityDetails));
    this.notification.blank('Success', 'Facility Details Saved Successfully');
  }

  onRegistrationDateChange(result: Date): void {
    this.registrationDate = result;
  }
  onExpiryDateChange(result: Date): void {
    this.expiryDate = result;
  }

  onBirthDateChange(result: Date): void {
    this.dateOfBirth = result;
  }
  constructor(
    private setup: SetupService,
    private notification: NzNotificationService
  ) {}

  ngOnInit() {
    this.countriesloading.next(true);
    this.setup
      .getCountries()
      .pipe(first())
      .subscribe(
        data => {
          console.log('data', data);
          this.countries = data.data;
          this.countriesloading.next(false);
        },
        error => {
          console.log('error', error);
          this.countriesloading.next(false);
        }
      );
  }
}
