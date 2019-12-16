import { SetupService } from './../shared/services/setup.service';
import { BehaviorSubject } from 'rxjs';
import { Component, OnInit, ViewChild } from '@angular/core';
import { first } from 'rxjs/operators';
import { GooglePlaceDirective} from "ngx-google-places-autocomplete";
import { Address} from "ngx-google-places-autocomplete/objects/address";

@Component({
  selector: 'app-setups',
  templateUrl: './setups.component.html',
  styleUrls: ['./setups.component.css']
})
export class SetupsComponent implements OnInit {

  @ViewChild("placesRef", {static:false}) placesRef : GooglePlaceDirective;

        public handleAddressChange(address: Address) {
        // Do some stuff
        console.log(address);
    }

  registrationNumber="";
  registeringBodyName="";
  tinOrPinNumber="";
  adminLocation="";
  adminUsername="";
  adminEmail="";
  firstName="";
  middleName="";
  lastName="";
  countries=[];
  countriesloading = new BehaviorSubject(false);
  current=0;
  registrationDate=null;
  expiryDate=null;
  dateOfBirth=null;
  name="";
  address="";
  hospitalPhoneOne={
    countryCode:"+233",
    number:""
  }
  hospitalPhoneTwo={
    countryCode:"+233",
    number:""
  }
  adminPhoneOne={
    countryCode:"+233",
    number:""
  }
  adminPhoneTwo={
    countryCode:"+233",
    number:""
  }
  nextOfKingPhone={
    countryCode:"+233",
    number:""
  }
  nextOfKingName="";
  relationship=null;
  facilityType=null;



  pre(): void {
    this.current -= 1;
  }

  next(): void {
    this.current += 1;
  }

  done(): void {
    console.log("done");
  }

  onRegistrationDateChange(result: Date): void {
    this.registrationDate=result;
  }
  onExpiryDateChange(result:Date):void{
    this.expiryDate=result;
  }

  onBirthDateChange(result:Date):void{
    this.dateOfBirth =result;
  }
  constructor(private setup:SetupService) { }

  ngOnInit() {

    this.countriesloading.next(true);
    this.setup.getCountries().pipe(first()).subscribe(
      data=>{
        console.log("data",data);
        this.countries=data.data;
        this.countriesloading.next(false);
      },
      error=>{
        console.log("error",error)
        this.countriesloading.next(false);
      }
    );
  }

}
