import {WalkinRegistrationComponent} from './walkin-registration/walkin-registration.component';
import {RecordsReportComponent} from './records-report/records-report.component';
import {SearchPatientComponent} from './search-patient/search-patient.component';
import {RegisterPatientComponent} from './register-patient/register-patient.component';
import {AuthGuard} from '../shared/guard/auth.guard';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RequestConsultationComponent} from './request-consultation/request-consultation.component';
import {FullLayoutComponent} from '../layouts/full-layout/full-layout.component';
import {AllFoldersComponent} from './all-folders/all-folders.component';
import {ViewFolderComponent} from './view-folder/view-folder.component';
import {AddPatientComponent} from './add-patient/add-patient.component';
import {SponsorshipPermitComponent} from './sponsorship-permit/sponsorship-permit.component';

const routes: Routes = [
  {
    path: 'folders',
    component: FullLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'all',
        component: AllFoldersComponent,
        data: {title: 'All'}
      },
      {
        path: 'view',
        component: FullLayoutComponent,
        data: {title: 'View'},
        children: [
          {path: ':id', component: ViewFolderComponent},
          {
            path: ':id/add-patient',
            component: AddPatientComponent,
            data: {title: 'Add Patient'}
          }
        ]
      }
    ],
    data: {title: 'Folders'}
  },
  {
    path: 'patients',
    component: FullLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'search-patient',
        component: SearchPatientComponent,
        canActivate: [AuthGuard],
        data: {title: 'Search Patient'},
      },
      {
        path: 'register-patient',
        component: RegisterPatientComponent,
        canActivate: [AuthGuard],
        data: {title: 'Register New Patient'}
      },
      { path: '', pathMatch: 'full', redirectTo: 'search-patient'}
    ],
    data: {title: 'Patients'}
  },
  {
    path: 'sponsorship-permit',
    component: SponsorshipPermitComponent,
    canActivate: [AuthGuard],
    data: {title: 'Sponsorship Permit'}
  },
  {
    path: 'request-consultation',
    component: RequestConsultationComponent,
    canActivate: [AuthGuard],
    data: {title: 'Request Consultation'}
  }, {
    path: 'records-report',
    component: RecordsReportComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Reports'
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
export class RecordsRoutingModule {
}
