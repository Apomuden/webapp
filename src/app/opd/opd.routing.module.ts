import {AuthGuard} from '../shared/guard/auth.guard';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FullLayoutComponent} from '../layouts/full-layout/full-layout.component';
import { VitalFormComponent } from './vital-form/vital-form.component';

const routes: Routes = [
  {
    path: 'vitals',
    component: VitalFormComponent,
    canActivate: [AuthGuard],
    data: {title: 'Vitals'}
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OpdRoutingModule {
}
