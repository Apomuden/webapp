/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { StockAdjustmentApprovalSearchComponent } from './stock-adjustment-approval-search.component';

describe('StockAdjustmentApprovalSearchComponent', () => {
  let component: StockAdjustmentApprovalSearchComponent;
  let fixture: ComponentFixture<StockAdjustmentApprovalSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockAdjustmentApprovalSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockAdjustmentApprovalSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
