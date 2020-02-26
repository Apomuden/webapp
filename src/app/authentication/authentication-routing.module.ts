import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import {ChangePasswordComponent} from './change-password/change-password.component';
import {AuthGuard} from '../shared/guard/auth.guard';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Login'
    },
  },
  {
    path: 'change-password',
    component: ChangePasswordComponent,
    data: {
      title: 'Change Password'
    },
    // canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthenticationRoutingModule {}
