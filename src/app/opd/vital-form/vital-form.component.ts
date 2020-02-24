import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { debounceTime, first } from 'rxjs/operators';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { OpdService } from '../services/opd.service';

@Component({
  selector: 'app-vital-form',
  templateUrl: './vital-form.component.html',
  styleUrls: ['./vital-form.component.css']
})
export class VitalFormComponent implements OnInit, OnDestroy, AfterViewInit {

  vitalsForm: FormGroup = this.fb.group({
    folderNumber: [null, [Validators.minLength(11), Validators.maxLength(12)]],
    temp: [null, [Validators.required]],
    pulse: [null, [Validators.required, Validators.min(0)]],
    systolic: [null, [Validators.required, Validators.min(0)]],
    diastolic: [null, [Validators.required, Validators.min(0)]],
    respiratory: [null, [Validators.required, Validators.min(0)]],
    spo: [null, [Validators.required, Validators.min(0)]],
    weight: [null, [Validators.required, Validators.min(0)]],
    height: [null, [Validators.required, Validators.min(0)]],
    bmi: [{ value: null, disabled: true }, [Validators.required]],
    comment: [null],
  });

  isLoadingData = false;
  searchInitialized = false;
  submiting = false;

  patient: any;
  message = 'Please enter a valid folder number to fill this form.';

  constructor(private fb: FormBuilder, private opdService: OpdService) { }


  private get folderNoControl(): FormControl {
    return this.vitalsForm.get('folderNumber') as FormControl;
  }
  private get weightControl(): FormControl {
    return this.vitalsForm.get('weight') as FormControl;
  }

  private get heightControl(): FormControl {
    return this.vitalsForm.get('height') as FormControl;
  }

  private get bmiControl(): FormControl {
    return this.vitalsForm.get('bmi') as FormControl;
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.folderNoControl.valueChanges.pipe(debounceTime(1000), untilComponentDestroyed(this))
      .subscribe(folderNo => {
        if (folderNo && this.folderNoControl.valid) {
          this.getPatient(folderNo);
        } else {
          this.message = 'Please enter a valid folder number to fill this form.';
          this.searchInitialized = false;
        }
      });

    this.weightControl.valueChanges.pipe(untilComponentDestroyed(this))
      .subscribe(weight => {
        if (weight && this.weightControl.valid && this.heightControl.valid) {
          const bmi = (weight / Math.pow(this.heightControl.value / 100, 2));
          this.bmiControl.setValue(bmi);
        }
      });

    this.heightControl.valueChanges.pipe(untilComponentDestroyed(this))
      .subscribe(height => {
        if (height && this.weightControl.valid && this.heightControl.valid) {
          const bmi = (this.weightControl.value / Math.pow((height / 100), 2));
          this.bmiControl.setValue(bmi);
        }
      });
  }

  ngOnDestroy() { }

  getPatient(folderNo: string) {
    this.isLoadingData = true;
    this.searchInitialized = true;
    this.opdService.getPatient(`folder_no=${folderNo}`).pipe(first())
      .subscribe(data => {
        this.isLoadingData = false;
        this.patient = data;
        this.patient.age = this.calculateAge(this.patient.dob);
      }, e => {
        console.log(e);
        this.message = 'Folder not found';
        this.searchInitialized = false;
      });
  }

  calculateAge(birthday: string) {
    const ageDifMs = Date.now() - new Date(birthday).getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }

  cancel() {
    this.patient = null;
    this.searchInitialized = false;
    this.vitalsForm.reset();
  }

  done() {
    if (this.validateForm()) {

    }
  }

  validateForm() {
    if (this.vitalsForm.valid) {
      return true;
    }
    for (const i of Object.keys(this.vitalsForm.controls)) {
      if (this.vitalsForm.controls[i].invalid) {
        this.vitalsForm.controls[i].markAsDirty();
        this.vitalsForm.controls[i].updateValueAndValidity();
      }
    }
  }
}
