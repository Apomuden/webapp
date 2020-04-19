import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LabParametersComponent } from './lab-parameters.component';

describe('LabParametersComponent', () => {
  let component: LabParametersComponent;
  let fixture: ComponentFixture<LabParametersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LabParametersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabParametersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
