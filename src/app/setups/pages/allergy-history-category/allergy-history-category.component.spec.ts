import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllergyHistoryCategoryComponent } from './allergy-history-category.component';

describe('AllergyHistoryCategoryComponent', () => {
  let component: AllergyHistoryCategoryComponent;
  let fixture: ComponentFixture<AllergyHistoryCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllergyHistoryCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllergyHistoryCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
