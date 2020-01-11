import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RegisterPatientComponent} from './register-patient/register-patient.component';
import {RecordsRoutingModule} from './records-routing.module';

import {SharedModule} from '../shared/shared.module';
import {AllFoldersComponent} from './all-folders/all-folders.component';
import {RecordsService} from './records.service';
import {ViewFolderComponent} from './view-folder/view-folder.component';


@NgModule({
  declarations: [
    RegisterPatientComponent,
    AllFoldersComponent,
    ViewFolderComponent,
  ],
  imports: [
    CommonModule,
    RecordsRoutingModule,
    SharedModule,
  ],
  providers: [RecordsService]
})
export class RecordsModule {
}
