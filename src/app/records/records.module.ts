import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterPatientComponent } from './register-patient/register-patient.component';
import { RecordsRoutingModule } from './records-routing.module';

import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [RegisterPatientComponent],
  imports: [
    CommonModule,
    RecordsRoutingModule,
    SharedModule,
  ]
})
export class RecordsModule { }
