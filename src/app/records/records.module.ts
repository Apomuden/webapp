import { RegisterPatientComponent } from './register-patient/register-patient.component';
import { SearchPatientComponent } from './search-patient/search-patient.component';
import { AppointmentComponent } from './appointment/appointment.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecordsRoutingModule } from './records-routing.module';

import { SharedModule } from '../shared/shared.module';
import { AllFoldersComponent } from './all-folders/all-folders.component';
import { RecordsService } from './records.service';
import { ViewFolderComponent } from './view-folder/view-folder.component';
import { AddPatientComponent } from './add-patient/add-patient.component';


@NgModule({
  declarations: [
    AllFoldersComponent,
    ViewFolderComponent,
    AddPatientComponent,
    AppointmentComponent,
    SearchPatientComponent,
    RegisterPatientComponent
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
