import { FacilityManagementNumberingSettingComponent } from './categories/facility-management-numbering-setting/facility-management-numbering-setting.component';
import { FacilityManagementFundingSettingComponent } from './categories/facility-management-funding-setting/facility-management-funding-setting.component';
import { FacilityManagementDetailComponent } from './categories/facility-management-detail/facility-management-detail.component';
import { AuthGuard } from './../shared/guard/auth.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FacilityManagementComponent } from './facility-management.component';

const routes: Routes = [
  { path: '', component: FacilityManagementComponent, canActivate: [AuthGuard] },
  {
    path: 'details', component: FacilityManagementDetailComponent, canActivate: [AuthGuard], data: {
      title: 'Facility Detail'
    }
  },
  {
    path: 'numbering-setting', component: FacilityManagementNumberingSettingComponent, canActivate: [AuthGuard], data: {
      title: 'Facility Detail'
    }
  },
  {
    path: 'funding-setting', component: FacilityManagementFundingSettingComponent, canActivate: [AuthGuard], data: {
      title: 'Funding Setting'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FacilityManagementRoutingModule { }
