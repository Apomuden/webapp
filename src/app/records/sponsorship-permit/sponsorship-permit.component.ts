import { first, debounceTime, take } from 'rxjs/operators';
import { RecordService } from './../record.service';
import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { FormBuilder, Validators, FormControl, FormGroup } from '@angular/forms';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { SetupService } from 'src/app/shared/services/setup.service';

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
    company: [null, [Validators.required]],
    memberId: [null, [Validators.required]],
    cardSerialNumber: [null],
    staffId: [null, [Validators.required]],
    beneficiary: [null, [Validators.required]],
    relation: [null],
    policy: [null, [Validators.required]],
    issuedDate: [null, [Validators.required]],
    expiryDate: [null, [Validators.required]],
  });
  patient: any;

  fundingTypes = [];
  sponsors = [];
  message = 'Enter a valid folder number to fill this form';

  constructor(
    private recordService: RecordService,
    private setupService: SetupService,
    private fb: FormBuilder) { }


  ngOnInit() {
    this.getFundingTypes();
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

  ngAfterViewInit() {
    this.searchControl.valueChanges.pipe(debounceTime(1000), untilComponentDestroyed(this))
      .subscribe(folderNo => {
        if (folderNo && this.searchControl.valid) {
          this.getPatient(folderNo);
        } else {
          this.message = 'Please enter a valid folder number to fill this form.';
          this.searchInitialized = false;
        }
      });
    this.fundingTypeControl.valueChanges.pipe(debounceTime(1000), untilComponentDestroyed(this))
      .subscribe(id => {
        if (id && this.fundingTypeControl.valid) {
          this.sponsorNameControl.reset();
          this.getSponsors(this.getSelectedFundingType(id).sponsorship_type_id);
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

  get isBeneficiaryDependant(): boolean {
    if (this.beneficiaryControl.value === 'Dependant') {
      this.relationControl.setValidators(Validators.required);
      return true;
    } else {
      this.relationControl.clearValidators();
      this.relationControl.reset();
      return false;
    }
  }

  get isCoporateSponsor(): boolean {
    const fundType = this.getSelectedFundingType(this.fundingTypeControl.value);
    if (!fundType) {
      return false;
    }
    const isCoporate = fundType.name.toLocaleLowerCase().includes('coporate');
    if (isCoporate) {
      this.staffIDControl.setValidators(Validators.required);
    } else {
      this.staffIDControl.clearValidators();
      this.staffIDControl.reset();
    }
    return isCoporate;
  }

  get isInsurance(): boolean {
    const fundType = this.getSelectedFundingType(this.fundingTypeControl.value);
    if (!fundType) {
      return false;
    }
    if (fundType.name.toLocaleLowerCase().includes('nhis') || fundType.name.toLocaleLowerCase().includes('insurance')) {
      this.memberIDControl.setValidators(Validators.required);
      this.cardSerialControl.setValidators(Validators.required);
      return true;
    } else {
      this.memberIDControl.clearValidators();
      this.memberIDControl.reset();
      this.cardSerialControl.clearValidators();
      this.cardSerialControl.reset();
      return false;
    }
  }

  get companyControl(): FormControl {
    return this.sponsorForm.get('company') as FormControl;
  }

  get cardSerialControl(): FormControl {
    return this.sponsorForm.get('cardSerialNumber') as FormControl;
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

  getSelectedFundingType(value: number) {
    const fundType = this.fundingTypes.find(ft => ft.id === value);
    if (!fundType) {
      return null;
    }
    return fundType;
  }

  getSponsors(sponsor_type_id: number) {
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

  getPatient(folderNo: string) {
    this.isLoadingData = true;
    this.searchInitialized = true;
    this.recordService.getAllPatients(`/single?folder_no=${folderNo}`).pipe(first())
      .subscribe(data => {
        this.isLoadingData = false;
        if (data.data) {
          this.patient = data.data;
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

  calculateAge(birthday: string) {
    const ageDifMs = Date.now() - new Date(birthday).getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }


  cancel() {
    this.patient = null;
    this.searchInitialized = false;
    this.sponsorForm.reset();
  }

  addSponsor() {
  }
}

/*
import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { FormControl, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { first, retry, debounceTime, take } from 'rxjs/operators';
import { SetupService } from 'src/app/shared/services/setup.service';
import { BehaviorSubject } from 'rxjs';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { RecordService } from '../record.service';

@Component({
  selector: 'app-request-consultation',
  templateUrl: './request-consultation.component.html',
  styleUrls: ['./request-consultation.component.scss']
})
export class RequestConsultationComponent implements OnInit, AfterViewInit, OnDestroy {

  requestForm: FormGroup = this.fb.group({
    folderNumber: this.fb.control('A0000001/20', [Validators.required, Validators.minLength(11), Validators.maxLength(12)]),
    fullName: this.fb.control({ value: null, disabled: true }, [Validators.required]),
    age: this.fb.control({ value: 0, disabled: true }, [Validators.required]),
    gender: this.fb.control({ value: null, disabled: true }, [Validators.required]),
    status: this.fb.control({ value: null, disabled: true }, [Validators.required]),
    fundingType: this.fb.control({ value: null, disabled: true }, [Validators.required]),
    sponsorName: this.fb.control({ value: null, disabled: true }, [Validators.required]),
    attendanceDate: this.fb.control(new Date(), [Validators.required]),
    clinic: this.fb.control(null, [Validators.required]),
    consultationService: this.fb.control(null, [Validators.required]),
    orderType: this.fb.control('INTERNAL', [Validators.required]),
    billed: this.fb.control({ value: null, disabled: true }, [Validators.required]),
    memberId: this.fb.control({ value: null, disabled: true }),
    staffId: this.fb.control({ value: null, disabled: true }),
    cardStatus: this.fb.control({ value: null, disabled: true }),
    ccc: this.fb.control({ value: null, disabled: true }, [Validators.minLength(5), Validators.maxLength(5)]),
    qty: this.fb.control({ value: 1, disabled: true }, [Validators.required, Validators.min(1)]),
    fee: this.fb.control({ value: 0.0, disabled: true }, [Validators.required]),
  });

  clinicsloading = new BehaviorSubject(false);
  servicesLoading = new BehaviorSubject(false);
  isLoadingData = false;
  searchInitialized = false;

  clinics = [];
  services = [];
  patient: any;
  message = 'Please enter a valid folder number to fill this form.';

  formatterAge = (value: number) => `${value} yrs`;
  parserAge = (value: string) => value.replace('yrs', '');

  formatFee = (value: number) => `GHC ${value}`;
  parseFee = (value: string) => value.replace('GHC', '');

  formatService = (value: number) => `${value} Svcs`;
  parseService = (value: string) => value.replace('Svcs', '');

  constructor(private readonly fb: FormBuilder,
    private recordService: RecordService,
    private setup: SetupService) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.folderNoControl.valueChanges.pipe(debounceTime(1000), untilComponentDestroyed(this))
      .subscribe(folderNo => {
        if (folderNo && this.folderNoControl.valid) {
          this.getPatient(folderNo);
        } else {
          this.message = 'Please enter a valid folder number to fill this form.';
          this.searchInitialized = false;
        }
      });

    this.clinicControl.valueChanges.pipe(untilComponentDestroyed(this))
      .subscribe((value: number) => {
        this.getClinicServices(value);
      });

    this.serviceControl.valueChanges.pipe(untilComponentDestroyed(this))
      .subscribe((value: number) => {
        // display price of the selected service
        const service = this.services.find(s => s.id === value);
        this.feeControl.patchValue(service.price);
      });
  }

  ngOnDestroy() {

  }

  get folderNoControl(): FormControl {
    return this.requestForm.get('folderNumber') as FormControl;
  }

  get feeControl(): FormControl {
    return this.requestForm.get('fee') as FormControl;
  }

  get qtyControl(): FormControl {
    return this.requestForm.get('qty') as FormControl;
  }

  get clinicControl(): FormControl {
    return this.requestForm.get('clinic') as FormControl;
  }

  get serviceControl(): FormControl {
    return this.requestForm.get('consultationService') as FormControl;
  }

  get billedControl(): FormControl {
    return this.requestForm.get('billed') as FormControl;
  }

  get isFolderAvailable(): boolean {
    return this.folderNoControl.valid && this.patient;
  }

  get ageControl(): FormControl {
    return this.requestForm.get('age') as FormControl;
  }

  get fullNameControl(): FormControl {
    return this.requestForm.get('fullName') as FormControl;
  }

  get genderControl(): FormControl {
    return this.requestForm.get('gender') as FormControl;
  }

  get statusControl(): FormControl {
    return this.requestForm.get('status') as FormControl;
  }

  get fundingTypeControl(): FormControl {
    return this.requestForm.get('fundingType') as FormControl;
  }

  get memberIdControl(): FormControl {
    return this.requestForm.get('memberId') as FormControl;
  }

  get cccControl(): FormControl {
    return this.requestForm.get('ccc') as FormControl;
  }

  get staffIdControl(): FormControl {
    return this.requestForm.get('staffId') as FormControl;
  }

  get sponsorNameControl(): FormControl {
    return this.requestForm.get('sponsorName') as FormControl;
  }

  get attendanceDateControl(): FormControl {
    return this.requestForm.get('attendanceDate') as FormControl;
  }

  get cardStatusControl(): FormControl {
    return this.requestForm.get('cardStatus') as FormControl;
  }

  get isCash(): boolean {
    const fundType = this.fundingTypeControl.value as string;
    if (!fundType) {
      return false;
    }
    return fundType.toLocaleLowerCase().includes('cash') || fundType.toLocaleLowerCase().includes('prepaid');
  }

  get isCoporateInsured(): boolean {
    const fundType = this.fundingTypeControl.value as string;
    if (!fundType) {
      return false;
    }
    if (fundType.toLocaleLowerCase().includes('company') || fundType.toLocaleLowerCase().includes('insurance')) {
      this.billedControl.setValidators(Validators.required);
      this.staffIdControl.setValidators(Validators.required);
      this.staffIdControl.enable();
      this.cardStatusControl.enable();
      this.cardStatusControl.setValidators(Validators.required);
      this.memberIdControl.clearValidators();
      this.memberIdControl.reset();
      this.memberIdControl.disable();
      this.cccControl.clearValidators();
      this.cccControl.disable();
      this.cccControl.reset();
      return true;
    } else {
      return false;
    }
  }

  get isInsurance(): boolean {
    const fundType = this.fundingTypeControl.value as string;
    if (!fundType) {
      return false;
    }
    if (fundType.toLocaleLowerCase().includes('nhis')) {
      this.cardStatusControl.enable();
      this.cardStatusControl.setValidators(Validators.required);
      this.memberIdControl.setValidators(Validators.required);
      this.memberIdControl.enable();
      this.cccControl.setValidators(Validators.required);
      this.cccControl.enable();
      this.staffIdControl.clearValidators();
      this.staffIdControl.reset();
      this.staffIdControl.disable();
      return true;
    } else {
      return false;
    }
  }

  cancel(): void {
    this.patient = null;
    this.searchInitialized = false;
    this.requestForm.reset();
  }

  done(): void {
    this.submitForm();
  }

  submitForm() {
    // todo get data from form and submit .
  }
}
 */
