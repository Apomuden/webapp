import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {SetupService} from 'src/app/shared/services/setup.service';
import {NzNotificationService} from 'ng-zorro-antd';
import {first} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {ConsultationQuestion, ConsultationQuestionOption} from "../../../shared/models/ConsultationQuestion";

@Component({
  selector: 'app-consultation-questions',
  templateUrl: './consultation-questions.component.html',
  styles: []
})
export class ConsultationQuestionsComponent implements OnInit, AfterViewInit, OnDestroy {

  questionForm = this.fb.group({
    question: [null, Validators.required],
    gender: ['MALE,FEMALE', Validators.required],
    value_type: ['Text', Validators.required],
  });
  optionForm = this.fb.group({
    consultation_question_id: [null, Validators.required],
    consultation_question: [{value: null, disabled: true}, Validators.required],
    value: [null, Validators.required],
    gender: [null, Validators.required],
  });

  questions: ConsultationQuestion[] = [];
  options: ConsultationQuestionOption[] = [];

  isQuestionsLoading = true;
  isCreatingQuestion = false;
  isQuestionModalVisible = false;
  isOptionModalVisible = false;
  isEditingQuestion = false;
  isEditingOption = false;
  isOptionsLoading = false;
  isCreatingOption = false;

  editQuestion: ConsultationQuestion;
  editOption: ConsultationQuestionOption;
  activeQuestion: ConsultationQuestion;

  constructor(
    private fb: FormBuilder,
    private setupService: SetupService,
    private notification: NzNotificationService,
  ) {
  }

  public get isSelect(): boolean {
    return this.activeQuestion && this.activeQuestion.value_type === 'Select';
  }

  ngOnInit() {
    this.getQuestions().then();
  }

  ngAfterViewInit() {
  }

  ngOnDestroy() {
  }

  async getQuestions() {
    this.isQuestionsLoading = true;
    this.questions = await this.setupService.getConsultationQuestions().toPromise();
    this.isQuestionsLoading = false;
    const question = this.questions.find(q => q.value_type === 'Select')
    if (question) {
      this.activeQuestion = question;
      await this.getQuestionOptions(question);
    }
  }

  async getQuestionOptions(que: any) {
    this.isOptionsLoading = true;
    this.activeQuestion = que;
    this.optionForm.get('consultation_question_id').setValue(que.id);
    this.optionForm.get('consultation_question').setValue(que.question);
    this.options = [];
    this.options = await this.setupService.getQuestionOptions(que.id).toPromise();
    this.isOptionsLoading = false;
  }

  resetQue() {
    this.questionForm.reset();
    this.questionForm.get('value_type').setValue('Text');
    this.questionForm.get('gender').setValue('MALE,FEMALE');
    this.isQuestionModalVisible = false;
    this.editQuestion = null;
    this.isEditingQuestion = false;
  }

  resetOpt() {
    this.optionForm.reset();
    this.optionForm.get('gender').setValue('MALE,FEMALE');
    this.isOptionModalVisible = false;
    this.editOption = null;
    this.isEditingOption = false;
  }

  async submitQuestion() {
    this.isCreatingQuestion = true;
    let observable: Observable<boolean>;
    observable = !this.isEditingQuestion
      ? this.setupService.createConsultationQuestion(this.questionForm.value)
      : this.setupService.editConsultationQuestion(this.editQuestion.id, this.questionForm.value);
    const success = await observable.toPromise()
    this.isCreatingQuestion = false;
    this.showNotification(!success);
    if (success) {
      this.resetQue();
      await this.getQuestions();
    }
  }

  async submitOption() {
    this.isCreatingOption = true;
    const observable = !this.isEditingOption
      ? this.setupService.createQuestionOption(this.optionForm.value)
      : this.setupService.editQuestionOption(this.editOption.id, this.optionForm.value);
    const success = await observable.toPromise();
    this.isCreatingOption = false;
    this.showNotification(!success);
    if (success) {
      this.closeOptionModal();
      await this.getQuestionOptions(this.activeQuestion);
    }
  }

  showQuestionModal(question?: ConsultationQuestion) {
    if (question) {
      this.editQuestion = question;
      this.isEditingQuestion = true;
      for (const i of Object.keys(this.questionForm.value)) {
        this.questionForm.get(i).setValue(question[i]);
      }
    }
    this.isQuestionModalVisible = true;
  }

  closeQuestionModal() {
    this.isEditingQuestion = false;
    this.editQuestion = null;
    this.resetQue();
    this.isQuestionModalVisible = false;
  }

  showOptionModal(option?: any) {
    if (option) {
      this.editOption = option;
      this.isEditingOption = true;
      for (const i of Object.keys(this.optionForm.value)) {
        this.optionForm.get(i).setValue(option[i]);
      }
    }
    this.optionForm.get('consultation_question').setValue(this.activeQuestion.question);
    this.isOptionModalVisible = true
  }

  closeOptionModal() {
    this.isEditingOption = false;
    this.editOption = null;
    this.resetOpt();
    this.isOptionModalVisible = false;
  }

  async deleteQuestion(opt: any) {
    this.isQuestionsLoading = true;
    const success = await this.setupService.deleteQuestion(opt.id).toPromise();
    this.isQuestionsLoading = false;
    this.showNotification(!success);
    if (!success) {
      return;
    }
    const index = this.questions.findIndex(p => p.id === opt.id);
    this.questions.splice(index, 1);
    if (this.activeQuestion === opt) {
      this.activeQuestion = null;
      this.options = [];
    }
  }

  async deleteOption(opt: any) {
    this.isOptionsLoading = true;
    const success = await this.setupService.deleteOption(opt.id).toPromise();
    this.isOptionsLoading = false;
    this.showNotification(!success);
    if (success) {
      const index = this.options.findIndex(f => f.id === opt.id);
      this.options.splice(index, 1);
    }
  }

  showNotification(isError = false) {
    if (isError) {
      this.notification.error('Error', 'Operation unsuccessful');
      return;
    }
    this.notification.success('Success', 'Processed Successfully');
  }

  toggleItem($event: any, item: any, isQue = false) {
    const path = isQue ? 'consultationquestions' : 'consultationquestionoptions';
    this.setupService.toggleActive(`setups/${path}/${item.id}`, $event ? 'ACTIVE' : 'INACTIVE').pipe(first())
      .subscribe(({id, isActivated}: any) => {
        const index = isQue
          ? this.questions.findIndex(l => l.id === id)
          : this.options.findIndex(l => l.id === id);
        if (isQue) {
          this.questions[index].isActivated = isActivated;
        } else {
          this.options[index].isActivated = isActivated;
        }
      }, _ => {
        let index: number;
        if (isQue) {
          index = this.questions.findIndex(l => l.id === item.id);
          this.questions[index].isActivated = !item.isActivated;
        } else {
          index = this.options.findIndex(l => l.id === item.id);
          this.options[index].isActivated = !item.isActivated;
        }
        this.notification.error('Toggle failed', 'Unable to toggle this item.');
      });
  }

  asQuestion(value: any) {
    return value as ConsultationQuestion;
  }

  asOption(value: any) {
    return value as ConsultationQuestionOption;
  }
}
