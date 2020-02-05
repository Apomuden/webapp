import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SponsorshipPermitComponent } from './sponsorship-permit.component';

describe('SponsorshipPermitComponent', () => {
  let component: SponsorshipPermitComponent;
  let fixture: ComponentFixture<SponsorshipPermitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SponsorshipPermitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SponsorshipPermitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
