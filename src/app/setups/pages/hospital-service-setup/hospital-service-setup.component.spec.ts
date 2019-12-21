import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalServiceSetupComponent } from './hospital-service-setup.component';

describe('HospitalServiceSetupComponent', () => {
  let component: HospitalServiceSetupComponent;
  let fixture: ComponentFixture<HospitalServiceSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HospitalServiceSetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HospitalServiceSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
