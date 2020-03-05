import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { Validators, FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { debounceTime, first } from 'rxjs/operators';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { OpdService } from '../services/opd.service';
import { NzInputDirective, NzNotificationService, NzInputGroupComponent, NzModalRef, NzModalService } from 'ng-zorro-antd';
import * as datefn from 'date-fns';

@Component({
  selector: 'app-vital-form',
  templateUrl: './vital-form.component.html',
  styleUrls: ['./vital-form.component.css']
})
export class VitalFormComponent implements OnInit, OnDestroy, AfterViewInit {
  editName: string | null;
  @ViewChild(NzInputDirective, { static: false, read: ElementRef }) inputElement: ElementRef;

  folderNumb = this.fb.control(null, [Validators.minLength(11), Validators.maxLength(12)]);

  vitals = [
    {
      name: 'Temperature', form: this.fb.control(null),
      flag: 'Provide value to evalute',
      unit: '˚C',
      min: 36.0,
      max: 37.3
    },
    {
      name: 'Pulse', form: this.fb.control(null, [Validators.min(0)]),
      flag: 'Provide value to evalute',
      unit: 'BPM',
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
      unit: 'kg/m2',
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

  constructor(
    private fb: FormBuilder,
    private opdService: OpdService,
    private notificationS: NzNotificationService,
    private modalService: NzModalService,
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

  getPatient(folderNo: string) {
    this.isLoadingData = true;
    this.searchInitialized = true;
    this.opdService.getPatient(folderNo).pipe(first())
      .subscribe(data => {
        this.isLoadingData = false;
        this.patient = data;
        this.patient.age = this.calculateAge(this.patient.dob);
      }, e => {
        console.log(e);
        this.message = 'Folder not found';
        this.attendance = null;
        this.searchInitialized = false;
      });
  }

  getAttendance(folderNo: string) {
    this.isLoadingData = true;
    this.searchInitialized = true;
    const today = this.formatDate(datefn.subDays(datefn.startOfYesterday(), 4));
    this.opdService.getAttendance(folderNo, today).pipe(first())
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
    for (let i = 0; i < this.vitals.length; i++) {
      this.vitals[i].form.reset();
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
