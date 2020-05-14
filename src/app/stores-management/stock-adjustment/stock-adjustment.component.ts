import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { StockData } from './stock-adjustment.model';

@Component({
  selector: 'app-stock-adjustment',
  templateUrl: './stock-adjustment.component.html',
  styleUrls: ['./stock-adjustment.component.scss']
})
export class StockAdjustmentComponent implements OnInit {
  // setup form
  isLoadingStoreDept = false;
  isLoadingRefNumber = false;

  storeDeptsList: string[] = ['Antenatal Store', 'Children\'s Ward'];

  adjustmentTypeList: string[] = ['OPERATIONAL', 'OPENING'];

  stockAdjustmentForm: FormGroup;
  stockItemForm: FormGroup;

  adjustedStockData: StockData[] = [];


  constructor(private readonly fb: FormBuilder) {}

  ngOnInit() {
    // TODO: error and validation re-check
    this.stockAdjustmentForm = this.fb.group({
      storeDept: [this.storeDeptsList[0], Validators.required], // TODO: check defaults
      adjustmentType: [this.adjustmentTypeList[0], Validators.required], // TODO: check defaults
      adjustmentDate: [new Date(), Validators.required],
      adjustmentRef: [
        '8f14a65f-3032-42c8-a196-1cf66d11b930',
        Validators.required
      ],
      totalAdjustedQty: ['', Validators.required],
      name: ['', Validators.required],
      totalExpectedValue: ['', Validators.required],
      designation: ['', Validators.required]
    });

    // disable adjustment ref form field
    this.stockAdjustmentForm.get('adjustmentRef').disable();

    this.stockItemForm = this.fb.group({
      productName: ['', Validators.required],
      uom: ['ml', Validators.required],
      qtyAtHand: [null, Validators.required],
      unitCost: [null, Validators.required],
      adjustmentMode: ['+', Validators.required],
      adjustmentQuantity: [null, Validators.required],
      expectedValue: [null, Validators.required],
      batchNo: ['', Validators.required],
      expiryDate: [new Date(), Validators.required],
      reason: ['Expired', Validators.required]
    });

    this.stockItemForm.get('expectedValue').disable();
  }

  get qtyAtHandControl() {
    return this.stockItemForm.get('qtyAtHand');
  }

  get adjustmentModeControl() {
    return this.stockItemForm.get('adjustmentMode');
  }

  get adjustmentQuantityControl() {
    return this.stockItemForm.get('adjustmentQuantity');
  }

  get expectedValueControl() {
    return this.stockItemForm.get('expectedValue');
  }

  adjustmentQtyChanged() {
    console.log('value changed'); // TODO: REMOVE THIS LINE

    const qtyAtHand = parseInt(this.qtyAtHandControl.value, 10);

    if (isNaN(qtyAtHand)) {
      this.qtyAtHandControl.setValue(null);
      this.qtyAtHandControl.markAsDirty();
      this.qtyAtHandControl.updateValueAndValidity();
      return;
    }

    const adjQty = parseInt(this.adjustmentQuantityControl.value, 10);

    if (isNaN(adjQty)) {
      this.adjustmentQuantityControl.setValue(null);
      this.adjustmentModeControl.markAsDirty();
      this.adjustmentModeControl.updateValueAndValidity();
      return;
    }

    if (this.adjustmentModeControl.value === '-') {
      const sub = qtyAtHand - adjQty;

      if (sub >= 0) {
        this.adjustmentQuantityControl.setErrors(null);
        this.expectedValueControl.setValue(qtyAtHand - adjQty);
      } else {
        this.expectedValueControl.setValue(null);
        this.adjustmentQuantityControl.setErrors({
          valueBelowZero: true
        });
      }
    } else if (this.adjustmentModeControl.value === '+') {
      this.expectedValueControl.setValue(qtyAtHand + adjQty);
    }
  }

  addStockItem() {
    for (const key of Object.keys(this.stockItemForm.controls)) {
      const formControl = this.stockItemForm.controls[key];
      formControl.markAsDirty();
      formControl.updateValueAndValidity();
    }

    if (!this.stockItemForm.valid) {
      return;
    }

    const formControls = this.stockItemForm.controls;
    const stockData: StockData = {
      productName: formControls.productName.value,
      uom: formControls.uom.value,
      qtyAtHand: this.qtyAtHandControl.value,
      unitCost: formControls.unitCost.value,
      adjustmentMode: this.adjustmentModeControl.value,
      adjustmentQuantity: this.adjustmentQuantityControl.value,
      expectedValue: this.expectedValueControl.value,
      batchNo: formControls.batchNo.value,
      expiryDate: formControls.expiryDate.value,
      reason: formControls.reason.value
    };

    this.adjustedStockData = [...this.adjustedStockData, stockData];
  }

  deleteData(data: StockData) {
    const index = this.adjustedStockData.indexOf(data);

    if (index !== -1) {
      this.adjustedStockData = this.adjustedStockData.splice(index, 1);
    }
  }
}
