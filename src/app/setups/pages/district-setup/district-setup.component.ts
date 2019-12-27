import { NzNotificationService } from "ng-zorro-antd";
import { SetupService } from "./../../../shared/services/setup.service";
import { first } from "rxjs/operators";
import { Component, OnInit } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Component({
  selector: "app-district-setup",
  templateUrl: "./district-setup.component.html",
  styleUrls: ["./district-setup.component.css"]
})
export class DistrictSetupComponent implements OnInit {
  initLoading = true; // bug
  loadingMore = false;
  isCreatingDistrict = new BehaviorSubject(false);
  regionsLoading = new BehaviorSubject(false);
  countriesLoading = new BehaviorSubject(false);

  data = [];
  list = [];
  error = "";
  name = "";

  region = null;
  country = null;

  regions = null;
  countries = null;

  componentLabel = "district";

  submitForm(): void {
    if (
      this.name == null ||
      this.name == "" ||
      this.region == null ||
      this.region == ""
    ) {
      this.error = "All Fields are required!";
    } else {
      this.error = "";
      this.isCreatingDistrict.next(true);
      this.setup
        .createDistrict(this.name, this.region)
        .pipe(first())
        .subscribe(
          success => {
            this.isCreatingDistrict.next(false);
            if (success) {
              this.notification.blank(
                "Success",
                `Successfully created ${this.componentLabel}`
              );
              this.getDistricts();
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
            this.isCreatingDistrict.next(false);
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

  getDistricts() {
    this.setup
      .getDistricts()
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
    this.getDistricts();
    this.getCountries();
  }
}
