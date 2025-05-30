// services/reporte.service.ts (Ejemplo si creas un nuevo servicio)
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SafeHtml } from '@angular/platform-browser';

export interface ReporteServiciosEntry {
  id_agendamiento: string;
  fecha_agendamiento: string;
  tipo_servicio: string;
  precio_servicio: number;
  id_cliente: string;
  nombre_cliente: string;
  apellido_cliente: string;
  tipo_pasadia: string | null;
  id_insumo: string | null;
  nombre_insumo: string | null;
  cantidad_insumo_utilizada: number | null;
  precio_unitario_insumo: number | null;
  costo_insumo_total: number | null;
  observaciones: string | null;
  fecha_finalizacion_servicio: string | null;
}

export interface ClienteReporteDetalle {
  nombre: string;
  apellido: string;
  numero_identificacion: string;
  correo: string;
  estado: 'activo' | 'inactivo';
  placa_vehiculo: string | null;
  fecha_ultimo_agendamiento: string | null;
}

export interface CrmCardData {
  title: string;
  value: string;
  percent?: string;
  bg: string;
  arrow?: string; 
  iconBgClass: string;
  svg: string | SafeHtml; 
}

export interface ClienteReporteConteo {
  activos_con_agendamiento: number;
  activos_sin_agendamiento: number;
  inactivos_totales: number;
  activos_totales: number;
  total_clientes: number;
}

export interface ReporteConteoClientesResponse {
    detalles: ClienteReporteDetalle[];
    conteos: ClienteReporteConteo;
}

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  apiUrl: string = environment.ApiUrl + 'reportes/';

  constructor(private http: HttpClient) {}

  getReporteServicios(fechaInicio: string, fechaFin: string): Observable<ReporteServiciosEntry[]> {
    let params = new HttpParams();
    params = params.append('fechaInicio', fechaInicio);
    params = params.append('fechaFin', fechaFin);
    return this.http.get<ReporteServiciosEntry[]>(`${this.apiUrl}servicios`, { params });
  }

  getReporteConteoClientes(
    placa: string | null = null,
    numeroIdentificacion: string | null = null,
    estado: string | null = null,
    conServicios: boolean | null = null,
    soloClientes: boolean | null = null
  ): Observable<ReporteConteoClientesResponse> {
    let params = new HttpParams();
    if (placa) params = params.append('placa', placa);
    if (numeroIdentificacion) params = params.append('numeroIdentificacion', numeroIdentificacion);
    if (estado) params = params.append('estado', estado);
    if (conServicios !== null) params = params.append('conServicios', conServicios.toString());
    if (soloClientes !== null) params = params.append('soloClientes', soloClientes.toString());

    return this.http.get<ReporteConteoClientesResponse>(`${this.apiUrl}clientes-conteo`, { params });
  }

  getConteoClientesResumen(): Observable<ClienteReporteConteo> {
    return this.http.get<ClienteReporteConteo>(`${this.apiUrl}clientes-conteo-resumen`);
  }
}