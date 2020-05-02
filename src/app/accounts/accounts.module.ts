import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountsRoutingModule } from './accounts-routing.module';
import { ReceiptComponent } from './receipt/receipt.component';


@NgModule({
  declarations: [ReceiptComponent],
  imports: [
    CommonModule,
    AccountsRoutingModule,
    SharedModule,
  ]
})
export class AccountsModule { }
