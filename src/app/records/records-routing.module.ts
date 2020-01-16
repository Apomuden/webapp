import {AuthGuard} from '../shared/guard/auth.guard';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RegisterPatientComponent} from './register-patient/register-patient.component';
import { SponsorshipPermitComponent } from './sponsorship-permit/sponsorship-permit.component';

const routes: Routes = [
  {
    path: 'register-patient',
    component: RegisterPatientComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Register New Patient'
    }
  },
  {
    path: 'sponsorship-permit',
    component: SponsorshipPermitComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Sponsorship Permit'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecordsRoutingModule {}
