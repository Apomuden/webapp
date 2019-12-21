import { AuthGuard } from "./../shared/guard/auth.guard";
import { CreateUserComponent } from "./create-user/create-user.component";
import { UserProfileComponent } from "./user-profile/user-profile.component";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { UserManagementComponent } from "./user-management.component";

const routes: Routes = [
  {
    path: "",
    component: UserManagementComponent,
    canActivate: [AuthGuard],
    data: {
      title: "User Management "
    }
  },
  {
    path: "profile",
    component: UserProfileComponent,
    canActivate: [AuthGuard],
    data: {
      title: "User Profile "
    }
  },
  {
    path: "create-user",
    component: CreateUserComponent,
    canActivate: [AuthGuard],
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
