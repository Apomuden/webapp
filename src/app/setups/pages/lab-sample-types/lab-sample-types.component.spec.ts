import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LabSampleTypesComponent } from './lab-sample-types.component';

describe('LabSampleTypesComponent', () => {
  let component: LabSampleTypesComponent;
  let fixture: ComponentFixture<LabSampleTypesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LabSampleTypesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabSampleTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
