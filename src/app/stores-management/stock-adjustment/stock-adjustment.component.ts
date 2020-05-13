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
      qtyAtHand: [0, Validators.required],
      unitCost: [0, Validators.required],
      adjustmentMode: ['-', Validators.required],
      adjustmentQuantity: [0, Validators.required],
      expectedValue: [0, Validators.required],
      batchNo: ['', Validators.required],
      expiryDate: [new Date(), Validators.required],
      reason: ['Expired', Validators.required]
    });

    this.stockItemForm.get('expectedValue').disable();
  }

  addStockItem() {}

  deleteData(data: StockData) {
    const index = this.adjustedStockData.indexOf(data);

    if (index !== -1) {
      this.adjustedStockData = this.adjustedStockData.splice(index, 1);
    }

    for (let i = 0; i < 10; i++) {
      this.adjustedStockData.push({
        productName: 'Paracetamol',
        uom: 'ml',
        qtyAtHand: 20,
        unitCost: 30,
        adjustmentMode: '-',
        adjustmentQuantity: 90,
        expectedValue: 22,
        batchNo: 'E4434',
        expiryDate: new Date(),
        reason: 'Asem Aba'
      });
    }

    this.adjustedStockData = this.adjustedStockData;
  }
}
