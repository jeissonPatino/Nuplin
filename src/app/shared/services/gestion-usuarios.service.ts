import { Injectable, NgZone  } from '@angular/core';
import { Router } from '@angular/router';
import { EncryptionService } from './encryption.service';
import { User } from '../models/user.model';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { LoginResponse } from '../models/LoginResponse';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';


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

  // Actualizar uno o varios usuarios
  updateUser(listaUsuarios: any[]): Observable<any> {
    return this.http.put(`${this.apiUrl}/actualizar`, listaUsuarios);
}

  // Crear uno o varios usuarios
  createUser(listaUsuarios: any[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/crear`, listaUsuarios);
  }

  // Eliminar usuarios por lista de IDs
  deleteUser(listaIDUsuarios: number[]): Observable<any> {
    return this.http.put(`${this.apiUrl}/desactivar`, listaIDUsuarios);
}

}