import { FolderDetails } from './../models/folders';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { RecordService } from './../record.service';
import { NzNotificationService } from 'ng-zorro-antd';
import { first, map, retry, debounceTime } from 'rxjs/operators';
import { SetupService } from './../../shared/services/setup.service';
import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';


@Component({
  selector: 'app-register-patient',
  templateUrl: './register-patient.component.html',
  styleUrls: ['./register-patient.component.scss']
})
export class RegisterPatientComponent implements OnInit, AfterViewInit, OnDestroy {



  fundingTypes = [];
  titles = [];
  religions = [];
  educationalLevels = [];
  companies = [];
  occupations = [];
  policies = [];
  sponsors = [];
  idtypes = [];
  hometowns = [];
  relationships = [];
  countryCodes = [];
  countries = [];
  languages = [];
  regions = [];
  isVisible = false;
  districts = [];
  patient: any;
  isLoadingFundingTypes = true;
  isLoadingTitles = true;
  isLoadingReligions = true;
  isLoadingEducationalLevels = true;
  isCreatingCompany = false;
  isLoadingCountryCodes = true;
  isLoadingCompanies = new BehaviorSubject(false);
  isLoadingIdTypes = new BehaviorSubject(false);
  isLoadingRelationships = new BehaviorSubject(false);
  isLoadingLanguages = new BehaviorSubject(true);
  isLoadingRegions = new BehaviorSubject(false);
  isLoadingDistricts = new BehaviorSubject(false);
  isLoadingHomeTowns = new BehaviorSubject(false);
  isLoadingPolicies = new BehaviorSubject(false);
  isLoadingMedicalSponsors = new BehaviorSubject(false);
  isLoadingOccupations = new BehaviorSubject(false);
  isCreatingSponsor = false;
  googleAddress: string = null;
  stepIndex = 0;
  readonly finalStepIndex = 3;

  patientForm: FormGroup;
  companyForm: FormGroup;
  @ViewChild('placesRef', { static: false }) placesRef: GooglePlaceDirective;
  public handleAddressChange(address: Address) {
    this.googleAddress = address.url;
    console.log(this.companyForm);
  }
  formatterAge = (value: number) => `${value} yrs`;
  parserAge = (value: string) => value.replace('years', '');

  constructor(private readonly fb: FormBuilder,
    private setups: SetupService,
    private recordService: RecordService,
    private setupService: SetupService,
    private notification: NzNotificationService) {

  }

  pre(): void {
    this.changeContent('previous');
  }

  next(): void {
    this.changeContent('next');
  }

  done(): void {
    // if (this.validateNextOfKinInfo()) {
    this.submitForm();
    // }
  }
  handleCancel() {
    this.isVisible = false;
  }
  showModal() {
    this.isVisible = true;
    this.googleAddress = null;
    this.companyForm.reset();
  }

  private getSponsors(sponsor_type_id: number) {
    this.isLoadingMedicalSponsors.next(true);
    this.setupService.getSponsorsByType(sponsor_type_id).pipe(first())
      .subscribe(data => {
        this.isLoadingMedicalSponsors.next(false);
        if (data) {
          this.sponsors = data.data;
        }
      }, e => {
        this.isLoadingMedicalSponsors.next(false);
      });
  }




  changeContent(mode: 'next' | 'previous'): void {
    const action = (valid: boolean) => mode === 'next' ? (valid) ? this.stepIndex++ : null : this.stepIndex--;
    switch (this.stepIndex) {
      case 0: {
        console.log('checking billing type control ' + this.billingTypeControl.valid);
        console.log(this.sponsoredForm);

        action(this.validateBillingInfo());
        break;
      }
      case 1: {
        action(this.validatePatientInfo());
        break;
      }
      case 2: {
        action(this.validateContactInfo());
        break;
      }
      case 3: {
        action(this.validateNextOfKinInfo());
        break;
      }
      default: {
        break;
      }
    }
  }

  ngAfterViewInit() {

    this.billingTypeControl.valueChanges.pipe(debounceTime(500), untilComponentDestroyed(this))
      .subscribe(id => {
        if (this.billingTypeControl.valid) {
          // this must be reset so that the previous selections will be cleared to avoid conflict with the backend validation
          this.sponsorNameControl.reset();
          this.getSponsors(this.getSelectedFundingType(id).sponsorship_type_id);
        }
      });

    this.sponsorNameControl.valueChanges.pipe(debounceTime(1000), untilComponentDestroyed(this))
      .subscribe(id => {
        if (this.billingTypeControl.valid) {
          this.policyControl.reset();
          this.policies = [];
          if (this.isPrivateInsurance) {
            this.getPolicies(id);
          }
        }
      });
  }

  ngOnDestroy(): void {

  }

  ngOnInit() {
    this.getFundingTypes();
    this.getTitles();
    this.getReligions();
    this.getEducationalLevels();
    this.getCountryCodes();
    this.getOccupations();
    this.getCompanies();
    this.getDistricts();
    this.getRelationships();
    this.getMedicalSponsors();
    this.getLanguages();
    this.getTowns();
    this.getIdTypes();
    this.companyForm = this.fb.group({
      name: [null, [Validators.required]],
      email: [null, [Validators.required]],
      phone: [null, [Validators.required]],
      googleAddress: [null],
    });
    this.patientForm = this.fb.group({
      // 1.0 Billing Information
      billingInfo: this.fb.group({
        billingType: [null, [Validators.required]],
        folder_type: [null, [Validators.required]],
        sponsored: this.fb.group({
          sponsorName: [null, [Validators.required]],
          company: [null], // some of the fields are conditionally required so must not set them as required here
          memberId: [null],
          cardSerialNumber: [null],
          staffId: [null],
          staffName: [null],
          beneficiary: [null, [Validators.required]],
          relation: [null], // the relation validator is not needed
          // relation: [null],
          policy: [null],
          issuedDate: [null, [Validators.required]],
          expiryDate: [null, [Validators.required]],
        }),
      }),
      // 2.0 Patient Information
      patientInfo: this.fb.group({
        firstName: [null, [Validators.required]],
        lastName: [null, [Validators.required]],
        middleName: [null, [Validators.required]],
        title: [null, [Validators.required]],
        dob: [null, [Validators.required]],
        snnit: [null],
        tin: [null],

        // todo add custom validator for when useAge is selected
        age: [0],
        useAge: [false],
        gender: [null, [Validators.required]],
        maritalStatus: [null, [Validators.required]],
        nativeLanguage: [null, [Validators.required]],
        secondLanguage: [null, [Validators.required]],
        officialLanguage: [null, [Validators.required]],
        nationality: [null, [Validators.required]],
        region: [null, [Validators.required]],
        district: [null, [Validators.required]],
        hometown: [null, [Validators.required]],
        religion: [null, [Validators.required]],
        educationalLevel: [null, [Validators.required]],
        idtype: [null, [Validators.required]],
        idNumber: [null, [Validators.required]],
        IdExpiryDate: [null, [Validators.required]],
        occupation: [null, [Validators.required]],
        oldFolderNumber: [null],
      }),
      // 3.0 Contact Information
      contactInfo: this.fb.group({
        homeAddress: [null, [Validators.required]],
        workAddress: [null, [Validators.required]],
        countryCode: ['+233', [Validators.required]],
        cellPhoneNumber: [null, [Validators.required]],
        emailAddress: [null, [Validators.email]],
        emergencyName: [null, [Validators.required]],
        emergencyRelationship: [null, [Validators.required]],
        emergencyCountryCode: ['+233', [Validators.required]],
        emergencyPhoneNumber: [null, [Validators.required]]
      }),
      // 4.0 Next of Kin
      nextOfKin: this.fb.group({
        name: [null, [Validators.required]],
        homeAddress: [null, [Validators.required]],
        countryCode: ['+233', [Validators.required]],
        cellPhoneNumber: [null, [Validators.required]],
        emailAddress: [null, [Validators.email]],
        relationship: [null, [Validators.required]],
      }),
    });



    this.patientInfoForm.get('nationality').valueChanges.subscribe(val => {
      if (val != null) {
        this.getRegionsByCountryId(val.toString());
      }

    },
      err => console.log(err)
    );
    this.patientForm.get('billingInfo').get('billingType').valueChanges.subscribe(val => {
      console.log(this.billingTypeControl);
    });

    this.medicalSponsorControl.valueChanges.subscribe(val => {
      this.getPolicies(val);
    });
  }

  get billingTypeControl(): FormControl {
    return this.patientForm.get('billingInfo').get('billingType') as FormControl;
  }

  get folderTypeControl(): FormControl {
    return this.patientForm.get('billingInfo').get('folder_type') as FormControl;
  }
  get getCompanyLocationControl() {
    return this.companyControl.get('googleAddress') as FormControl;
  }
  get medicalSponsorControl(): FormControl {
    return this.patientForm.get('billingInfo').get('sponsored').get('sponsorName') as FormControl;
  }


  get isBillingSponsored(): boolean {

    return this.billingTypeControl.value !== null && this.getSelectedFundingType(this.billingTypeControl.value) !== null;
  }

  get sponsoredForm(): FormGroup {
    return this.patientForm.get('billingInfo').get('sponsored') as FormGroup;
  }





  createPatient(data: object) {
    this.recordService.createPatient(data).pipe(first()).subscribe(
      res => {
        if (!res) {

        } else {
          this.createNextOfKin(res.id as number, this.processNextOfKinData(res.id));
        }
      },
      err => {

      }
    );
  }

  createNextOfKin(patientId: number, data: object) {
    this.recordService.createNextOfKin(data).subscribe(
      res => {
        if (!res) {

        } else {
          this.addSponsor(this.processSponsorData(patientId));

        }
      },
      err => {

      }
    );
  }


  private processPatientData() {
    const patientData = this.patientInfoForm.value;

    return {
      'title_id': patientData.title,
      'funding_type_id': this.billingTypeControl.value,
      'folder_type': this.folderTypeControl.value,
      'ssnit_no': patientData.snnit,
      'tin': patientData.tin,
      'surname': patientData.lastName,
      'middlename': patientData.middleName,
      'firstname': patientData.firstName,
      'dob': this.formatDate(patientData.dob),
      'gender': patientData.gender,
      'origin_country_id': patientData.nationality,
      'origin_region_id': patientData.region,
      'origin_district_id': patientData.district,
      'hometown_id': patientData.hometown,
      'marital': patientData.maritalStatus,
      'profession_id': patientData.occupation,
      'staff_id': this.sponsoredForm.value.staffId,
      'work_address': this.contactInfoForm.value.workAddress,
      'residence_address': this.contactInfoForm.value.homeAddress,
      'native_lang_id': patientData.nativeLanguage,
      'second_lang_id': patientData.secondLanguage,
      'official_lang_id': patientData.officialLanguage,
      'id_type_id': patientData.idtype,
      'id_no': patientData.idNumber,
      'id_expiry_date': this.formatDate(patientData.IdExpiryDate),
      'religion_id': patientData.religion,
      'educational_level_id': patientData.educationalLevel,
      'active_cell': `${this.contactInfoForm.value.countryCode}${this.contactInfoForm.value.cellPhoneNumber}`,
      'email': this.contactInfoForm.value.emailAddress,
      'emerg_name': this.contactInfoForm.value.emergencyName,
      'emerg_phone': `${this.contactInfoForm.value.emergencyCountryCode}${this.contactInfoForm.value.emergencyPhoneNumber}`,
      'emerg_relation_id': this.contactInfoForm.value.emergencyRelationship,
      'mortality': 'ALIVE',
      'reg_status': 'OUT-PATIENT',
      'status': 'ACTIVE'
    };
  }
  processNextOfKinData(patientId: number) {
    const nextOfKinData = this.nextOfKinInfoForm.value;
    return {
      'name': nextOfKinData.name,
      'phone': `${nextOfKinData.countryCode}${nextOfKinData.cellPhoneNumber}`,
      'email': nextOfKinData.emailAddress,
      'patient_id': patientId,
      'relation_id': nextOfKinData.relationship,
      'alternate_phone': `${nextOfKinData.countryCode}${nextOfKinData.cellPhoneNumber}`
    };
  }

  private processSponsorData(patientId: number) {

    return {
      patient_id: patientId,
      billing_sponsor_id: this.sponsorNameControl.value as number,
      // sponsorship_policy_id: 6,
      priority: 1,
      member_id: this.memberIDControl.value,
      card_serial_no: this.cardSerialControl.value,
      company_id: this.companyControl.value as number,
      staff_name: this.staffNameControl.value,
      staff_id: this.staffIDControl.value,
      benefit_type: this.beneficiaryControl.value,
      relation_id: this.relationControl.value,
      issued_date: this.formatDate(this.issueDateControl.value as Date),
      expiry_date: this.formatDate(this.expiryDateControl.value as Date),
    };
  }

  private formatDate(date: Date): string {
    if (!date) {
      return null;
    }

    let month = '' + (date.getMonth() + 1);
    let day = '' + date.getDate();
    const year = date.getFullYear();

    if (month.length < 2) {
      month = '0' + month;
    }
    if (day.length < 2) {
      day = '0' + day;
    }
    return [year, month, day].join('-');
  }

  get relationControl(): FormControl {
    return this.sponsoredForm.get('relation') as FormControl;
  }

  createCompany() {
    this.isCreatingCompany = true;
    this.setupService
      .createCompany(`${this.companyForm.get('name').value}`, `${this.companyForm.get('phone').value}`,
        `${this.companyForm.get('email').value}`, `${this.googleAddress}`)
      .pipe(first())
      .subscribe(
        success => {
          this.isCreatingCompany = false;
          if (success) {
            this.notification.success(
              'Success',
              `Successfully created ${this.companyForm.get('name').value}`
            );
            this.getCompanies();
            this.companyForm.reset();
            this.isVisible = false;
          } else {
            this.notification.error(
              'Error',
              `Could not create ${this.companyForm.get('name').value}`
            );
          }
        },
        error => {
          this.isCreatingCompany = false;
          console.log(error);
          this.notification.error(
            'Error',
            `Could not create ${this.companyForm.get('name').value}`
          );
        }
      );
  }

  get sponsorNameControl(): FormControl {
    return this.sponsoredForm.get('sponsorName') as FormControl;
  }

  get beneficiaryControl(): FormControl {
    return this.sponsoredForm.get('beneficiary') as FormControl;
  }

  get policyControl(): FormControl {
    return this.sponsoredForm.get('policy') as FormControl;
  }

  get companyControl(): FormControl {
    return this.sponsoredForm.get('company') as FormControl;
  }

  get staffNameControl(): FormControl {
    return this.sponsoredForm.get('staffName') as FormControl;
  }

  get cardSerialControl(): FormControl {
    return this.sponsoredForm.get('cardSerialNumber') as FormControl;
  }

  get issueDateControl(): FormControl {
    return this.sponsoredForm.get('issuedDate') as FormControl;
  }

  get expiryDateControl(): FormControl {
    return this.sponsoredForm.get('expiryDate') as FormControl;
  }

  get staffIDControl(): FormControl {
    return this.sponsoredForm.get('staffId') as FormControl;
  }

  get memberIDControl(): FormControl {
    return this.sponsoredForm.get('memberId') as FormControl;
  }



  /*
  * Tracks validity status of form before moving to the
  * next step in patient registration*/
  validateBillingInfo(): boolean {
    console.log('sponsornamecontrol:  ' + this.sponsorNameControl.value);
    if (!this.isBillingSponsored && this.billingTypeControl.value) {
      console.log('sponsornamecontrolsponsored:  ' + this.sponsorNameControl.value);

      this.sponsoredForm.reset();
      console.log('sponsornamecontrolsponsored:  ' + this.sponsorNameControl.value);
      return true;
    }

    if (!this.isBeneficiaryDependant) {
      this.relationControl.reset();
    }

    for (const i of Object.keys(this.sponsoredForm.controls)) {
      this.sponsoredForm.controls[i].markAsDirty();
      this.sponsoredForm.controls[i].updateValueAndValidity();
    }

    this.billingTypeControl.markAsDirty();
    this.billingTypeControl.updateValueAndValidity();

    return this.sponsoredForm.valid && this.billingTypeControl.valid;
  }

  // noinspection JSMethodCanBeStatic
  // TODO fix validator error
  relationValidator = (control: FormControl): { [key: string]: any } | null => {

    if (!this.patientForm) {
      return null;
    }

    if (!this.isBeneficiaryDependant) {
      return null;
    }

    if (!control.value) {
      return { required: true };
    }

    return null;
  };

  get patientInfoForm(): FormGroup {
    return this.patientForm.get('patientInfo') as FormGroup;
  }

  get dobControl(): FormControl {
    return this.patientInfoForm.get('dob') as FormControl;
  }

  get ageControl(): FormControl {
    return this.patientInfoForm.get('age') as FormControl;
  }

  get useAge(): boolean {
    return this.patientInfoForm.get('useAge').value as boolean;
  }

  ageChanged() {
    const age = (this.ageControl.value as number) * 31556952000;
    const today = Date.now();

    const ageDate = new Date(today - age);
    this.dobControl.setValue(ageDate);
  };

  validatePatientInfo(): boolean {
    for (const i of Object.keys(this.patientInfoForm.controls)) {
      this.patientInfoForm.controls[i].markAsDirty();
      this.patientInfoForm.controls[i].updateValueAndValidity();
    }

    console.log('patientForm: ');
    console.log(this.patientForm);
    return this.patientInfoForm.valid;
  }

  get contactInfoForm(): FormGroup {
    return this.patientForm.get('contactInfo') as FormGroup;
  }


  validateContactInfo(): boolean {
    for (const i of Object.keys(this.contactInfoForm.controls)) {
      this.contactInfoForm.controls[i].markAsDirty();
      this.contactInfoForm.controls[i].updateValueAndValidity();
    }
    console.log('patientForm: ');
    console.log(this.patientForm);
    return this.contactInfoForm.valid;
  }

  get nextOfKinInfoForm(): FormGroup {
    return this.patientForm.get('nextOfKin') as FormGroup;
  }

  validateNextOfKinInfo(): boolean {
    for (const i of Object.keys(this.nextOfKinInfoForm.controls)) {
      this.nextOfKinInfoForm.controls[i].markAsDirty();
      this.nextOfKinInfoForm.controls[i].updateValueAndValidity();
    }

    console.log('patientForm: ');
    console.log(this.patientForm);
    return this.nextOfKinInfoForm.valid;
  }

  private getFundingTypes() {
    this.setups.getFundingTypes()
      .pipe(first())
      .subscribe(data => {
        this.isLoadingFundingTypes = false;
        this.fundingTypes = data.data;
      }, error => {
        this.isLoadingFundingTypes = false;
        console.log(error);
      });
  }

  getTitles() {
    this.isLoadingTitles = true;
    this.setups.getTitles().pipe(first()).subscribe(
      res => {
        if (res) {
          this.isLoadingTitles = false;
          this.titles = res.data;
        }
      },
      err => {
        console.log(err);
        this.isLoadingTitles = false;
      }
    );
  }

  getReligions() {
    this.isLoadingReligions = true;
    this.setups.getReligions().pipe(first()).subscribe(
      res => {
        this.isLoadingReligions = false;
        if (res) {
          this.religions = res.data;
        }

      },
      err => {
        this.isLoadingReligions = false;
        console.log(err);
      }
    );
  }

  getEducationalLevels() {
    this.isLoadingEducationalLevels = true;
    this.setups.getEducationalLevels().pipe(first()).subscribe(
      res => {
        if (res) {
          this.isLoadingEducationalLevels = false;
          this.educationalLevels = res.data;
        }
      },
      err => {
        this.isLoadingEducationalLevels = false;
        console.log(err);
      }
    );
  }
  getPolicies(medicalSponsorId: string) {
    this.isLoadingPolicies.next(true);
    this.setups.getSponsorPolicies(parseInt(medicalSponsorId, 10)).pipe(first()).subscribe(
      res => {
        this.isLoadingPolicies.next(false);
        if (res) {
          this.policies = res.data;
        }
      }, err => {
        this.isLoadingPolicies.next(false);
        console.log(err);
        retry(2);
      }
    );
  }

  getCountryCodes() {
    this.isLoadingCountryCodes = true;
    this.setups.getCountries().pipe(first()).subscribe(
      res => {
        this.isLoadingCountryCodes = false;
        this.countryCodes = res.data.map(item => item.call_code);
        this.countries = res.data;
      },
      err => {
        this.isLoadingCountryCodes = false;
        console.log(err);
      }
    );
  }

  getCompanies() {
    this.isLoadingCompanies.next(true);
    this.setups.getCompanies().pipe(first()).subscribe(
      res => {
        this.isLoadingCompanies.next(false);
        this.companies = res.data;
      }, err => {
        this.isLoadingCompanies.next(false);
      }
    );
  }

  getRelationships() {
    this.isLoadingRelationships.next(true);
    this.setups.getRelationships().pipe(first()).subscribe(
      res => {
        this.isLoadingRelationships.next(false);
        this.relationships = res.data;
      },
      err => {
        this.isLoadingRelationships.next(false);
      }
    );
  }


  getRegionsByCountryId(countryId: string) {
    this.isLoadingRegions.next(true);
    this.setups.getRegionsByCountryId(countryId).pipe(first()).subscribe(
      res => {
        if (res) {
          this.regions = res.data;
          this.isLoadingRegions.next(false);
        }
      },
      err => {
        this.isLoadingRegions.next(false);
      }
    );
  }

  getMedicalSponsors() {
    this.isLoadingMedicalSponsors.next(true);
    this.setups.getMedicalSponsors().pipe(first()).subscribe(
      res => {
        this.isLoadingMedicalSponsors.next(false);
        if (res) {
          this.sponsors = res.data;
        } else {
          retry(3);
        }
      },
      err => {
        this.isLoadingMedicalSponsors.next(false);
        console.log(err);
        retry(3);
      }
    );
  }
  getLanguages() {
    this.isLoadingLanguages.next(true);
    this.setups.getLanguages().pipe(first()).subscribe(
      res => {
        this.isLoadingLanguages.next(false);
        if (res) {
          this.languages = res.data;
        } else {
          retry(3);
        }
      },
      err => {
        this.isLoadingLanguages.next(false);
        console.log(err);
        retry(3);
      }
    );
  }

  getOccupations() {
    this.isLoadingOccupations.next(true);
    this.setups.getProfessions().pipe(first()).subscribe(
      res => {
        this.isLoadingOccupations.next(false);
        if (res) {
          this.occupations = res.data;
        } else {
          retry(3);
        }
      },
      err => {
        this.isLoadingOccupations.next(false);
        console.log(err);
        retry(3);
      }
    );
  }
  getDistricts() {
    this.isLoadingDistricts.next(true);
    this.setups.getDistricts().pipe(first()).subscribe(
      res => {
        this.isLoadingDistricts.next(false);
        this.districts = res.data;

      },
      err => {
        this.isLoadingDistricts.next(false);
        console.log(err);
      }
    );
  }
  getTowns() {
    this.isLoadingHomeTowns.next(true);
    this.setups.getTowns().pipe(first()).subscribe(
      res => {
        this.isLoadingHomeTowns.next(false);
        this.hometowns = res.data;

      },
      err => {
        this.isLoadingHomeTowns.next(false);
        console.log(err);
      }
    );
  }

  getIdTypes() {
    this.isLoadingIdTypes.next(true);
    this.setups.getIdTypes().pipe(first()).subscribe(
      res => {
        this.isLoadingIdTypes.next(false);
        this.idtypes = res.data;

      },
      err => {
        this.isLoadingIdTypes.next(false);
        console.log(err);
      }
    );
  }


  get isBeneficiaryDependant(): boolean {
    if (this.beneficiaryControl.value === 'DEPENDANT') {
      if (this.isPrivateCompany || this.isGovernmentCompany) {
        this.staffNameControl.setValidators([Validators.required]);
      } else {
        this.staffNameControl.clearValidators();
        this.staffNameControl.reset();
      }
      this.relationControl.setValidators(Validators.required);
      return true;
    } else {
      this.relationControl.clearValidators();
      this.relationControl.reset();
      return false;
    }
  }

  private getSelectedFundingType(value: number) {

    const fundType = this.fundingTypes.find(ft => ft.id === value);
    if (!fundType) {
      return null;
    }
    return fundType;
  }
  get isGovernmentCompany(): boolean {
    const fundType = this.getSelectedFundingType(this.billingTypeControl.value);
    if (!fundType) {
      return false;
    }
    const isGovernmentCom = fundType.sponsorship_type_name.toLocaleLowerCase() === 'government company';
    if (isGovernmentCom) {
      this.staffIDControl.setValidators(Validators.required);
      this.memberIDControl.clearValidators();
      this.memberIDControl.reset();
      this.policyControl.clearValidators();
      this.policyControl.reset();
      this.cardSerialControl.clearValidators();
      this.cardSerialControl.reset();
    }
    return isGovernmentCom;
  }

  get isPrivateCompany(): boolean {

    const fundType = this.getSelectedFundingType(this.billingTypeControl.value);
    if (!fundType) {
      return false;
    }
    const isPrivateCom = fundType.sponsorship_type_name.toLocaleLowerCase() === 'private company';
    if (isPrivateCom) {
      this.staffIDControl.setValidators(Validators.required);
      this.policyControl.clearValidators();
      this.policyControl.reset();
      this.memberIDControl.clearValidators();
      this.memberIDControl.reset();
      this.cardSerialControl.clearValidators();
      this.cardSerialControl.reset();
    }
    return isPrivateCom;
  }

  get isPrivateInsurance(): boolean {
    const fundType = this.getSelectedFundingType(this.billingTypeControl.value);
    if (!fundType) {
      return false;
    }
    const isPrivateIn = fundType.sponsorship_type_name.toLocaleLowerCase() === 'private insurance';
    if (isPrivateIn) {
      this.memberIDControl.setValidators(Validators.required);
      // this.policyControl.setValidators(Validators.required);
      this.staffIDControl.clearValidators();
      this.staffIDControl.reset();
      this.staffNameControl.clearValidators();
      this.staffNameControl.reset();
      this.cardSerialControl.clearValidators();
      this.cardSerialControl.reset();
    }
    return isPrivateIn;
  }

  get isGovernmentInsurance(): boolean {
    const fundType = this.getSelectedFundingType(this.billingTypeControl.value);
    if (!fundType) {
      return false;
    }
    const isGovIn = fundType.sponsorship_type_name.toLocaleLowerCase() === 'government insurance';
    if (isGovIn) {
      this.memberIDControl.setValidators(Validators.required);
      this.cardSerialControl.setValidators(Validators.required);
      this.policyControl.clearValidators();
      this.policyControl.reset();
      this.staffNameControl.clearValidators();
      this.staffNameControl.reset();
      this.staffIDControl.reset();
      this.staffIDControl.clearValidators();
      return true;
    }
    return isGovIn;
  }

  get isCash(): boolean {
    const fundType = this.getSelectedFundingType(this.billingTypeControl.value);
    if (!fundType) {
      return false;
    }
    const isCash = fundType.sponsorship_type_name.toLocaleLowerCase().includes('patient');
    if (isCash) {
      this.staffIDControl.setValidators(Validators.required);
      this.staffNameControl.setValidators(Validators.required);
    }
    return isCash;
  }


  addSponsor(data: object) {
    this.isCreatingSponsor = true;
    this.recordService.addSponsorPermit(data).pipe(first())
      .subscribe(res => {
        console.log('Sponsor  Results Records: ');
        console.log(res);
        console.log('A BIG SUCCESS!!');
        // this.notification.success(
        //   'Success',
        //   `Sponsor permit has been added to ${this.patient.folder_no}`
        // );

        this.isCreatingSponsor = false;
        this.sponsoredForm.reset();
      }, e => {
        this.isCreatingSponsor = false;
        // this.notification.error(
        //   'Error',
        //   `Could not add sponsor permit to ${this.patient.folder_no}`
        // );
        console.error(e);
      });
  }

  submitForm() {

    const patientData = this.processPatientData();
    // const nextOfKinData = this.processNextOfKinData(1);
    // const sponsorshipData = this.processSponsorData(1);

    // console.log('patientDataFinale:');
    // console.log(patientData);
    // console.log('kinFinale:');
    // console.log(nextOfKinData);
    // console.log('sponsorFinale:');
    // console.log(sponsorshipData);


    this.createPatient(patientData);

  }

  compareFn(c1: any, c2: any): boolean {
    return c1 === c2;
  }
}
