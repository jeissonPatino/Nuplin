import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { dashboardRoutingModule } from '../../components/dashboards/dashboards.routes';
import { AuthGuard } from '../../guards/auth.guard';

export const content: Routes = [
  { path: '', 
    canActivate: [AuthGuard], 
    data: { role: 'Cliente' },children: [
   ...dashboardRoutingModule.routes,
  ]}
];
@NgModule({
    // imports: [RouterModule.forRoot()],
    exports: [RouterModule]
})
export class SaredRoutingModule { }
