import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacilityManagementNumberingSettingComponent } from './facility-management-numbering-setting.component';

describe('FacilityManagementNumberingSettingComponent', () => {
  let component: FacilityManagementNumberingSettingComponent;
  let fixture: ComponentFixture<FacilityManagementNumberingSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacilityManagementNumberingSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacilityManagementNumberingSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
