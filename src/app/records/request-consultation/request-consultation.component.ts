import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { FormControl, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { first, retry, debounceTime, take } from 'rxjs/operators';
import { SetupService } from 'src/app/shared/services/setup.service';
import { BehaviorSubject } from 'rxjs';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { RecordService } from '../record.service';
import { NzNotificationService } from 'ng-zorro-antd';
import * as dateFns from 'date-fns';

@Component({
  selector: 'app-request-consultation',
  templateUrl: './request-consultation.component.html',
  styleUrls: ['./request-consultation.component.scss']
})
export class RequestConsultationComponent implements OnInit, AfterViewInit, OnDestroy {

  requestForm: FormGroup = this.fb.group({
    folderNumber: this.fb.control(null, [Validators.minLength(11), Validators.maxLength(12)]),
    attendanceDate: this.fb.control(new Date(), [Validators.required]),
    clinic: this.fb.control(null, [Validators.required]),
    consultationService: this.fb.control(null, [Validators.required]),
    orderType: this.fb.control('INTERNAL', [Validators.required]),
    billed: this.fb.control(0, [Validators.required]),
    ccc: this.fb.control(null, [Validators.minLength(5), Validators.maxLength(5)]),
    qty: this.fb.control({ value: 1, disabled: true }, [Validators.required, Validators.min(1)]),
    fee: this.fb.control({ value: 0.0, disabled: true }, [Validators.required, Validators.min(0.1)]),
  });

  clinicsloading = new BehaviorSubject(false);
  servicesLoading = new BehaviorSubject(false);
  isLoadingData = false;
  searchInitialized = false;
  requesting = false;

  clinics = [];
  sponsorPermits = [];
  services = [];
  patient: any;
  message = 'Please enter a valid folder number to fill this form.';
  permit: any;

  patientSponsor = {
    billing_sponsor_name: 'Patient',
    id: 0,
    card_serial_no: null,
    member_id: null,
    staff_id: null,
    billing_sponsor: {
      sponsorship_type_name: 'Patient'
    }
  };
  servicePrice: any;
  formatFee = (value: number) => `GHC ${value}`;
  parseFee = (value: string) => value.replace('GHC', '');

  constructor(private readonly fb: FormBuilder,
    private recordService: RecordService,
    private notificationS: NzNotificationService,
    private setupService: SetupService) {
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

    this.billedControl.valueChanges.pipe(untilComponentDestroyed(this))
      .subscribe(_ => {
        this.setPrice();
      });

    this.serviceControl.valueChanges.pipe(untilComponentDestroyed(this))
      .subscribe((service_id: number) => {
        // display price of the selected service
        if (service_id) {
          this.getPrice(service_id);
        }
      });
  }

  ngOnDestroy() { }

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

  get cccControl(): FormControl {
    return this.requestForm.get('ccc') as FormControl;
  }

  get attendanceDateControl(): FormControl {
    return this.requestForm.get('attendanceDate') as FormControl;
  }

  get isInsurance(): boolean {
    const id = this.billedControl.value as number;
    const sponsorPermit = this.getSelectedSponsorPermit(id); // TODO: change to the billed sponsor value
    if (!sponsorPermit) {
      this.cccControl.disable();
      this.cccControl.reset();
      this.cccControl.clearValidators();
      return false;
    }
    const sponsorType = sponsorPermit.billing_sponsor.sponsorship_type_name;
    if (sponsorType.toLocaleLowerCase() === 'government insurance') {
      this.cccControl.setValidators([Validators.required, Validators.minLength(5), Validators.maxLength(5)]);
      this.cccControl.enable();
      return true;
    } else {
      this.cccControl.disable();
      this.cccControl.reset();
      this.cccControl.clearValidators();
      return false;
    }
  }

  get isCash(): boolean {
    const id = this.billedControl.value as number;
    const sponsorPermit = this.getSelectedSponsorPermit(id); // TODO: change to the billed sponsor value
    if (!sponsorPermit) {
      return false;
    }
    const sponsorType = sponsorPermit.billing_sponsor.sponsorship_type_name;
    return sponsorType.toLocaleLowerCase() === 'patient';
  }

  private getSelectedSponsorPermit(value: number) {
    const permit = this.sponsorPermits.find(sp => sp.id === value);
    this.permit = permit;
    if (!permit) {
      return null;
    }
    return permit;
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
          this.getPatientSponsorPermits(this.patient.id);
          this.getClinics();
        } else {
          this.message = 'Folder not found';
          this.searchInitialized = false;
        }
      }, e => {
        this.message = 'Folder not found';
        this.searchInitialized = false;
      });
  }

  disabledDate(current: Date): boolean {
    if (!current) {
      return false;
    }
    // can only select days before today
    return dateFns.isAfter(current, new Date());
  }

  getPatientSponsorPermits(id: number) {
    this.sponsorPermits = [];
    this.recordService.getPatientSponsors(id)
      .pipe(first()).subscribe(res => {
        if (res && res.data) {
          this.sponsorPermits.push(this.patientSponsor, ...res.data);
        } else {
          this.sponsorPermits.push(this.patientSponsor);
        }
      }, error => {
      });
  }

  getClinics() {
    this.clinicsloading.next(true);
    this.setupService.getClinics().pipe(first())
      .subscribe(data => {
        this.clinics = data.data;
        this.clinicsloading.next(false);
      }, error => {
        this.clinicsloading.next(false);
      });
  }

  getClinicServices(clinicId: number) {
    this.servicesLoading.next(true);
    this.setupService.getServicesByClinic(clinicId).pipe(first())
      .subscribe(data => {
        this.services = data.data;
        this.servicesLoading.next(false);
      }, error => {
        this.servicesLoading.next(false);
      });
  }

  getPrice(service_id: any) {
    this.requesting = true;
    this.setupService.getServicePrice(service_id).pipe(first())
      .subscribe(servicePrice => {
        this.servicePrice = servicePrice;
        this.requesting = false;
        this.setPrice();
      });
  }

  private setPrice() {
    if (!this.servicePrice) {
      return;
    }
    if (this.isCash) {
      this.feeControl.patchValue(this.servicePrice.prepaid_amount);
    } else {
      this.feeControl.patchValue(this.servicePrice.postpaid_amount);
    }
  }

  compareFn(c1: any, c2: any): boolean {
    return c1 === c2;
  }

  appendToForm() {
    const age = this.calculateAge(this.patient.dob);
    this.patient.age = age;
    if (this.patient.sponsorship_type_name !== 'Patient') {
      this.billedControl.reset();
    }
  }

  calculateAge(birthday: string) {
    const ageDifMs = Date.now() - new Date(birthday).getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }

  cancel(): void {
    this.patient = null;
    this.sponsorPermits = [];
    this.sponsorPermits.push(this.patientSponsor);
    this.searchInitialized = false;
    this.requestForm.reset();
    this.requestForm.get('orderType').setValue('INTERNAL');
    this.billedControl.setValue(0);
    this.feeControl.setValue(0);
    this.qtyControl.setValue(0);
    this.attendanceDateControl.setValue(new Date());
  }

  private validateForm(): boolean {
    if (this.requestForm.valid) {
      return true;
    }
    for (const i of Object.keys(this.requestForm.controls)) {
      if (this.requestForm.controls[i].invalid) {
        this.requestForm.controls[i].markAsDirty();
        this.requestForm.controls[i].updateValueAndValidity();
      }
    }
    return this.requestForm.valid;
  }

  done(): void {
    if (this.validateForm()) {
      this.submitForm();
    }
  }

  submitForm() {
    this.requesting = true;
    const data = this.processData();
    this.recordService.requestConsultation(data)
      .subscribe(res => {
        this.requesting = false;
        this.notificationS.success('Success',
          `Successfully requested consultation for ${this.patient.folder_no}`);
        this.cancel();
      }, error => {
        this.requesting = false;
        this.notificationS.error('Oops',
          `Failed to request consultation for ${this.patient.folder_no}. Consultation has probably been requested already.`);
        console.log(error);
      });
  }

  processData() {
    console.log(this.formatDateTime(this.attendanceDateControl.value));
    return {
      order_type: this.requestForm.get('orderType').value as string,
      service_quantity: this.qtyControl.value as number,
      service_fee: this.feeControl.value,
      age: this.patient.age,
      patient_id: this.patient.id,
      clinic_id: this.clinicControl.value as number,
      consultation_service_id: this.serviceControl.value as number,
      funding_type_id: this.patient.funding_type_id,
      sponsorship_type: this.permit.billing_sponsor.sponsorship_type_name,
      ccc: this.cccControl.value,
      patient_status: this.patient.reg_status,
      patient_sponsor_id: (this.billedControl.value === 0) ? null : this.billedControl.value,
      billing_sponsor_id: (this.billedControl.value === 0) ? null :
        this.getSelectedSponsorPermit(this.billedControl.value).billing_sponsor.id,
      attendance_date: this.formatDateTime(this.attendanceDateControl.value),
      card_serial_no: this.permit.card_serial_no,
      member_id: this.permit.member_id,
      staff_id: this.permit.staff_id,
    };
  }

  formatDateTime(date: Date): string {
    if (!date) {
      return null;
    }
    let minute = '' + (date.getUTCMinutes());
    let hour = '' + (date.getUTCHours());
    let seconds = '' + (date.getUTCSeconds());
    let month = '' + (date.getMonth() + 1);
    let day = '' + date.getDate();
    const year = date.getFullYear();

    if (minute.length < 2) {
      minute = '0' + minute;
    }
    if (hour.length < 2) {
      hour = '0' + hour;
    }
    if (seconds.length < 2) {
      seconds = '0' + seconds;
    }
    if (month.length < 2) {
      month = '0' + month;
    }
    if (day.length < 2) {
      day = '0' + day;
    }
    return `${[year, month, day].join('-')} ${[hour, minute, seconds].join(':')}`;
  }
}
