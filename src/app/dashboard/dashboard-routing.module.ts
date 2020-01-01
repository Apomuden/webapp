import { AuthGuard } from './../shared/guard/auth.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DefaultDashboardComponent } from './default/default-dashboard.component';
import { WithBreadcrumbDashboardComponent } from './with-breadcrumb/with-breadcrumb-dashboard.component';

const routes: Routes = [
  {
    path: 'default',
    component: DefaultDashboardComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Dashboard ',
      headerDisplay: 'none'
    }
  },
  {
    path: 'with-breadcrumb',
    component: WithBreadcrumbDashboardComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'With Breadcrumb '
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {}
