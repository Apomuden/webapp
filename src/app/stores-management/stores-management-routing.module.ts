import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { StoresManagementComponent } from './stores-management.component';
import { AuthGuard } from '../shared/guard/auth.guard';
import { StockAdjustmentComponent } from './stock-adjustment/stock-adjustment.component';
const routes: Routes = [
  {
    path: '',
    component: StoresManagementComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Stores Management'
    },
  },
  {
    path: 'stock-adjustment',
    component: StockAdjustmentComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Stock Adjustment'
    }
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StoresManagementRoutingModule {}
