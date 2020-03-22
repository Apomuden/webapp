import { map, first } from 'rxjs/operators';
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
const AGE_CATEGORY_API_URL = environment.apiBaseUrl + '/setups/agecategories';
const AGE_CLASSIFICATION_API_URL = environment.apiBaseUrl + '/setups/ageclassifications';
const BILLING_SYSTEM_API_URL =
  environment.apiBaseUrl + '/setups/billingsystems';
const HOSPITAL_SERVICE_API_URL =
  environment.apiBaseUrl + '/setups/hospitalservices';

const LANGUAGE_API_URL = environment.apiBaseUrl + '/setups/languages';
const MEDICAL_SPONSOR_API_URL = environment.apiBaseUrl + '/setups/billingsponsors';
const POLICY_API_URL = `${environment.apiBaseUrl}/setups/sponsorpolicies`;
const DISTRICT_API_URL = environment.apiBaseUrl + '/setups/districts';
const STAFF_TYPE_API_URL = environment.apiBaseUrl + '/setups/stafftypes';
const SPECIALITY_API_URL = environment.apiBaseUrl + '/setups/specialties';
const RELATIONSHIP_API_URL = environment.apiBaseUrl + '/setups/relationships';
const CLINICS_API_URL = environment.apiBaseUrl + '/setups/clinics';
const RELIGION_API_URL = environment.apiBaseUrl + '/setups/religions';
const SERVICE_PRICING_API_URL = environment.apiBaseUrl + '/pricing/services';
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
  private ageCategories;
  private ageClassifications;
  private titles;
  private regions;
  private districts;
  private regionsByCountry;
  private towns;
  private facilities;
  private companies;
  private accreditations;
  private medicalSponsors;
  private clinics;
  private servicePrices;

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


  createClinic(fields: object) {
    return this.http
      .post<any>(CLINICS_API_URL, fields)
      .pipe(
        map(res => {
          if (res) {
            console.log(res);
            return true;
          }
          return false;
        })
      );
  }
  createClinicType(name: String) {
    return this.http
      .post<any>(`${environment.apiBaseUrl}/setups/clinictypes`, { name })
      .pipe(
        map(res => {
          if (res) {
            return true;
          }
          return false;
        })
      );
  }
  getClinicTypes() {
    return this.http.get<any>(`${environment.apiBaseUrl}/setups/clinictypes`).pipe(
      map(
        res => {
          const clinicTypes = res;
          if (res) {
            for (let i = 0; i < clinicTypes.data.length; i++) {
              clinicTypes.data[i].isActivated =
                clinicTypes.data[i].status === 'ACTIVE';
            }
          }
          return clinicTypes;
        }
      )
    );
  }
  getClinics() {
    return this.http.get<any>(CLINICS_API_URL).pipe(
      map(
        res => {
          if (res) {
            this.clinics = res;
            for (let i = 0; i < this.clinics.data.length; i++) {
              this.clinics.data[i].isActivated =
                this.clinics.data[i].status === 'ACTIVE';
            }
          }
          return this.clinics;
        }
      )
    );
  }

  getAllSponsorPolicies() {
    let data: any = [];
    return this.http.get<any>(`${environment.apiBaseUrl}/setups/sponsorpolicies`).pipe(
      map(res => {
        if (res) {
          data = res;
          for (let i = 0; i < res.data.length; i++) {
            data.data[i].isActivated = data.data[i].status === 'ACTIVE';
          }
        }
        return data;
      })
    );
  }

  createSponsorPolicy(name: string, medicalSponser: string) {

    return this.http.post<any>(`${environment.apiBaseUrl}/setups/sponsorpolicies`, {
      name,
      billing_sponsor_id: medicalSponser
    }).pipe(
      map(
        res => {
          if (res) {
            return true;
          }
          return false;
        }
      )
    );
  }

  getDepartments() {
    return this.http.get<any>(DEPARTMENTS_API_URL).pipe(
      map(res => {
        if (res) {
          this.departments = res;
          for (let i = 0; i < this.departments.data.length; i++) {
            this.departments.data[i].isActivated =
              this.departments.data[i].status === 'ACTIVE';
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
              this.fundingTypes.data[i].status === 'ACTIVE';
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
              this.serviceCategories.data[i].status === 'ACTIVE';
          }
        }
        return this.serviceCategories;
      })
    );
  }

  getServiceCatByServiceId(hospital_service_id: number) {
    return this.http.get<any>(SERVICE_CATEGORY_API_URL, {
      params: {
        hospital_service_id: `${hospital_service_id}`,
      }
    }).pipe(
      map(res => {
        if (res) {
          this.serviceCategories = res;
          for (let i = 0; i < this.serviceCategories.data.length; i++) {
            this.serviceCategories.data[i].isActivated =
              this.serviceCategories.data[i].status === 'ACTIVE';
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
              this.serviceSubCategories.data[i].status === 'ACTIVE';
          }
        }
        return this.serviceSubCategories;
      })
    );
  }
  getServiceSubcategoriesByCategory(categoryId: number) {
    return this.http.get<any>(`${environment.apiBaseUrl}/setups/servicecategories/${categoryId}/servicesubcategories`).pipe(
      map(res => {
        if (res) {
          this.serviceSubCategories = res;
          for (let i = 0; i < this.serviceSubCategories.data.length; i++) {
            this.serviceSubCategories.data[i].isActivated =
              this.serviceSubCategories.data[i].status === 'ACTIVE';
          }
        }
        return this.serviceSubCategories;
      })
    );
  }
  getServiceCategoriesByHospitalService(hospitalServiceId: number) {

    return this.http.get<any>(`${environment.apiBaseUrl}/setups/hospitalservices/${hospitalServiceId}/servicecategories`).pipe(
      map(res => {
        if (res) {
          this.serviceCategories = res;
          for (let i = 0; i < this.serviceCategories.data.length; i++) {
            this.serviceCategories.data[i].isActivated =
              this.serviceCategories.data[i].status === 'ACTIVE';
          }
        }
        return this.serviceCategories;
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
              this.professions.data[i].status === 'ACTIVE';
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
              this.staffTypes.data[i].status === 'ACTIVE';
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
              this.paymentChannels.data[i].status === 'ACTIVE';
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
              this.billingCycles.data[i].status === 'ACTIVE';
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
              this.accreditations.data[i].status === 'ACTIVE';
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
              this.billingSystems.data[i].status === 'ACTIVE';
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
              this.companies.data[i].status === 'ACTIVE';
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
              this.hospitalServices.data[i].status === 'ACTIVE';
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
              this.languages.data[i].status === 'ACTIVE';
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
              this.towns.data[i].status === 'ACTIVE';
          }
        }
        return this.towns;
      })
    );
  }

  getTownsByReigion(regionId: string) {
    return this.http.get<any>(TOWN_API_URL, {
      params: {
        region_id: regionId,
      }
    }).pipe(
      map(res => {
        if (res) {
          this.towns = res;
          console.log(res);
          for (let i = 0; i < this.towns.data.length; i++) {
            this.towns.data[i].isActivated =
              this.towns.data[i].status === 'ACTIVE';
          }
        }
        return this.towns;
      })
    );
  }

  getServicePricings() {
    return this.http.get<any>(SERVICE_PRICING_API_URL).pipe(
      map(res => {
        if (res) {
          this.servicePrices = res;
          console.log(res);
          for (let i = 0; i < this.servicePrices.data.length; i++) {
            this.servicePrices.data[i].isActivated =
              this.servicePrices.data[i].status === 'ACTIVE';
          }
        }
        return this.servicePrices;
      })

    );
  }

  createServicePricing(fields: object) {
    return this.http.post<any>(SERVICE_PRICING_API_URL, fields).pipe(
      map(res => {
        if (res) {
          return true;
        }
        return false;
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
              this.relationships.data[i].status === 'ACTIVE';
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
              this.specialities.data[i].status === 'ACTIVE';
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
              this.religions.data[i].status === 'ACTIVE';
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
              this.staffCategories.data[i].status === 'ACTIVE';
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
              this.paymentStyle.data[i].status === 'ACTIVE';
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
              this.sponsorshipTypes.data[i].status === 'ACTIVE';
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

  getAgeCategories() {
    return this.http.get<any>(AGE_CATEGORY_API_URL).pipe(
      map(res => {
        if (res) {
          this.ageCategories = res;
          for (let i = 0; i < this.ageCategories.data.length; i++) {
            this.ageCategories.data[i].isActivated =
              this.ageCategories.data[i].status === 'ACTIVE' ? true : false;
          }
        }
        return this.ageCategories;
      })
    );
  }

  getAgeClassifications() {
    return this.http.get<any>(AGE_CLASSIFICATION_API_URL).pipe(
      map(res => {
        if (res) {
          this.ageClassifications = res;
          for (let i = 0; i < this.ageClassifications.data.length; i++) {
            this.ageClassifications.data[i].isActivated =
              this.ageClassifications.data[i].status === 'ACTIVE' ? true : false;
          }
        }
        return this.ageClassifications;
      })
    );
  }

  createAgeGroup(data: any) {
    return this.http
      .post<any>(AGE_GROUP_API_URL, data)
      .pipe(
        map(res => {
          if (res) {
            return true;
          }
          return false;
        })
      );
  }

  createAgeCategory(data: any) {
    return this.http
      .post<any>(AGE_CATEGORY_API_URL, data)
      .pipe(
        map(res => {
          if (res) {
            return true;
          }
          return false;
        })
      );
  }

  createAgeClassification(data: any) {
    return this.http
      .post<any>(AGE_CLASSIFICATION_API_URL, data)
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
  getDoctorsBySpecialty(id: string) {
    const url = `${environment.apiBaseUrl}/auth/profiles?staff_specialty_id=${id}&role_id=3`;

    return this.http.get<any>(url).pipe(
      map(res => {
        if (res) {
          for (let i = 0; i < res.data.length; i++) {
            res.data[i].isActivated =
              res.data[i].status === 'ACTIVE' ? true : false;
          }
        }
        console.log(res);
        return res ? res : null;
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

  getServicesByClinic(clinicId: number) {
    return this.http.get<any>(`${environment.apiBaseUrl}/setups/clinicservices`,
      {
        params: {
          clinic_id: `${clinicId}`,
        }
      })
      .pipe(map(data => {
        if (!data) {
          return { data: [] };
        }
        return data;
      }));
  }

  getClinicServices() {
    return this.http.get<any>(`${environment.apiBaseUrl}/setups/clinicservices`)
      .pipe(map(data => {
        if (!data) {
          return { data: [] };
        }
        return data;
      }));
  }


  createClinicService(fields: any) {
    return this.http.post<any>(`${environment.apiBaseUrl}/setups/clinicservices`, fields).pipe(
      map(res => {
        if (res) {
          return true;
        }
        return false;
      })
    );
  }

  getServicePrice(serviceId: number) {
    return this.http.get<any>(`${environment.apiBaseUrl}/pricing/services/${serviceId}`)
      .pipe(map(res => res.data));
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

  getSponsorsByType(sponsorTypeId: number) {
    return this.http.get<any>(MEDICAL_SPONSOR_API_URL, {
      params: {
        sponsorship_type_id: `${sponsorTypeId}`,
      }
    }).pipe(
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

  getSponsorPolicies(sponsorId: number) {
    return this.http.get<any>(POLICY_API_URL, {
      params: {
        billing_sponsor_id: `${sponsorId}`,
      }
    }).pipe(
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

  updateFacility(fields: any) {
    const url = `${environment.apiBaseUrl}/setups/hospital`;
    return this.http.put<any>(url, fields).pipe(map(
      res => {
        if (res) {
          return true;
        }
        return false;
      }
    ));
  }


  toggleActive(resourcePath: string, status: string) {
    const url = `${environment.apiBaseUrl}/${resourcePath}`;
    return this.http.put<any>(url, {
      status: status
    }).pipe(map(res => {
      res.data.isActivated = res.data.status === 'ACTIVE';
      return res.data;
    }));
  }

  getHistoryCategories(resourcePath: string) {
    const url = `${environment.apiBaseUrl}/${resourcePath}`;
    return this.http.get<any>(url).pipe(map(res => {
      return res ? res.data : [];
    },
      err => {
        return [];
      }
    ));
  }
  createHistoryCategory(resourcePath: string, fields: object) {
    const url = `${environment.apiBaseUrl}/${resourcePath}`;
    return this.http.post<any>(url, fields).pipe(map(res => {
      return res ? true : false;
    },
      err => {
        return false;
      }
    ));
  }
  genericGet(resourcePath: string) {
    const url = `${environment.apiBaseUrl}/${resourcePath}`;
    return this.http.get<any>(url).pipe(map(res => {
      if (res) {
        for (let i = 0; i < res.data.length; i++) {
          res.data[i].isActivated =
            res.data[i].status === 'ACTIVE' ? true : false;
        }
      }

      return res ? res.data : [];
    },
      err => {
        return [];
      }
    ));
  }
  genericPost(resourcePath: string, fields: object) {
    const url = `${environment.apiBaseUrl}/${resourcePath}`;
    return this.http.post<any>(url, fields).pipe(map(res => {
      return res ? true : false;
    },
      err => {
        return false;
      }
    ));
  }
  deleteSetup(resourcePath: string) {
    const url = `${environment.apiBaseUrl}/${resourcePath}`;
    return this.http.delete<any>(url).pipe(
      map(res => {
        return res ? true : false;
      }));
  }
  updateSetup(fields: any, resourcePath: string) {
    const url = `${environment.apiBaseUrl}/${resourcePath}`;
    return this.http.put<any>(url, fields).pipe(
      map(res => {
        return res ? true : false;
      }));
  }
}


