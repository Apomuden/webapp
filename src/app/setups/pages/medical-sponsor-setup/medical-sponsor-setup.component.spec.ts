import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalSponsorSetupComponent } from './medical-sponsor-setup.component';

describe('MedicalSponsorSetupComponent', () => {
  let component: MedicalSponsorSetupComponent;
  let fixture: ComponentFixture<MedicalSponsorSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MedicalSponsorSetupComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicalSponsorSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
