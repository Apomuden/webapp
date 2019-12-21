import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffTypeSetupComponent } from './staff-type-setup.component';

describe('StaffTypeSetupComponent', () => {
  let component: StaffTypeSetupComponent;
  let fixture: ComponentFixture<StaffTypeSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StaffTypeSetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StaffTypeSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
