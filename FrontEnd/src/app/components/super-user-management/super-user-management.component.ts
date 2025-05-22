import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EncryptionService } from '../../shared/services/encryption.service';
import { LogUsuarioService } from '../../shared/services/log-usuario.service';
import { ToastrService } from 'ngx-toastr';
import { SpkReusableTablesComponent } from '../../../@spk/spk-reusable-tables/spk-reusable-tables.component';
import { GestionUsuariosService } from '../../shared/services/gestion-usuarios.service';
import { AuthService } from '../../shared/services/auth.service';
import { Subject, takeUntil } from 'rxjs';
import { UsuarioCliente } from '../../shared/models/UsuarioCliente';
import { UsuarioAdministrador } from '../../shared/models/usuarioAdministrador';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-super-user-management',
  imports: [CommonModule, SpkReusableTablesComponent],
  templateUrl: './super-user-management.component.html',
  styleUrl: './super-user-management.component.scss'
})
export class SuperUserManagementComponent {
  private ngUnsubscribe = new Subject<void>();
  showModalUA: boolean = false;
  showModalDA: boolean = false;
  showModalUC: boolean = false;
  showModalDC: boolean = false;
  TypeDoc = [
    { label: 'Cédula de Ciudadanía', value: 1 },
    { label: 'NIT', value: 2 },
    { label: 'Tarjeta de Identidad', value: 3 },
    { label: 'Pasaporte', value: 4 }
  ];

  paginatedDataAdministrador: any[] = [];
  currentPageAdministrador: number = 1;
  itemsPerPageAdministrador: number = 20;
  totalPagesArrayAdministrador: number[] = [];
  datosTablaUsuarioAdministrador: UsuarioAdministrador[] = [];
  selectedUserAdmin: UsuarioAdministrador | null = null;
  sugerenciaPassword: any;
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
  datosTablaUsuarioCliente: UsuarioCliente[] = [];

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
    this.loadUsersManager();
    this.loadUsersClient();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  updatePaginatedDataCliente() {
    const start = (this.currentPageCliente - 1) * this.itemsPerPageCliente;
    const end = start + this.itemsPerPageCliente;
    this.paginatedDataCliente = this.datosTablaUsuarioCliente.slice(start, end);
    this.totalPagesArrayCliente = Array.from({ length: this.totalPagescliente() }, (_, i) => i + 1);
  }

  changePageCliente(page: number) {
    if (page < 1 || page > this.totalPagescliente()) return;
    this.currentPageCliente = page;
    this.updatePaginatedDataCliente();
  }

  totalPagescliente(): number {
    return Math.ceil(this.datosTablaUsuarioCliente.length / this.itemsPerPageCliente);
  }

  get displayedRecordsCliente(): number {
    return Math.min(this.currentPageCliente * this.itemsPerPageCliente, this.datosTablaUsuarioCliente.length);
  }

  loadUsersClient() {
      this.gestionUsuariosService.getUsuariosClientesVehiculos().pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(
          (data: UsuarioCliente[]) => {
            this.datosTablaUsuarioCliente = data;
            this.updatePaginatedDataCliente();
            this.crearLog('Consulta Usuarios Clientes', 'Datos obtenidos con exito', 'INFO', 'GESTION USUARIOS Clientes');
          },
          (error) => {
            this.toastr.error('Error al cargar los usuarios Clientes.', 'Error');
            this.crearLog('Consulta Usuarios Clientes', 'Error al cargar los usuarios Clientes.'+error, 'ERROR', 'GESTION USUARIOS Clientes');
            
          }
        );
  }


  /* funcionalidad de paginacion Admin*/
  updatePaginatedDataAdministrador() {
    const start = (this.currentPageAdministrador - 1) * this.itemsPerPageAdministrador;
    const end = start + this.itemsPerPageAdministrador;
    this.paginatedDataAdministrador = this.datosTablaUsuarioAdministrador.slice(start, end);
    this.totalPagesArrayAdministrador = Array.from({ length: this.totalPagesAdministrador() }, (_, i) => i + 1);
  }

  changePageAdministrador(page: number) {
    if (page < 1 || page > this.totalPagesAdministrador()) return;
    this.currentPageAdministrador = page;
    this.updatePaginatedDataAdministrador();
  }

  totalPagesAdministrador(): number {
    return Math.ceil(this.datosTablaUsuarioAdministrador.length / this.itemsPerPageAdministrador);
  }

  get displayedRecordsAdministrador(): number {
    return Math.min(this.currentPageAdministrador * this.itemsPerPageAdministrador, this.datosTablaUsuarioAdministrador.length);
  }

  loadUsersManager() {
        this.gestionUsuariosService.getUsuariosAdministrador().pipe(takeUntil(this.ngUnsubscribe))
          .subscribe(
            (data: UsuarioAdministrador[]) => {
              this.datosTablaUsuarioAdministrador = data;
              this.updatePaginatedDataAdministrador();
              this.crearLog('Consulta Usuarios Administradores', 'Datos obtenidos con exito', 'INFO', 'GESTION USUARIOS Administradores');
            },
            (error) => {
              this.toastr.error('Error al cargar los usuarios Administradores.', 'Error');
              this.crearLog('Consulta Usuarios Administradores', 'Error al cargar los usuarios Administradores.'+error, 'ERROR', 'GESTION USUARIOS Administradores');
              
            }
          );
  }

  openEditModalAdmin(admin: UsuarioAdministrador){
    this.selectedUserAdmin = { ...admin };
    Swal.fire({
      title: 'Actualizar Usuario',
      html: `
        <div>
          <label for="estado-usuario">Estado:</label>
          <select id="estado-usuario" class="swal2-input">
            <option value="activo" ${this.selectedUserAdmin.estado === 'activo' ? 'selected' : ''}>Activo</option>
            <option value="inactivo" ${this.selectedUserAdmin.estado === 'inactivo' ? 'selected' : ''}>Inactivo</option>
          </select>
        </div>
        <div class="mt-2">
          <label for="nueva-password">Nueva Contraseña (opcional):</label>
          <input type="password" id="nueva-password" class="swal2-input">
        </div>
      `,
      showCancelButton: true,
      confirmButtonColor: '#007bff',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Actualizar',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        return {
          estado: (document.getElementById('estado-usuario') as HTMLSelectElement).value ,
          nuevaPassword: (document.getElementById('nueva-password') as HTMLInputElement).value
        };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const userData = {
          id: this.selectedUserAdmin?.id, 
          estado: result.value.estado,
          password: result.value.nuevaPassword
        };
        this.actualizarUsuarioAdmin(userData,userData.id);
      }
    });
  }

  actualizarUsuarioAdmin(userData: any, id_user:any) {
    this.gestionUsuariosService.updateUser(id_user,userData).subscribe(
      (response) => {
        Swal.fire(
          '¡Actualizado!',
          'El usuario ha sido actualizado exitosamente.',
          'success'
        );
        window.location.reload()
      },
      (error) => {
        Swal.fire(
          '¡Error!',
          'Hubo un problema al actualizar el usuario.',
          'error'
        );
      }
    );
  }


  openDeleteModalAdmin(admin: UsuarioAdministrador) {
    this.selectedUserAdmin = { ...admin };
    const usuarioId= this.selectedUserAdmin.id;
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar este usuario?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'No, cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.eliminarUsuarioAdmin(usuarioId);
      }
    });
  }

  eliminarUsuarioAdmin(usuarioId: string) {
    this.gestionUsuariosService.deleteUser(usuarioId).subscribe(
      (response) => {
        Swal.fire(
          '¡Eliminado!',
          'El usuario ha sido eliminado exitosamente.',
          'success'
        )
        window.location.reload()
      },
      (error) => {
        Swal.fire(
          '¡Error!',
          'Hubo un problema al eliminar el usuario.',
          'error'
        )
      }
    );
  }


  openEditModalClienr(admin: UsuarioAdministrador){
    this.selectedUserAdmin = { ...admin };
    Swal.fire({
      title: 'Actualizar Usuario',
      html: `
        <div>
          <label for="estado-usuario">Estado:</label>
          <select id="estado-usuario" class="swal2-input">
            <option value="activo" ${this.selectedUserAdmin.estado === 'activo' ? 'selected' : ''}>Activo</option>
            <option value="inactivo" ${this.selectedUserAdmin.estado === 'inactivo' ? 'selected' : ''}>Inactivo</option>
          </select>
        </div>
        <div class="mt-2">
          <label for="nueva-password">Nueva Contraseña (opcional):</label>
          <input type="password" id="nueva-password" class="swal2-input">
        </div>
      `,
      showCancelButton: true,
      confirmButtonColor: '#007bff',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Actualizar',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        return {
          estado: (document.getElementById('estado-usuario') as HTMLSelectElement).value ,
          nuevaPassword: (document.getElementById('nueva-password') as HTMLInputElement).value
        };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const userData = {
          id: this.selectedUserAdmin?.id, 
          estado: result.value.estado,
          password: result.value.nuevaPassword
        };
        this.actualizarUsuarioClient(userData,userData.id);
      }
    });
  }

  actualizarUsuarioClient(userData: any, id_user:any) {
    this.gestionUsuariosService.updateUser(id_user,userData).subscribe(
      (response) => {
        Swal.fire(
          '¡Actualizado!',
          'El usuario ha sido actualizado exitosamente.',
          'success'
        );
        window.location.reload()
      },
      (error) => {
        Swal.fire(
          '¡Error!',
          'Hubo un problema al actualizar el usuario.',
          'error'
        );
      }
    );
  }


  openDeleteModalClient(admin: UsuarioAdministrador) {
    this.selectedUserAdmin = { ...admin };
    const usuarioId= this.selectedUserAdmin.id;
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar este usuario?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'No, cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.eliminarUsuarioClient(usuarioId);
      }
    });
  }

  eliminarUsuarioClient(usuarioId: string) {
    this.gestionUsuariosService.deleteUser(usuarioId).subscribe(
      (response) => {
        Swal.fire(
          '¡Eliminado!',
          'El usuario ha sido eliminado exitosamente.',
          'success'
        )
        window.location.reload()
      },
      (error) => {
        Swal.fire(
          '¡Error!',
          'Hubo un problema al eliminar el usuario.',
          'error'
        )
      }
    );
  }

  generarPassword() {
    this.sugerenciaPassword = this.authService.generarPassword();
    
  }

  mostrarFormularioCrearAdmin(typeDocOptions: any[]) {
    this.generarPassword();
    Swal.fire({
      title: 'Crear Nuevo Administrador',
      html: `
        <div class="grid grid-cols-12 gap-y-4">
          <div class="col-span-12">
            <label for="swal-firstname" class="form-label text-defaulttextcolor">Nombres<sup class="text-xs text-danger">*</sup></label>
            <input type="text" id="swal-firstname" class="swal2-input" placeholder="Nombres">
          </div>
          <div class="col-span-12">
            <label for="swal-lastname" class="form-label text-defaulttextcolor">Apellidos<sup class="text-xs text-danger">*</sup></label>
            <input type="text" id="swal-lastname" class="swal2-input" placeholder="Apellidos">
          </div>
          <div class="col-span-12">
            <label for="swal-typeIdentification" class="form-label text-defaulttextcolor">Tipo identificación<sup class="text-xs text-danger">*</sup></label>
            <select id="swal-typeIdentification" class="swal2-input">
              <option value="">Seleccione un Tipo identificación</option>
              ${typeDocOptions.map(option => `<option value="${option.value}">${option.label}</option>`).join('')}
            </select>
          </div>
          <div class="col-span-12">
            <label for="swal-NumberIdentification" class="form-label text-defaulttextcolor">Número de identificación<sup class="text-xs text-danger">*</sup></label>
            <input type="text" id="swal-NumberIdentification" class="swal2-input" placeholder="Número de identificación">
          </div>
          <div class="col-span-12">
            <label for="swal-email" class="ti-form-label text-default">Correo<sup class="text-xs text-danger">*</sup></label>
            <input type="email" id="swal-email" class="swal2-input" placeholder="Correo">
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonColor: '#17a2b8',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Crear Admin',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        return {
          firstname: (document.getElementById('swal-firstname') as HTMLInputElement).value,
          lastname: (document.getElementById('swal-lastname') as HTMLInputElement).value,
          typeIdentification: (document.getElementById('swal-typeIdentification') as HTMLSelectElement).value,
          NumberIdentification: (document.getElementById('swal-NumberIdentification') as HTMLInputElement).value,
          email: (document.getElementById('swal-email') as HTMLInputElement).value,
          password: this.sugerenciaPassword,
          id_rol: 4, // Establecer el rol a Administrador (id_rol = 4)
          estado: 'activo' // Estado por defecto
        };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.gestionUsuariosService.createUserAdmin(result.value).subscribe(
          (response) => {
            Swal.fire('¡Creado!', 'El administrador ha sido creado exitosamente.', 'success');
            // Recargar la lista de administradores
          },
          (error) => {
            Swal.fire('¡Error!', 'Hubo un problema al crear el administrador.', 'error');
          }
        );
      }
    });
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




  




