import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentStyleSetupComponent } from './payment-style-setup.component';

describe('PaymentStyleSetupComponent', () => {
  let component: PaymentStyleSetupComponent;
  let fixture: ComponentFixture<PaymentStyleSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentStyleSetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentStyleSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
