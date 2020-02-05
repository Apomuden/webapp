import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { FormControl, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { first, retry, debounceTime, take } from 'rxjs/operators';
import { SetupService } from 'src/app/shared/services/setup.service';
import { BehaviorSubject } from 'rxjs';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { RecordService } from '../record.service';
import { NzNotificationService } from 'ng-zorro-antd';

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
    ccc: this.fb.control({ value: null, disabled: true }, [Validators.minLength(5), Validators.maxLength(5)]),
    qty: this.fb.control({ value: 1, disabled: true }, [Validators.required, Validators.min(1)]),
    fee: this.fb.control({ value: 0.0, disabled: true }, [Validators.required]),
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

  formatFee = (value: number) => `GHC ${value}`;
  parseFee = (value: string) => value.replace('GHC', '');

  formatService = (value: number) => `${value} Svcs`;
  parseService = (value: string) => value.replace('Svcs', '');

  constructor(private readonly fb: FormBuilder,
    private recordService: RecordService,
    private notificationS: NzNotificationService,
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
        if (value) {
          const service = this.services.find(s => s.id === value);
          if (service) {
            this.feeControl.patchValue(service.price);
          }
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

  getPatientSponsorPermits(id: number) {
    this.recordService.getPatientSponsors(id)
      .pipe(first()).subscribe(res => {
        if (res && res.data) {
          this.sponsorPermits.push({
            billing_sponsor_name: 'Patient',
            id: 0,
            card_serial_no: null,
            member_id: null,
            staff_id: null,
            billing_sponsor: {
              sponsorship_type_name: 'Patient'
            }
          }, ...res.data);
        } else {
          this.sponsorPermits.push({
            billing_sponsor_name: 'Patient',
            id: 0,
            billing_sponsor: {
              sponsorship_type_name: 'Patient'
            }
          });
        }
      }, error => {
      });
  }

  getClinics() {
    this.clinicsloading.next(true);
    this.setup.getClinics().pipe(first())
      .subscribe(data => {
        this.clinics = data.data;
        this.clinicsloading.next(false);
      }, error => {
        this.clinicsloading.next(false);
      });
  }

  getClinicServices(clinicId: number) {
    this.servicesLoading.next(true);
    this.setup.getServicesByClinic(clinicId).pipe(first())
      .subscribe(data => {
        this.services = data.data;
        this.servicesLoading.next(false);
      }, error => {
        this.servicesLoading.next(false);
      });
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
    this.searchInitialized = false;
    this.requestForm.reset();
  }

  done(): void {
    this.submitForm();
  }

  submitForm() {
    this.requesting = true;
    const data = this.processData();
    console.log(data);
    this.recordService.requestConsultation(data)
      .subscribe(res => {
        this.requesting = false;
        this.notificationS.success('Success',
          `Successfully requested consultation for ${this.patient.folder_no}`);
        this.cancel();
        console.log(res);
      }, error => {
        this.requesting = false;
        this.notificationS.error('Oops',
          `Failed to request consultation for ${this.patient.folder_no}`);
        console.log(error);
      });
  }

  processData() {
    return {
      order_type: this.requestForm.get('orderType').value as string,
      service_quantity: this.qtyControl.value as number,
      service_fee: this.feeControl.value,
      age: this.patient.age,
      patient_id: this.patient.id,
      consultation_service_id: this.serviceControl.value as number,
      funding_type_id: this.patient.funding_type_id,
      sponsorship_type: this.permit.billing_sponsor.sponsorship_type_name,
      ccc: this.cccControl.value,
      patient_status: this.patient.reg_status,
      billing_sponsor_id: (this.billedControl.value === 0) ? null : this.billedControl.value,
      attendance_date: this.formatDate(this.attendanceDateControl.value),
      card_serial_no: this.permit.card_serial_no,
      member_id: this.permit.member_id,
      staff_id: this.permit.staff_id,
    };
  }

  formatDate(date: Date): string {
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
}
