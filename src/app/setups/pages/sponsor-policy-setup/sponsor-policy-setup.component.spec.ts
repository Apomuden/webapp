import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SponsorPolicySetupComponent } from './sponsor-policy-setup.component';

describe('SponsorPolicySetupComponent', () => {
  let component: SponsorPolicySetupComponent;
  let fixture: ComponentFixture<SponsorPolicySetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SponsorPolicySetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SponsorPolicySetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
