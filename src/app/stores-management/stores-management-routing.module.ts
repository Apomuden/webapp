import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { StoresManagementComponent } from './stores-management.component';
import { AuthGuard } from '../shared/guard/auth.guard';
import { StockAdjustmentComponent } from './stock-adjustment/stock-adjustment.component';
import { StockAdjustmentApprovalComponent } from './stock-adjustment-approval/stock-adjustment-approval.component';
import { CommonLayoutComponent } from '../layouts/common-layout/common-layout.component';
import { StockAdjustmentApprovalSearchComponent } from './stock-adjustment-approval-search/stock-adjustment-approval-search.component';
import { NzEmptyComponent } from 'ng-zorro-antd';
import { FullLayoutComponent } from '../layouts/full-layout/full-layout.component';
const routes: Routes = [
  {
    path: '',
    component: StoresManagementComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Stores Management'
    }
  },
  {
    path: 'stock-adjustment',
    component: StockAdjustmentComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Stock Adjustment'
    }
  },
  {
    path: 'stock-adjustment-approval',
    component: FullLayoutComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Stock Adjustment'
    },
    children: [
      {
        path: 'search',
        component: StockAdjustmentApprovalSearchComponent,
        canActivate: [AuthGuard],
        data: {
          title: 'Search'
        }
      },
      {
        path: ':referenceNo',
        component: StockAdjustmentApprovalComponent,
        canActivate: [AuthGuard],
        data: {
          title: 'Approval'
        }
      }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StoresManagementRoutingModule {}
