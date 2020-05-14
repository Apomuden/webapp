import {AuthGuard} from '../shared/guard/auth.guard';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { ConsultationComponent } from './consultation/consultation.component';
import {IvfConsultationComponent} from "./ivf-consultation/ivf-consultation.component";

const routes: Routes = [
  {
    path: 'consultation',
    component: ConsultationComponent,
    canActivate: [AuthGuard],
    data: {title: 'Consultation'}
  },
  {
    path: 'ivf-consultation',
    component: IvfConsultationComponent,
    canActivate: [AuthGuard],
    data: {title: 'IVF Consultation'}
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PhysicianRoutingModule {
}
