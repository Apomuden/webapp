import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FacilityManagementRoutingModule } from './facility-management-routing.module';
import { FacilityManagementComponent } from './facility-management.component';
import { FacilityManagementDetailComponent } from './categories/facility-management-detail/facility-management-detail.component';
import { FacilityManagementNumberingSettingComponent } from './categories/facility-management-numbering-setting/facility-management-numbering-setting.component';
import { FacilityManagementFundingSettingComponent } from './categories/facility-management-funding-setting/facility-management-funding-setting.component';
import { SetupsModule } from '../setups/setups.module';
import { BillingCycleSetupComponent } from './pages/billing-cycle-setup/billing-cycle-setup.component';
import { BillingSystemSetupComponent } from './pages/billing-system-setup/billing-system-setup.component';
import { PaymentChannelSetupComponent } from './pages/payment-channel-setup/payment-channel-setup.component';
import { FundingTypeSetupComponent } from './pages/funding-type-setup/funding-type-setup.component';
import { PaymentStyleSetupComponent } from './pages/payment-style-setup/payment-style-setup.component';

@NgModule({
  declarations: [
    FacilityManagementComponent,
    FacilityManagementDetailComponent,
    FacilityManagementNumberingSettingComponent,
    FacilityManagementFundingSettingComponent,
    BillingCycleSetupComponent,
    BillingSystemSetupComponent,
    PaymentChannelSetupComponent,
    FundingTypeSetupComponent,
    PaymentStyleSetupComponent

  ],
  imports: [
    CommonModule,
    FacilityManagementRoutingModule,
    SharedModule,
    GooglePlaceModule
  ]
})
export class FacilityManagementModule { }
