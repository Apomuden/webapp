import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FamilyHistoryCategoryComponent } from './family-history-category.component';

describe('FamilyHistoryCategoryComponent', () => {
  let component: FamilyHistoryCategoryComponent;
  let fixture: ComponentFixture<FamilyHistoryCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FamilyHistoryCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FamilyHistoryCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
