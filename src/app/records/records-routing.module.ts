import {AuthGuard} from '../shared/guard/auth.guard';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RegisterPatientComponent} from './register-patient/register-patient.component';
import {FullLayoutComponent} from '../layouts/full-layout/full-layout.component';
import {AllFoldersComponent} from './all-folders/all-folders.component';
import {ViewFolderComponent} from './view-folder/view-folder.component';
import {CreateFolderComponent} from './create-folder/create-folder.component';

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
        path: 'view/:id',
        component: ViewFolderComponent,
        data: {title: 'View'}
      },
    ],
    data: {
      title: 'Folders'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecordsRoutingModule {
}
