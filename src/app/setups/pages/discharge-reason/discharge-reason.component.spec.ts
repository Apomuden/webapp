import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DischargeReasonComponent } from './discharge-reason.component';

describe('DischargeReasonComponent', () => {
  let component: DischargeReasonComponent;
  let fixture: ComponentFixture<DischargeReasonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DischargeReasonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DischargeReasonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
