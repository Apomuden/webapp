import {AuthGuard} from '../shared/guard/auth.guard';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { ConsultationComponent } from './consultation/consultation.component';

const routes: Routes = [
  {
    path: 'consultation',
    component: ConsultationComponent,
    canActivate: [AuthGuard],
    data: {title: 'Consultation'}
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PhysicianRoutingModule {
}
