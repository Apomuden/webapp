import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicineHistoryCategoryComponent } from './medicine-history-category.component';

describe('MedicineHistoryCategoryComponent', () => {
  let component: MedicineHistoryCategoryComponent;
  let fixture: ComponentFixture<MedicineHistoryCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MedicineHistoryCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicineHistoryCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
