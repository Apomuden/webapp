import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClinicTypeSetupComponent } from './clinic-type-setup.component';

describe('ClinicTypeSetupComponent', () => {
  let component: ClinicTypeSetupComponent;
  let fixture: ComponentFixture<ClinicTypeSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClinicTypeSetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClinicTypeSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
