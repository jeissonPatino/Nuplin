import { Component, OnInit, OnDestroy } from '@angular/core';
import { ReportService, ReporteServiciosEntry } from '../../shared/services/report.service';
import { ToastrService } from 'ngx-toastr';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-service-report',
  imports: [CommonModule,FormsModule],
  templateUrl: './service-report.component.html',
  styleUrl: './service-report.component.scss'
})
export class ServiceReportComponent implements OnInit, OnDestroy{
  reporteData: ReporteServiciosEntry[] = [];
  fechaInicio: string = ''; 
  fechaFin: string = ''; 
  private destroy$ = new Subject<void>();
  constructor(
      private reporteService: ReportService,
      private toastr: ToastrService) {}

  ngOnInit(): void {
    
  }
  generarReporte(): void {
    if (this.fechaInicio && this.fechaFin) {
      this.reporteService.getReporteServicios(this.fechaInicio, this.fechaFin)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (data) => {
            this.reporteData = data;
            console.log('Datos del reporte de servicios:', this.reporteData);
            if (data.length === 0) {
              this.toastr.info('No se encontraron datos para el rango de fechas seleccionado.', 'Reporte de Servicios');
            } else {
              this.toastr.success('Reporte generado exitosamente.', 'Reporte de Servicios');
            }
          },
          (error) => {
            console.error('Error al generar el reporte:', error);
            this.toastr.error('Error al generar el reporte. Inténtalo de nuevo más tarde.', 'Error'); 
          }
        );
    } else {
      this.toastr.warning('Por favor, selecciona una fecha de inicio y una fecha de fin.', 'Advertencia');
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(); 
    this.destroy$.complete();
  }
}
