import { CustomAutoFocusDirective } from './custom-auto-focus.directive';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VitalFormComponent } from './vital-form/vital-form.component';
import { OpdService } from './services/opd.service';
import { OpdRoutingModule } from './opd.routing.module';
import { SharedModule } from '../shared/shared.module';
import { PatientQueueComponent } from './patient-queue/patient-queue.component';
import { ConsultationComponent } from './consultation/consultation.component';

@NgModule({
<<<<<<< HEAD
  declarations: [VitalFormComponent, PatientQueueComponent, CustomAutoFocusDirective],
=======
  declarations: [VitalFormComponent, PatientQueueComponent, ConsultationComponent],
>>>>>>> Feature/consultation
  imports: [
    CommonModule,
    OpdRoutingModule,
    SharedModule,
  ],
  providers: [OpdService]
})
export class OpdModule { }
