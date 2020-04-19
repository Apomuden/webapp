import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LaboratorySetupComponent } from './laboratory-setup.component';

describe('LaboratorySetupComponent', () => {
  let component: LaboratorySetupComponent;
  let fixture: ComponentFixture<LaboratorySetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LaboratorySetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LaboratorySetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
