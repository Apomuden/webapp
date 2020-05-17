import {Component, OnInit, OnDestroy, AfterViewInit} from '@angular/core';
import {Validators, FormBuilder, FormControl} from '@angular/forms';
import {debounceTime, first} from 'rxjs/operators';
import {untilComponentDestroyed} from '@w11k/ngx-componentdestroyed';
import {NzNotificationService, NzModalRef} from 'ng-zorro-antd';
import {AuthenticationService} from 'src/app/shared/services/authentication.service';
import {User} from 'src/app/shared/interfaces/user.type';
import {PhysicianService} from '../services/physician.service';
import * as dateFns from 'date-fns';
import {formatDate} from '@angular/common';
import {ThemeConstantService} from 'src/app/shared/services/theme-constant.service';
import {ConsultationData} from '../../shared/models/consultation-data.model';

@Component({
  selector: 'app-ivf-consultation',
  templateUrl: './ivf-consultation.component.html',
  styleUrls: ['./ivf-consultation.component.css']
})
export class IvfConsultationComponent implements OnInit, OnDestroy, AfterViewInit {
  commentControl = this.fb.control(null);
  folderNumb = this.fb.control(null, [
    Validators.minLength(11),
    Validators.maxLength(12)
  ]);
  consultationForm = this.fb.group({
    end_at: [new Date(), Validators.required],
    pregnant: [false, Validators.required],
    illness_type: [null, Validators.required]
  });

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
      max: 100
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
      apiName: 'weight'
    },
    {
      name: 'Height',
      apiName: 'height'
    },
    {
      name: 'BMI',
      apiName: 'bmi',
      min: 18.5,
      max: 24.9
    }
  ];
  panels = [
    {
      active: true,
      name: 'Patient Details'
    },
    {
      active: false,
      name: 'Vitals'
    }
  ];
  illnessTypes = [];

  doctorsModalVisible = false;
  doctorsLoading = false;
  isLoadingData = false;
  searchInitialized = false;
  submiting = false;
  isAssigning = false;

  patient: any;
  message = 'Please enter a valid folder number to fill this form.';
  today: string;
  attendance: any;
  vitals: any;
  user: User;
  patientHistory: any;
  physicalExam: any;

  consultationData: ConsultationData = {
    physicalExam: null,
    investigations: [],
    procedures: [],
    diagnosis: [],
    prescription: null,
    clinicalNotes: {
      treatmentPlan: '',
      progressiveNote: '',
      admissionNote: '',
      urgentCareNote: ''
    }
  };

  constructor(
    private fb: FormBuilder,
    private physicianService: PhysicianService,
    private notificationS: NzNotificationService,
    private authService: AuthenticationService
  ) {
  }

  private get folderNoControl(): FormControl {
    return this.folderNumb as FormControl;
  }

  ngOnInit() {
    this.today = formatDate(dateFns.startOfToday(), 'yyyy-MM-dd', 'en');
    this.user = this.authService.currentUserValue;
    this.physicianService
      .getIllnessTypes()
      .pipe(first())
      .subscribe(res => {
        this.illnessTypes = res;
      });
  }

  ngAfterViewInit() {
    if (this.user) {
      this.folderNoControl.valueChanges
        .pipe(debounceTime(1000), untilComponentDestroyed(this))
        .subscribe(folderNo => {
          if (folderNo && this.folderNoControl.valid) {
            this.getPatient(folderNo);
          } else {
            this.message =
              'Please enter a valid folder number to fill this form.';
            this.searchInitialized = false;
          }
        });

      this.consultationForm
        .get('end_at')
        .valueChanges.pipe(untilComponentDestroyed(this))
        .subscribe(date => {
          this.physicianService.setConsultationDate(date);
        });
    } else {
      this.notificationS.error('Error', 'Could not initialize this page.');
    }
  }

  ngOnDestroy() {
  }

  onIndexChange(index: number): void {
    this.stepIndex = index;
  }

  disabledDate(current: Date): boolean {
    if (!current) {
      return false;
    }
    // can only select days before today
    return dateFns.isAfter(current, new Date());
  }

  getConsultation(patientId: string) {
    this.isLoadingData = true;
    this.searchInitialized = true;
    this.physicianService
      .getConsultation(patientId, this.today)
      .pipe(first())
      .subscribe(
        data => {
          this.isLoadingData = false;
          this.attendance = data;
          this.getPatientVitals(this.patient.id);
        },
        e => {
          this.patient = null;
          this.message = 'Attendance not found';
          this.searchInitialized = false;
        }
      );
  }

  getPatient(folderNo: string) {
    this.isLoadingData = true;
    this.searchInitialized = true;
    this.physicianService
      .getPatient(folderNo)
      .pipe(first())
      .subscribe(
        data => {
          this.isLoadingData = false;
          this.patient = data;
          this.getConsultation(this.patient.id);
        },
        e => {
          this.message = 'Folder not found';
          this.attendance = null;
          this.searchInitialized = false;
        }
      );
  }

  getPatientVitals(patientId: string) {
    this.isLoadingData = true;
    this.searchInitialized = true;
    this.physicianService
      .getPatientVitals(patientId, this.today)
      .pipe(first())
      .subscribe(
        data => {
          this.isLoadingData = false;
          this.vitals = data;
          if (
            this.vitals.systolic_blood_pressure &&
            this.vitals.systolic_blood_pressure.value &&
            this.vitals.diastolic_blood_pressure &&
            this.vitals.diastolic_blood_pressure.value
          ) {
            this.vitals.blood_pressure = {
              value: `${this.vitals.diastolic_blood_pressure.value}/${this.vitals.systolic_blood_pressure.value}`,
              unit: 'mmHg'
            };
          }
        },
        e => {
          this.isLoadingData = false;
        }
      );
  }

  cancel() {
    this.patient = null;
    this.attendance = null;
    this.searchInitialized = false;
    this.folderNoControl.reset();
    this.vitals = null;
  }

  previous() {
    if (this.stepIndex === 0) {
      this.cancel();
      return;
    }
    this.stepIndex -= 1;
  }

  next(eventData: any) {
    if (this.stepIndex === 0) {
      this.patientHistory = eventData;
      this.stepIndex += 1;
    } else if (this.stepIndex === 1) {
      this.physicalExam = eventData;
      this.stepIndex += 1;
    } else {
      this.stepIndex += 1;
    }
  }

  done() {
    const data = this.processData();
    // this.submiting = true;
    console.log(data);
  }

  processData() {
    // todo
    return null;
  }

  // queue item click event
  attendanceClick(attendance: any) {
    this.folderNoControl.setValue(attendance.folder_no);
  }
}
