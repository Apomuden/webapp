import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentChannelSetupComponent } from './payment-channel-setup.component';

describe('PaymentChannelSetupComponent', () => {
  let component: PaymentChannelSetupComponent;
  let fixture: ComponentFixture<PaymentChannelSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentChannelSetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentChannelSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
