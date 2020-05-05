import { AccountService } from './../services/account.service';
import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { FormControl, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { first, retry, debounceTime, take } from 'rxjs/operators';
import { SetupService } from 'src/app/shared/services/setup.service';
import { BehaviorSubject } from 'rxjs';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { RecordService } from '../../records/record.service';
import { NzNotificationService } from 'ng-zorro-antd';
import * as dateFns from 'date-fns';
import { formatDate } from '@angular/common';
import * as datefns from 'date-fns';

@Component({
  selector: 'app-discount',
  templateUrl: './discount.component.html',
  styleUrls: ['./discount.component.css']
})
export class DiscountComponent implements OnInit, AfterViewInit, OnDestroy {
  editName: string | null;
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

  appliesToReasonControl = this.fb.control(null);

  balanceDueControl = this.fb.control(null);
  isLoadingData = false;
  searchInitialized = false;
  requesting = false;
  serviceOrdersLoading = false;
  services = [];
  transactionDetails;
  submiting = false;


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
      id: 0,
      sponsorship_type_name: 'Patient'
    }
  };
  displayData;
  indeterminate = false;
  sponsorPermits = [this.patientSponsor];
  servicePrice: any;
  allChecked = true;
  ageUnit = 'year(s)';
  formatFee = (value: number) => `GHC ${value}`;
  parseFee = (value: string) => value.replace('GHC', '');


  constructor(private readonly fb: FormBuilder,
    private recordService: RecordService,
    private notification: NzNotificationService,
    private accountService: AccountService
  ) {
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


  }

  ngOnDestroy() { }

  get folderNoControl(): FormControl {
    return this.requestForm.get('folderNumber') as FormControl;
  }


  get attendanceDateControl(): FormControl {
    return this.requestForm.get('attendanceDate') as FormControl;
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
          this.getServiceOrdersForPatient(this.patient.id);
        } else {
          this.message = 'Folder not found';
          this.searchInitialized = false;
        }
      }, e => {
        this.message = 'Folder not found';
        this.searchInitialized = false;
      });
  }

  async getServiceOrdersForPatient(patientId) {
    this.serviceOrdersLoading = true;
    try {
      const response = await this.accountService.getServiceOrdersForPatient(patientId);
      response.data.services.forEach(item => {
        item.checked = true;
        item.amount = item.total_amount;
        item.disabled = false;
      });
      this.services = response.data.services ? response.data.services : [];
      const otherDetails = JSON.parse(JSON.stringify(response.data));
      delete otherDetails.services;
      this.transactionDetails = otherDetails;

    } catch (e) {
      this.serviceOrdersLoading = false;
      console.log(e);
    } finally {
      this.serviceOrdersLoading = false;
    }


  }

  startEdit(name: string, event: MouseEvent): void {
    if (this.submiting) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    this.editName = name;
  }

  finishEdit(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.editName = null;
  }
  disabledDate(current: Date): boolean {
    if (!current) {
      return false;
    }
    // can only select days before today
    return dateFns.isAfter(current, new Date());
  }






  compareFn(c1: any, c2: any): boolean {
    return c1 === c2;
  }

  appendToForm() {
    let age = datefns.differenceInCalendarYears(new Date(), new Date(this.patient.dob));
    if (age < 1) {
      age = datefns.differenceInMonths(new Date(), new Date(this.patient.dob));
      this.ageUnit = 'month(s)';
      if (age < 1) {
        age = datefns.differenceInCalendarDays(new Date(), new Date(this.patient.dob));
        this.ageUnit = 'day(s)';
      }
    }
    this.patient.age = age;

  }

  cancel(): void {
    this.patient = null;
    this.sponsorPermits = [this.patientSponsor];
    this.searchInitialized = false;
    this.requestForm.reset();
    this.requestForm.get('orderType').setValue('INTERNAL');
    this.attendanceDateControl.setValue(new Date());
  }



  done(): void {
    // if (this.amountRecievedFormControl.value && this.amountRecievedFormControl.valid) {
    //   this.submitForm();
    // } else {
    //   console.log('Invalid data');
    // }
  }

  async submitForm() {
    this.requesting = true;
    const data = this.processData();
    console.log(data);
    try {
      const response = await this.accountService.createEreceipt(data);
      console.log(response);
      this.requesting = false;
      this.notification.success('Success', 'E-receipt creation was successful');
    } catch (e) {
      console.log(e);
      this.requesting = false;
      this.notification.error('Error', 'Unable to create E-receipt');
    } finally {
      this.requesting = false;
    }
  }

  processData() {
    // return {
    //   patient_id: this.patient.id,
    //   patient_status: this.patient.reg_status,
    //   services: this.services.filter(item => item.checked).map(item => ({ transaction_update_id: item.transaction_update_id })),
    //   outstanding_bill: this.services
    //     .filter(item => !item.checked)
    //     .reduce(((accumulator, currentValue) => accumulator + parseFloat(currentValue.total_amount)), 0.00),
    //   total_bill: this.billDueControl.value,
    //   amount_paid: this.amountRecievedFormControl.value
    // };
  }
}