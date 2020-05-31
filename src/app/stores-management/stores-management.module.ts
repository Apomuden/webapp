import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { StockAdjustmentApprovalSearchComponent } from './stock-adjustment-approval-search/stock-adjustment-approval-search.component';
import { StockAdjustmentApprovalComponent } from './stock-adjustment-approval/stock-adjustment-approval.component';
import { StockAdjustmentComponent } from './stock-adjustment/stock-adjustment.component';
import { StoresManagementRoutingModule } from './stores-management-routing.module';
import { StoresManagementComponent } from './stores-management.component';

@NgModule({
  imports: [CommonModule, SharedModule, StoresManagementRoutingModule],
  declarations: [
    StoresManagementComponent,
    StockAdjustmentComponent,
    StockAdjustmentApprovalSearchComponent,
    StockAdjustmentApprovalComponent,
  ]
})
export class StoresManagementModule {}
