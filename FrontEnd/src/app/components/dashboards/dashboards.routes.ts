import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConsultaUsuariosComponent } from '../gestion-usuarios/consulta-usuarios/consulta-usuarios.component';
import { ConsultaAbonadosComponent } from '../abonados/consulta-abonados/consulta-abonados.component';
import { CargaMasivaAbonadosComponent } from '../abonados/carga-masiva-abonados/carga-masiva-abonados.component';
import { AuthGuard } from '../../guards/auth.guard';
import { LogDisplayComponent } from '../log-display/log-display.component';
import { SuperUserManagementComponent } from '../super-user-management/super-user-management.component';
import { VehicleRegistrationComponentTsComponent } from '../vehicle-registration/vehicle-registration.component.ts.component'
import { UserProfileComponent } from '../user-profile/user-profile.component';
import { AppointmentSchedulingComponent } from '../appointment-scheduling/appointment-scheduling.component';
import { SupplyInventoryComponent } from '../supply-inventory/supply-inventory.component';
import { ServiceReportComponent } from '../service-report/service-report.component';
import { CustomerCountReportComponent } from '../customer-count-report/customer-count-report.component';

export const admin: Routes = [
 {path:'CMT_Movitlity',children:[ {
  path: 'inicio',
  loadComponent: () =>
    import('./sales/sales.component').then((m) => m.SalesComponent),
  
},
{
  path: 'gestion-usuarios/consulta',
  component: ConsultaUsuariosComponent, 
  canActivate: [AuthGuard], data: { role: 1 }
},
{
  path: 'abonados/consulta',
  component: ConsultaAbonadosComponent, 
  canActivate: [AuthGuard], data: { role: 1 }
},
{
  path: 'abonados/carga-masiva',
  component: CargaMasivaAbonadosComponent, 
  canActivate: [AuthGuard], data: { role: 1 }
},
{
  path: 'log/log-usuarios',
  component: LogDisplayComponent, 
  canActivate: [AuthGuard], data: { role: 1 }
},
{
  path: 'managementSuper/user',
  component: SuperUserManagementComponent, 
  canActivate: [AuthGuard], data: { role: 1 }
},
{
  path: 'Reports/ReportService',
  component: ServiceReportComponent, 
  canActivate: [AuthGuard], data: { role: 1 }
},
{
  path: 'Reports/countUser',
  component: CustomerCountReportComponent, 
  canActivate: [AuthGuard], data: { role: 1 }
},
{
  path: 'vehicleRegistration',
  component: VehicleRegistrationComponentTsComponent, 
  canActivate: [AuthGuard], data: { role: 2 }
},
{
  path: 'profileUser',
  component: UserProfileComponent, 
  canActivate: [AuthGuard], data: { role: [1,2,3,4] }
},
{
  path: 'appointmentScheduling',
  component: AppointmentSchedulingComponent, 
  canActivate: [AuthGuard], data: { role: 2 }
},
{
  path: 'operatorAssignmentComponent',
  component: UserProfileComponent, 
  canActivate: [AuthGuard], data: { role: [3,4] }
},
{
  path: 'supplyInventory',
  component: SupplyInventoryComponent, 
  canActivate: [AuthGuard], data: { role: 4 }
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