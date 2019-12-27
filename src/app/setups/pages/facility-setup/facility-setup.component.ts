import { first } from "rxjs/operators";
import { NzNotificationService } from "ng-zorro-antd";
import { SetupService } from "./../../../shared/services/setup.service";
import { GooglePlaceDirective } from "ngx-google-places-autocomplete";
import { Address } from "ngx-google-places-autocomplete/objects/address";
import { Component, OnInit, ViewChild } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Component({
  selector: "app-facility-setup",
  templateUrl: "./facility-setup.component.html",
  styleUrls: ["./facility-setup.component.css"]
})
export class FacilitySetupComponent implements OnInit {
  initLoading = true; // bug
  loadingMore = false;
  isCreatingFacility = new BehaviorSubject(false);
  regionsLoading = new BehaviorSubject(false);
  countriesLoading = new BehaviorSubject(false);
  googleAddress = null;

  @ViewChild("placesRef", { static: false }) placesRef: GooglePlaceDirective;
  public handleAddressChange(address: Address) {
    this.googleAddress = address.url;
  }

  data = [];
  list = [];
  error = "";
  name = "";
  staffIDPrefix = "";
  staffIdSeperator = "";
  folderIdPrefix = "";
  folderIdSeperator = "";
  digitsAfterStaffPrefix = "";
  digitsAfterFolderPrefix = "";
  yearDigits = "";
  allowedFolderType = null;
  allowedInstallmentType = null;
  activeCell = "";
  alternateCell = "";
  email1 = "";
  email2 = "";
  postalAddress = "";
  physicalAddress = "";
  region = null;
  country = null;

  regions = null;
  countries = null;

  componentLabel = "facility";

  submitForm(): void {
    if (
      this.name == null ||
      this.name == "" ||
      this.region == null ||
      this.region == "" ||
      this.staffIDPrefix == null ||
      this.staffIDPrefix == "" ||
      this.staffIdSeperator == null ||
      this.staffIdSeperator == "" ||
      this.folderIdPrefix == null ||
      this.folderIdPrefix == "" ||
      this.folderIdSeperator == null ||
      this.folderIdSeperator == "" ||
      this.digitsAfterStaffPrefix == null ||
      this.digitsAfterStaffPrefix == "" ||
      this.yearDigits == null ||
      this.yearDigits == "" ||
      this.allowedFolderType == null ||
      this.allowedFolderType == "" ||
      this.allowedInstallmentType == null ||
      this.allowedInstallmentType == "" ||
      this.activeCell == null ||
      this.activeCell == "" ||
      this.email1 == null ||
      this.email1 == "" ||
      this.postalAddress == null ||
      this.postalAddress == "" ||
      this.physicalAddress == null ||
      this.physicalAddress == "" ||
      this.region == null ||
      this.region == "" ||
      this.country == null ||
      this.country == "" ||
      this.googleAddress == null ||
      this.googleAddress == ""
    ) {
      this.error = "Please fill all required fields!";
    } else {
      this.error = "";
      this.isCreatingFacility.next(true);
      this.setup
        .createFacility(
          this.name,
          this.staffIDPrefix,
          this.staffIdSeperator,
          this.folderIdPrefix,
          this.folderIdSeperator,
          this.digitsAfterStaffPrefix,
          this.digitsAfterFolderPrefix,
          this.yearDigits,
          this.allowedFolderType,
          this.allowedInstallmentType,
          this.activeCell,
          this.alternateCell,
          this.email1,
          this.email2,
          this.postalAddress,
          this.physicalAddress,
          this.country,
          this.region,
          this.googleAddress
        )
        .pipe(first())
        .subscribe(
          success => {
            this.isCreatingFacility.next(false);
            if (success) {
              this.notification.blank(
                "Success",
                `Successfully created ${this.componentLabel}`
              );
              this.getFacilities();
              this.name = "";
              this.country = null;
              this.region = null;
            } else {
              this.notification.blank(
                "Error",
                `Could not create ${this.componentLabel}`
              );
            }
          },
          error => {
            this.isCreatingFacility.next(false);
            this.notification.blank(
              "Error",
              `Could not create ${this.componentLabel}`
            );
          }
        );
    }
  }

  constructor(
    private setup: SetupService,
    private notification: NzNotificationService
  ) {}

  getFacilities() {
    this.setup
      .getFacilities()
      .pipe(first())
      .subscribe(
        data => {
          this.data = data.data;
          this.list = data.data;
          this.initLoading = false;
          console.log(this.data);
        },
        error => {
          console.log(error);
        }
      );
  }

  getRegionsByCountryId(countryId: string) {
    this.regionsLoading.next(true);
    this.setup
      .getRegionsByCountryId(countryId)
      .pipe(first())
      .subscribe(
        data => {
          this.regionsLoading.next(false);
          this.regions = data.data;
          this.region = null;
          console.log("regions by country id", this.regions);
        },
        error => {
          this.regionsLoading.next(false);
          console.log(error);
        }
      );
  }
  getCountries() {
    this.countriesLoading.next(true);
    this.setup
      .getCountries()
      .pipe(first())
      .subscribe(
        data => {
          this.countriesLoading.next(false);
          this.countries = data.data;
          this.region = null;
          console.log("countries", this.countries);
        },
        error => {
          this.countriesLoading.next(false);
          console.log(error);
        }
      );
  }

  ngOnInit() {
    this.getFacilities();
    this.getCountries();
  }
}
