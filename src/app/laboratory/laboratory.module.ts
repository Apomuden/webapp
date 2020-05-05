import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { LabComponent } from './lab/lab.component';
import { LaboratoryRoutingModule } from './laboratory.routing.module';
import { OpdModule } from '../opd/opd.module';
import { LabCoreComponent } from './lab-core/lab-core.component';

@NgModule({
  declarations: [LabComponent, LabCoreComponent],
  imports: [
    CommonModule,
    LaboratoryRoutingModule,
    OpdModule,
    SharedModule,
  ],
  exports: [],
  providers: []
})
export class LaboratoryModule { }