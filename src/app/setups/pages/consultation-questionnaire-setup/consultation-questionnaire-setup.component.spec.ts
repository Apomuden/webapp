import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultationQuestionnaireSetupComponent } from './consultation-questionnaire-setup.component';

describe('ConsultationQuestionnaireSetupComponent', () => {
  let component: ConsultationQuestionnaireSetupComponent;
  let fixture: ComponentFixture<ConsultationQuestionnaireSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsultationQuestionnaireSetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultationQuestionnaireSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
