import { Component, OnInit } from '@angular/core';
import { LogUsuarioService } from '../../shared/services/log-usuario.service';
import { LogUsuario } from '../../shared/models/log-usuario.model';
import { SpkReusableTablesComponent } from '../../../@spk/spk-reusable-tables/spk-reusable-tables.component';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { ToastrService } from 'ngx-toastr';


import { CommonModule } from '@angular/common';
interface ColumnDefinition {
  header: string;
  field: string;
}
@Component({
  selector: 'app-log-display',
  imports: [SpkReusableTablesComponent,CommonModule],
  templateUrl: './log-display.component.html',
  styleUrl: './log-display.component.scss'
})
export class LogDisplayComponent {
  logs: LogUsuario[] = [];
  paginatedData: LogUsuario[] = [];
  responsiveColumn: ColumnDefinition[] = [
    { header: 'ID', field: 'id' },
    { header: 'Usuario ID', field: 'usuarioId' },
    { header: 'Descripción', field: 'descripcion' },
    { header: 'Fecha', field: 'fecha' },
    { header: 'Tipo', field: 'tipo' }
  ];
  currentPage = 1;
  itemsPerPage = 10; 
  totalLogs = 0;
  loading = true;
  error: string | null = null;
  datosExportarLog: any[] = [];

  constructor(
    private logService: LogUsuarioService,
    private toastr: ToastrService
  ){
  }
  ngOnInit(): void {
    this.fetchLogs();
  }

  fetchLogs(): void {
    this.loading = true;
    this.error = null;
    this.logService.obtenerLogs().subscribe(
      (data) => {
        this.logs = data;
        this.totalLogs = data.length;
        this.paginateData(); // Inicializar paginatedData
      },
      (err) => {
        this.error = 'Error al cargar los logs. Intente nuevamente.';
        console.error(err);
      },
      () => {
        this.loading = false;
      }
    );
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.paginateData();
  }

  paginateData(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedData = this.logs.slice(startIndex, endIndex);
  }

  totalPages(): number {
    return Math.ceil(this.totalLogs / this.itemsPerPage);
  }

  get totalPagesArray(): number[] {
    return Array(this.totalPages()).fill(0).map((_, index) => index + 1);
  }

  updateExportData(): void {
    if (!this.logs || this.logs.length === 0) {
      this.toastr.info('No hay datos para exportar.', 'Información', {
        timeOut: 3000,
        positionClass: 'toast-top-center'
      });
      return;
    }
    this.datosExportarLog = [...this.logs];
    this.exportToExcel();
  }

  exportToExcel(): void {
    if (!this.datosExportarLog || this.datosExportarLog.length === 0) {
      this.toastr.warning('No hay datos para exportar a Excel.', 'Advertencia', {
        timeOut: 3000,
        positionClass: 'toast-top-center'
      });
      return;
    }

    const workSheet = XLSX.utils.json_to_sheet(this.datosExportarLog);
    const workBook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet, 'Logs');
    const excelBuffer: any = XLSX.write(workBook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, 'logs');
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
    FileSaver.saveAs(data, fileName + '.xlsx');
  }

}



