import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingCycleSetupComponent } from './billing-cycle-setup.component';

describe('BillingCycleSetupComponent', () => {
  let component: BillingCycleSetupComponent;
  let fixture: ComponentFixture<BillingCycleSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillingCycleSetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillingCycleSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
