import { SearchPatientComponent } from './search-patient/search-patient.component';
import { RegisterPatientComponent } from './register-patient/register-patient.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecordsRoutingModule } from './records-routing.module';

import { SharedModule } from '../shared/shared.module';
import { AllFoldersComponent } from './all-folders/all-folders.component';
import { RecordsService } from './records.service';
import { ViewFolderComponent } from './view-folder/view-folder.component';
import { AddPatientComponent } from './add-patient/add-patient.component';
import { RecordsReportComponent } from './records-report/records-report.component';


@NgModule({
  declarations: [
    AllFoldersComponent,
    ViewFolderComponent,
    AddPatientComponent,
    RegisterPatientComponent,
    SearchPatientComponent,
    RecordsReportComponent
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
