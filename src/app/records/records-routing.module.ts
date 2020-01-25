import { RecordsReportComponent } from './records-report/records-report.component';
import { SearchPatientComponent } from './search-patient/search-patient.component';
import { RegisterPatientComponent } from './register-patient/register-patient.component';
import { AuthGuard } from '../shared/guard/auth.guard';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FullLayoutComponent } from '../layouts/full-layout/full-layout.component';
import { AllFoldersComponent } from './all-folders/all-folders.component';
import { ViewFolderComponent } from './view-folder/view-folder.component';
import { AddPatientComponent } from './add-patient/add-patient.component';

const routes: Routes = [
  {
    path: 'folders',
    component: FullLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'all',
        component: AllFoldersComponent,
        data: { title: 'All' }
      },
      {
        path: 'view',
        component: FullLayoutComponent,
        data: { title: 'View' },
        children: [
          { path: ':id', component: ViewFolderComponent },
          {
            path: ':id/add-patient',
            component: AddPatientComponent,
            data: { title: 'Add Patient' }
          }
        ]
      }
    ],
    data: { title: 'Folders' }
  },
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
  },
  {
    path: 'records-report',
    component: RecordsReportComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Reports'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecordsRoutingModule { }
