import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductTypeAndCategoryComponent } from './product-type-and-category.component';

describe('ProductTypeAndCategoryComponent', () => {
  let component: ProductTypeAndCategoryComponent;
  let fixture: ComponentFixture<ProductTypeAndCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductTypeAndCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductTypeAndCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
