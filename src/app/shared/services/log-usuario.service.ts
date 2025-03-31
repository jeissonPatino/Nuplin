import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LogUsuario } from '../../shared/models/log-usuario.model';

@Injectable({
  providedIn: 'root'
})
export class LogUsuarioService {
    apiUrl:string = environment.ApiUrl+'logs';
  constructor(private http: HttpClient) { }

  /**
   * Crea una nueva entrada de log.
   * @param usuarioId El ID del usuario que realizó la acción.
   * @param descripcion La descripción de la acción.
   * @param tipo Opcional: El tipo de acción.
   * @returns Un Observable que emite la respuesta del servidor (puede ser el log creado).
   */

  crearLog(usuarioId: number, descripcion: string, tipo?: string): Observable<LogUsuario> {
    const logEntry: LogUsuario = {
      usuarioId: usuarioId,
      descripcion: descripcion
    };
    return this.http.post<LogUsuario>(this.apiUrl, logEntry);
  }

  /**
   * Obtiene todos los logs del usuario (sin filtrar).
   * @returns Un Observable que emite un array de todos los logs.
   */
  obtenerLogs(): Observable<LogUsuario[]> {
    return this.http.get<LogUsuario[]>(this.apiUrl);
  }

  /**
   * (Opcional) Obtiene los logs filtrados por un criterio (ejemplo: usuarioId).
   * @param usuarioId El ID del usuario para filtrar los logs.
   * @returns Un Observable que emite un array de los logs filtrados.
   */
  obtenerLogsPorUsuario(usuarioId: number): Observable<LogUsuario[]> {
    const url = `${this.apiUrl}/usuario/${usuarioId}`; // Asume que tienes una ruta específica para esto
    return this.http.get<LogUsuario[]>(url);
  }

  /**
   * (Opcional) Obtiene los logs filtrados por un rango de fechas.
   * @param fechaInicio Fecha de inicio del rango.
   * @param fechaFin Fecha de fin del rango.
   * @returns Un Observable que emite un array de los logs en el rango de fechas.
   */
  obtenerLogsPorRangoDeFechas(fechaInicio: Date, fechaFin: Date): Observable<LogUsuario[]> {
    const url = `${this.apiUrl}/rango?fechaInicio=${fechaInicio.toISOString()}&fechaFin=${fechaFin.toISOString()}`;
    return this.http.get<LogUsuario[]>(url);
  }
}