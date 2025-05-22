import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConsultaUsuariosComponent } from '../gestion-usuarios/consulta-usuarios/consulta-usuarios.component';
import { ConsultaAbonadosComponent } from '../abonados/consulta-abonados/consulta-abonados.component';
import { CargaMasivaAbonadosComponent } from '../abonados/carga-masiva-abonados/carga-masiva-abonados.component';
import { AuthGuard } from '../../guards/auth.guard';
import { LogDisplayComponent } from '../log-display/log-display.component';
import { SuperUserManagementComponent } from '../super-user-management/super-user-management.component';
import { VehicleRegistrationComponentTsComponent } from '../vehicle-registration/vehicle-registration.component.ts.component'

export const admin: Routes = [
 {path:'nuplinTV',children:[ {
  path: 'inicio',
  loadComponent: () =>
    import('./sales/sales.component').then((m) => m.SalesComponent),
  
},
{
  path: 'gestion-usuarios/consulta',
  component: ConsultaUsuariosComponent, 
  canActivate: [AuthGuard], data: { role: 1 }// Ruta para consulta de usuarios
},
{
  path: 'abonados/consulta',
  component: ConsultaAbonadosComponent, 
  canActivate: [AuthGuard], data: { role: 1 }// Ruta para consulta de abonados
},
{
  path: 'abonados/carga-masiva',
  component: CargaMasivaAbonadosComponent, 
  canActivate: [AuthGuard], data: { role: 1 }// Ruta para carga masiva de abonados
},
{
  path: 'log/log-usuarios',
  component: LogDisplayComponent, 
  canActivate: [AuthGuard], data: { role: 1 }// Ruta para carga masiva de abonados
},
{
  path: 'managementSuper/user',
  component: SuperUserManagementComponent, 
  canActivate: [AuthGuard], data: { role: 1 }// Ruta para carga masiva de abonados
},
{
  path: 'user/vehicleRegistration',
  component: VehicleRegistrationComponentTsComponent, 
  canActivate: [AuthGuard], data: { role: 2 }
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