import { CreateUserComponent } from "./create-user/create-user.component";
import { UserProfileComponent } from "./user-profile/user-profile.component";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { UserManagementComponent } from "./user-management.component";

const routes: Routes = [
  {
    path: "",
    component: UserManagementComponent,
    data: {
      title: "User Management "
    }
  },
  {
    path: "profile",
    component: UserProfileComponent,
    data: {
      title: "User Profile "
    }
  },
  {
    path: "create-user",
    component: CreateUserComponent,
    data: {
      title: "Create User"
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserManagementRoutingModule {}
