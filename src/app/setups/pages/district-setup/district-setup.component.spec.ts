import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DistrictSetupComponent } from './district-setup.component';

describe('DistrictSetupComponent', () => {
  let component: DistrictSetupComponent;
  let fixture: ComponentFixture<DistrictSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DistrictSetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DistrictSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
