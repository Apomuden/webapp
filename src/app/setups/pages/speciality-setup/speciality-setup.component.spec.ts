import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialitySetupComponent } from './speciality-setup.component';

describe('SpecialitySetupComponent', () => {
  let component: SpecialitySetupComponent;
  let fixture: ComponentFixture<SpecialitySetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecialitySetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecialitySetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
