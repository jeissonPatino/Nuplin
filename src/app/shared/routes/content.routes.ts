import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { dashboardRoutingModule } from '../../components/dashboards/dashboards.routes';

export const content: Routes = [
  { path: '', children: [
   ...dashboardRoutingModule.routes,
  ]}
];
@NgModule({
    // imports: [RouterModule.forRoot()],
    exports: [RouterModule]
})
export class SaredRoutingModule { }
