import { ProcedureComponent } from './procedure/procedure.component';
import { InvestigationComponent } from './investigation/investigation.component';
import { DiagnosisComponent } from './diagnosis/diagnosis.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { ConsultationComponent } from './consultation/consultation.component';
import { PhysicianRoutingModule } from './physician.routing.module';
import { OpdModule } from '../opd/opd.module';
import { PhysicianService } from './services/physician.service';
import { PatientHistoryComponent } from './patient-history/patient-history.component';
import { PhysicalExamComponent } from './physical-exam/physical-exam.component';
import { PrescriptionComponent } from '../prescription/prescription.component';

@NgModule({
  declarations: [
    ConsultationComponent,
    PatientHistoryComponent,
    PhysicalExamComponent,
    PrescriptionComponent,
    DiagnosisComponent,
    InvestigationComponent,
    ProcedureComponent
  ],
  imports: [
    CommonModule,
    PhysicianRoutingModule,
    OpdModule,
    SharedModule,
  ],
  providers: [PhysicianService]
})
export class PhysicianModule { }
