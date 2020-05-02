import { AuthGuard } from '../shared/guard/auth.guard';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LabComponent } from './lab/lab.component';

const routes: Routes = [
  {
    path: 'laboratory',
    component: LabComponent,
    canActivate: [AuthGuard],
    data: { title: 'Laboratory' }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LaboratoryRoutingModule {
}
