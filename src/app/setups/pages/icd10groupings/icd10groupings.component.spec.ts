import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Icd10groupingsComponent } from './icd10groupings.component';

describe('Icd10groupingsComponent', () => {
  let component: Icd10groupingsComponent;
  let fixture: ComponentFixture<Icd10groupingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Icd10groupingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Icd10groupingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
