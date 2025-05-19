import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EncryptionService } from '../../shared/services/encryption.service';
import { LogUsuarioService } from '../../shared/services/log-usuario.service';
import { ToastrService } from 'ngx-toastr';
import { SpkReusableTablesComponent } from '../../../@spk/spk-reusable-tables/spk-reusable-tables.component';
import { GestionUsuariosService } from '../../shared/services/gestion-usuarios.service';
import { AuthService } from '../../shared/services/auth.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-super-user-management',
  imports: [CommonModule, SpkReusableTablesComponent],
  templateUrl: './super-user-management.component.html',
  styleUrl: './super-user-management.component.scss'
})
export class SuperUserManagementComponent {
  private ngUnsubscribe = new Subject<void>();

  paginatedDataAdministrador: any[] = [];
  currentPageAdministrador: number = 1;
  itemsPerPageAdministrador: number = 20;
  totalPagesArrayAdministrador: number[] = [];

  responsiveColumnAdministrador = [
    { header: "Nombres", field: "nombre" },
    { header: "Apellido", field: "apellido" },
    { header: "Identificación", field: "id" },
    { header: "Email", field: "correo" },
    { header: "Rol", field: "rol" },
    { header: "Estado", field: "estado" },
    { header: "Acciones", field: "Acciones" }
  ];

  
  paginatedDataCliente: any[] = [];
  currentPageCliente: number = 1;
  itemsPerPageCliente: number = 20;
  totalPagesArrayCliente: number[] = [];

  responsiveColumnCliente = [
    { header: "Nombres", field: "nombre" },
    { header: "Apellido", field: "apellido" },
    { header: "Identificación", field: "id" },
    { header: "Email", field: "correo" },
    { header: "Placa Vehiculo", field: "id_vehiculo" },
    { header: "Marca", field: "marca" },
    { header: "Modelo", field: "modelo" },
    { header: "Acciones", field: "Acciones" }
  ];
  

  
  constructor(
        private toastr: ToastrService ,
        private authService: AuthService,
        private gestionUsuariosService: GestionUsuariosService,
        private encryptionService: EncryptionService,
        private LogUsuarioService: LogUsuarioService,
    ){}

  ngOnInit() {
    
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }














private crearLog(accion: string, descripcion: string, logLevel: string, moduloOrigen: string) {
    const email = this.encryptionService.getEmailFromToken();
    if (email !== null) {
      const mensaje = descripcion;
      const detalles = `${accion} - ${descripcion}`;
      this.LogUsuarioService.crearLog(email, logLevel, moduloOrigen, mensaje, detalles).subscribe({
        next: (log) => console.log('Log creado correctamente:', log),
        error: (err) => console.error('Error al crear log:', err)
      });
    }
  }    
}



