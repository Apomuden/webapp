import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd';
import { SetupService } from 'src/app/shared/services/setup.service';
import { FormBuilder, Validators } from '@angular/forms';
import { PhysicianService } from '../services/physician.service';
import { first, takeUntil } from 'rxjs/operators';
import { formatDate } from '@angular/common';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';

@Component({
  selector: 'app-physical-exam',
  templateUrl: './physical-exam.component.html',
  styleUrls: ['./physical-exam.component.css']
})
export class PhysicalExamComponent implements OnInit, OnDestroy, AfterViewInit {
  physicalExamForm = this.fb.group({});
  examFields: any[];
  previousExams: any[];
  defaultRelationship = {
    name: 'Self',
    id: 0,
  };
  relationships = [this.defaultRelationship];
  submiting = false;

  @Input() consultation: any;
  @Input() patient: any;
  @Input() userId: any;
  @Output() nextClicked: EventEmitter<any> = new EventEmitter();
  @Output() previousClicked: EventEmitter<any> = new EventEmitter();
  consultationDate = formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss', 'en');
  examinedToday = false;

  constructor(
    private setUpService: SetupService,
    private fb: FormBuilder,
    private physicianService: PhysicianService,
    private notificationS: NzNotificationService,
  ) { }

  ngOnInit() {
    this.setUpService.getRelationships().pipe(first())
      .subscribe(res => {
        this.relationships.push(...res.data);
      });
    this.physicianService.getPhysicalExamCategories().pipe(first())
      .subscribe(res => {
        this.examFields = res;
        this.examFields.forEach(field => {
          this.physicalExamForm.addControl(field.name, this.fb.control(null));
          this.physicalExamForm.addControl(`${field.name}Abnormal`, this.fb.control(false));
          field.form = this.physicalExamForm.get(field.name);
          field.abnormal = this.physicalExamForm.get(`${field.name}Abnormal`);
        });
        this.physicalExamForm.valueChanges.pipe(untilComponentDestroyed(this))
          .subscribe(examData => {
            this.examFields.forEach(field => {
              if (examData[`${field.name}Abnormal`] && this.physicalExamForm.get(field.name)) {
                this.physicalExamForm.get(field.name).setValidators(Validators.required);
              } else {
                this.physicalExamForm.get(field.name).clearValidators();
              }
            });
          });
      });
  }

  ngAfterViewInit() {
    this.getPhysicalExams(this.patient.id);

    this.physicianService.consultationDate$.pipe(untilComponentDestroyed(this))
      .subscribe(date => {
        this.consultationDate = formatDate(date, 'yyyy-MM-dd HH:mm:ss', 'en');
      });
  }

  ngOnDestroy() { }

  getPhysicalExams(patientId: number) {
    this.physicianService.getPhysicalExams(patientId).pipe(first())
      .subscribe((exams: any[]) => {
        this.previousExams = [];
        exams = exams.reverse();
        exams.forEach(exam => {
          this.examinedToday = exam.consultation_id === this.consultation.id;
          if (this.examinedToday) {
            if (exam.category_name) {
              this.physicalExamForm.get(exam.category_name).setValue(exam.note);
              this.physicalExamForm.get(`${exam.category_name}Abnormal`).setValue(true);
            }
          }
          if (!this.previousExams.find(pe => pe.consultation_date === exam.consultation_date)) {
            this.previousExams.push({
              consultation_date: exam.consultation_date,
              exams: exams.filter(e => e.consultation_date === exam.consultation_date)
            });
          }
        });
      });
  }

  previous() {
    // emit previous step event
    this.previousClicked.emit();
  }

  submit() {
    if (this.physicalExamForm.pristine) {
      this.nextClicked.emit(this.previousExams || {});
      return;
    }
    const data = this.processExamData();
    this.physicianService.savePhysicalExams(data).pipe(first())
      .subscribe(res => {
        if (res) {
          this.physicalExamForm.reset();
          this.getPhysicalExams(this.patient.id);
          this.nextClicked.emit(res.data);
        }
      }, error => {
        console.error(error);
        this.notificationS.error('Error', 'Unable to proceed');
      });
  }

  processExamData() {
    const exams = [];
    this.examFields.forEach(field => {
      if (this.physicalExamForm.get(`${field.name}Abnormal`).value) {
        exams.push({
          note: this.physicalExamForm.get(field.name).value,
          category_id: field.id,
        });
      }
    });
    return {
      consultation_id: this.consultation.id,
      patient_status: this.consultation.patient_status,
      consultation_date: this.consultationDate,
      consultant_id: this.userId,
      exams: exams
    };
  }
}
