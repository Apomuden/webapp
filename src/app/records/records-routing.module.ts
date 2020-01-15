import { AppointmentComponent } from './appointment/appointment.component';
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
    path: 'appointments',
    component: AppointmentComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Appointments'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecordsRoutingModule { }
