import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RegisterPatientComponent} from './register-patient/register-patient.component';
import {RecordsRoutingModule} from './records-routing.module';
import {
  NzButtonModule,
  NzDatePickerModule,
  NzFormModule,
  NzGridModule,
  NzIconModule,
  NzInputModule, NzInputNumberModule,
  NzSelectModule,
  NzStepsModule, NzSwitchModule
} from 'ng-zorro-antd';
import {ReactiveFormsModule} from '@angular/forms';


@NgModule({
  declarations: [RegisterPatientComponent],
  imports: [
    CommonModule,
    RecordsRoutingModule,
    NzStepsModule,
    NzButtonModule,
    NzGridModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzDatePickerModule,
    NzIconModule,
    NzInputNumberModule,
    NzSwitchModule,
  ]
})
export class RecordsModule {}
