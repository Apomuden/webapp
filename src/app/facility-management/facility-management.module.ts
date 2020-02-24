import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FacilityManagementRoutingModule } from './facility-management-routing.module';
import { FacilityManagementComponent } from './facility-management.component';
import { FacilityManagementDetailComponent } from './categories/facility-management-detail/facility-management-detail.component';
import { FacilityManagementNumberingSettingComponent } from './categories/facility-management-numbering-setting/facility-management-numbering-setting.component';
import { FacilityManagementFundingSettingComponent } from './categories/facility-management-funding-setting/facility-management-funding-setting.component';

@NgModule({
  declarations: [FacilityManagementComponent, FacilityManagementDetailComponent, FacilityManagementNumberingSettingComponent, FacilityManagementFundingSettingComponent],
  imports: [
    CommonModule,
    FacilityManagementRoutingModule,
    SharedModule,
    GooglePlaceModule
  ]
})
export class FacilityManagementModule {}
