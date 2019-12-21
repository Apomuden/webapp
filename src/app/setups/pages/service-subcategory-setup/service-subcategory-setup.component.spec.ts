import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceSubcategorySetupComponent } from './service-subcategory-setup.component';

describe('ServiceSubcategorySetupComponent', () => {
  let component: ServiceSubcategorySetupComponent;
  let fixture: ComponentFixture<ServiceSubcategorySetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceSubcategorySetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceSubcategorySetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
