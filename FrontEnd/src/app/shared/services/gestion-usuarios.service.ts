import { Injectable, NgZone  } from '@angular/core';
import { Router } from '@angular/router';
import { EncryptionService } from './encryption.service';
import { User } from '../models/user.model';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { LoginResponse } from '../models/LoginResponse';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { UsuarioCliente } from '../models/UsuarioCliente';
import { UsuarioAdministrador } from '../models/usuarioAdministrador';


@Injectable({
  providedIn: 'root',
})

export class GestionUsuariosService{

apiUrl:string = environment.ApiUrl+'clientes';

constructor(
    private http: HttpClient
){}

getUsuarios(fechaInicio: string, fechaFin: string, paquete?: string): Observable<any> {
    let url = `${this.apiUrl}?fechaInicial=${fechaInicio}&fechaFinal=${fechaFin}`;
    if (paquete) {
      url += `&paquete=${paquete}`;
    }
    return this.http.get(url);
}

 updateUser(usuarioId: string, userData: any): Observable<any> {
    const url = `${this.apiUrl}/actualizar/${usuarioId}`;
    return this.http.put(url, userData);
  }
  
  createUserAdmin(listaUsuarios: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/crearAdmin`, listaUsuarios);
  }

  createUser(listaUsuarios: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/crearAdmin`, listaUsuarios);
  }

  // Eliminar usuarios por lista de IDs
  deleteUser(usuarioId: string): Observable<any> { 
    const url = `${this.apiUrl}/desactivar/${usuarioId}`; 
    return this.http.delete(url);
  }


getUsuariosAdministrador():Observable<UsuarioAdministrador[]>{
  let url = `${this.apiUrl}/usuarios-administrador`;
  return this.http.get<UsuarioAdministrador[]>(url);
}

getUsuariosClientesVehiculos():Observable<UsuarioCliente[]>{
  let url = `${this.apiUrl}/esuarios-clientes-vehiculos`;
  return this.http.get<UsuarioCliente[]>(url);
}


}