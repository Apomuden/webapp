import { first, debounceTime, take } from 'rxjs/operators';
import { RecordService } from './../record.service';
import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { FormBuilder, Validators, FormControl, FormGroup } from '@angular/forms';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { SetupService } from 'src/app/shared/services/setup.service';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { NzNotificationService } from 'ng-zorro-antd';
import * as dateFn from 'date-fns';
import { formatDate } from '@angular/common';
@Component({
  selector: 'app-sponsorship-permit',
  templateUrl: './sponsorship-permit.component.html',
  styleUrls: ['./sponsorship-permit.component.css']
})
export class SponsorshipPermitComponent implements OnInit, OnDestroy, AfterViewInit {
  selected = false;
  isLoadingData = false;
  searchInitialized = false;
  isLoadingFundingTypes = false;
  searchControl = this.fb.control(null, [Validators.minLength(11), Validators.maxLength(12)]);
  sponsorForm = this.fb.group({
    fundingType: [null, [Validators.required]],
    sponsorName: [null, [Validators.required]],
    company: [null],
    memberId: [null],
    cardSerialNumber: [null],
    staffId: [null],
    staffName: [null],
    beneficiary: [null, [Validators.required]],
    relation: [null],
    policy: [null],
    issuedDate: [null, [Validators.required]],
    expiryDate: [null, [Validators.required]],
  });
  companyForm = this.fb.group({
    name: [null, [Validators.required]],
    email: [null, [Validators.required]],
    phone: [null, [Validators.required]],
    googleAddress: [null, [Validators.required]],
  });
  patient: any;

  fundingTypes = [];
  sponsors = [];
  message = 'Enter a valid folder number to fill this form';
  relationships = [];
  isLoadingRelation = false;
  isCreatingCompany = false;
  isVisible = false;
  googleAddress: string = null;
  companies = [];
  isCompaniesLoading = false;
  isCreatingSponsor = false;
  policies = [];

  constructor(
    private recordService: RecordService,
    private setupService: SetupService,
    private notification: NzNotificationService,
    private fb: FormBuilder) { }


  ngOnInit() { }

  ngAfterViewInit() {
    this.searchControl.valueChanges.pipe(debounceTime(1000), untilComponentDestroyed(this))
      .subscribe(folderNo => {
        if (folderNo && this.searchControl.valid) {
          this.getPatient(folderNo);
          this.getFundingTypes();
          this.getRelationships();
          this.getCompanies();
        } else {
          this.message = 'Please enter a valid folder number to fill this form.';
          this.searchInitialized = false;
        }
      });

    this.issueDateControl.valueChanges.pipe(untilComponentDestroyed(this))
      .subscribe((date: Date) => {
        if (date) {
          this.expiryDateControl.setValue(dateFn.addYears(date, 1));
        }
      });

    this.beneficiaryControl.valueChanges.pipe(untilComponentDestroyed(this))
      .subscribe(benefitiary => {
        if (benefitiary) {
          this.updateBenefitValidators(benefitiary);
        }
      });

    this.fundingTypeControl.valueChanges.pipe(debounceTime(500), untilComponentDestroyed(this))
      .subscribe(id => {
        if (this.fundingTypeControl.valid) {
          this.sponsorNameControl.reset();
          this.getSponsors(this.getSelectedFundingType(id).sponsorship_type_id);
          this.updateValidators(this.getSelectedFundingType(id));
        }
      });

    this.sponsorNameControl.valueChanges.pipe(debounceTime(1000), untilComponentDestroyed(this))
      .subscribe(id => {
        if (this.fundingTypeControl.valid) {
          this.policyControl.reset();
          this.policies = [];
          if (this.isPrivateInsurance) {
            this.getPolicies(id);
          }
        }
      });
  }

  ngOnDestroy() { }

  get fundingTypeControl(): FormControl {
    return this.sponsorForm.get('fundingType') as FormControl;
  }

  get sponsorNameControl(): FormControl {
    return this.sponsorForm.get('sponsorName') as FormControl;
  }

  get beneficiaryControl(): FormControl {
    return this.sponsorForm.get('beneficiary') as FormControl;
  }

  get policyControl(): FormControl {
    return this.sponsorForm.get('policy') as FormControl;
  }

  get isBeneficiaryDependant(): boolean {
    return this.beneficiaryControl.value === 'DEPENDANT';
  }

  get isGovernmentCompany(): boolean {
    const fundType = this.getSelectedFundingType(this.fundingTypeControl.value);
    if (!fundType) {
      return false;
    }
    return fundType.sponsorship_type_name.toLocaleLowerCase() === 'government company';
  }

  get isPrivateCompany(): boolean {
    const fundType = this.getSelectedFundingType(this.fundingTypeControl.value);
    if (!fundType) {
      return false;
    }
    return fundType.sponsorship_type_name.toLocaleLowerCase() === 'private company';
  }

  get isPrivateInsurance(): boolean {
    const fundType = this.getSelectedFundingType(this.fundingTypeControl.value);
    if (!fundType) {
      return false;
    }
    return fundType.sponsorship_type_name.toLocaleLowerCase() === 'private insurance';
  }

  get isGovernmentInsurance(): boolean {
    const fundType = this.getSelectedFundingType(this.fundingTypeControl.value);
    if (!fundType) {
      return false;
    }
    return fundType.sponsorship_type_name.toLocaleLowerCase() === 'government insurance';
  }

  get isCash(): boolean {
    const fundType = this.getSelectedFundingType(this.fundingTypeControl.value);
    if (!fundType) {
      return false;
    }
    return fundType.sponsorship_type_name.toLocaleLowerCase().includes('patient');
  }

  get companyControl(): FormControl {
    return this.sponsorForm.get('company') as FormControl;
  }

  get staffNameControl(): FormControl {
    return this.sponsorForm.get('staffName') as FormControl;
  }

  get cardSerialControl(): FormControl {
    return this.sponsorForm.get('cardSerialNumber') as FormControl;
  }

  get issueDateControl(): FormControl {
    return this.sponsorForm.get('issuedDate') as FormControl;
  }

  get expiryDateControl(): FormControl {
    return this.sponsorForm.get('expiryDate') as FormControl;
  }

  get staffIDControl(): FormControl {
    return this.sponsorForm.get('staffId') as FormControl;
  }

  get memberIDControl(): FormControl {
    return this.sponsorForm.get('memberId') as FormControl;
  }

  get relationControl(): FormControl {
    return this.sponsorForm.get('relation') as FormControl;
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
      this.memberIDControl.setValidators(Validators.required);
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
    } else if (sponsorType.includes('patient')) {
      this.memberIDControl.setValidators(Validators.required);
    }
    for (const i of Object.keys(this.sponsorForm.controls)) {
      if (this.sponsorForm.get(i) !== this.sponsorNameControl && this.sponsorForm.get(i) !== this.fundingTypeControl) {
        this.sponsorForm.get(i).updateValueAndValidity();
      }
    }
  }

  private getFundingTypes() {
    this.setupService.getFundingTypes()
      .pipe(first())
      .subscribe(data => {
        this.isLoadingFundingTypes = false;
        this.fundingTypes = data.data;
      }, error => {
        this.isLoadingFundingTypes = false;
        console.log(error);
      });
  }

  disabledIssueDate = (issueDate: Date): boolean => {
    if (!issueDate) {
      return false;
    }
    // can only select days before today
    return dateFn.isAfter(issueDate, new Date());
  }

  disabledExpiryDate = (expiryDate: Date): boolean => {
    if (!expiryDate || !this.issueDateControl) {
      return false;
    }
    const date = this.issueDateControl.value as Date;
    // can only select days after the issue date
    return dateFn.isBefore(expiryDate, date);
  }

  private getPolicies(sponsorId: number) {
    this.setupService.getSponsorPolicies(sponsorId)
      .pipe(first())
      .subscribe(data => {
        this.isLoadingFundingTypes = false;
        this.policies = data.data;
      }, error => {
        this.isLoadingFundingTypes = false;
        this.policies = [];
      });
  }

  private getRelationships() {
    this.setupService.getRelationships()
      .pipe(first())
      .subscribe(data => {
        this.isLoadingRelation = false;
        this.relationships = data.data;
      }, error => {
        this.isLoadingRelation = false;
      });
  }

  public handleAddressChange(address: Address) {
    this.googleAddress = address.url;
  }

  private getSelectedFundingType(value: number) {
    const fundType = this.fundingTypes.find(ft => ft.id === value);
    if (!fundType) {
      return null;
    }
    return fundType;
  }

  private getSponsors(sponsor_type_id: number) {
    this.isLoadingFundingTypes = true;
    this.setupService.getSponsorsByType(sponsor_type_id).pipe(first())
      .subscribe(data => {
        this.isLoadingFundingTypes = false;
        if (data) {
          this.sponsors = data.data;
        }
      }, e => {
        this.isLoadingFundingTypes = false;
      });
  }

  private getPatient(folderNo: string) {
    this.isLoadingData = true;
    this.searchInitialized = true;
    this.recordService.getAllPatients(`/single?folder_no=${folderNo}`).pipe(first())
      .subscribe(data => {
        this.isLoadingData = false;
        if (data.data) {
          this.patient = data.data;
          console.log(this.patient.id, 'patient id');
          this.patient.age = this.calculateAge(this.patient.dob);
        } else {
          this.message = 'Folder not found';
          this.searchInitialized = false;
        }
      }, e => {
        this.message = 'Folder not found';
        this.searchInitialized = false;
      });
  }

  private calculateAge(birthday: string) {
    const ageDifMs = Date.now() - new Date(birthday).getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }

  handleCancel() {
    this.isVisible = false;
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

  private getCompanies() {
    this.setupService
      .getCompanies()
      .pipe(first())
      .subscribe(
        data => {
          this.companies = data.data;
          this.isCompaniesLoading = false;
        },
        error => {
          this.isCompaniesLoading = false;
        }
      );
  }

  showModal() {
    this.isVisible = true;
  }

  cancel() {
    this.patient = null;
    this.searchInitialized = false;
    this.sponsorForm.reset();
  }

  private validateForm(): boolean {
    if (this.sponsorForm.valid) {
      return true;
    }
    for (const i of Object.keys(this.sponsorForm.controls)) {
      if (this.sponsorForm.controls[i].invalid) {
        this.sponsorForm.controls[i].markAsDirty();
        this.sponsorForm.controls[i].updateValueAndValidity();
      }
    }
    return this.sponsorForm.valid;
  }

  addSponsor() {
    if (!this.validateForm()) {
      return;
    }
    this.isCreatingSponsor = true;
    const data = this.processData();
    this.recordService.addSponsorPermit(data).pipe(first())
      .subscribe(res => {
        this.notification.success(
          'Success',
          `Sponsor permit has been added to ${this.patient.folder_no}`
        );
        this.isCreatingSponsor = false;
        this.sponsorForm.reset();
        this.searchControl.reset();
        this.patient = null;
        this.searchInitialized = false;
      }, e => {
        this.isCreatingSponsor = false;
        this.notification.error(
          'Error',
          `Could not add sponsor permit to ${this.patient.folder_no}`
        );
        console.error(e);
      });
  }

  private processData() {
    return {
      patient_id: this.patient.id as number,
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
}
