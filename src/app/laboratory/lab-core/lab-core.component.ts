import { Component, OnInit, Input, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { User } from 'src/app/shared/interfaces/user.type';
import { LaboratoryService } from '../services/laboratory.service';
import { LabSetupService } from 'src/app/shared/services/lab-setup.service';
import { NzNotificationService } from 'ng-zorro-antd';
import { formatDate } from '@angular/common';

enum OperationStatus {
  success,
  error,
  loading
}

@Component({
  selector: 'app-lab-core',
  templateUrl: './lab-core.component.html',
  styles: []
})
export class LabCoreComponent implements OnInit, AfterViewInit {

  sampleTypeCtrl = this.fb.control(null, [Validators.required]);

  isInProgress = true;

  @Input() patient: any;
  @Input() labRequest: any;
  @Input() consultation: any;
  @Input() user: User;

  @Output() didPause: EventEmitter<any> = new EventEmitter();

  labParams: any[];
  sampleTypes: any[];
  sample: any;
  results: any[];

  constructor(
    private fb: FormBuilder,
    private labService: LaboratoryService,
    private labSetupService: LabSetupService,
    private notificationS: NzNotificationService,
  ) { }

  ngOnInit() { }

  ngAfterViewInit() {
    this.initLabForm();
  }

  async initLabForm() {
    try {
      if (this.labRequest.status === 'IN-QUEUE') {
        this.sampleTypes = await this.labSetupService.getLabSampleTypes(this.labRequest.service_id)
          .toPromise();
      } if (this.labRequest.status === 'SAMPLE-TAKEN') {
        this.labService.getSample(this.labRequest)
          .subscribe(sample => this.sample = sample, error => console.log(error));
        this.labParams = await this.processParams();
      } else if (this.labRequest.status === 'RESULTS-TAKEN' || this.labRequest.status === 'APPROVED') {
        this.results = await this.labService.getLabResults(this.labRequest.id).toPromise();
      }
    } catch (e) {
      this.pause();
    }
    this.isInProgress = false;
  }

  async processParams(): Promise<any[]> {
    const params = await this.labSetupService.getLabParams(this.labRequest.service_id)
      .toPromise();
    const temp = [];
    params.forEach((param, index) => {
      param.form = this.fb.control(null);
      if (param.value_type === 'Text') {
        param.loading = true;
        this.labSetupService.getParamFlags(param.id)
          .subscribe((flags: any[]) => {
            param.flags = flags.filter(flag => flag.isActivated);
            param.loading = false;
          });
      }
      if (index % 2 === 0) {
        temp.push([param]);
      } else {
        temp[index - temp.length].push(param);
      }
    });
    return temp;
  }

  pause() {
    this.patient = null;
    this.labRequest = null;
    this.didPause.emit();
  }

  async cancel() {
    this.isInProgress = true;
    try {
      await this.labService.updateLabRequest(this.labRequest.id, {
        status: 'CANCELLED',
        canceller_id: this.user.details.id,
        cancelled_date: formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss', 'en')
      }).toPromise();
      this.didPause.emit();
      this.showNotification(OperationStatus.success);
    } catch {
      this.showNotification(OperationStatus.error);
    }
    this.isInProgress = false;
  }

  async approve() {
    this.isInProgress = true;
    try {
      this.labRequest = await this.labService.updateLabRequest(this.labRequest.id, {
        status: 'APPROVED',
        approver_id: this.user.details.id,
        approval_date: formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss', 'en')
      }).toPromise();
      this.showNotification(OperationStatus.success);
    } catch {
      this.showNotification(OperationStatus.error);
    }
    this.isInProgress = false;
  }

  async generateSample() {
    this.isInProgress = true;
    this.showNotification(OperationStatus.loading);
    try {
      const sampleCode = await this.labService.newSampleCode(this.labRequest.id, this.sampleTypeCtrl.value)
        .toPromise();
      this.sample = await this.labService.createSample(this.sampleData(sampleCode))
        .toPromise();
      this.labRequest = await this.labService.updateLabRequest(this.labRequest.id, { status: 'SAMPLE-TAKEN' })
        .toPromise();
      this.labParams = await this.processParams();
      this.isInProgress = false;
    } catch (e) {
      this.showNotification(OperationStatus.error);
    }
  }

  sampleData(sampleCode: string) {
    return {
      sample_code: sampleCode,
      lab_sample_type_id: this.sampleTypeCtrl.value,
      investigation_id: this.labRequest.id,
      technician_id: this.user.details.id,
    };
  }

  async submitResults() {
    this.isInProgress = true;
    try {
      this.results = await this.labService.saveLabResults(this.processResults()).toPromise();
      this.labRequest = await this.labService.updateLabRequest(this.labRequest.id, {
        status: 'RESULTS-TAKEN',
        test_date: formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss', 'en')
      })
        .toPromise();
    } catch (e) {
      this.showNotification(OperationStatus.error);
    }
    this.isInProgress = false;
  }

  processResults() {
    const data = {
      investigation_id: this.labRequest.id,
      results: [],
      technician_id: this.user.details.id,
      patient_status: this.labRequest.patient_status
    };
    this.labParams.forEach((params: any[]) => {
      params.forEach(param => {
        data.results.push({
          lab_parameter_id: param.id,
          test_value: param.form.value
        });
      });
    });
    return data;
  }

  resultFormValid() {
    const valid = this.labParams.reduce((previous: any[], current: any[]) => {
      const preValid = previous.reduce((prev, cur) => prev.form.valid && cur.form.valid);
      const curValid = current.reduce((prev, cur) => prev.form.valid && cur.form.valid);
      return preValid && curValid;
    });
    return valid;
  }

  showNotification(status: OperationStatus) {
    switch (status) {
      case OperationStatus.success:
        this.notificationS.success('Success', 'The request completed successfully');
        break;
      case OperationStatus.loading:
        this.notificationS.blank('Loading', 'Please wait');
        break;
      default:
        this.notificationS.error('Error', 'Could not proceess request');
        break;
    }
  }
}
