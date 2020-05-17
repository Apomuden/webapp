import {AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {debounceTime, first} from 'rxjs/operators';
import {untilComponentDestroyed} from '@w11k/ngx-componentdestroyed';
import {OpdService} from '../services/opd.service';
import {NzInputDirective, NzModalRef, NzNotificationService} from 'ng-zorro-antd';
import * as datefns from 'date-fns';
import {formatDate} from '@angular/common';
import {UserManagementService} from 'src/app/user-management/user-management.service';
import {PhysicianService} from 'src/app/physician/services/physician.service';

@Component({
  selector: 'app-vital-form',
  templateUrl: './vital-form.component.html',
  styleUrls: ['./vital-form.component.css']
})
export class VitalFormComponent implements OnInit, OnDestroy, AfterViewInit {
  today: string;
  editName: string | null;
  @ViewChild(NzInputDirective, { static: false, read: ElementRef }) inputElement: ElementRef;

  folderNumb = this.fb.control(null, [Validators.minLength(11), Validators.maxLength(12)]);

  vitals = [
    {
      name: 'Temperature', form: this.fb.control(null),
      flag: 'Provide value to evalute',
      unit: '℃',
      min: 36.0,
      max: 37.3
    },
    {
      name: 'Pulse', form: this.fb.control(null, [Validators.min(0)]),
      flag: 'Provide value to evalute',
      unit: 'bpm',
      min: 60,
      max: 100,
    },
    {
      name: 'Blood Pressure',
      flag: 'Provide value to evalute', unit: 'mmHG',
      form: this.fb.control(null, [
        Validators.pattern(/^\d{1,3}\/\d{1,3}$/)]),
      min: [90, 60],
      max: [120, 80]
    },
    {
      name: 'Respiration', form: this.fb.control(null, [Validators.min(0)]),
      flag: 'Provide value to evalute',
      unit: 'cpm',
      min: 12,
      max: 24
    },
    {
      name: 'Oxygen Saturation', form: this.fb.control(null, [Validators.min(0)]),
      flag: 'Provide value to evalute',
      unit: '%',
      min: 95,
      max: 100
    },
    {
      name: 'Weight', form: this.fb.control(null, [Validators.min(0)]),
      flag: 'N/A', unit: 'kg'
    },
    {
      name: 'Height', form: this.fb.control(null, [Validators.min(0)]),
      flag: 'N/A', unit: 'cm'
    },
    {
      name: 'BMI', form: this.fb.control(null),
      flag: 'Provide value to evalute',
      unit: 'Kg/m²',
      min: 18.5,
      max: 24.9
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
  consultation: any;

  constructor(
    private fb: FormBuilder,
    private opdService: OpdService,
    private physicianService: PhysicianService,
    private userManagementService: UserManagementService,
    private notificationS: NzNotificationService,
  ) { }


  private get folderNoControl(): FormControl {
    return this.folderNumb as FormControl;
  }

  private get weightControl(): FormControl {
    return this.vitals.find(v => v.name === 'Weight').form as FormControl;
  }

  private get heightControl(): FormControl {
    return this.vitals.find(v => v.name === 'Height').form as FormControl;
  }

  private get bmiControl(): FormControl {
    return this.vitals.find(v => v.name === 'BMI').form as FormControl;
  }

  private get pulseControl(): FormControl {
    return this.vitals.find(v => v.name === 'Pulse').form;
  }

  private get bpControl(): FormControl {
    return this.vitals.find(v => v.name === 'Blood Pressure').form;
  }

  private get tempControl(): FormControl {
    return this.vitals.find(v => v.name === 'Temperature').form;
  }

  private get respirationControl(): FormControl {
    return this.vitals.find(v => v.name === 'Respiration').form;
  }

  private get spoControl(): FormControl {
    return this.vitals.find(v => v.name === 'Oxygen Saturation').form;
  }

  ngOnInit() {
    this.today = formatDate(datefns.startOfToday(), 'yyyy-MM-dd', 'en');
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

    this.weightControl.valueChanges.pipe(untilComponentDestroyed(this))
      .subscribe(weight => {
        if (weight && this.weightControl.valid && this.heightControl.valid) {
          this.evaluateBmi(weight, this.heightControl.value);
        }
      });

    this.heightControl.valueChanges.pipe(untilComponentDestroyed(this))
      .subscribe(height => {
        if (height && this.weightControl.valid && this.heightControl.valid) {
          this.evaluateBmi(height, this.weightControl.value);
        }
      });

    this.vitals.forEach(vital => {
      if (vital.name !== 'Weight' && vital.name !== 'Height') {
        vital.form.valueChanges.pipe(untilComponentDestroyed(this)).subscribe(value => {
          if (value) {
            this.evaluateFlag(vital, value);
          }
        });
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

  getConsultation() {
    this.isLoadingData = true;
    this.searchInitialized = true;
    const date = new Date(this.attendance.attendance_date);
    const formatedDate = formatDate(date, 'yyyy-MM-dd', 'en');
    this.physicianService.getConsultation(this.patient.id, formatedDate).pipe(first())
      .subscribe(data => {
        this.isLoadingData = false;
        this.consultation = data;
      }, e => {
        this.message = 'Folder not found';
        this.attendance = null;
        this.patient = null;
        this.searchInitialized = false;
      });
  }

  getPatient(folderNo: string) {
    this.isLoadingData = true;
    this.searchInitialized = true;
    this.opdService.getPatient(folderNo).pipe(first())
      .subscribe(data => {
        this.patient = data;
        this.getConsultation();
      }, e => {
        this.message = 'Folder not found';
        this.attendance = null;
        this.searchInitialized = false;
      });
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

  private evaluateBmi(height: number, weight: number) {
    const bmi = (weight / Math.pow((height / 100), 2));
    this.bmiControl.setValue(parseFloat(bmi.toFixed(1)));
  }

  private evaluateFlag(vital: any, value: any) {
    if (vital.form.valid) {
      if (vital.name !== 'Blood Pressure') {
        if (value < vital.min) {
          vital.flag = 'LOW';
        } else if (value > vital.max) {
          vital.flag = 'HIGH';
        } else if (value >= vital.min && value <= vital.max) {
          vital.flag = 'NORMAL';
        }
      } else {
        if (value.split('/').length < 2) {
          return;
        }
        const systolic = value.split('/')[0];
        const diastolic = value.split('/')[1];
        vital.flag = '';
        if (systolic < vital.min[0]) {
          vital.flag = vital.flag + 'LOW SYSTOLIC. ';
        } else if (systolic > vital.max[0]) {
          vital.flag = vital.flag + 'HIGH SYSTOLIC. ';
        } else if (systolic >= vital.min[0] && systolic <= vital.max[0]) {
          vital.flag = vital.flag + 'NORMAL SYSTOLIC. ';
        }
        if (diastolic < vital.min[1]) {
          vital.flag = vital.flag + 'LOW DIASTOLIC. ';
        } else if (diastolic > vital.max[1]) {
          vital.flag = vital.flag + 'HIGH DIASTOLIC. ';
        } else if (diastolic >= vital.min[1] && diastolic <= vital.max[1]) {
          vital.flag = vital.flag + 'NORMAL DIASTOLIC. ';
        }
      }
    }
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
    this.isAssigning = true;
    this.opdService.assignDoctor(this.doctorControl.value, this.consultation.id).pipe(first())
      .subscribe(res => {
        this.isAssigning = false;
        if (res) {
          this.handleCancel();
          this.notificationS.success('Success', 'Doctor assigned');
        }
      }, error => {
        console.log(error);
        this.isAssigning = false;
        this.notificationS.error('Error', 'Doctor not assigned');
      });
  }

  cancel() {
    this.patient = null;
    this.attendance = null;
    this.consultation = null;
    this.searchInitialized = false;
    this.folderNoControl.reset();
    for (let i = 0; i < this.vitals.length; i++) {
      this.vitals[i].form.reset();
    }
  }

  done() {
    const data = this.processData();
    this.submiting = true;
    this.opdService.saveVitals(data).pipe(first())
      .subscribe(res => {
        this.submiting = false;
        this.doctorsModalVisible = true;
        this.doctorsLoading = true;
        this.userManagementService.getDoctors().pipe(first()).subscribe(doctors => {
          this.doctorsLoading = false;
          this.doctors = doctors;
          console.log(this.doctors);
        });
      }, e => {
        this.submiting = false;
        this.notificationS.error('Error', 'Could not save vitals');
        console.error(e);
      });
  }

  processData() {
    let systolic: number = null;
    let diastolic: number = null;
    if (this.bpControl.value) {
      systolic = parseFloat(this.bpControl.value.split('/')[0]);
      diastolic = parseFloat(this.bpControl.value.split('/')[1]);
    }
    return {
      temperature: !isNaN(parseFloat(this.tempControl.value)) ? parseFloat(this.tempControl.value) : null,
      patient_id: this.patient.id,
      weight: !isNaN(parseFloat(this.weightControl.value)) ? parseFloat(this.weightControl.value) : null,
      height: !isNaN(parseFloat(this.heightControl.value)) ? parseFloat(this.heightControl.value) : null,
      pulse: !isNaN(parseFloat(this.pulseControl.value)) ? parseFloat(this.pulseControl.value) : null,
      systolic_blood_pressure: systolic,
      diastolic_blood_pressure: diastolic,
      respiration: !isNaN(parseFloat(this.respirationControl.value)) ? parseFloat(this.respirationControl.value) : null,
      oxygen_saturation: !isNaN(parseFloat(this.spoControl.value)) ? parseFloat(this.spoControl.value) : null,
      // fasting_blood_sugar: parseFloat(this.vitals.find(v => v.name === 'Fasting Blood Sugar').form),
      // random_blood_sugar: parseFloat(this.vitals.find(v => v.name === 'Random Blood Sugar').form),
      comment: this.commentControl.value,
    };
  }

  validateForm() {
    let valid = true;
    for (let i = 0; i < this.vitals.length; i++) {
      valid = valid && this.vitals[i].form.valid;
    }
    return valid;
  }

  attendanceClick(attendance: any) {
    this.folderNoControl.setValue(attendance.folder_no);
  }
}
