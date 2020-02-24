import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClinicServiceSetupComponent } from './clinic-service-setup.component';

describe('ClinicServiceSetupComponent', () => {
  let component: ClinicServiceSetupComponent;
  let fixture: ComponentFixture<ClinicServiceSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClinicServiceSetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClinicServiceSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
