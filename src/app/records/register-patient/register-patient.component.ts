import { FolderDetails } from './../models/folders';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { RecordService } from './../record.service';
import { NzNotificationService, UploadFile } from 'ng-zorro-antd';
import { first, map, retry, debounceTime } from 'rxjs/operators';
import { SetupService } from './../../shared/services/setup.service';
import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import * as dateFns from 'date-fns';
import { formatDate } from '@angular/common';

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
  folderTypes = [];
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
  readonly finalStepIndex = 4;
  @ViewChild('placesRef', { static: false }) placesRef: GooglePlaceDirective;
  createdPatient: any;
  createdNextofKin: any;
  isCreatingPatient = false;
  companyForm = this.fb.group({
    name: [null, [Validators.required]],
    email: [null, [Validators.required]],
    phone: [null, [Validators.required, Validators.pattern(/^\d{9,}$/)]],
    googleAddress: [null],
  });
  patientForm = this.fb.group({
    // 1.0 Billing Information
    billingInfo: this.fb.group({
      billingType: [null, [Validators.required]],
      folder_type: [null, [Validators.required]],
    }),
    sponsored: this.fb.group({
      sponsorName: [null, Validators.required],
      company: [null],
      memberId: [null],
      cardSerialNumber: [null],
      staffId: [null],
      staffName: [null],
      beneficiary: [null, Validators.required],
      relation: [null], // the relation validator is not needed
      // relation: [null],
      policy: [null],
      issuedDate: [null, [Validators.required]],
      expiryDate: [null, [Validators.required]],
    }),
    // 2.0 Patient Information
    patientInfo: this.fb.group({
      firstName: [null, [Validators.required]],
      lastName: [null, [Validators.required]],
      middleName: [null],
      title: [null, [Validators.required]],
      dob: [null, [Validators.required]],
      // todo add custom validator for when useAge is selected
      age: [0],
      useAge: [false],
      gender: [null, [Validators.required]],
      maritalStatus: [null, [Validators.required]],
      nativeLanguage: [null, [Validators.required]],
      nationality: [null, [Validators.required]],
      region: [null, [Validators.required]],
      district: [null, [Validators.required]],
      hometown: [null, [Validators.required]],
      religion: [null, [Validators.required]],
      educationalLevel: [null, [Validators.required]],
      idtype: [null, [Validators.required]],
      idNumber: [null],
      IdExpiryDate: [null],
      occupation: [null, [Validators.required]],
      oldFolderNumber: [null],
    }),
    // 3.0 Contact Information
    contactInfo: this.fb.group({
      homeAddress: [null, [Validators.required]],
      workAddress: [null, [Validators.required]],
      countryCode: ['+233', [Validators.required]],
      cellPhoneNumber: [null, [Validators.required, Validators.minLength(9), Validators.maxLength(9), Validators.pattern(/^\d{8,}$/)]],
      emailAddress: [null, [Validators.email]],
    }),
    // 4.0 Next of Kin
    nextOfKin: this.fb.group({
      name: [null, [Validators.required]],
      homeAddress: [null, [Validators.required]],
      countryCode: ['+233', [Validators.required]],
      cellPhoneNumber: [null, [Validators.required, Validators.minLength(9), Validators.maxLength(9), Validators.pattern(/^\d{8,}$/)]],
      emailAddress: [null, [Validators.email]],
      relationship: [null, [Validators.required]],
    }),
    attachments: this.fb.group({
      photo: [null, [Validators.required]],
    }),
  });

  noneIdType = {
    id: 0,
    name: 'NONE'
  };
  photo: string;

  formatterAge = (value: number) => `${value} yrs`;
  parserAge = (value: string) => value.replace('yrs', '');

  constructor(private readonly fb: FormBuilder,
    private setups: SetupService,
    private recordService: RecordService,
    private setupService: SetupService,
    private notification: NzNotificationService) { }

  ngAfterViewInit() {
    this.patientInfoForm.get('idtype').valueChanges.subscribe(id => {
      if (id !== 0) {
        this.patientInfoForm.get('idNumber').setValidators(Validators.required);
      } else {
        this.patientInfoForm.get('idNumber').clearValidators();
      }
    });

    this.issueDateControl.valueChanges.pipe(untilComponentDestroyed(this))
      .subscribe((date: Date) => {
        if (date) {
          this.expiryDateControl.setValue(dateFns.addYears(date, 1));
        }
      });

    this.beneficiaryControl.valueChanges.pipe(untilComponentDestroyed(this))
      .subscribe(benefitiary => {
        if (benefitiary) {
          this.updateBenefitValidators(benefitiary);
        }
      });

    this.billingTypeControl.valueChanges.pipe(debounceTime(500), untilComponentDestroyed(this))
      .subscribe(id => {
        if (this.billingTypeControl.valid) {
          this.sponsorNameControl.reset();
          this.getSponsors(this.getSelectedFundingType(id).sponsorship_type_id);
          this.updateValidators(this.getSelectedFundingType(id));
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

  ngOnDestroy(): void { }

  ngOnInit() {
    this.getAllowedFolderTypes();
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

    this.patientInfoForm.get('nationality').valueChanges.pipe(untilComponentDestroyed(this))
      .subscribe(val => {
        if (val) {
          this.getRegionsByCountryId(val.toString());
        }
      },
        err => console.error(err)
      );

    this.medicalSponsorControl.valueChanges.pipe(untilComponentDestroyed(this))
      .subscribe(val => {
        if (val) {
          this.getPolicies(val);
        }
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
    return this.patientForm.get('sponsored').get('sponsorName') as FormControl;
  }

  get isBillingSponsored(): boolean {
    return this.billingTypeControl.value !== null && this.getSelectedFundingType(this.billingTypeControl.value) !== null;
  }

  get sponsoredForm(): FormGroup {
    return this.patientForm.get('sponsored') as FormGroup;
  }

  get billingForm(): FormGroup {
    return this.patientForm.get('billingInfo') as FormGroup;
  }

  get relationControl(): FormControl {
    return this.sponsoredForm.get('relation') as FormControl;
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

  get attachmentsForm(): FormGroup {
    return this.patientForm.get('attachments') as FormGroup;
  }

  get isGovernmentCompany(): boolean {
    const fundType = this.getSelectedFundingType(this.billingTypeControl.value);
    if (!fundType) {
      return false;
    }
    return fundType.sponsorship_type_name.toLocaleLowerCase() === 'government company';
  }

  get isPrivateCompany(): boolean {
    const fundType = this.getSelectedFundingType(this.billingTypeControl.value);
    if (!fundType) {
      return false;
    }
    return fundType.sponsorship_type_name.toLocaleLowerCase() === 'private company';
  }

  get isPrivateInsurance(): boolean {
    const fundType = this.getSelectedFundingType(this.billingTypeControl.value);
    if (!fundType) {
      return false;
    }
    return fundType.sponsorship_type_name.toLocaleLowerCase() === 'private insurance';
  }

  get isGovernmentInsurance(): boolean {
    const fundType = this.getSelectedFundingType(this.billingTypeControl.value);
    if (!fundType) {
      return false;
    }
    return fundType.sponsorship_type_name.toLocaleLowerCase() === 'government insurance';
  }

  get isCash(): boolean {
    const fundType = this.getSelectedFundingType(this.billingTypeControl.value);
    if (!fundType) {
      return false;
    }
    return fundType.sponsorship_type_name.toLocaleLowerCase().includes('patient');
  }

  beforeUploadPhoto = (uploadFile: UploadFile): boolean => {
    if (this.isCreatingPatient || this.isCreatingSponsor) {
      return false;
    }
    this.toBase64(uploadFile).then((file: string) => {
      this.photo = file;
      this.attachmentsForm.get('photo').patchValue(this.photo);
    });
    return false;
  }

  toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  })

  clearPhoto() {
    this.photo = null;
    this.attachmentsForm.get('photo').reset();
  }

  getAllowedFolderTypes() {
    const facility = this.recordService.getFacilityDetails();
    if (facility) {
      this.folderTypes = facility.allowed_folder_type.split(',');
      if (this.folderTypes.length === 1) {
        this.folderTypeControl.setValue(this.folderTypes[0]);
      }
    }
  }

  updateBenefitValidators(beneficiary: any) {
    if (beneficiary === 'DEPENDANT') {
      if (this.isGovernmentCompany || this.isPrivateCompany) {
        this.staffNameControl.setValidators([Validators.required]);
      } else {
        this.staffNameControl.clearValidators();
        this.staffNameControl.reset();
      }
      this.relationControl.setValidators(Validators.required);
    } else {
      this.relationControl.clearValidators();
      this.relationControl.reset();
    }
  }

  updateValidators(fundType: any) {
    if (!fundType) {
      return;
    }
    const sponsorType = fundType.sponsorship_type_name.toLocaleLowerCase();

    if (sponsorType === 'government company') {
      this.staffIDControl.setValidators(Validators.required);
      this.memberIDControl.clearValidators();
      this.memberIDControl.reset();
      this.policyControl.clearValidators();
      this.policyControl.reset();
      this.cardSerialControl.clearValidators();
      this.cardSerialControl.reset();
    } else if (sponsorType === 'private company') {
      this.staffIDControl.setValidators(Validators.required);
      this.policyControl.clearValidators();
      this.policyControl.reset();
      this.memberIDControl.clearValidators();
      this.memberIDControl.reset();
      this.cardSerialControl.clearValidators();
      this.cardSerialControl.reset();
    } else if (sponsorType === 'private insurance') {
      this.memberIDControl.setValidators([Validators.required]);
      // this.policyControl.setValidators(Validators.required);
      this.staffIDControl.clearValidators();
      this.staffIDControl.reset();
      this.staffNameControl.clearValidators();
      this.staffNameControl.reset();
      this.cardSerialControl.clearValidators();
      this.cardSerialControl.reset();
    } else if (sponsorType === 'government insurance') {
      this.memberIDControl.setValidators(Validators.required);
      this.cardSerialControl.setValidators(Validators.required);
      this.policyControl.clearValidators();
      this.policyControl.reset();
      this.staffNameControl.clearValidators();
      this.staffNameControl.reset();
      this.staffIDControl.reset();
      this.staffIDControl.clearValidators();
    } /* else if (sponsorType.includes('patient')) {
      for (const i of Object.keys(this.sponsoredForm.controls)) {
        this.sponsoredForm.controls[i].clearValidators();
      }
    } */
    for (const i of Object.keys(this.sponsoredForm.controls)) {
      if (this.sponsoredForm.get(i) !== this.sponsorNameControl) {
        this.sponsoredForm.get(i).updateValueAndValidity();
      }
    }
  }

  public handleAddressChange(address: Address) {
    this.googleAddress = address.url;
  }

  get contactInfoForm(): FormGroup {
    return this.patientForm.get('contactInfo') as FormGroup;
  }

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

  get isBeneficiaryDependant(): boolean {
    return this.beneficiaryControl.value === 'DEPENDANT';
  }

  get nextOfKinInfoForm(): FormGroup {
    return this.patientForm.get('nextOfKin') as FormGroup;
  }

  private validateContactInfo(): boolean {
    if (this.contactInfoForm.valid) {
      return true;
    }
    for (const i of Object.keys(this.contactInfoForm.controls)) {
      if (this.contactInfoForm.controls[i].invalid) {
        this.contactInfoForm.controls[i].markAsDirty();
        this.contactInfoForm.controls[i].updateValueAndValidity();
      }
    }
    return this.contactInfoForm.valid;
  }

  private validateNextOfKinInfo(): boolean {
    if (this.nextOfKinInfoForm.valid) {
      return true;
    }
    for (const i of Object.keys(this.nextOfKinInfoForm.controls)) {
      if (this.nextOfKinInfoForm.controls[i].invalid) {
        this.nextOfKinInfoForm.controls[i].markAsDirty();
        this.nextOfKinInfoForm.controls[i].updateValueAndValidity();
      }
    }

    return this.nextOfKinInfoForm.valid;
  }

  pre(): void {
    this.changeContent('previous');
  }

  next(): void {
    this.changeContent('next');
  }

  done(): void {
    this.isCreatingPatient = true;
    if (this.patientForm.valid) {
      this.submitForm();
    }
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
        action(this.validateBillingInfo() && this.validateSponsorInfo());
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
      case 4: {
        action(true);
        break;
      }
      default: {
        break;
      }
    }
  }

  disabledDate(current: Date): boolean {
    if (!current) {
      return false;
    }
    // can only select days before today
    return dateFns.isAfter(current, new Date());
  }

  disabledIssueDate = (issueDate: Date): boolean => {
    if (!issueDate) {
      return false;
    }
    // can only select days before today
    return dateFns.isAfter(issueDate, new Date());
  }

  disabledExpiryDate = (expiryDate: Date): boolean => {
    if (!expiryDate || !this.issueDateControl) {
      return false;
    }
    const date = this.issueDateControl.value as Date;
    // can only select days after the issue date
    return dateFns.isBefore(expiryDate, date);
  }

  private createPatient(data: object) {
    this.recordService.createPatient(data).pipe(first()).subscribe(
      patient => {
        if (!patient) {
          this.isCreatingPatient = false;
          this.notification.error('Error', 'Could not create patient, please try again');
        } else {
          this.createdPatient = patient;
          this.createNextOfKin(patient.id as number, this.processNextOfKinData(patient.id));
        }
      },
      err => {
        this.isCreatingPatient = false;
        this.notification.error('Error', 'Could not create patient, please try again');
        console.error(err);
      }
    );
  }

  private createNextOfKin(patientId: number, data: object) {
    if (this.createdNextofKin) {
      /* at this point, the nok had been created but an error occured while
      adding the sponsor, so resume here */
      this.addSponsor(this.processSponsorData(patientId));
    }
    this.recordService.createNextOfKin(data).subscribe(
      res => {
        if (!res) {
          this.isCreatingPatient = false;
          this.notification.error('Error', 'Could not attach next of kin to patient, please try again');
        } else {
          this.createdNextofKin = res;
          this.addSponsor(this.processSponsorData(patientId));
        }
      },
      err => {
        this.isCreatingPatient = false;
        this.notification.error('Error', 'Could not attach next of kin to patient, please try again');
      }
    );
  }

  private processPatientData() {
    const patientData = this.patientInfoForm.value;

    let emerg_phone: string;
    if (this.contactInfoForm.value.emergencyPhoneNumber) {
      emerg_phone = `${this.contactInfoForm.value.emergencyCountryCode.replace('+', '')}${this.contactInfoForm.value.emergencyPhoneNumber}`;
    }

    let active_cell: string;
    if (this.contactInfoForm.value.cellPhoneNumber) {
      active_cell = `${this.contactInfoForm.value.countryCode.replace('+', '')}${this.contactInfoForm.value.cellPhoneNumber}`;
    }

    return {
      'title_id': patientData.title,
      'photo': this.attachmentsForm.get('photo').value,
      'funding_type_id': this.billingTypeControl.value,
      'folder_type': this.folderTypeControl.value,
      'ssnit_no': patientData.snnit,
      'tin': patientData.tin,
      'surname': patientData.lastName,
      'middlename': patientData.middleName,
      'firstname': patientData.firstName,
      'dob': formatDate(patientData.dob.toISOString(), 'yyyy-MM-dd', 'en'),
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
      'id_type_id': (patientData.idtype === 0) ? null : patientData.idtype,
      'id_no': patientData.idNumber,
      'id_expiry_date': formatDate(patientData.IdExpiryDate.toISOString(), 'yyyy-MM-dd', 'en'),
      'religion_id': patientData.religion,
      'educational_level_id': patientData.educationalLevel,
      'active_cell': active_cell,
      'email': this.contactInfoForm.value.emailAddress,
      'emerg_name': this.contactInfoForm.value.emergencyName,
      'emerg_phone': emerg_phone,
      'emerg_relation_id': this.contactInfoForm.value.emergencyRelationship,
      'mortality': 'ALIVE',
      'reg_status': 'OUT-PATIENT',
      'status': 'ACTIVE'
    };
  }

  private processNextOfKinData(patientId: number) {
    const nextOfKinData = this.nextOfKinInfoForm.value;
    let phone: string;
    if (nextOfKinData.cellPhoneNumber) {
      phone = `${nextOfKinData.countryCode.replace('+', '')}${nextOfKinData.cellPhoneNumber}`;
    }

    return {
      'name': nextOfKinData.name,
      'phone': phone,
      'email': nextOfKinData.emailAddress,
      'patient_id': patientId,
      'relation_id': nextOfKinData.relationship,
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
      issued_date: formatDate(this.issueDateControl.value, 'yyyy-MM-dd', 'en'),
      expiry_date: formatDate(this.expiryDateControl.value, 'yyyy-MM-dd', 'en'),
    };
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
          console.error(error);
          this.notification.error(
            'Error',
            `Could not create ${this.companyForm.get('name').value}`
          );
        }
      );
  }

  private validateBillingInfo(): boolean {
    if (this.billingForm.valid) {
      // no need to run validator if the form is valid
      return true;
    }
    for (const i of Object.keys(this.billingForm.controls)) {
      // try to show errors on only invalid fields
      if (this.billingForm.controls[i].invalid) {
        this.billingForm.controls[i].markAsDirty();
        this.billingForm.controls[i].updateValueAndValidity();
      }
    }

    return this.billingForm.valid;
  }
  /*
  * Tracks validity status of form before moving to the
  * next step in patient registration*/
  private validateSponsorInfo(): boolean {
    if (this.sponsoredForm.valid || this.isCash) {
      // no need to run validator if the form is valid
      return true;
    }
    for (const i of Object.keys(this.sponsoredForm.controls)) {
      // try to show errors on only invalid fields
      if (this.sponsoredForm.controls[i].invalid) {
        this.sponsoredForm.controls[i].markAsDirty();
        this.sponsoredForm.controls[i].updateValueAndValidity();
      }
    }

    return this.sponsoredForm.valid;
  }

  ageChanged() {
    const age = (this.ageControl.value as number) * 31556952000;
    const today = Date.now();

    const ageDate = new Date(today - age);
    this.dobControl.setValue(ageDate);
  }

  validatePatientInfo(): boolean {
    if (this.patientInfoForm.valid) {
      return true;
    }
    for (const i of Object.keys(this.patientInfoForm.controls)) {
      if (this.patientInfoForm.controls[i].invalid) {
        this.patientInfoForm.controls[i].markAsDirty();
        this.patientInfoForm.controls[i].updateValueAndValidity();
      }
    }

    return this.patientInfoForm.valid;
  }

  private getFundingTypes() {
    this.setups.getFundingTypes()
      .pipe(first())
      .subscribe(data => {
        this.isLoadingFundingTypes = false;
        this.fundingTypes = data.data;
      }, error => {
        this.isLoadingFundingTypes = false;
        console.error(error);
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
        console.error(err);
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
        console.error(err);
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
        console.error(err);
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
        console.error(err);
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
        console.error(err);
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
        console.error(err);
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
        console.error(err);
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
        console.error(err);
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
        console.error(err);
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
        console.error(err);
      }
    );
  }

  private getIdTypes() {
    this.isLoadingIdTypes.next(true);
    this.setups.getIdTypes().pipe(first()).subscribe(
      res => {
        this.isLoadingIdTypes.next(false);
        this.idtypes.push(this.noneIdType, ...res.data);
      },
      err => {
        this.isLoadingIdTypes.next(false);
        console.error(err);
      }
    );
  }

  private getSelectedFundingType(value: number) {

    const fundType = this.fundingTypes.find(ft => ft.id === value);
    if (!fundType) {
      return null;
    }
    return fundType;
  }

  private addSponsor(data: object) {
    if (!this.isBillingSponsored) {
      this.notification.success(
        'Success',
        `Folder number is ${this.createdPatient.folder_no}. Write it for the patient and close this!`,
        { nzDuration: 0 }
      );
      this.isCreatingSponsor = false;
      this.isCreatingPatient = false;
      this.stepIndex = 0;
      this.patientForm.reset();
      return;
    }
    this.isCreatingSponsor = true;
    this.recordService.addSponsorPermit(data).pipe(first())
      .subscribe(res => {
        if (res) {
          this.notification.success(
            'Success',
            `Folder number is ${this.createdPatient.folder_no}. Write it for the patient and close this!`,
            { nzDuration: 0 }
          );
          this.isCreatingSponsor = false;
          this.isCreatingPatient = false;
          this.stepIndex = 0;
          this.patientForm.reset();
        } else {
          this.isCreatingSponsor = false;
          this.isCreatingPatient = false;
          this.notification.error(
            'Error',
            `Could not create patient. Please try again.`
          );
        }
      }, e => {
        this.isCreatingSponsor = false;
        this.isCreatingPatient = false;
        this.notification.error(
          'Error',
          `Could not create patient. Please try again.`
        );
        console.error(e);
      });
  }

  submitForm() {
    const patientData = this.processPatientData();
    console.log(patientData);
    if (this.createdPatient) {
      /* at this point, the patient had been created but an error occured while
      adding the nok, so resume here */
      this.createNextOfKin(this.createdPatient.id,
        this.processNextOfKinData(this.createdPatient.id));
      return;
    }
    this.createPatient(patientData);
  }

  compareFn(c1: any, c2: any): boolean {
    return c1 === c2;
  }
}
