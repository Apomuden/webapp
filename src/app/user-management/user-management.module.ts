import { SharedModule } from "./../shared/shared.module";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { UserManagementRoutingModule } from "./user-management-routing.module";
import { UserManagementComponent } from "./user-management.component";
import { UserProfileComponent } from "./user-profile/user-profile.component";
import { CreateUserComponent } from "./create-user/create-user.component";
import { RolesComponent } from "./roles/roles.component";
import { ModulesComponent } from "./modules/modules.component";
import { PermissionsComponent } from "./permissions/permissions.component";
import { SystemComponentsComponent } from './system-components/system-components.component';

@NgModule({
  declarations: [
    UserManagementComponent,
    UserProfileComponent,
    CreateUserComponent,
    RolesComponent,
    ModulesComponent,
    PermissionsComponent,
    SystemComponentsComponent
  ],
  imports: [CommonModule, SharedModule, UserManagementRoutingModule]
})
export class UserManagementModule {}
