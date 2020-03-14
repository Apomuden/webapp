import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllowedInstallmentTypeSetupComponent } from './allowed-installment-type-setup.component';

describe('AllowedInstallmentTypeSetupComponent', () => {
  let component: AllowedInstallmentTypeSetupComponent;
  let fixture: ComponentFixture<AllowedInstallmentTypeSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllowedInstallmentTypeSetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllowedInstallmentTypeSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
