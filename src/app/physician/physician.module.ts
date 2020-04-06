import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { ConsultationComponent } from './consultation/consultation.component';
import { PhysicianRoutingModule } from './physician.routing.module';
import { OpdModule } from '../opd/opd.module';
import { PhysicianService } from './services/physician.service';
import { PatientHistoryComponent } from './patient-history/patient-history.component';
import { PhysicalExamComponent } from './physical-exam/physical-exam.component';

@NgModule({
  declarations: [ConsultationComponent, PatientHistoryComponent, PhysicalExamComponent],
  imports: [
    CommonModule,
    PhysicianRoutingModule,
    OpdModule,
    SharedModule,
  ],
  providers: [PhysicianService]
})
export class PhysicianModule { }
