import { AppointmentComponent } from './appointment/appointment.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecordsRoutingModule } from './records-routing.module';

import { SharedModule } from '../shared/shared.module';
<<<<<<< HEAD
import { AllFoldersComponent } from './all-folders/all-folders.component';
import { RecordsService } from './records.service';
import { ViewFolderComponent } from './view-folder/view-folder.component';
import { AddPatientComponent } from './add-patient/add-patient.component';


@NgModule({
  declarations: [
    AllFoldersComponent,
    ViewFolderComponent,
    AddPatientComponent,
    AppointmentComponent
  ],
=======
import { SearchPatientComponent } from './search-patient/search-patient.component';


@NgModule({
  declarations: [RegisterPatientComponent, SearchPatientComponent],
>>>>>>> Feature/patient-search-ui
  imports: [
    CommonModule,
    RecordsRoutingModule,
    SharedModule,
  ],
  providers: [RecordsService]
})
export class RecordsModule {
}
