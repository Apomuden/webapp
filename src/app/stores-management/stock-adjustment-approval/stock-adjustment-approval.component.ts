import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { StockApprovalData } from '../stores-management.model';

@Component({
  selector: 'app-stock-adjustment-approval',
  templateUrl: './stock-adjustment-approval.component.html',
  styleUrls: ['./stock-adjustment-approval.component.scss']
})
export class StockAdjustmentApprovalComponent implements OnInit {
  isLoadingStockAdjustment = true;
  hasError = true;
  //
  allChecked = false;
  someChecked = false;
  setOfCheckedId = new Set<number>();
  //
  referenceNo: string;
  // setup form
  isLoadingStoreDept = false;
  isLoadingRefNumber = false;

  adjustmentApprovalForm: FormGroup;

  adjustedStockData: StockApprovalData[] = [{
    reqData: {
      id: 1,
      productName: 'srring',
      uom: 'string',
      qtyAtHand: 0,
      unitCost: 0.5,
      adjustmentMode: 'string',
      adjustmentQuantity: 0,
      expectedValue: 0,
      batchNo: 'string',
      expiryDate: new Date(),
      reason: 'string'
    },
    approvedQty: 5,
    approvalMode: '-'
  }];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly location: Location,
    private readonly fb: FormBuilder
  ) {}

  ngOnInit() {
    this.referenceNo = this.route.snapshot.paramMap.get('referenceNo');

    // TODO: subcribe for data

    this.adjustmentApprovalForm = this.fb.group({
      totalApprovalQty: [0, Validators.required],
      totalApprovalValue: [0, Validators.required],
      approvedBy: ['James Akrofi', Validators.required],
      approvalDesignation: ['', Validators.required]
    });

    this.adjustmentApprovalForm.get('totalApprovalQty').disable();
    this.adjustmentApprovalForm.get('totalApprovalValue').disable();
    this.adjustmentApprovalForm.get('approvedBy').disable();
    this.adjustmentApprovalForm.get('approvalDesignation').disable();
  }

  goBack(): void {
    this.location.back();
  }

  onAllChecked(checked: boolean) {
    console.log(checked);
  }

  updateCheckedSet(id: number, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }

  refreshCheckedStatus(): void {
    this.allChecked = this.adjustedStockData.every(item =>
      this.setOfCheckedId.has(item.reqData.id)
    );
    this.someChecked =
      this.adjustedStockData.some(item =>
        this.setOfCheckedId.has(item.reqData.id)
      ) && !this.allChecked;
  }

  onCurrentPageDataChange($event: StockApprovalData[]): void {
    this.adjustedStockData = $event;
    this.refreshCheckedStatus();
  }

  onItemChecked(id: number, checked: boolean) {
    console.log(id, checked);
    this.updateCheckedSet(id, checked);
  }
}
