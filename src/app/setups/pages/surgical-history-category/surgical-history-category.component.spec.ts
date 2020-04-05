import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SurgicalHistoryCategoryComponent } from './surgical-history-category.component';

describe('SurgicalHistoryCategoryComponent', () => {
  let component: SurgicalHistoryCategoryComponent;
  let fixture: ComponentFixture<SurgicalHistoryCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SurgicalHistoryCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SurgicalHistoryCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
