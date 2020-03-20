import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { Validators, FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { debounceTime, first } from 'rxjs/operators';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { OpdService } from '../services/opd.service';
import { NzInputDirective, NzNotificationService, NzInputGroupComponent, NzModalRef, NzModalService } from 'ng-zorro-antd';
import * as datefns from 'date-fns';

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

  steps = [
    {
      name: 'Patient History',
    },
    {
      name: 'Physical Examination',
    },
    {
      name: 'Diagnosis',
    },
    {
      name: 'Investigation',
    },
    {
      name: 'Prescription',
    },
    {
      name: 'Procedure',
    },
    {
      name: 'Clinical Notes',
    },
  ];
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

  constructor(
    private fb: FormBuilder,
    private opdService: OpdService,
    private notificationS: NzNotificationService,
    private modalService: NzModalService,
  ) { }


  private get folderNoControl(): FormControl {
    return this.folderNumb as FormControl;
  }

  ngOnInit() {
    this.today = this.formatDate(datefns.startOfToday());
  }

  ngAfterViewInit() {
    this.folderNoControl.valueChanges.pipe(debounceTime(1000), untilComponentDestroyed(this))
      .subscribe(folderNo => {
        if (folderNo && this.folderNoControl.valid) {
          this.getAttendance(folderNo);
        } else {
          this.message = 'Please enter a valid folder number to fill this form.';
          this.searchInitialized = false;
        }
      });
  }

  ngOnDestroy() { }

  @HostListener('window:click', ['$event'])
  handleClick(e: MouseEvent): void {
    if (this.editName && this.inputElement && this.inputElement.nativeElement !== e.target) {
      this.editName = null;
    }
  }

  getAttendance(folderNo: string) {
    this.isLoadingData = true;
    this.searchInitialized = true;
    this.opdService.getAttendance(folderNo, this.today).pipe(first())
      .subscribe(data => {
        this.isLoadingData = false;
        this.attendance = data;
        this.getPatient(folderNo);
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
        this.getPatientVitals(this.patient.id);
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
      }, e => {
        console.log(e);
        this.isLoadingData = false;
      });
  }

  formatDate(date: Date): string {
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
      minute = '0' + month;
    }
    if (hour.length < 2) {
      hour = '0' + month;
    }
    if (seconds.length < 2) {
      seconds = '0' + month;
    }
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
  }

  previous() {
    this.stepIndex -= 1;
  }

  next() {
    this.stepIndex += 1;
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

  attendanceClick(attendance: any) {
    this.folderNoControl.setValue(attendance.folder_no);
  }
}
