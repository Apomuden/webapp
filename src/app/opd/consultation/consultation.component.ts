import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { Validators, FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { debounceTime, first, take } from 'rxjs/operators';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { OpdService } from '../services/opd.service';
import { NzInputDirective, NzNotificationService, NzInputGroupComponent, NzModalRef, NzModalService } from 'ng-zorro-antd';
import * as datefns from 'date-fns';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { User } from 'src/app/shared/interfaces/user.type';
import { SetupService } from 'src/app/shared/services/setup.service';

@Component({
  selector: 'app-vital-form',
  templateUrl: './consultation.component.html',
  styleUrls: ['./consultation.component.css']
})
export class ConsultationComponent implements OnInit, OnDestroy, AfterViewInit {
  today: string;
  editName: string | null;
  @ViewChild(NzInputDirective, { static: false, read: ElementRef }) inputElement: ElementRef;

  folderNumb = this.fb.control(null, [Validators.minLength(11), Validators.maxLength(12)]);

  patientHistoryForm = this.fb.group({
    presentComplaints: [null],
    historyComplaints: [null],
    directQuestioning: [null],
    pastMedicalHistory: [null],
    medicineHistory: [null],
    surgicalHistory: [null],
    allergiesHistory: [null],
    familyHistory: [null],
    socialHistory: [null],
    complaintRelation: [0],
  });
  previousHistory: any;
  panels = [
    {
      active: true,
      name: 'Patient Details',
    },
    {
      active: false,
      name: 'Vitals'
    },
  ];
  defaultRelationship = {
    name: 'Self',
    id: 0,
  };
  relationships = [this.defaultRelationship];
  commentControl = this.fb.control(null);
  doctorControl = this.fb.control(null, Validators.required);

  doctorsModalVisible = false;
  doctorsLoading = false;
  isLoadingData = false;
  searchInitialized = false;
  submiting = false;
  isAssigning = false;

  patient: any;
  doctors = [];
  message = 'Please enter a valid folder number to fill this form.';
  attendance: any;
  tplModal: NzModalRef;
  vitals: any;
  stepIndex = 0;
  stepsCount = 6;
  vitalKeys = [
    {
      name: 'Temperature',
      apiName: 'temperature',
      min: 36.0,
      max: 37.3
    },
    {
      name: 'Pulse',
      apiName: 'pulse',
      min: 60,
      max: 100,
    },
    {
      name: 'Blood Pressure',
      apiName: 'blood_pressure',
      min: [90, 60],
      max: [120, 80]
    },
    {
      name: 'Respiration',
      apiName: 'respiration',
      min: 12,
      max: 24
    },
    {
      name: 'Oxygen Saturation',
      apiName: 'oxygen_saturation',
      min: 95,
      max: 100
    },
    {
      name: 'Weight',
      apiName: 'weight',
    },
    {
      name: 'Height',
      apiName: 'height',
    },
    {
      name: 'BMI',
      apiName: 'bmi',
      min: 18.5,
      max: 24.9
    },
  ];
  user: User;

  constructor(
    private fb: FormBuilder,
    private opdService: OpdService,
    private notificationS: NzNotificationService,
    private authService: AuthenticationService,
    private setUpService: SetupService,
    private modalService: NzModalService,
  ) { }


  private get folderNoControl(): FormControl {
    return this.folderNumb as FormControl;
  }

  ngOnInit() {
    this.today = this.formatDate(datefns.startOfToday());
    this.setUpService.getRelationships().pipe(first())
      .subscribe(res => {
        this.relationships.push(...res.data);
      });
  }

  ngAfterViewInit() {
    this.user = this.authService.currentUserValue;
    if (this.user) {
      this.folderNoControl.valueChanges.pipe(debounceTime(1000), untilComponentDestroyed(this))
        .subscribe(folderNo => {
          if (folderNo && this.folderNoControl.valid) {
            this.getPatient(folderNo);
          } else {
            this.message = 'Please enter a valid folder number to fill this form.';
            this.searchInitialized = false;
          }
        });
    } else {
      this.notificationS.error('Error', 'Could not initialize this page.');
    }
  }

  ngOnDestroy() { }

  @HostListener('window:click', ['$event'])
  handleClick(e: MouseEvent): void {
    if (this.editName && this.inputElement && this.inputElement.nativeElement !== e.target) {
      this.editName = null;
    }
  }

  getConsultation(patientId: string) {
    this.isLoadingData = true;
    this.searchInitialized = true;
    this.opdService.getConsultation(patientId, this.today).pipe(first())
      .subscribe(data => {
        this.isLoadingData = false;
        this.attendance = data;
        this.getPatientVitals(this.patient.id);
      }, e => {
        console.log(e);
        this.patient = null;
        this.message = 'Attendance not found';
        this.searchInitialized = false;
      });
  }

  getPatient(folderNo: string) {
    this.isLoadingData = true;
    this.searchInitialized = true;
    this.opdService.getPatient(folderNo).pipe(first())
      .subscribe(data => {
        this.isLoadingData = false;
        this.patient = data;
        this.patient.age = this.calculateAge(this.patient.dob);
        this.getConsultation(this.patient.id);
      }, e => {
        console.log(e);
        this.message = 'Folder not found';
        this.attendance = null;
        this.searchInitialized = false;
      });
  }

  getPatientVitals(patientId: string) {
    this.isLoadingData = true;
    this.searchInitialized = true;
    this.opdService.getPatientVitals(patientId, this.today).pipe(first())
      .subscribe(data => {
        this.isLoadingData = false;
        this.vitals = data;
        if ((this.vitals.systolic_blood_pressure && this.vitals.systolic_blood_pressure.value)
          && (this.vitals.diastolic_blood_pressure && this.vitals.diastolic_blood_pressure.value)) {
          this.vitals.blood_pressure = {
            value: `${this.vitals.diastolic_blood_pressure.value}/${this.vitals.systolic_blood_pressure.value}`,
            unit: 'mmHg'
          };
        }
        this.getPatientHistory(this.patient.id);
      }, e => {
        console.log(e);
        this.isLoadingData = false;
      });
  }

  getPatientHistory(patientId: number) {
    this.opdService.getPatientHistory(patientId).pipe(first())
      .subscribe(history => {
        console.log(history);
        this.previousHistory = history;
      });
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
    return `${[year, month, day].join('-')}`;
  }

  calculateAge(birthday: string) {
    const ageDifMs = Date.now() - new Date(birthday).getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
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

  assignDoctor() {

  }

  cancel() {
    this.patient = null;
    this.searchInitialized = false;
    this.folderNoControl.reset();
    this.vitals = null;
  }

  previous() {
    this.stepIndex -= 1;
  }

  next() {
    if (this.stepIndex === 0) {
      const data = this.processPatientHistoryData();
      const isUpdating = this.previousHistory !== null;
      this.opdService.savePatientHistory(data, isUpdating).pipe(first())
        .subscribe(res => {
          if (res) {
            this.stepIndex += 1;
            this.patientHistoryForm.reset();
            this.getPatientHistory(this.patient.id);
          }
        }, error => {
          console.error(error);
          this.notificationS.error('Error', 'Unable to proceed');
        });
    }
  }

  done() {
    const data = this.processData();
    this.submiting = true;
    console.log(data);
    this.opdService.saveVitals(data).pipe(first())
      .subscribe(res => {
        this.submiting = false;
        console.log(res);
        this.doctorsModalVisible = true;
      }, e => {
        this.submiting = false;
        console.error(e);
      });
  }

  processData() {
    return null;
  }

  processPatientHistoryData() {
    return {
      'patient_id': this.patient.id,
      'consultation_id': this.attendance.id,
      'patient_status': this.attendance.patient_status,
      'consultation_date': this.formatDateTime(new Date()),
      'presenting_complaints': this.patientHistoryForm.get('presentComplaints').value,
      'presenting_complaints_history': this.patientHistoryForm.get('historyComplaints').value,
      'direct_questions': this.patientHistoryForm.get('directQuestioning').value,
      'past_medical_history': this.patientHistoryForm.get('pastMedicalHistory').value,
      'surgical_history': this.patientHistoryForm.get('surgicalHistory').value,
      'medicine_history': this.patientHistoryForm.get('medicineHistory').value,
      'allergies_history': this.patientHistoryForm.get('allergiesHistory').value,
      'family_history': this.patientHistoryForm.get('familyHistory').value,
      'social_history': this.patientHistoryForm.get('socialHistory').value,
      'consultant_id': this.user.id,
      'chief_complaint_relation_id': (this.patientHistoryForm.get('complaintRelation').value === 0) ? null : this.patientHistoryForm.get('complaintRelation').value,
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

  attendanceClick(attendance: any) {
    this.folderNoControl.setValue(attendance.folder_no);
  }
}
