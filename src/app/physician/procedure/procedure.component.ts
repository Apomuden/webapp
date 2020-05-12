import { RecordService } from './../../records/record.service';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { BehaviorSubject } from 'rxjs';
import { PhysicianService } from './../services/physician.service';
import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd';
import { SetupService } from 'src/app/shared/services/setup.service';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { first, takeUntil } from 'rxjs/operators';
import { formatDate } from '@angular/common';
import * as moment from 'moment';
import { ConsultationData } from '../consultation/model/consultation-data.model';

@Component({
  selector: 'app-procedure',
  templateUrl: './procedure.component.html',
  styleUrls: ['./procedure.component.css']
})
export class ProcedureComponent implements OnInit {
  @Input() consultation: any;
  @Input() patient: any;
  @Input() userId: any;
   // consultation data for holding child component data states
   @Input() consultationData: ConsultationData;
  @Output() nextClicked: EventEmitter<any> = new EventEmitter();
  @Output() previousClicked: EventEmitter<any> = new EventEmitter();
  consultationDate = formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss', 'en');
  submiting = false;
  isLoading = true;
  categoriesLoading = new BehaviorSubject(false);
  servicesLoading = new BehaviorSubject(false);
  sponsorLoading = false;
  totalPrepaid = 0;
  totalPostpaid = 0;
  categories = [];
  services = [];
  permit: any;
  prepaidCashFundingTypeId;
  procedureKey = 0;
  requestForm: FormGroup = this.fb.group({
    category: this.fb.control(null, [Validators.required]),
    service_id: this.fb.control(null, [Validators.required]),
    order_type: this.fb.control('INTERNAL', [Validators.required]),
    sponsor_id: this.fb.control(0, [Validators.required]),
    ccc: this.fb.control(null, [Validators.minLength(5), Validators.maxLength(5)]),
    qty: this.fb.control({ value: 1, disabled: true }, [Validators.required, Validators.min(1)]),
    fee: this.fb.control({ value: 0.0, disabled: true }, [Validators.required, Validators.min(0.1)]),
  });
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
  sponsorPermits = [this.patientSponsor];
  servicePrice: any;
  previousProcedures = null;
  formatFee = (value: number) => `GHC ${value}`;
  parseFee = (value: string) => value.replace('GHC', '');
  constructor(
    private physicianService: PhysicianService,
    private fb: FormBuilder,
    private setup: SetupService,
    private recordService: RecordService,
    private notification: NzNotificationService
  ) { }

  ngOnInit() {
    this.getHospitalServices();
    this.getPatientSponsorPermits(this.patient.id);
    this.getProcedures(this.patient.id);
    this.categoryControl.valueChanges.subscribe(
      val => {
        if (val) {
          this.resetForm();
          this.getServices(val);
        }
      }
    );
    this.billedControl.valueChanges
      .subscribe(_ => {
        this.setPrice();
      });

    this.serviceControl.valueChanges
      .subscribe((service_id: number) => {
        // display price of the selected service
        if (service_id) {
          this.getPrice(service_id);
        }
      });
    this.setup.getFundingTypes().pipe(first()).subscribe(
      res => {
        this.prepaidCashFundingTypeId = res.data.find(fundingType => fundingType.name === 'Cash/Prepaid').id;
      }
    );
  }

  getPatientSponsorPermits(id: number) {
    this.sponsorLoading = true;
    this.recordService.getPatientSponsors(id)
      .pipe(first()).subscribe(res => {
        if (res && res.data) {
          this.sponsorPermits.push(...res.data);
        }
        this.sponsorLoading = false;
      }, error => {
      });
  }

  getProcedures(patientId: number) {
    this.physicianService.getProcedures(patientId).pipe(first())
      .subscribe((procedures: any[]) => {
        this.previousProcedures = [];
        procedures = procedures.reverse();
        procedures.forEach(invstgtn => {
          if (!this.previousProcedures.find(pe => moment(pe.consultation_date).isSame(invstgtn.consultation_date, 'day'))) {
            this.previousProcedures.push({
              attendance_date: invstgtn.consultation_date,
              procedure: procedures.filter(e => moment(e.consultation_date).isSame(invstgtn.consultation_date, 'day'))
            });
          }
        });
        this.isLoading = false;
      }, e => { console.log(e); this.isLoading = false; });
  }

  compareFn(c1: any, c2: any): boolean {
    return c1 === c2;
  }
  addProcedure() {
    if (this.requestForm.valid) {
      const serviceId = this.requestForm.get('service_id').value;
      const serviceValue = this.services.filter(service => service.id === serviceId)[0].description;
      const sponsorId = this.requestForm.get('sponsor_id').value;
      const sponsorValue = this.sponsorPermits.filter(sponsor => sponsor.id === sponsorId)[0].billing_sponsor_name;
      const billingSponsorId = (this.sponsorPermits.filter(sponsor => sponsor.id === sponsorId)[0] as any).billing_sponsor_id;

      const { fee: unitFee } = this.requestForm.getRawValue();
      if (billingSponsorId) {
          this.consultationData.procedures = [...this.consultationData.procedures, {
          ...this.requestForm.value, serviceValue, key: this.procedureKey, unitFee, sponsorValue, billing_sponsor_id: billingSponsorId
        }];
      } else {
        this.consultationData.procedures = [this.consultationData.procedures, {
          ...this.requestForm.value, serviceValue, key: this.procedureKey, unitFee, sponsorValue,
          funding_type_id: this.prepaidCashFundingTypeId
        }];
      }

      this.procedureKey++;
      this.calculateTotals();
      this.resetForm();
    } else {
      this.notification.error('Error', 'Fill required fields');
    }
  }
  submit() {
    const procedureItems = JSON.parse(JSON.stringify(this.consultationData.procedures));
    procedureItems.forEach(item => {
      delete item.serviceValue;
      delete item.unitFee;
      delete item.sponsorValue;
      delete item.category;
      delete item.key;
      delete item.sponsor_id;
    });
    const data = {
      consultation_id: this.consultation.id,
      patient_status: this.consultation.patient_status,
      consultation_date: this.consultationDate,
      consultant_id: this.userId,
      procedures: procedureItems
    };

    this.physicianService.saveInvestigations(data).pipe(first())
      .subscribe(res => {
        if (res && (res.errorCode === '000')) {
          this.consultationData.procedures = [];
          this.procedureKey = 0;
          this.nextClicked.emit(res.data);
        }
        this.submiting = false;
      }, error => {
        this.submiting = false;
        this.notification.error('Error', 'Unable to proceed');
      });
  }

  getAge() {
    return moment().diff(moment(this.patient.dob, 'YYYY-MM-DD'), 'years');
  }
  deleteItem(item) {
    this.consultationData.procedures = this.consultationData.procedures.filter(d => d.key !== item.key);
  }

  calculateTotals() {
    this.totalPostpaid = 0;
    this.totalPrepaid = 0;
    this.consultationData.procedures.forEach(procedure => {
      if (procedure.sponsorValue === 'Patient') {
        this.totalPrepaid += procedure.unitFee;
      } else {
        this.totalPostpaid += procedure.unitFee;
      }
    });
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


  get feeControl(): FormControl {
    return this.requestForm.get('fee') as FormControl;
  }

  get qtyControl(): FormControl {
    return this.requestForm.get('qty') as FormControl;
  }

  get categoryControl(): FormControl {
    return this.requestForm.get('category') as FormControl;
  }

  get serviceControl(): FormControl {
    return this.requestForm.get('service_id') as FormControl;
  }

  get billedControl(): FormControl {
    return this.requestForm.get('sponsor_id') as FormControl;
  }

  get cccControl(): FormControl {
    return this.requestForm.get('ccc') as FormControl;
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
  private setPrice() {
    if (!this.servicePrice) {
      return;
    }
    if (this.requestForm.get('sponsor_id').invalid) {
      this.requestForm.get('fee').setValue(0);
      return;
    } else if (this.isCash) {
      this.feeControl.patchValue(this.servicePrice.prepaid_amount);
    } else {
      this.feeControl.patchValue(this.servicePrice.postpaid_amount);
    }
  }
  getPrice(service_id: any) {
    this.setup.getServicePrice(service_id).pipe(first())
      .subscribe(servicePrice => {
        this.servicePrice = servicePrice;
        this.setPrice();
      });
  }
  private getHospitalServices() {
    this.categoriesLoading.next(true);
    this.setup.getHospitalServices().subscribe(
      res => {
        const procedureService = res.data.find(service => service.name === 'Surgery');
        this.getCategories(procedureService);
      }
    );
  }
  private getCategories(procedureService) {
    this.setup.getServiceCategoriesByHospitalService(procedureService.id).subscribe(
      res => {
        this.categories = res.data;
        this.categoriesLoading.next(false);

      }
    );
  }
  resetForm() {
    this.requestForm.get('service_id').reset();
    this.requestForm.get('order_type').reset();
    this.requestForm.get('sponsor_id').reset();
    this.requestForm.get('fee').patchValue(0.0);

  }

  private getServices(categoryId) {
    this.servicesLoading.next(true);
    this.setup.genericGet(`pricing/services?service_category_id==${categoryId}`).subscribe(
      res => {
        this.services = res;
        this.servicesLoading.next(false);
      }
    );
  }

  previous() {
    this.previousClicked.emit();
  }
}
