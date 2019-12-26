import { map } from "rxjs/operators";
import { environment } from "./../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

const COUNTRIES_API_URL = environment.apiBaseUrl + "/setups/countries";
const ROLES_API_URL = environment.apiBaseUrl + "/auth/roles";
const DEPARTMENTS_API_URL = environment.apiBaseUrl + "/setups/departments";
const PROFESSIONS_API_URL = environment.apiBaseUrl + "/setups/professions";
const BANK_BRANCH_API_URL = environment.apiBaseUrl + "/setups/bankbranches";
const SERVICE_SUB_CATEGORIES_API_URL =
  environment.apiBaseUrl + "/setups/servicesubcategories";
const PAYMENTS_CHANNEL_API_URL =
  environment.apiBaseUrl + "/setups/paymentchannels";
const BANKS_API_URL = environment.apiBaseUrl + "/setups/banks";
const EDUCATIONAL_LEVEL_API_URL =
  environment.apiBaseUrl + "/setups/educationallevels";
const ID_TYPE_API_URL = environment.apiBaseUrl + "/setups/idtypes";
const SPONSORSHIP_TYPE_API_URL =
  environment.apiBaseUrl + "/setups/sponsorshiptypes";
const PAYMENT_STYLE_API_URL = environment.apiBaseUrl + "/setups/paymentstyles";
const BILLING_CYCLE_API_URL = environment.apiBaseUrl + "/setups/billingcycles";
const AGE_GROUP_API_URL = environment.apiBaseUrl + "/setups/agegroups";
const BILLING_SYSTEM_API_URL =
  environment.apiBaseUrl + "/setups/billingsystems";
const HOSPITAL_SERVICE_API_URL =
  environment.apiBaseUrl + "/setups/hospitalservices";

const LANGUAGE_API_URL = environment.apiBaseUrl + "/setups/languages";
const STAFF_TYPE_API_URL = environment.apiBaseUrl + "/setups/stafftypes";
const SPECIALITY_API_URL = environment.apiBaseUrl + "/setups/specialties";
const RELATIONSHIP_API_URL = environment.apiBaseUrl + "/setups/relationships";
const RELIGION_API_URL = environment.apiBaseUrl + "/setups/religions";
const SERVICE_CATEGORY_API_URL =
  environment.apiBaseUrl + "/setups/servicecategories";
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
  private serviceCategories;
  private staffTypes;
  private professions;
  private serviceSubCategories;
  private bankBranches;
  private idTypes;
  private educationalLevels;
  private ageGroups;

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
   * Service Category routes
   */
  createServiceCategory(name: string, hospitalService: string) {
    return this.http
      .post<any>(SERVICE_CATEGORY_API_URL, {
        name,
        hospital_service_id: hospitalService
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
  getServiceCategories() {
    return this.http.get<any>(SERVICE_CATEGORY_API_URL).pipe(
      map(res => {
        if (res) {
          this.serviceCategories = res;
          for (let i = 0; i < this.serviceCategories.data.length; i++) {
            this.serviceCategories.data[i].isActivated =
              this.serviceCategories.data[i].status == "ACTIVE" ? true : false;
          }
        }
        return this.serviceCategories;
      })
    );
  }

  /**
   * Service Sub Category routes
   */
  createServiceSubcategory(name: string, serviceCategory: string) {
    return this.http
      .post<any>(SERVICE_SUB_CATEGORIES_API_URL, {
        name,
        service_category_id: serviceCategory
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
  getServiceSubcategories() {
    return this.http.get<any>(SERVICE_SUB_CATEGORIES_API_URL).pipe(
      map(res => {
        if (res) {
          this.serviceSubCategories = res;
          for (let i = 0; i < this.serviceSubCategories.data.length; i++) {
            this.serviceSubCategories.data[i].isActivated =
              this.serviceSubCategories.data[i].status == "ACTIVE"
                ? true
                : false;
          }
        }
        return this.serviceSubCategories;
      })
    );
  }

  /**
   * Service Category routes
   */
  createProfession(name: string, staffCategory: string) {
    return this.http
      .post<any>(PROFESSIONS_API_URL, {
        name,
        staff_category_id: staffCategory
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
  getProfessions() {
    return this.http.get<any>(PROFESSIONS_API_URL).pipe(
      map(res => {
        if (res) {
          this.professions = res;
          for (let i = 0; i < this.professions.data.length; i++) {
            this.professions.data[i].isActivated =
              this.professions.data[i].status == "ACTIVE" ? true : false;
          }
        }
        return this.professions;
      })
    );
  }

  /**
   * Staff Type routes
   */
  createStaffType(name: string, validityDays: string) {
    return this.http
      .post<any>(STAFF_TYPE_API_URL, {
        name,
        validity_days: validityDays
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
  getStaffTypes() {
    return this.http.get<any>(STAFF_TYPE_API_URL).pipe(
      map(res => {
        if (res) {
          this.staffTypes = res;
          for (let i = 0; i < this.staffTypes.data.length; i++) {
            this.staffTypes.data[i].isActivated =
              this.staffTypes.data[i].status == "ACTIVE" ? true : false;
          }
        }
        return this.staffTypes;
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

  /**
   * Bank routes
   */
  createBank(name: string, shortCode: string, email: string, phone: string) {
    return this.http
      .post<any>(BANKS_API_URL, { name, sort_code: shortCode, email, phone })
      .pipe(
        map(res => {
          if (res) {
            return true;
          }
          return false;
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

  /**
   * Bank Branch routes
   */
  createBankBranch(
    name: string,
    shortCode: string,
    bank: string,
    email: string,
    phone: string
  ) {
    return this.http
      .post<any>(BANK_BRANCH_API_URL, {
        name,
        sort_code: shortCode,
        bank_id: bank,
        email,
        phone
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

  getBankBranches() {
    return this.http.get<any>(BANK_BRANCH_API_URL).pipe(
      map(res => {
        if (res) {
          this.bankBranches = res;
        }
        return this.bankBranches;
      })
    );
  }

  createIdType(name: string) {
    return this.http
      .post<any>(ID_TYPE_API_URL, { name })
      .pipe(
        map(res => {
          if (res) {
            return true;
          }
          return false;
        })
      );
  }

  getIdTypes() {
    return this.http.get<any>(ID_TYPE_API_URL).pipe(
      map(res => {
        if (res) {
          this.idTypes = res;
          for (let i = 0; i < this.idTypes.data.length; i++) {
            this.idTypes.data[i].isActivated =
              this.idTypes.data[i].status == "ACTIVE" ? true : false;
          }
        }
        return this.idTypes;
      })
    );
  }

  getEducationalLevels() {
    return this.http.get<any>(EDUCATIONAL_LEVEL_API_URL).pipe(
      map(res => {
        if (res) {
          this.educationalLevels = res;
          for (let i = 0; i < this.educationalLevels.data.length; i++) {
            this.educationalLevels.data[i].isActivated =
              this.educationalLevels.data[i].status == "ACTIVE" ? true : false;
          }
        }
        return this.educationalLevels;
      })
    );
  }

  createEducationalLevel(name: string) {
    return this.http
      .post<any>(EDUCATIONAL_LEVEL_API_URL, { name })
      .pipe(
        map(res => {
          if (res) {
            return true;
          }
          return false;
        })
      );
  }

  getAgeGroups() {
    return this.http.get<any>(AGE_GROUP_API_URL).pipe(
      map(res => {
        if (res) {
          this.ageGroups = res;
          for (let i = 0; i < this.ageGroups.data.length; i++) {
            this.ageGroups.data[i].isActivated =
              this.ageGroups.data[i].status == "ACTIVE" ? true : false;
          }
        }
        return this.ageGroups;
      })
    );
  }

  createAgeGroup(name: string, minAge: string) {
    return this.http
      .post<any>(AGE_GROUP_API_URL, { name, min_age: minAge })
      .pipe(
        map(res => {
          if (res) {
            return true;
          }
          return false;
        })
      );
  }
}
