import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RegisterPatientComponent} from './register-patient/register-patient.component';
import {RecordsRoutingModule} from './records-routing.module';
import {SharedModule} from '../shared/shared.module';
import {WalkinRegistrationComponent} from './walkin-registration/walkin-registration.component';
import {SearchPatientComponent} from './search-patient/search-patient.component';
import {RequestConsultationComponent} from './request-consultation/request-consultation.component';
import {RecordsService} from './records.service';
import {AllFoldersComponent} from './all-folders/all-folders.component';
import {ViewFolderComponent} from './view-folder/view-folder.component';
import {AddPatientComponent} from './add-patient/add-patient.component';
import {SponsorshipPermitComponent} from './sponsorship-permit/sponsorship-permit.component';
import {GooglePlaceModule} from 'ngx-google-places-autocomplete';
import {NzNotificationModule} from 'ng-zorro-antd';
import {RecordsReportComponent} from './records-report/records-report.component';


@NgModule({
  declarations: [
    RegisterPatientComponent,
    WalkinRegistrationComponent,
    AllFoldersComponent,
    ViewFolderComponent,
    AddPatientComponent,
    RegisterPatientComponent,
    SearchPatientComponent,
    SponsorshipPermitComponent,
    RequestConsultationComponent,
    RecordsReportComponent,
  ],
  imports: [
    CommonModule,
    RecordsRoutingModule,
    SharedModule,
    NzNotificationModule,
    GooglePlaceModule,
  ],
  providers: [RecordsService]
})
export class RecordsModule { }
