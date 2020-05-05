import { DiscountComponent } from './discount/discount.component';
import { DepositComponent } from './deposit/deposit.component';
import { ReceiptComponent } from './receipt/receipt.component';
import { AuthGuard } from './../shared/guard/auth.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';



const routes: Routes = [{
  path: 'receipt', component: ReceiptComponent,
  canActivate: [AuthGuard],
  data: {
    title: 'E-Receipts'
  }
},
{
  path: 'deposit',
  component: DepositComponent,
  canActivate: [AuthGuard],
  data: {
    title: 'Deposits'
  }
},
{
  path: 'discount',
  component: DiscountComponent,
  canActivate: [AuthGuard],
  data: {
    title: 'Discount'
  }
}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountsRoutingModule { }
