import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef, HostListener, enableProdMode } from '@angular/core';
import { Validators, FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { debounceTime, first } from 'rxjs/operators';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { NzInputDirective, NzNotificationService, NzInputGroupComponent, NzModalRef, NzModalService } from 'ng-zorro-antd';
import * as datefns from 'date-fns';
import { formatDate } from '@angular/common';
import { UserManagementService } from 'src/app/user-management/user-management.service';
import { PhysicianService } from 'src/app/physician/services/physician.service';
import { OpdService } from 'src/app/opd/services/opd.service';
import { LaboratoryService } from '../services/laboratory.service';
import { LabSetupService } from 'src/app/shared/services/lab-setup.service';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { User } from 'src/app/shared/interfaces/user.type';

@Component({
  selector: 'app-lab',
  templateUrl: './lab.component.html',
  styleUrls: ['./lab.component.css']
})
export class LabComponent implements OnInit, OnDestroy, AfterViewInit {
  today: string;
  editName: string | null;
  @ViewChild(NzInputDirective, { static: false, read: ElementRef }) inputElement: ElementRef;

  folderNumb = this.fb.control(null, [Validators.minLength(11), Validators.maxLength(12)]);
  sampleTypeCtrl = this.fb.control(null, [Validators.required]);

  doctorsModalVisible = false;
  doctorsLoading = false;
  isLoadingData = false;
  searchInitialized = false;
  submiting = false;
  isCreatingSample = false;
  isAssigning = false;

  patient: any;
  message = 'Please enter a valid folder number to fill this form.';
  labRequest: any;
  consultation: any;
  labParams: any[];
  sampleTypes: any[];
  sample: any;
  user: User;
  results: any;

  constructor(
    private fb: FormBuilder,
    private opdService: OpdService,
    private labService: LaboratoryService,
    private labSetupService: LabSetupService,
    private physicianService: PhysicianService,
    private authService: AuthenticationService,
    private notificationS: NzNotificationService,
  ) { }


  private get folderNoControl(): FormControl {
    return this.folderNumb as FormControl;
  }

  ngOnInit() {
    this.user = this.authService.currentUserValue;
    //TODO change
    this.today = formatDate(datefns.startOfYesterday(), 'yyyy-MM-dd', 'en');
  }

  ngAfterViewInit() {
    this.folderNoControl.valueChanges.pipe(debounceTime(1000), untilComponentDestroyed(this))
      .subscribe(folderNo => {
        if (folderNo && this.folderNoControl.valid) {
          this.initLabForm(folderNo);
        } else {
          this.message = 'Please enter a valid folder number to fill this form.';
          this.searchInitialized = false;
        }
      });
    this.folderNoControl.setValue('a0000034/20');
  }

  ngOnDestroy() { }

  @HostListener('window:click', ['$event'])
  handleClick(e: MouseEvent): void {
    if (this.editName && this.inputElement && this.inputElement.nativeElement !== e.target) {
      this.editName = null;
    }
  }

  async initLabForm(folderNo: string) {
    this.isLoadingData = true;
    this.searchInitialized = true;
    try {
      this.patient = await this.opdService.getPatient(folderNo).toPromise();
      this.consultation = await this.physicianService
        .getConsultation(this.patient.id, this.today).toPromise();
      this.labRequest = await this.labService
        .getLabInvestigation(this.consultation.id, this.today).toPromise();
      if (this.labRequest.status === 'IN-QUEUE') {
        this.sampleTypes = await this.labSetupService.getLabSampleTypes(this.labRequest.service_id)
          .toPromise();
      } if (this.labRequest.status === 'SAMPLE-TAKEN') {
        this.labService.getSample(this.labRequest)
          .subscribe(sample => this.sample = sample, error => console.log(error));
        this.labParams = await this.processParams();
      } else if (this.labRequest.status === 'RESULTS-TAKEN') {
        this.results = await this.labService.getLabResults(this.labRequest.id)
          .toPromise();
      }
    } catch (e) {
      this.patient = null;
      this.labParams = null;
      this.labRequest = null;
      this.consultation = null;
      this.message = 'Folder not found';
      this.searchInitialized = false;
    }
    this.isLoadingData = false;
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

  startEdit(name: string, event: MouseEvent): void {
    if (this.submiting) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    if (name === 'BMI') {
      return;
    }
    this.editName = name;
  }

  finishEdit(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.editName = null;
  }

  handleCancel() {
    this.doctorsModalVisible = false;
    this.cancel();
  }

  cancel() {
    this.patient = null;
    this.labRequest = null;
    this.searchInitialized = false;
    this.folderNoControl.reset();
  }

  async generateSample() {
    this.isCreatingSample = true;
    this.notificationS.blank('Loading', 'Please wait');
    try {
      const sampleCode = await this.labService.newSampleCode(this.labRequest.id, this.sampleTypeCtrl.value)
        .toPromise();
      this.sample = await this.labService.createSample(this.sampleData(sampleCode))
        .toPromise();
      this.labRequest = await this.labService.updateLabRequest(this.labRequest.id, { status: 'SAMPLE-TAKEN' })
        .toPromise();
      this.labParams = await this.processParams();
      this.isCreatingSample = false;
    } catch (e) {
      this.notificationS.error('Error', 'Something went wrong');
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

  async done() {
    try {
      this.results = await this.labService.saveLabResults(this.processResults()).toPromise();
      this.labRequest = await this.labService.updateLabRequest(this.labRequest.id, { status: 'RESULTS-TAKEN' })
        .toPromise();
    } catch (e) {
      console.log(e);
    }
  }

  processResults() {
    const data = {
      investigation_id: this.labRequest.id,
      results: [],
      // technician_id: this.user.details.id,
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

  attendanceClick(attendance: any) {
    this.folderNoControl.setValue(attendance.folder_no);
  }
}
