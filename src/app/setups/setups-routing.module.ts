import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SetupsComponent } from './setups.component';

const routes: Routes = [{ path: '', component: SetupsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SetupsRoutingModule { }
