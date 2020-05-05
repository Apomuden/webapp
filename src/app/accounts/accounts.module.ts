import { CustomAutoFocusDirective } from './custom-auto-focus.directive';
import { AbscondComponent } from './abscond/abscond.component';
import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountsRoutingModule } from './accounts-routing.module';
import { ReceiptComponent } from './receipt/receipt.component';
import { DepositComponent } from './deposit/deposit.component';
import { DiscountComponent } from './discount/discount.component';
import { RefundComponent } from './refund/refund.component';


@NgModule({
  declarations: [ReceiptComponent, DepositComponent, AbscondComponent, DiscountComponent, RefundComponent, CustomAutoFocusDirective],
  imports: [
    CommonModule,
    AccountsRoutingModule,
    SharedModule,
  ]
})
export class AccountsModule { }
