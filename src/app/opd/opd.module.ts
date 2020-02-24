import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VitalFormComponent } from './vital-form/vital-form.component';
import { OpdService } from './services/opd.service';
import { OpdRoutingModule } from './opd.routing.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [VitalFormComponent],
  imports: [
    CommonModule,
    OpdRoutingModule,
    SharedModule,
  ],
  providers: [OpdService]
})
export class OpdModule { }
