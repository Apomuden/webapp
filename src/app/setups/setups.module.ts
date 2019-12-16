import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SetupsRoutingModule } from './setups-routing.module';
import { SetupsComponent } from './setups.component';


@NgModule({
  declarations: [SetupsComponent],
  imports: [
    CommonModule,
    SetupsRoutingModule,
    SharedModule,
    GooglePlaceModule
  ]
})
export class SetupsModule { }
