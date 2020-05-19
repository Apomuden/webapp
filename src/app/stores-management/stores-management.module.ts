import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoresManagementComponent } from './stores-management.component';
import { StoresManagementRoutingModule } from './stores-management-routing.module';
import { StockAdjustmentComponent } from './stock-adjustment/stock-adjustment.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    StoresManagementRoutingModule
  ],
  declarations: [StoresManagementComponent, StockAdjustmentComponent]
})
export class StoresManagementModule { }
