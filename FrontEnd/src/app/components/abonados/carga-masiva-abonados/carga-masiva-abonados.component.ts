import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { FilePondModule } from 'ngx-filepond';
import * as FilePond from 'filepond';
import { CommonModule } from '@angular/common';
import * as Papa from 'papaparse';
import { ToastrService } from 'ngx-toastr';
import { SpkReusableTablesComponent } from '../../../../@spk/spk-reusable-tables/spk-reusable-tables.component';
import { AuthService } from '../../../shared/services/auth.service';
import { GestionUsuariosService } from '../../../shared/services/gestion-usuarios.service';
import { DatosAbonadoCSV } from '../../../shared/models/DatosAbonadoCSV.model';
import { EncryptionService } from '../../../shared/services/encryption.service';
import { LogUsuarioService } from '../../../shared/services/log-usuario.service';

@Component({
  selector: 'app-carga-masiva-abonados',
  standalone: true,
  imports: [CommonModule, FilePondModule, SpkReusableTablesComponent],
  templateUrl: './carga-masiva-abonados.component.html',
  styleUrl: './carga-masiva-abonados.component.scss'
})
export class CargaMasivaAbonadosComponent implements AfterViewInit {

  constructor(
      private toastr: ToastrService ,
      private authService: AuthService,
      private gestionUsuariosService: GestionUsuariosService,
      private encryptionService: EncryptionService,
      private LogUsuarioService: LogUsuarioService,
  ){}

  modalVisible = false;
  paginatedData: DatosAbonadoCSV[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 20;
  totalPagesArray: number[] = [];
  @ViewChild("myPond") myPond: any;
  pondFiles: FilePond.FilePondOptions["files"] = [ ];
  singlepondOptions = {
    allowMultiple: false,
    acceptedFileTypes: ['text/csv', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
    labelIdle: "📂 Arrastra y suelta archivos aquí o haz clic para subir",
  };
  responsiveColumn=[
    {header:"Nombre completo",field:"Nombre completo"},         
    {header:"Email",field:"Email"},
    {header:"Paquete",field:"Paquete"},
    {header:"Activo hasta (paquete)",field:"Activo hasta (paquete)"},
    {header:"Canales Adicionales",field:"Canales Adicionales"}
  ]
  responsiveTables: DatosAbonadoCSV[] = [];
  csvDataReady: boolean = false;

  ngAfterViewInit() {
    if (this.myPond) {
      console.log('FilePond inicializado:', this.myPond);
    }
  }

  pondHandleInit() {}

  pondHandleAddFile(event: any) {
    const file = event.file.file;
    if (file) {
      const fileName = file.name.toLowerCase();
      if (!fileName.endsWith('.csv')) {
        this.toastr.error('Solo se permiten archivos con formato .csv', 'CMT_Movitlity', { timeOut: 5000 });
        this.myPond.removeFile(event.file);
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const csvData = reader.result as string;
        this.procesarCSV(csvData);
      };
      reader.readAsText(file);
    }
  }

  procesarCSV(csvData: string) {
    Papa.parse(csvData, {
      header: true,
      skipEmptyLines: true,
      complete: result => {
        this.validarDatos(result.data as DatosAbonadoCSV[]);
      }
    });
  }

  validarDatos(data: DatosAbonadoCSV[]) {
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let datosValidos = true;
    data.forEach(row => {
      if (!row.Nombre || !row.Email || !regexEmail.test(row.Email)) {
        console.error('Error en los datos:', row);
        datosValidos = false;
      }
    });

    if (datosValidos) {
      this.responsiveTables = data;
      this.csvDataReady = true;
      this.updatePaginatedData();
    } else {
      this.toastr.error('El archivo CSV contiene errores. Por favor, corríjalos.', 'Error', { timeOut: 5000 });
      this.csvDataReady = false;
      this.responsiveTables = [];
      this.paginatedData = [];
      this.totalPagesArray = [];
    }
  }

  pondHandleActivateFile(event: any) {

  }

  get displayedRecords(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.responsiveTables.length);
  }

  updatePaginatedData() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedData = this.responsiveTables.slice(start, end);
    this.totalPagesArray = this.generatePagesArray();
  }

  generatePagesArray(): number[] {
    const totalPages = this.totalPages();
    return Array(totalPages).fill(0).map((_, i) => i + 1);
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages()) return;
    this.currentPage = page;
    this.updatePaginatedData();
  }

  totalPages(): number {
    return Math.ceil(this.responsiveTables.length / this.itemsPerPage);
  }

  mostrarModal() {
    this.modalVisible = true;
  }

  descargarCSV() {
    const encabezados = ['Nombre', 'Email', 'Departamento', 'País', 'Paquete', 'Activo hasta', 'Canales adicionales'];
    const datosEjemplo = [
      ['Juan Pérez', 'juan.perez@email.com', 'Bogotá', 'Colombia', 'Paquete Básico', '31/12/2025', 'Win+'],
      ['María Gómez', 'maria.gomez@email.com', 'Medellín', 'Colombia', 'Paquete Premium', 'Indefinido', 'Sin canales adicionales']
    ];

    let csvContent = '\uFEFF' + [encabezados, ...datosEjemplo].map(e => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'Plantilla_Carga_Abonados.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  cargarDatosMasivamente() {
    
  }

  transformDataForAPI(data: DatosAbonadoCSV[]): any[] {
    return data.map(item => ({
      nombre: item.Nombre,
      email: item.Email,
      departamento: item.Departamento,
      pais: item.País,
      paquete: item.Paquete,
      activoHasta: item.Activo_hasta,
      canalesAdicionales: item.Canales_adicionales
    }));
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
