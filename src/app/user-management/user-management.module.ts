import { SharedModule } from "./../shared/shared.module";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { UserManagementRoutingModule } from "./user-management-routing.module";
import { UserManagementComponent } from "./user-management.component";
import { UserProfileComponent } from './user-profile/user-profile.component';
import { CreateUserComponent } from './create-user/create-user.component';

@NgModule({
  declarations: [UserManagementComponent, UserProfileComponent, CreateUserComponent],
  imports: [CommonModule, SharedModule, UserManagementRoutingModule]
})
export class UserManagementModule {}
