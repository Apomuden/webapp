import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultationQuestionsComponent } from './consultation-questions.component';

describe('LabParametersComponent', () => {
  let component: ConsultationQuestionsComponent;
  let fixture: ComponentFixture<ConsultationQuestionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsultationQuestionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultationQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
