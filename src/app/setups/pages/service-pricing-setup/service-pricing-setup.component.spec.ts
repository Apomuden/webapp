import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicePricingSetupComponent } from './service-pricing-setup.component';

describe('ServicePricingSetupComponent', () => {
  let component: ServicePricingSetupComponent;
  let fixture: ComponentFixture<ServicePricingSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServicePricingSetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServicePricingSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
