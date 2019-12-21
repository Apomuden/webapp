import { map } from "rxjs/operators";
import { environment } from "./../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
const COUNTRIES_API_URL = environment.apiBaseUrl + "/setups/countries";
const ROLES_API_URL = environment.apiBaseUrl + "/auth/roles";
const DEPARTMENTS_API_URL = environment.apiBaseUrl + "/setups/departments";
const PAYMENTS_CHANNEL_API_URL =
  environment.apiBaseUrl + "/setups/paymentchannels";
const BANKS_API_URL = environment.apiBaseUrl + "/setups/banks";
const SPONSORSHIP_TYPE_API_URL =
  environment.apiBaseUrl + "/setups/sponsorshiptypes";
const PAYMENT_STYLE_API_URL = environment.apiBaseUrl + "/setups/paymentstyles";
const BILLING_CYCLE_API_URL = environment.apiBaseUrl + "/setups/billingcycles";
const BILLING_SYSTEM_API_URL =
  environment.apiBaseUrl + "/setups/billingsystems";
const HOSPITAL_SERVICE_API_URL =
  environment.apiBaseUrl + "/setups/hospitalservices";

const LANGUAGE_API_URL = environment.apiBaseUrl + "/setups/languages";
const SPECIALITY_API_URL = environment.apiBaseUrl + "/setups/specialties";
const RELATIONSHIP_API_URL = environment.apiBaseUrl + "/setups/relationships";
const RELIGION_API_URL = environment.apiBaseUrl + "/setups/religions";
const FUNDING_TYPE_API_URL = environment.apiBaseUrl + "/setups/fundingtypes";
const STAFF_CATEGORY_API_URL =
  environment.apiBaseUrl + "/setups/staffcategories";
@Injectable({
  providedIn: "root"
})
export class SetupService {
  private countries;
  private roles;
  private departments;
  private paymentChannels;
  private banks;
  private sponsorshipTypes;
  private paymentStyle;
  private billingSystems;
  private hospitalServices;
  private languages;
  private staffCategories;
  private relationships;
  private religions;
  private specialities;
  private billingCycles;
  private fundingTypes;

  constructor(private http: HttpClient) {}

  getCountries() {
    return this.http.get<any>(COUNTRIES_API_URL).pipe(
      map(res => {
        if (res) {
          this.countries = res;
        }
        return this.countries;
      })
    );
  }

  /**
   * Department routes
   */
  createDepartment(name: string) {
    return this.http
      .post<any>(DEPARTMENTS_API_URL, { name })
      .pipe(
        map(res => {
          if (res) {
            return true;
          }
          return false;
        })
      );
  }
  getDepartments() {
    return this.http.get<any>(DEPARTMENTS_API_URL).pipe(
      map(res => {
        if (res) {
          this.departments = res;
          for (let i = 0; i < this.departments.data.length; i++) {
            this.departments.data[i].isActivated =
              this.departments.data[i].status == "ACTIVE" ? true : false;
          }
        }
        return this.departments;
      })
    );
  }

  /**
   * Department routes
   */
  createFundingType(
    name: string,
    sponsorshipType: string,
    billingCycle: string,
    paymentStyle: string,
    paymentChannel: string,
    billingSystem: string
  ) {
    return this.http
      .post<any>(FUNDING_TYPE_API_URL, {
        name,
        sponsorship_type_id: sponsorshipType,
        billing_cycle_id: billingCycle,
        payment_style_id: paymentStyle,
        payment_channel_id: paymentChannel,
        billing_system_id: billingSystem
      })
      .pipe(
        map(res => {
          if (res) {
            return true;
          }
          return false;
        })
      );
  }
  getFundingTypes() {
    return this.http.get<any>(FUNDING_TYPE_API_URL).pipe(
      map(res => {
        if (res) {
          this.fundingTypes = res;
          for (let i = 0; i < this.fundingTypes.data.length; i++) {
            this.fundingTypes.data[i].isActivated =
              this.fundingTypes.data[i].status == "ACTIVE" ? true : false;
          }
        }
        return this.fundingTypes;
      })
    );
  }

  /**
   * Payment Channel routes
   */
  createPaymentChannel(name: string) {
    return this.http
      .post<any>(PAYMENTS_CHANNEL_API_URL, { name })
      .pipe(
        map(res => {
          if (res) {
            return true;
          }
          return false;
        })
      );
  }

  getPaymentChannels() {
    return this.http.get<any>(PAYMENTS_CHANNEL_API_URL).pipe(
      map(res => {
        if (res) {
          this.paymentChannels = res;
          console.log(res);
          for (let i = 0; i < this.paymentChannels.data.length; i++) {
            this.paymentChannels.data[i].isActivated =
              this.paymentChannels.data[i].status == "ACTIVE" ? true : false;
          }
        }
        return this.paymentChannels;
      })
    );
  }

  /**
   * Billing Cycles routes
   */
  createBillingCycle(name: string, status: string) {
    return this.http
      .post<any>(BILLING_CYCLE_API_URL, { name, status })
      .pipe(
        map(res => {
          if (res) {
            return true;
          }
          return false;
        })
      );
  }

  getBillingCycles() {
    return this.http.get<any>(BILLING_CYCLE_API_URL).pipe(
      map(res => {
        if (res) {
          this.billingCycles = res;
          console.log(res);
          for (let i = 0; i < this.billingCycles.data.length; i++) {
            this.billingCycles.data[i].isActivated =
              this.billingCycles.data[i].status == "ACTIVE" ? true : false;
          }
        }
        return this.billingCycles;
      })
    );
  }

  /**
   * Billing System routes
   */
  createBillingSystem(name: string) {
    return this.http
      .post<any>(BILLING_SYSTEM_API_URL, { name })
      .pipe(
        map(res => {
          if (res) {
            return true;
          }
          return false;
        })
      );
  }

  getBillingSystems() {
    return this.http.get<any>(BILLING_SYSTEM_API_URL).pipe(
      map(res => {
        if (res) {
          this.billingSystems = res;
          console.log(res);
          for (let i = 0; i < this.billingSystems.data.length; i++) {
            this.billingSystems.data[i].isActivated =
              this.billingSystems.data[i].status == "ACTIVE" ? true : false;
          }
        }
        return this.billingSystems;
      })
    );
  }

  /**
   * Hospital services routes
   */
  createHospitalService(name: string) {
    return this.http
      .post<any>(HOSPITAL_SERVICE_API_URL, { name })
      .pipe(
        map(res => {
          if (res) {
            return true;
          }
          return false;
        })
      );
  }

  getHospitalServices() {
    return this.http.get<any>(HOSPITAL_SERVICE_API_URL).pipe(
      map(res => {
        if (res) {
          this.hospitalServices = res;
          console.log(res);
          for (let i = 0; i < this.hospitalServices.data.length; i++) {
            this.hospitalServices.data[i].isActivated =
              this.hospitalServices.data[i].status == "ACTIVE" ? true : false;
          }
        }
        return this.hospitalServices;
      })
    );
  }

  /**
   * Languages routes
   */
  createLanguage(name: string) {
    return this.http
      .post<any>(LANGUAGE_API_URL, { name })
      .pipe(
        map(res => {
          if (res) {
            return true;
          }
          return false;
        })
      );
  }

  getLanguages() {
    return this.http.get<any>(LANGUAGE_API_URL).pipe(
      map(res => {
        if (res) {
          this.languages = res;
          console.log(res);
          for (let i = 0; i < this.languages.data.length; i++) {
            this.languages.data[i].isActivated =
              this.languages.data[i].status == "ACTIVE" ? true : false;
          }
        }
        return this.languages;
      })
    );
  }

  /**
   * Relationship routes
   */
  createRelationship(name: string) {
    return this.http
      .post<any>(RELATIONSHIP_API_URL, { name })
      .pipe(
        map(res => {
          if (res) {
            return true;
          }
          return false;
        })
      );
  }

  getRelationships() {
    return this.http.get<any>(RELATIONSHIP_API_URL).pipe(
      map(res => {
        if (res) {
          this.relationships = res;
          console.log(res);
          for (let i = 0; i < this.relationships.data.length; i++) {
            this.relationships.data[i].isActivated =
              this.relationships.data[i].status == "ACTIVE" ? true : false;
          }
        }
        return this.relationships;
      })
    );
  }

  /**
   * Speciality routes
   */
  createSpeciality(name: string) {
    return this.http
      .post<any>(SPECIALITY_API_URL, { name })
      .pipe(
        map(res => {
          if (res) {
            return true;
          }
          return false;
        })
      );
  }

  getSpecialities() {
    return this.http.get<any>(SPECIALITY_API_URL).pipe(
      map(res => {
        if (res) {
          this.specialities = res;
          console.log(res);
          for (let i = 0; i < this.specialities.data.length; i++) {
            this.specialities.data[i].isActivated =
              this.specialities.data[i].status == "ACTIVE" ? true : false;
          }
        }
        return this.specialities;
      })
    );
  }

  /**
   * Religion routes
   */
  createReligion(name: string) {
    return this.http
      .post<any>(RELIGION_API_URL, { name })
      .pipe(
        map(res => {
          if (res) {
            return true;
          }
          return false;
        })
      );
  }

  getReligions() {
    return this.http.get<any>(RELIGION_API_URL).pipe(
      map(res => {
        if (res) {
          this.religions = res;
          console.log(res);
          for (let i = 0; i < this.religions.data.length; i++) {
            this.religions.data[i].isActivated =
              this.religions.data[i].status == "ACTIVE" ? true : false;
          }
        }
        return this.religions;
      })
    );
  }

  /**
   * Languages routes
   */
  createStaffCategory(name: string) {
    return this.http
      .post<any>(STAFF_CATEGORY_API_URL, { name })
      .pipe(
        map(res => {
          if (res) {
            return true;
          }
          return false;
        })
      );
  }

  getStaffCategories() {
    return this.http.get<any>(STAFF_CATEGORY_API_URL).pipe(
      map(res => {
        if (res) {
          this.staffCategories = res;
          console.log(res);
          for (let i = 0; i < this.staffCategories.data.length; i++) {
            this.staffCategories.data[i].isActivated =
              this.staffCategories.data[i].status == "ACTIVE" ? true : false;
          }
        }
        return this.staffCategories;
      })
    );
  }

  /**
   * Payment Styles routes
   */
  createPaymentStyle(name: string) {
    return this.http
      .post<any>(PAYMENT_STYLE_API_URL, { name })
      .pipe(
        map(res => {
          if (res) {
            return true;
          }
          return false;
        })
      );
  }

  getPaymentStyles() {
    return this.http.get<any>(PAYMENT_STYLE_API_URL).pipe(
      map(res => {
        if (res) {
          this.paymentStyle = res;
          console.log(res);
          for (let i = 0; i < this.paymentStyle.data.length; i++) {
            this.paymentStyle.data[i].isActivated =
              this.paymentStyle.data[i].status == "ACTIVE" ? true : false;
          }
        }
        return this.paymentStyle;
      })
    );
  }

  /**
   * Sponsorship Type routes
   */
  createSponsorshipType(name: string) {
    return this.http
      .post<any>(SPONSORSHIP_TYPE_API_URL, { name })
      .pipe(
        map(res => {
          if (res) {
            return true;
          }
          return false;
        })
      );
  }

  getSponsorshipTypes() {
    return this.http.get<any>(SPONSORSHIP_TYPE_API_URL).pipe(
      map(res => {
        if (res) {
          this.sponsorshipTypes = res;
          console.log(res);
          for (let i = 0; i < this.sponsorshipTypes.data.length; i++) {
            this.sponsorshipTypes.data[i].isActivated =
              this.sponsorshipTypes.data[i].status == "ACTIVE" ? true : false;
          }
        }
        return this.sponsorshipTypes;
      })
    );
  }

  getRoles() {
    return this.http.get<any>(ROLES_API_URL).pipe(
      map(res => {
        if (res) {
          this.roles = res;
        }
        return this.roles;
      })
    );
  }

  getBanks() {
    return this.http.get<any>(BANKS_API_URL).pipe(
      map(res => {
        if (res) {
          this.banks = res;
        }
        return this.banks;
      })
    );
  }
}
