import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhysicalExaminationCategoryComponent } from './physical-examination-category.component';

describe('PhysicalExaminationCategoryComponent', () => {
  let component: PhysicalExaminationCategoryComponent;
  let fixture: ComponentFixture<PhysicalExaminationCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhysicalExaminationCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhysicalExaminationCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
