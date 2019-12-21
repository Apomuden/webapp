import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EducationLevelSetupComponent } from './education-level-setup.component';

describe('EducationLevelSetupComponent', () => {
  let component: EducationLevelSetupComponent;
  let fixture: ComponentFixture<EducationLevelSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EducationLevelSetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EducationLevelSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
