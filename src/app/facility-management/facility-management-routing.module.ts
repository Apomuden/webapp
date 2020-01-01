import { AuthGuard } from './../shared/guard/auth.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FacilityManagementComponent } from './facility-management.component';

const routes: Routes = [
  { path: '', component: FacilityManagementComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FacilityManagementRoutingModule {}
