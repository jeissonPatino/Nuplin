import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export const admin: Routes = [
 {path:'nuplinTV',children:[ {
  path: 'inicio',
  loadComponent: () =>
    import('./sales/sales.component').then((m) => m.SalesComponent),
},

]}
];
@NgModule({
  imports: [RouterModule.forChild(admin)],
  exports: [RouterModule],
})
export class dashboardRoutingModule {
  static routes = admin;
}