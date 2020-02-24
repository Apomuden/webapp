import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacilityManagementDetailComponent } from './facility-management-detail.component';

describe('FacilityManagementDetailComponent', () => {
  let component: FacilityManagementDetailComponent;
  let fixture: ComponentFixture<FacilityManagementDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacilityManagementDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacilityManagementDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
