import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffCategorySetupComponent } from './staff-category-setup.component';

describe('StaffCategorySetupComponent', () => {
  let component: StaffCategorySetupComponent;
  let fixture: ComponentFixture<StaffCategorySetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StaffCategorySetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StaffCategorySetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
