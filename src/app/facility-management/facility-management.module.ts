import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { SharedModule } from "./../shared/shared.module";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { FacilityManagementRoutingModule } from "./facility-management-routing.module";
import { FacilityManagementComponent } from "./facility-management.component";

@NgModule({
  declarations: [FacilityManagementComponent],
  imports: [
    CommonModule,
    FacilityManagementRoutingModule,
    SharedModule,
    GooglePlaceModule
  ]
})
export class FacilityManagementModule {}
