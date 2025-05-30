import { Component, OnInit, OnDestroy } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SharedModule } from '../../../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { FlatpickrModule } from 'angularx-flatpickr';
import { SpkFlatpickrComponent } from '../../../../@spk/spk-flatpickr/spk-flatpickr.component';
import { CommonModule } from '@angular/common';
import { Usuario } from '../../../shared/models/usuario';
import { GestionUsuariosService } from '../../../shared/services/gestion-usuarios.service';
import { SpkNgSelectComponent } from '../../../../@spk/spk-ng-select/spk-ng-select.component';
import { Subject, takeUntil } from 'rxjs';
import { SpkReusableTablesComponent } from '../../../../@spk/spk-reusable-tables/spk-reusable-tables.component';
import FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { EncryptionService } from '../../../shared/services/encryption.service';
import { LogUsuarioService } from '../../../shared/services/log-usuario.service';

@Component({
  selector: 'app-consulta-usuarios',
  imports: [SharedModule, SpkReusableTablesComponent, FormsModule, FlatpickrModule, SpkFlatpickrComponent,  CommonModule, SpkNgSelectComponent],
  templateUrl: './consulta-usuarios.component.html',
  styleUrl: './consulta-usuarios.component.scss'
})
export class ConsultaUsuariosComponent implements OnInit, OnDestroy {
  selectedDates: string = '';
  showModal: boolean = false;
  isEditing: boolean = false;
  selectedUser: Usuario = { id: 0, name: '', mail: '', pack: '', dateActivation: '', periody: '', bg: '' };
  paginatedData: Usuario[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 20;
  totalPagesArray: number[] = [];
  fechaInicio: string = '';
  fechaFin: string = '';
  datosTablaUsuario: Usuario[] = [];
  datosExportarUsuario: Usuario[] = [];
  isPopoverOpen: boolean = false;
  selectedPaquete: string | null = null;
  private ngUnsubscribe = new Subject<void>();

  responsiveColumn = [
    { header: "Seleccione", field: "Seleccione" },
    { header: "Nombre completo", field: "name" },
    { header: "Email", field: "mail" },
    { header: "Paquete", field: "pack" },
    { header: "Fecha activación", field: "dateActivation" },
    { header: "Activo hasta (paquete)", field: "periody" },
    { header: "Acciones", field: "Acciones" }
  ];

  Planes = [
    { label: 'Paquete Básico', value: 1 },
    { label: 'Paquete básico & Paquete Adultos', value: 2 },
    { label: 'Paquete Básico & Win +', value: 3 },
  ];

  constructor(
    private toastr: ToastrService,
    private gestionUsuariosService: GestionUsuariosService,
    private encryptionService: EncryptionService,
    private LogUsuarioService: LogUsuarioService,
  ) {}

  ngOnInit() {
    this.loadUsers(); 
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  loadUsers() {
    this.gestionUsuariosService.getUsuarios(this.fechaInicio, this.fechaFin).pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (data: Usuario[]) => {
          this.datosTablaUsuario = data;
          this.updatePaginatedData();
          this.crearLog('Consulta Usuarios', 'Datos obtenidos con exito', 'INFO', 'GESTION USUARIOS');
        },
        (error) => {
          this.toastr.error('Error al cargar los usuarios.', 'Error');
          this.crearLog('Consulta Usuarios', 'Error al cargar los usuarios.'+error, 'ERROR', 'GESTION USUARIOS');
          
        }
      );
  }

  updatePaginatedData() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedData = this.datosTablaUsuario.slice(start, end);
    this.totalPagesArray = Array.from({ length: this.totalPages() }, (_, i) => i + 1);
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages()) return;
    this.currentPage = page;
    this.updatePaginatedData();
  }

  handleSelectChange(seleccion: any) {
    this.selectedPaquete = seleccion;
    console.log("Paquete seleccionado:", this.selectedPaquete);
  }

  totalPages(): number {
    return Math.ceil(this.datosTablaUsuario.length / this.itemsPerPage);
  }

  get displayedRecords(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.datosTablaUsuario.length);
  }

  openCreateModal() {
    this.selectedUser = { id: 0, name: '', mail: '', pack: '', dateActivation: '', periody: '', bg: '' };
    this.isEditing = false;
    this.showModal = true;
  }

  openEditModal(usuario: Usuario) {
    this.selectedUser = { ...usuario };
    this.isEditing = true;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  handleSave(data: Usuario) {
    if (this.isEditing) {
      this.gestionUsuariosService.updateUser('1', data).pipe(takeUntil(this.ngUnsubscribe)).subscribe(
        (updatedUsers: Usuario[]) => {
          if (updatedUsers && updatedUsers.length > 0) {
            this.toastr.success('Usuario actualizado correctamente.', 'Éxito');
            this.crearLog('Actualizar Usuarios', 'Usuario actualizado correctamente.', 'INFO', 'GESTION USUARIOS');
            this.loadUsers();
          } else {
            this.toastr.error('Error al actualizar el usuario.', 'Error');
            this.crearLog('Actualizar Usuarios', 'Error al actualizar el usuario.', 'ERROR', 'GESTION USUARIOS');
          }
        },
        (error) => {
          this.toastr.error('Error al actualizar el usuario.', 'Error');
          this.crearLog('Actualizar Usuarios', 'Error al actualizar el usuario.'+error, 'ERROR', 'GESTION USUARIOS');
          
        }
      );
    } else {
      this.gestionUsuariosService.createUser([data]).pipe(takeUntil(this.ngUnsubscribe)).subscribe(
        (newUsers: Usuario[]) => {
          if (newUsers && newUsers.length > 0) {
            this.toastr.success('Usuario creado correctamente.', 'Éxito');
            this.crearLog('Crear Usuarios', 'Usuario creado correctamente.', 'INFO', 'GESTION USUARIOS');
            this.loadUsers();
          } else {
            this.toastr.error('Error al crear el usuario.', 'Error');
            this.crearLog('Crear Usuarios', 'Error al crear el usuario.', 'ERROR', 'GESTION USUARIOS');
          }
        },
        (error) => {
          this.toastr.error('Error al crear el usuario.', 'Error');
          this.crearLog('Crear Usuarios', 'Error al crear el usuario.'+error, 'ERROR', 'GESTION USUARIOS');
        }
      );
    }
    this.closeModal();
  }

  togglePopover() {
    this.isPopoverOpen = !this.isPopoverOpen;
  }

  onDateChange(event: string) {
    this.selectedDates = event;
    const fechas = this.selectedDates.split(" to ");
    this.fechaInicio = fechas[0];
    this.fechaFin = fechas[1];
    this.searchByDate();
  }

  searchByDate() {
    if (this.fechaInicio == undefined || this.fechaFin == undefined) {
      this.toastr.error('Por favor, selecciona un rango de fechas.', 'Error', {
        timeOut: 3000,
        positionClass: 'toast-top-center'
      });
      return;
    } else {
      this.loadUsers();
    }
  }

  exportToExcel() {
    if (!this.datosExportarUsuario || this.datosExportarUsuario.length === 0) {
      this.toastr.warning('No hay datos para exportar a Excel.', 'Advertencia', {
        timeOut: 3000,
        positionClass: 'toast-top-center'
      });
      return;
    }
    const workSheet = XLSX.utils.json_to_sheet(this.datosExportarUsuario);
    const workBook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet, 'Usuarios');
    const excelBuffer: any = XLSX.write(workBook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, 'usuarios');
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
    FileSaver.saveAs(data, fileName + '.xlsx');
  }


  private crearLog(accion: string, descripcion: string, logLevel: string, moduloOrigen: string) {
    const email = this.encryptionService.decryptUser().split('&')[1];
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