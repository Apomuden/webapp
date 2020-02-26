import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { Validators, FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { debounceTime, first } from 'rxjs/operators';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { OpdService } from '../services/opd.service';
import { NzInputDirective, NzNotificationService, NzInputGroupComponent } from 'ng-zorro-antd';

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
      name: 'Temperature', form: this.fb.control(null, [Validators.required]),
      flag: 'Provide value to evalute',
      unit: '˚C',
      min: 36.0,
      max: 37.3
    },
    {
      name: 'Pulse', form: this.fb.control(null, [Validators.required, Validators.min(0)]),
      flag: 'Provide value to evalute',
      unit: 'BPM',
      min: 60,
      max: 100,
    },
    {
      name: 'Blood Pressure',
      flag: 'Provide value to evalute', unit: 'mmHG',
      form: this.fb.control(null, [Validators.required,
      Validators.pattern(/^\d{1,3}\/\d{1,3}$/)]),
      min: [90, 60],
      max: [120, 80]
    },
    {
      name: 'Respiratory', form: this.fb.control(null, [Validators.required, Validators.min(0)]),
      flag: 'Provide value to evalute',
      unit: 'cpm',
      min: 12,
      max: 24
    },
    {
      name: 'SPO', form: this.fb.control(null, [Validators.required, Validators.min(0)]),
      flag: 'Provide value to evalute',
      unit: '%',
      min: 95,
      max: 100
    },
    {
      name: 'Weight', form: this.fb.control(null, [Validators.required, Validators.min(0)]),
      flag: 'N/A', unit: 'kg'
    },
    {
      name: 'Height', form: this.fb.control(null, [Validators.required, Validators.min(0)]),
      flag: 'N/A', unit: 'cm'
    },
    {
      name: 'BMI', form: this.fb.control(null, [Validators.required]),
      flag: 'Provide value to evalute',
      unit: 'kg/m2',
      min: 18.5,
      max: 24.9
    },
  ];
  commentControl = this.fb.control(null);

  isLoadingData = false;
  searchInitialized = false;
  submiting = false;

  patient: any;
  message = 'Please enter a valid folder number to fill this form.';
  attendance: any;

  constructor(private fb: FormBuilder, private opdService: OpdService, private notificationS: NzNotificationService) { }


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
          this.evaluateFlag(vital, value);
        });
      }
    });
  }

  private evaluateBmi(height: number, weight: number) {
    const bmi = (weight / Math.pow((height / 100), 2));
    this.bmiControl.setValue(parseFloat(bmi.toFixed(1)));
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
    this.opdService.getAttendance(folderNo).pipe(first())
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

  calculateAge(birthday: string) {
    const ageDifMs = Date.now() - new Date(birthday).getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }

  startEdit(name: string, event: MouseEvent): void {
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

  private evaluateFlag(vital, value: any) {
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

  cancel() {
    this.patient = null;
    this.searchInitialized = false;
    for (let i = 0; i < this.vitals.length; i++) {
      this.vitals[i].form.reset();
    }
  }

  done() {
  }

  validateForm() {
    let valid = true;
    for (let i = 0; i < this.vitals.length; i++) {
      valid = valid && this.vitals[i].form.valid;
    }
    return valid;
  }
}
