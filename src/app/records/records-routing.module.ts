import {AuthGuard} from '../shared/guard/auth.guard';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FullLayoutComponent} from '../layouts/full-layout/full-layout.component';
import {AllFoldersComponent} from './all-folders/all-folders.component';
import {ViewFolderComponent} from './view-folder/view-folder.component';
import {AddPatientComponent} from './add-patient/add-patient.component';

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
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecordsRoutingModule {
}
