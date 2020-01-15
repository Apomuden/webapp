import { AuthGuard } from '../shared/guard/auth.guard';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterPatientComponent } from './register-patient/register-patient.component';
import { WalkinRegistrationComponent } from './walkin-registration/walkin-registration.component';

const routes: Routes = [
  {
    path: 'register-patient',
    component: RegisterPatientComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Register New Patient'
    }
  }, {
    path: 'walkin-registration',
    component: WalkinRegistrationComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Register Walk-in'
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecordsRoutingModule { }
