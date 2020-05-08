import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductFormAndUnitComponent } from './product-form-and-unit.component';

describe('ProductFormAndUnitComponent', () => {
  let component: ProductFormAndUnitComponent;
  let fixture: ComponentFixture<ProductFormAndUnitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductFormAndUnitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductFormAndUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
