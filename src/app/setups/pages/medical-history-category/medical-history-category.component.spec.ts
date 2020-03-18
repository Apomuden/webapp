import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalHistoryCategoryComponent } from './medical-history-category.component';

describe('MedicalHistoryCategoryComponent', () => {
  let component: MedicalHistoryCategoryComponent;
  let fixture: ComponentFixture<MedicalHistoryCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MedicalHistoryCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicalHistoryCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
