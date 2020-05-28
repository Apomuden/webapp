import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IvfConsultationComponent } from './ivf-consultation.component';

describe('IvfConsultationComponent', () => {
  let component: IvfConsultationComponent;
  let fixture: ComponentFixture<IvfConsultationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IvfConsultationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IvfConsultationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
