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

  doctorsModalVisible = false;
  doctorsLoading = false;
  isLoadingData = false;
  searchInitialized = false;
  submiting = false;
  isAssigning = false;

  patient: any;
  message = 'Please enter a valid folder number to fill this form.';
  labRequest: any;
  consultation: any;
  labParams: any;

  constructor(
    private fb: FormBuilder,
    private opdService: OpdService,
    private labService: LaboratoryService,
    private labSetupService: LabSetupService,
    private physicianService: PhysicianService,
    private notificationS: NzNotificationService,
  ) { }


  private get folderNoControl(): FormControl {
    return this.folderNumb as FormControl;
  }

  ngOnInit() {
    this.today = formatDate(datefns.startOfToday(), 'yyyy-MM-dd', 'en');
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
      const params = await this.labSetupService.getLabParams(this.labRequest.service_id)
      .toPromise();
      this.labParams = this.processParams(params);
    } catch (e) {
      this.patient = null;
      this.labRequest = null;
      this.consultation = null;
      this.message = 'Folder not found';
    this.searchInitialized = false;
    }
    this.isLoadingData = false;
  }

  processParams(params: any[]): any[] {
    const temp = [];
    params.forEach((param, index) => {
      param.form = this.fb.control(null);
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

  done() {
  }

  processData() {
    return {};
  }

  attendanceClick(attendance: any) {
    this.folderNoControl.setValue(attendance.folder_no);
  }
}
