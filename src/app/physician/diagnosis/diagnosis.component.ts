import { PhysicianService } from './../services/physician.service';
import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd';
import { SetupService } from 'src/app/shared/services/setup.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { first, takeUntil } from 'rxjs/operators';
import { formatDate } from '@angular/common';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';

@Component({
  selector: 'app-diagnosis',
  templateUrl: './diagnosis.component.html',
  styleUrls: ['./diagnosis.component.css']
})
export class DiagnosisComponent implements OnInit {
  @Input() consultation: any;
  @Input() patient: any;
  @Input() userId: any;
  @Output() nextClicked: EventEmitter<any> = new EventEmitter();
  @Output() previousClicked: EventEmitter<any> = new EventEmitter();
  consultationDate = formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss', 'en');
  submiting = false;
  isLoading = true;
  previousDiagnosis = null;
  diagnosisForm: FormGroup;
  diseasesLoading = false;
  diagnosisKey = 0;
  diagnosis = [];
  diseases = [];


  constructor(
    private physicianService: PhysicianService,
    private fb: FormBuilder,
    private setup: SetupService,
    private notification: NzNotificationService
  ) { }

  ngOnInit() {
    this.diagnosisForm = this.fb.group({
      diagnosis_type: [null, Validators.required],
      diagnosis_status: [null, Validators.required],
      disease_id: [null, Validators.required],
      remarks: [null, Validators.required]
    });
    this.getDiagnosis(this.patient.id);
    this.getDiseases();
  }

  getDiagnosis(patientId: number) {
    this.physicianService.getDiagnosis(patientId).pipe(first())
      .subscribe((diagnosis: any[]) => {
        this.previousDiagnosis = [];
        diagnosis = diagnosis.reverse();
        diagnosis.forEach(diag => {
          if (!this.previousDiagnosis.find(pd => pd.attendance_date === diag.attendance_date)) {
            this.previousDiagnosis.push({
              attendance_date: diag.attendance_date,
              diagnosis: diagnosis.filter(e => e.attendance_date === diag.attendance_date)
            });
          }
        });
        this.isLoading = false;
      }, e => { console.log(e); this.isLoading = false; });
  }


  addDiagnosis() {
    if (this.diagnosisForm.valid) {
      const diseaseId = this.diagnosisForm.get('disease_id').value;
      const diseaseValue = this.diseases.filter(disease => disease.id === diseaseId)[0].name;
      this.diagnosis = [...this.diagnosis, { ...this.diagnosisForm.value, diseaseValue, key: this.diagnosisKey }];
      this.diagnosisKey++;
      console.log(this.diagnosis);
      this.diagnosisForm.reset();
    } else {
      this.notification.error('Error', 'All fields are required');
    }
  }

  getDiseases() {
    this.diseasesLoading = true;
    this.setup.genericGet('setups/diseases').pipe(first())
      .subscribe(diseases => {
        this.diseases = diseases;
        this.diseasesLoading = false;
      }, e => { console.log(e); this.diseasesLoading = false; });
  }
  submit() {
    const diagnosisItems = JSON.parse(JSON.stringify(this.diagnosis));
    diagnosisItems.forEach(item => {
      delete item.diseaseValue;
      delete item.key;
    });
    const data = {
      consultation_id: this.consultation.id,
      patient_status: this.consultation.patient_status,
      consultation_date: this.consultationDate,
      consultant_id: this.userId,
      diagnoses: diagnosisItems
    };

    this.physicianService.saveDiagnosis(data).pipe(first())
      .subscribe(res => {
        if (res && (res.errorCode === '000')) {
          this.diagnosis = [];
          this.diagnosisKey = 0;
          this.nextClicked.emit(res.data);
        }
        this.submiting = false;
      }, error => {
        this.submiting = false;
        this.notification.error('Error', 'Unable to proceed');
      });
  }

  deleteItem(item) {
    this.diagnosis = this.diagnosis.filter(d => d.key !== item.key);
  }
  previous() {

  }


  // {
  //   "consultation_id":96,
  //   "patient_status":"OUT-PATIENT",
  //   "consultation_date":"2020-04-09",
  //   "diagnoses":[
  //     {
  //         "disease_id":1,
  //       "diagnosis_type":"CONFIRM",
  //       "diagnosis_status":"NEW",
  //       "remarks":"Lorem Ipsum is simply dummy text of the printing and typesetting industry"
  //     }
  //   ],
  //   "consultant_id":"2d6cdefc-d1d6-48e4-baad-f35a66138a63"
  // }
}
