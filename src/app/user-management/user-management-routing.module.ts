import { RolesComponent } from './roles/roles.component';
import { ModulesComponent } from './modules/modules.component';
import { PermissionsComponent } from './permissions/permissions.component';
import { SystemComponentsComponent } from './system-components/system-components.component';
import { AuthGuard } from './../shared/guard/auth.guard';
import { CreateUserComponent } from './create-user/create-user.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserManagementComponent } from './user-management.component';

const routes: Routes = [
  {
    path: '',
    component: UserManagementComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'User Management '
    }
  },
  {
    path: 'profile',
    component: UserProfileComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'User Profile '
    }
  },
  {
    path: 'create-user',
    component: CreateUserComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Create User'
    }
  },

  {
    path: 'roles',
    component: RolesComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Manage Roles'
    }
  },
  {
    path: 'modules',
    component: ModulesComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Manage Modules'
    }
  },
  {
    path: 'components',
    component: SystemComponentsComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Manage Components'
    }
  },
  {
    path: 'permissions',
    component: PermissionsComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Manage Permissions'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserManagementRoutingModule {}
