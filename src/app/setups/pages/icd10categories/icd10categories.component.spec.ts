import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Icd10categoriesComponent } from './icd10categories.component';

describe('Icd10categoriesComponent', () => {
  let component: Icd10categoriesComponent;
  let fixture: ComponentFixture<Icd10categoriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Icd10categoriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Icd10categoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
