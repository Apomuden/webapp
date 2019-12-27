import { Router } from "@angular/router";
import { Component, OnInit, ViewChild } from "@angular/core";

@Component({
  selector: "app-setups",
  templateUrl: "./setups.component.html",
  styleUrls: ["./setups.component.css"]
})
export class SetupsComponent implements OnInit {
  selectedSetup = "departments";
  routerLink = "departments";
  // createOrEditMode = 0; //0 for create 1 for edit

  onSetupChanged() {
    switch (this.selectedSetup) {
      case "departments":
        this.routerLink = "departments";
        break;
      case "fundingtypes":
        this.routerLink = "funding-types";
        break;
      case "paymentchannels":
        this.routerLink = "payment-channels";
        break;
      case "sponsorshiptypes":
        this.routerLink = "sponsorship-types";
        break;
      case "districts":
        this.routerLink = "districts";
        break;
      case "paymentstyles":
        this.routerLink = "payment-styles";
        break;
      case "billingsystems":
        this.routerLink = "billing-systems";
        break;
      case "billingcycles":
        this.routerLink = "billing-cycles";
        break;
      case "hospitalservices":
        this.routerLink = "hospital-services";
        break;
      case "servicecategories":
        this.routerLink = "service-categories";
        break;
      case "stafftypes":
        this.routerLink = "staff-types";
        break;
      case "professions":
        this.routerLink = "professions";
        break;
      case "staffcategories":
        this.routerLink = "staff-categories";
        break;
      case "servicesubcategories":
        this.routerLink = "service-subcategories";
        break;
      case "languages":
        this.routerLink = "languages";
        break;
      case "banks":
        this.routerLink = "banks";
        break;
      case "bankbranches":
        this.routerLink = "bank-branches";
        break;
      case "idtypes":
        this.routerLink = "id-types";
        break;
      case "educationallevels":
        this.routerLink = "education-levels";
        break;
      case "agegroups":
        this.routerLink = "age-groups";
        break;
      case "titles":
        this.routerLink = "titles";
        break;
      case "relationships":
        this.routerLink = "relationships";
        break;
      case "towns":
        this.routerLink = "towns";
        break;
      case "religions":
        this.routerLink = "religions";
        break;
      case "facilities":
        this.routerLink = "facilities";
        break;
      case "accreditations":
        this.routerLink = "accreditations";
        break;
      case "countries":
        this.routerLink = "countries";
        break;
      case "companies":
        this.routerLink = "companies";
        break;
      case "specialties":
        this.routerLink = "specialties";
        break;
    }

    this.router.navigate(["setup/" + this.routerLink]);
    console.log(this.routerLink);
  }
  constructor(private router: Router) {}

  ngOnInit() {
    this.router.navigate(["setup/departments"]);
  }
}
