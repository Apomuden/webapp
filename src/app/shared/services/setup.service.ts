import { map } from 'rxjs/operators';
import { environment } from './../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

const COUNTRIES_API_URL = environment.apiBaseUrl + '/setups/countries';
const ROLES_API_URL = environment.apiBaseUrl + '/auth/roles';
const DEPARTMENTS_API_URL = environment.apiBaseUrl + '/setups/departments';
const PROFESSIONS_API_URL = environment.apiBaseUrl + '/setups/professions';
const TOWN_API_URL = environment.apiBaseUrl + '/setups/towns';
const BANK_BRANCH_API_URL = environment.apiBaseUrl + '/setups/bankbranches';
const TITLE_API_URL = environment.apiBaseUrl + '/setups/titles';
const ACCREDITATION_API_URL = environment.apiBaseUrl + '/setups/accreditations';
const COMPANY_API_URL = environment.apiBaseUrl + '/setups/companies';
const REGION_API_URL = environment.apiBaseUrl + '/setups/regions';
const FACILITY_API_URL = environment.apiBaseUrl + '/setups/hospital';
const REGIONS_BY_COUNTRY_ID_API_URL =
  environment.apiBaseUrl + '/setups/countries/';
const SERVICE_SUB_CATEGORIES_API_URL =
  environment.apiBaseUrl + '/setups/servicesubcategories';
const PAYMENTS_CHANNEL_API_URL =
  environment.apiBaseUrl + '/setups/paymentchannels';
const BANKS_API_URL = environment.apiBaseUrl + '/setups/banks';
const EDUCATIONAL_LEVEL_API_URL =
  environment.apiBaseUrl + '/setups/educationallevels';
const ID_TYPE_API_URL = environment.apiBaseUrl + '/setups/idtypes';
const SPONSORSHIP_TYPE_API_URL =
  environment.apiBaseUrl + '/setups/sponsorshiptypes';
const PAYMENT_STYLE_API_URL = environment.apiBaseUrl + '/setups/paymentstyles';
const BILLING_CYCLE_API_URL = environment.apiBaseUrl + '/setups/billingcycles';
const AGE_GROUP_API_URL = environment.apiBaseUrl + '/setups/agegroups';
const BILLING_SYSTEM_API_URL =
  environment.apiBaseUrl + '/setups/billingsystems';
const HOSPITAL_SERVICE_API_URL =
  environment.apiBaseUrl + '/setups/hospitalservices';

const LANGUAGE_API_URL = environment.apiBaseUrl + '/setups/languages';
const MEDICAL_SPONSOR_API_URL = environment.apiBaseUrl + '/setups/billingsponsors';
const DISTRICT_API_URL = environment.apiBaseUrl + '/setups/districts';
const STAFF_TYPE_API_URL = environment.apiBaseUrl + '/setups/stafftypes';
const SPECIALITY_API_URL = environment.apiBaseUrl + '/setups/specialties';
const RELATIONSHIP_API_URL = environment.apiBaseUrl + '/setups/relationships';
const RELIGION_API_URL = environment.apiBaseUrl + '/setups/religions';
const SERVICE_CATEGORY_API_URL =
  environment.apiBaseUrl + '/setups/servicecategories';
const FUNDING_TYPE_API_URL = environment.apiBaseUrl + '/setups/fundingtypes';
const STAFF_CATEGORY_API_URL =
  environment.apiBaseUrl + '/setups/staffcategories';
@Injectable({
  providedIn: 'root'
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
  private titles;
  private regions;
  private districts;
  private regionsByCountry;
  private towns;
  private facilities;
  private companies;
  private accreditations;
  private medicalSponsors;

  constructor(private http: HttpClient) { }

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
  getRegionsByCountryApi(countryId: String) {
    return REGIONS_BY_COUNTRY_ID_API_URL + countryId + '/regions';
  }
  getRegionsByCountryId(countryId: string) {
    return this.http.get<any>(this.getRegionsByCountryApi(countryId)).pipe(
      map(res => {
        if (res) {
          this.regionsByCountry = res;
        }
        return this.regionsByCountry;
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
  createMedicalSponsor(fields: object) {
    return this.http
      .post<any>(MEDICAL_SPONSOR_API_URL, fields)
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
              this.departments.data[i].status === 'ACTIVE' ? true : false;
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
              this.fundingTypes.data[i].status === 'ACTIVE' ? true : false;
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
              this.serviceCategories.data[i].status === 'ACTIVE' ? true : false;
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
              this.serviceSubCategories.data[i].status === 'ACTIVE'
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
              this.professions.data[i].status === 'ACTIVE' ? true : false;
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
              this.staffTypes.data[i].status === 'ACTIVE' ? true : false;
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
              this.paymentChannels.data[i].status === 'ACTIVE' ? true : false;
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
              this.billingCycles.data[i].status === 'ACTIVE' ? true : false;
          }
        }
        return this.billingCycles;
      })
    );
  }

  /**
   * Accreditations routes
   */
  createAccreditation(
    reg_body: string,
    reg_no: string,
    reg_date: string,
    tin: string,
    expiry_date: string
  ) {
    return this.http
      .post<any>(ACCREDITATION_API_URL, {
        reg_body,
        reg_no,
        reg_date,
        tin,
        expiry_date
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

  getAccreditations() {
    return this.http.get<any>(ACCREDITATION_API_URL).pipe(
      map(res => {
        if (res) {
          this.accreditations = res;
          console.log(res);
          for (let i = 0; i < this.accreditations.data.length; i++) {
            this.accreditations.data[i].isActivated =
              this.accreditations.data[i].status === 'ACTIVE' ? true : false;
          }
        }
        return this.accreditations;
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
              this.billingSystems.data[i].status === 'ACTIVE' ? true : false;
          }
        }
        return this.billingSystems;
      })
    );
  }

  /**
   * Company routes
   */
  createCompany(name: string, phone: string, email: string, gps_location) {
    return this.http
      .post<any>(COMPANY_API_URL, { name, phone, email, gps_location })
      .pipe(
        map(res => {
          if (res) {
            return true;
          }
          return false;
        })
      );
  }

  getCompanies() {
    return this.http.get<any>(COMPANY_API_URL).pipe(
      map(res => {
        if (res) {
          this.companies = res;
          console.log(res);
          for (let i = 0; i < this.companies.data.length; i++) {
            this.companies.data[i].isActivated =
              this.companies.data[i].status === 'ACTIVE' ? true : false;
          }
        }
        return this.companies;
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
              this.hospitalServices.data[i].status === 'ACTIVE' ? true : false;
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
              this.languages.data[i].status === 'ACTIVE' ? true : false;
          }
        }
        return this.languages;
      })
    );
  }

  /**
   * Languages routes
   */
  createTown(name: string, district: string) {
    return this.http
      .post<any>(TOWN_API_URL, { name, district_id: district })
      .pipe(
        map(res => {
          if (res) {
            return true;
          }
          return false;
        })
      );
  }

  getTowns() {
    return this.http.get<any>(TOWN_API_URL).pipe(
      map(res => {
        if (res) {
          this.towns = res;
          console.log(res);
          for (let i = 0; i < this.towns.data.length; i++) {
            this.towns.data[i].isActivated =
              this.towns.data[i].status === 'ACTIVE' ? true : false;
          }
        }
        return this.towns;
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
              this.relationships.data[i].status === 'ACTIVE' ? true : false;
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
              this.specialities.data[i].status === 'ACTIVE' ? true : false;
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
              this.religions.data[i].status === 'ACTIVE' ? true : false;
          }
        }
        return this.religions;
      })
    );
  }

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
              this.staffCategories.data[i].status === 'ACTIVE' ? true : false;
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
              this.paymentStyle.data[i].status === 'ACTIVE' ? true : false;
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
              this.sponsorshipTypes.data[i].status === 'ACTIVE' ? true : false;
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
              this.idTypes.data[i].status === 'ACTIVE' ? true : false;
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
              this.educationalLevels.data[i].status === 'ACTIVE' ? true : false;
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
              this.ageGroups.data[i].status === 'ACTIVE' ? true : false;
          }
        }
        return this.ageGroups;
      })
    );
  }

  createAgeGroup(name: string, minAge: number, maxAge: number) {
    return this.http
      .post<any>(AGE_GROUP_API_URL, {
        name,
        min_age: minAge,
        max_age: maxAge
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

  getTitles() {
    return this.http.get<any>(TITLE_API_URL).pipe(
      map(res => {
        if (res) {
          this.titles = res;
          for (let i = 0; i < this.titles.data.length; i++) {
            this.titles.data[i].isActivated =
              this.titles.data[i].status === 'ACTIVE' ? true : false;
          }
        }
        return this.titles;
      })
    );
  }

  createTitle(name: string, gender: string) {
    return this.http
      .post<any>(TITLE_API_URL, {
        name,
        gender
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

  getRegions() {
    return this.http.get<any>(REGION_API_URL).pipe(
      map(res => {
        if (res) {
          this.regions = res;
          for (let i = 0; i < this.regions.data.length; i++) {
            this.regions.data[i].isActivated =
              this.regions.data[i].status === 'ACTIVE' ? true : false;
          }
        }
        return this.regions;
      })
    );
  }

  createDistrict(name: string, region: string) {
    return this.http
      .post<any>(DISTRICT_API_URL, {
        name,
        region_id: region
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

  getDistricts() {
    return this.http.get<any>(DISTRICT_API_URL).pipe(
      map(res => {
        if (res) {
          this.districts = res;
          for (let i = 0; i < this.districts.data.length; i++) {
            this.districts.data[i].isActivated =
              this.districts.data[i].status === 'ACTIVE' ? true : false;
          }
        }
        return this.districts;
      })
    );
  }

  createFacility(
    name: string,
    staffIDPrefix: string,
    staffIdSeperator: string,
    folderIdPrefix: string,
    folderIdSeperator: string,
    digitsAfterStaffPrefix: number,
    digitsAfterFolderPrefix: number,
    yearDigits: number,
    allowedFolderType: string,
    allowedInstallmentType: string,
    activeCell: string,
    alternateCell: string,
    email1: string,
    email2: string,
    postalAddress: string,
    physicalAddress: string,
    country: string,
    region: string,
    googleAddress: string
  ) {
    return this.http
      .post<any>(FACILITY_API_URL, {
        name,
        staff_id_prefix: staffIDPrefix,
        staff_id_seperator: staffIdSeperator,
        folder_id_prefix: folderIdPrefix,
        folder_id_seperator: folderIdSeperator,
        digits_after_staff_prefix: digitsAfterStaffPrefix,
        digits_after_folder_prefix: digitsAfterFolderPrefix,
        year_digits: yearDigits,
        allowed_folder_type: allowedFolderType.toString(),
        allowed_installment_type: allowedInstallmentType.toString(),
        active_cell: activeCell,
        alternate_cell: alternateCell,
        email1: email1,
        email2: email2,
        postal_address: postalAddress,
        physical_address: physicalAddress,
        country_id: country,
        region_id: region,
        gps_location: googleAddress
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

  getFacilities() {
    return this.http.get<any>(FACILITY_API_URL).pipe(
      map(res => {
        if (res) {
          this.facilities = res;
          for (let i = 0; i < this.facilities.data.length; i++) {
            this.facilities.data[i].isActivated =
              this.facilities.data[i].status === 'ACTIVE' ? true : false;
          }
        }
        return this.facilities;
      })
    );
  }
  getMedicalSponsors() {
    return this.http.get<any>(MEDICAL_SPONSOR_API_URL).pipe(
      map(res => {
        if (res) {
          this.medicalSponsors = res;
          for (let i = 0; i < this.medicalSponsors.data.length; i++) {
            this.medicalSponsors.data[i].isActivated =
              this.medicalSponsors.data[i].status === 'ACTIVE' ? true : false;
          }
        }
        return this.medicalSponsors;
      })
    );
  }
}
