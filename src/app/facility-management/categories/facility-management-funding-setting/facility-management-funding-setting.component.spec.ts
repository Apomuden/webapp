import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacilityManagementFundingSettingComponent } from './facility-management-funding-setting.component';

describe('FacilityManagementFundingSettingComponent', () => {
  let component: FacilityManagementFundingSettingComponent;
  let fixture: ComponentFixture<FacilityManagementFundingSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacilityManagementFundingSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacilityManagementFundingSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
