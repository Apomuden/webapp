import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef, Input, HostListener, Output, EventEmitter } from '@angular/core';
import { PhysicianService } from '../services/physician.service';
import { SetupService } from 'src/app/shared/services/setup.service';
import { NzNotificationService, NzInputDirective } from 'ng-zorro-antd';
import { first } from 'rxjs/operators';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { FormBuilder } from '@angular/forms';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-patient-history',
  templateUrl: './patient-history.component.html',
  styleUrls: ['./patient-history.component.css']
})
export class PatientHistoryComponent implements OnInit, OnDestroy, AfterViewInit {
  patientHistoryForm = this.fb.group({
    presenting_complaints: [null],
    presenting_complaints_history: [null],
    direct_questions: [null],
    past_medical_history: [null],
    medicine_history: [null],
    surgical_history: [null],
    allergies_history: [null],
    family_history: [null],
    social_history: [null],
    chief_complaint_relation_id: [0],
  });
  previousHistories: any;
  defaultRelationship = {
    name: 'Self',
    id: 0,
  };
  relationships = [this.defaultRelationship];
  editName: string | null;
  submiting = false;

  @ViewChild(NzInputDirective, { static: false, read: ElementRef }) inputElement: ElementRef;
  @Input() patientId: number;
  @Input() consultationId: any;
  @Input() patientStatus: any;
  @Input() userId: any;
  @Output() nextClicked: EventEmitter<any> = new EventEmitter();
  consultationDate = formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss', 'en');
  patientHistory: any;

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
  }

  ngAfterViewInit() {
    this.getPatientHistories(this.patientId);
    this.getPatientHistory(this.patientId);
    this.physicianService.consultationDate$.pipe(untilComponentDestroyed(this))
      .subscribe(date => {
        this.consultationDate = formatDate(date, 'yyyy-MM-dd HH:mm:ss', 'en');
      });
  }

  ngOnDestroy() { }

  getPatientHistories(patientId: number) {
    this.physicianService.getPatientHistories(patientId).pipe(first())
      .subscribe(histories => {
        histories = histories.reverse();
        this.previousHistories = histories;
      });
  }

  getPatientHistory(patientId: number) {
    this.physicianService.getPatientHistory(patientId).pipe(first())
      .subscribe(history => {
        history.panelActive = true; // to open the collapse panel in the ui
        this.patientHistory = history;
      });
  }

  cancel() {
    // emit cancel event
    this.nextClicked.emit(null);
  }

  submit() {
    if (this.patientHistoryForm.pristine) {
      this.nextClicked.emit(this.previousHistories || {});
      return;
    }
    const data = this.processPatientHistoryData();
    this.physicianService.savePatientHistory(data).pipe(first())
      .subscribe(res => {
        if (res) {
          this.patientHistoryForm.reset();
          this.getPatientHistories(this.patientId);
          this.nextClicked.emit(res.data);
        }
      }, error => {
        console.error(error);
        this.notificationS.error('Error', 'Unable to proceed');
      });
  }

  processPatientHistoryData() {
    const data = this.patientHistoryForm.value;
    data.chief_complaint_relation_id = (data.chief_complaint_relation_id === 0) ? null : data.chief_complaint_relation_id;
    return {
      patient_id: this.patientId,
      consultation_id: this.consultationId,
      patient_status: this.patientStatus,
      consultant_id: this.userId,
      consultation_date: this.consultationDate,
      ...data
    };
  }
}
