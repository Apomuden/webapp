import { ReceiptComponent } from './receipt/receipt.component';
import { AuthGuard } from './../shared/guard/auth.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';



const routes: Routes = [{
  path: 'receipt', component: ReceiptComponent,
  canActivate: [AuthGuard],
  data: {
    title: 'Receipts'
  }
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountsRoutingModule { }
