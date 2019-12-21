import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceCategorySetupComponent } from './service-category-setup.component';

describe('ServiceCategorySetupComponent', () => {
  let component: ServiceCategorySetupComponent;
  let fixture: ComponentFixture<ServiceCategorySetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceCategorySetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceCategorySetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
