import { SearchPatientComponent } from './search-patient/search-patient.component';
import { AuthGuard } from '../shared/guard/auth.guard';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterPatientComponent } from './register-patient/register-patient.component';

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
    path: 'search-patient',
    component: SearchPatientComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Search Patient'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecordsRoutingModule { }
