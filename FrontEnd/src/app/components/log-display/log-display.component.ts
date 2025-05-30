import { Component, OnInit } from '@angular/core';
import { LogUsuarioService } from '../../shared/services/log-usuario.service';
import { LogUsuario } from '../../shared/models/log-usuario.model';

import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { ToastrService } from 'ngx-toastr';


import { CommonModule, DecimalPipe } from '@angular/common';
interface ColumnDefinition {
  header: string;
  field: string;
}
interface SalesData {
  name: string;
  data: number[];
}

interface MonthlyReportData {
  month: string;
  actualSales: number | null;
  projectedSales: number | null;
}
@Component({
  selector: 'app-log-display',
  imports: [CommonModule],
  templateUrl: './log-display.component.html',
  styleUrl: './log-display.component.scss'
})

export class LogDisplayComponent {
  public reportTableData: MonthlyReportData[] = [];
  logs: LogUsuario[] = [];
  paginatedData: LogUsuario[] = [];
  responsiveColumn: ColumnDefinition[] = [
    { header: 'ID', field: 'id' },
    { header: 'Usuario ID', field: 'usuarioId' },
    { header: 'Descripción', field: 'descripcion' },
    { header: 'Fecha', field: 'fecha' },
    { header: 'Tipo', field: 'tipo' }
  ];

  public salesChartData: SalesData[] = [
    {
      name: "Ventas Reales",
      data: [1000000, 1345000, 900000, 2400000, 31000000, 27000000, 3565000, 65600000, 64000000, 35000000, 28000000, 21000000],
    },
    {
      name: "Proyección Ventas",
      data: [74000000, 59000000, 32000000, 73000000, 34000000, 58000000, 89000000, 65400000, 41000000, 63800000, 23000000, 67500000],
    }
  ];

  public months: string[] = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];
  currentPage = 1;
  itemsPerPage = 10; 
  totalLogs = 0;
  loading = true;
  error: string | null = null;
  datosExportarLog: any[] = [];
  
  constructor(
    private logService: LogUsuarioService,
    private toastr: ToastrService,
    
  ){
  }
  ngOnInit(): void {
    this.prepareTableData();
    this.fetchLogs();
  }

  fetchLogs(): void {
    this.loading = true;
    this.error = null;
    this.logService.obtenerLogs().subscribe(
      (data) => {
        this.logs = data;
        this.totalLogs = data.length;
        this.paginateData();
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

  prepareTableData(): void {
    const actualSalesData = this.salesChartData.find(s => s.name === "Ventas Reales");
    const projectedSalesData = this.salesChartData.find(s => s.name === "Proyección Ventas");

    this.reportTableData = this.months.map((month, index) => {
      return {
        month: month,
        actualSales: actualSalesData ? actualSalesData.data[index] : null,
        projectedSales: projectedSalesData ? projectedSalesData.data[index] : null,
      };
    });
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

  getTotal(type: 'actualSales' | 'projectedSales'): number {
    return this.reportTableData.reduce((sum, item) => {
      const value = item[type];
      return sum + (typeof value === 'number' ? value : 0);
    }, 0);
  }

}



