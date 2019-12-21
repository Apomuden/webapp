import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingSystemSetupComponent } from './billing-system-setup.component';

describe('BillingSystemSetupComponent', () => {
  let component: BillingSystemSetupComponent;
  let fixture: ComponentFixture<BillingSystemSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillingSystemSetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillingSystemSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
