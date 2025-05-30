import { Component } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ClienteReporteConteo, ClienteReporteDetalle, ReportService } from '../../shared/services/report.service';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-customer-count-report',
  imports: [CommonModule,FormsModule],
  templateUrl: './customer-count-report.component.html',
  styleUrl: './customer-count-report.component.scss'
})
export class CustomerCountReportComponent {
  detalleClientes: ClienteReporteDetalle[] = [];
  conteosClientes: ClienteReporteConteo | null = null;
  filtroPlaca: string = '';
  filtroNumeroIdentificacion: string = '';
  filtroEstado: string = 'todos';
  filtroConServicios: string = 'todos';
  filtroSoloClientes: boolean = true; 

  private destroy$ = new Subject<void>();

  constructor(private reporteService: ReportService, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.generarReporte(); // Carga inicial
  }

  generarReporte(): void {
    const conServiciosParam = this.filtroConServicios === 'true' ? true : (this.filtroConServicios === 'false' ? false : null);

    this.reporteService.getReporteConteoClientes(
      this.filtroPlaca || null,
      this.filtroNumeroIdentificacion || null,
      this.filtroEstado === 'todos' ? null : this.filtroEstado,
      conServiciosParam,
      this.filtroSoloClientes
    )
    .pipe(takeUntil(this.destroy$))
    .subscribe(
      (response) => {
        this.detalleClientes = response.detalles;
        this.conteosClientes = response.conteos;
        if (this.detalleClientes.length === 0) {
          this.toastr.info('No se encontraron clientes que coincidan con los filtros.', 'Reporte de Clientes');
        } else {
          this.toastr.success('Reporte de clientes generado exitosamente.', 'Reporte de Clientes');
        }
      },
      (error) => {
        console.error('Error al generar el reporte de clientes:', error);
        this.toastr.error('Error al generar el reporte de clientes. Inténtalo de nuevo más tarde.', 'Error');
      }
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}

