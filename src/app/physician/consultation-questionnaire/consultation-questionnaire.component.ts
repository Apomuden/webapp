import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from "@angular/core";
import {NzNotificationService} from "ng-zorro-antd";
import {SetupService} from "src/app/shared/services/setup.service";
import {FormBuilder} from "@angular/forms";
import {PhysicianService} from "../services/physician.service";
import {formatDate} from "@angular/common";
import {untilComponentDestroyed} from "@w11k/ngx-componentdestroyed";
import {ConsultationData} from "../../shared/models/consultation-data.model";
import {ConsultationGroupedResponses, ConsultationQuestion} from "../../shared/models/consultation-questionnaire.model";
import {ValueType} from "../../shared/models/common.model";

@Component({
  selector: "app-consultation-questionnaire",
  templateUrl: "./consultation-questionnaire.component.html",
  styleUrls: ["./consultation-questionnaire.component.css"]
})
export class ConsultationQuestionnaireComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() consultation: any;
  @Input() patient: any;
  @Input() userId: string;
  // consultation data for holding child component data states
  @Input() consultationData: ConsultationData;

  @Output() nextClicked: EventEmitter<any> = new EventEmitter();
  @Output() previousClicked: EventEmitter<any> = new EventEmitter();

  questionForm = this.fb.group({});
  questions: ConsultationQuestion[][] = [];
  previousResponses: ConsultationGroupedResponses[];
  isSubmitting = false;
  isLoading = true;
  consultationDate = formatDate(new Date(), "yyyy-MM-dd HH:mm:ss", "en");

  constructor(
    private setUpService: SetupService,
    private fb: FormBuilder,
    private physicianService: PhysicianService,
    private setupService: SetupService,
    private notificationS: NzNotificationService
  ) {
  }

  ngOnInit() {
    this.getPreviousResponses(this.patient.id).then();
    this.setUpForm().then();
  }

  ngAfterViewInit() {
    this.physicianService.consultationDate$
      .pipe(untilComponentDestroyed(this))
      .subscribe(date => {
        this.consultationDate = formatDate(date, "yyyy-MM-dd HH:mm:ss", "en");
      });
  }

  ngOnDestroy() {
  }

  private async setUpForm() {
    const temp: ConsultationQuestion[] = await this.setupService
      .getConsultationQuestions(this.patient.gender).toPromise();
    temp.forEach((field, index) => {
      this.questionForm.addControl(`${field.id}`, this.fb.control(null));
      // get options for select types
      if (field.value_type === ValueType.SELECT) {
        field.isLoadingOptions = true;
        this.setupService.getQuestionOptions(field.id)
          .subscribe(opts => {
            field.options = opts.filter(o => o.isActivated);
          });
      }

      // put the fields in groups of 2
      if (index % 2 === 0) {
        this.questions.push([field]);
      } else {
        this.questions[index - this.questions.length].push(field);
      }
    });
    this.questionForm.updateValueAndValidity();
  }

  async getPreviousResponses(patientId: number) {
    this.previousResponses = await this.physicianService.getQuestionResponses(patientId, true)
      .toPromise();
    this.isLoading = false;
  }

  previous() {
    // emit previous step event
    this.previousClicked.emit();
  }

  async submit() {
    for (let key in this.questionForm.controls) {
      this.questionForm.get(key).updateValueAndValidity();
    }
    if (this.questionForm.pristine) {
      this.nextClicked.emit(this.previousResponses || {});
      return;
    } else if (!this.questionForm.pristine && !this.questionForm.valid) {
      return;
    }
    this.isSubmitting = true;
    const data = this.processExamData();
    const success = await this.physicianService.saveQuestionResponse(data).toPromise();
    this.isSubmitting = false;
    if (success) {
      this.questionForm.reset();
      this.nextClicked.emit({});
      return;
    }
    this.notificationS.error('Error', 'Operation could not be completed')
  }

  processExamData() {
    const data = {
      consultation_id: this.consultation.id,
      consultant_id: this.userId,
      patient_id: this.patient.id,
      response_date: formatDate(new Date(), "yyyy-MM-dd HH:mm:ss", "en"),
      responses: [],
    };
    this.questions.forEach((ques: any[]) => {
      ques.forEach(question => {
        data.responses.push({
          consultation_question_id: question.id,
          response: this.questionForm.get(`${question.id}`).value
        });
      });
    });
    return data;
  }
}
