import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AdjustmentSearchItem } from './stock-adjustment-approval-search.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-stock-adjustment-approval-search',
  templateUrl: './stock-adjustment-approval-search.component.html',
  styleUrls: ['./stock-adjustment-approval-search.component.scss']
})
export class StockAdjustmentApprovalSearchComponent implements OnInit {
  isLoadingStoreDept = false;

  storeDeptsList: string[] = ['Antenatal Store', 'Children\'s Ward'];

  adjustmentTypeList: string[] = ['OPERATIONAL', 'OPENING'];

  searchForm: FormGroup;
  pendingRequests: AdjustmentSearchItem[] = [
    {
      adjustmentRef: '8f14a65f-3032-42c8-a196-1cf66d11b930',
      adjustmentType: 'OPERATIONAL',
      adjustmentDate: new Date(),
      storeDept: 'Antenatal'
    }
  ];

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router
  ) {}

  ngOnInit() {
    this.searchForm = this.fb.group({
      adjustmentRef: [''],
      adjustmentDate: [new Date()],
      adjustmentType: ['OPERATIONAL'],
      storeDept: ['Antenatal Store']
    });
  }

  gotoAdjustmentApproval(adjustmentRef: string): void {
    console.log(adjustmentRef);
    this.router.navigate(['/stores-management/stock-adjustment-approval', adjustmentRef]);
  }
}
