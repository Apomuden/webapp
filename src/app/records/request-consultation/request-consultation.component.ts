import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { FormControl, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { first, retry, debounceTime } from 'rxjs/operators';
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
    folderNumber: this.fb.control('a0000001/20.', [Validators.required, Validators.minLength(11), Validators.maxLength(12)]),
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
    billed: this.fb.control(null, [Validators.required]),
    memberId: this.fb.control(null),
    staffId: this.fb.control(null),
    cardStatus: this.fb.control(null),
    ccc: this.fb.control(null, [Validators.minLength(5), Validators.maxLength(5)]),
    qty: this.fb.control({ value: 1, disabled: true }, [Validators.required, Validators.min(1)]),
    fee: this.fb.control({ value: 0.7, disabled: true }, [Validators.required]),
  });

  countriesloading = new BehaviorSubject(false);
  titlesLoading = new BehaviorSubject(false);
  isLoadingData = false;
  searchInitialized = false;

  countries = [];
  titles = [];
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
    this.getFolderNoControl.valueChanges.pipe(debounceTime(1000), untilComponentDestroyed(this))
      .subscribe(folderNo => {
        if (folderNo && this.getFolderNoControl.valid) {
          this.getPatient(folderNo);
        } else {
          this.message = 'Please enter a valid folder number to fill this form.';
          this.searchInitialized = false;
        }
      });
  }

  ngOnDestroy() {

  }

  get getFolderNoControl(): FormControl {
    return this.requestForm.get('folderNumber') as FormControl;
  }

  get getFeeControl(): FormControl {
    return this.requestForm.get('fee') as FormControl;
  }

  get getQtyControl(): FormControl {
    return this.requestForm.get('qty') as FormControl;
  }

  get isFolderAvailable(): boolean {
    return this.getFolderNoControl.valid && this.patient;
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
    const clearValidators = () => {
      this.cardStatusControl.clearValidators();
      this.cardStatusControl.reset();
      this.cardStatusControl.disable();
      this.staffIdControl.clearValidators();
      this.staffIdControl.reset();
      this.staffIdControl.disable();
      this.memberIdControl.clearValidators();
      this.memberIdControl.reset();
      this.memberIdControl.disable();
      this.cccControl.clearValidators();
      this.cccControl.reset();
      this.cccControl.disable();
    };
    const fundType = this.fundingTypeControl.value as string;
    if (!fundType) {
      clearValidators();
      return false;
    }
    if (fundType.toLocaleLowerCase().includes('cash') || fundType.toLocaleLowerCase().includes('prepaid')) {
      clearValidators();
      return true;
    } else {
      return false;
    }
  }

  get isCoporateInsured(): boolean {
    const fundType = this.fundingTypeControl.value as string;
    if (!fundType) {
      return false;
    }
    if (fundType.toLocaleLowerCase().includes('company') || fundType.toLocaleLowerCase().includes('insurance')) {
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

  getPatient(folderNo: string) {
    this.isLoadingData = true;
    this.searchInitialized = true;
    this.recordService.getAllPatients(`/single?folder_no=${folderNo}`).pipe(first())
      .subscribe(data => {
        this.isLoadingData = false;
        if (data.data) {
          this.patient = data.data;
          this.appendToForm();
        } else {
          this.message = 'Folder not found';
          this.searchInitialized = false;
        }
      }, e => {
        this.message = 'Folder not found';
        this.searchInitialized = false;
      });
  }

  appendToForm() {
    this.ageControl.patchValue(this.calculateAge(this.patient.dob));
    this.fullNameControl.patchValue(`${this.patient.firstname} ${this.patient.middlename} ${this.patient.surname}`);
    this.genderControl.patchValue(this.patient.gender);
    this.statusControl.patchValue(this.patient.reg_status);
    this.fundingTypeControl.patchValue(this.patient.funding_type_name);
    this.sponsorNameControl.patchValue(this.patient.sponsorship_type_name);
  }

  calculateAge(birthday: string) {
    const ageDifMs = Date.now() - new Date(birthday).getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }

  validateForm(): boolean {
    for (const i of Object.keys(this.requestForm.controls)) {
      this.requestForm.controls[i].markAsDirty();
      this.requestForm.controls[i].updateValueAndValidity();
    }

    return this.requestForm.valid;
  }

  done(): void {
    if (this.validateForm()) {
      this.submitForm();
    }
  }

  submitForm() {
    // todo get data from form and submit .
  }
}
