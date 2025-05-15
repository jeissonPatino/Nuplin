import { Injectable, NgZone  } from '@angular/core';
import { Router } from '@angular/router';
import { EncryptionService } from './encryption.service';
import { User } from '../models/user.model';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { LoginResponse } from '../models/LoginResponse';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})

export class AuthService {
  private inactivityTimeout: any;
  private warningTimeout!: ReturnType<typeof setTimeout>;
  private SESSION_LIMIT = 60 * 60 * 1000; // 1 hora en ms
  private INACTIVITY_LIMIT = 5 * 60 * 1000; // 5 minutos en ms
  private email: string | null = null;
  private pass: string | null = null;
  private codigo: string = '';
  apiUrl:string = environment.ApiUrl;
  constructor( 
      private http: HttpClient,
      private router: Router, 
      private encryptionService: EncryptionService,
      private toastr: ToastrService ,) 
  {
    this.setupInactivityListener();
  }
  
 

  private setupInactivityListener() {
    this.resetInactivityTimer();
    ['mousemove', 'keydown', 'click'].forEach(event => {
      document.addEventListener(event, () => this.resetInactivityTimer());
    });
  }

  private resetInactivityTimer() {
    clearTimeout(this.inactivityTimeout);
    clearTimeout(this.warningTimeout);
    const WARNING_TIME = this.INACTIVITY_LIMIT - 60000;
    this.warningTimeout = setTimeout(() => {
      this.toastr.warning('Su sesión expirará en 1 minuto por inactividad.', 'Advertencia', {
        timeOut: 5000
      });
    }, WARNING_TIME);
    this.inactivityTimeout = setTimeout(() => this.logout(), this.INACTIVITY_LIMIT);
  }
  //el usuario ingresa correo y contraseña
  async validateUser(formUser: any): Promise<any> { // Cambiado el tipo de retorno
    try {
      let [password, email] = this.encryptionService.decrypt(formUser).split('&');
      try {
        const response = await this.http.post<LoginResponse>(`${this.apiUrl}auth/login`, { formUser } ).toPromise();
        if (response) {
          
          return { token: response.token, userData: response };
        }
      } catch (backendError) {
        console.warn('El backend no está disponible, buscando localmente...', backendError);
        
      }
    } catch (error) {
      console.error('Error al validar usuario:', error);
    }
    return null; //  Indicar fallo
  }

  // se valida si el usuario esta activo o no
  async validateUserStatus(username: string): Promise<{ active: number }> {
    if (username === this.encryptionService.decryptUser().split('&')[0]) {
      return new Promise((resolve) => {
        const status = this.encryptionService.decryptUser().split('&')[2];
        resolve({
          active: status ? Number(status) : 0,
        });
      });
    }
    return Promise.resolve({ active: 0 });
  }

  async loginConCodigo(codigo: string): Promise<boolean> {
    return new Promise((resolve) => {
      const user = this.isAuthenticated();
      const validacion = this.verificarCodigo(codigo);
      resolve(!!user && validacion);
    });
  }

  //Se toma el usuario en sesion
  isAuthenticated(): any {
    let username= this.encryptionService.decryptUser().split('&')[0];
    if (!username) return false;
    try {
      return username 
    } catch (error) {
      console.error('Error al descifrar el usuario:', error);
      return true;
    }
  }

  //se obtiene el rol del usuario
  getUserRole(): string | null {
    let userType = this.encryptionService.decryptUser().split('&')[1];
    if (!userType) return null;
    try {
      return userType || null
    } catch (error) {
      console.error('Error al descifrar el usuario:', error);
      return null;
    }
  }

  //El token JWK 
  verificarToken(token: string, email: string): boolean {
    if (!token) {
      console.error('No se encontró el token.');
      return false;
    }
    const decoded = this.encryptionService.decodeToken(token);
    if (!decoded || !decoded.sub) {
      console.error('Error al decodificar el token o el "sub" no existe.');
      return false;
    }
    return email === decoded.sub;
  }

  verificarCodigo(code: string): Promise<boolean> {
    return Promise.resolve(this.codigo === code);
  }
  
  sendEmailCodeVerification(email: string) {
    const url = `${this.apiUrl}auth/dobleAuth`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
    const body = new HttpParams().set('email', email);
    return this.http.post<string>(url, body.toString(), { headers });
  }

  //Generacion de pass Automatico se usa en el reset pass y el update 
  generarPassword(): string {
    const caracteres = 'abcdefghijklmnopqrstuvwxyz';
    const mayusculas = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numeros = '0123456789';
    const especiales = '!@#$%^&*()-_=+';
    let password = '';
    password += mayusculas.charAt(Math.floor(Math.random() * mayusculas.length));
    password += numeros.charAt(Math.floor(Math.random() * numeros.length));
    password += especiales.charAt(Math.floor(Math.random() * especiales.length));
    const todos = caracteres + mayusculas + numeros + especiales;
    while (password.length < 12) {
      password += todos.charAt(Math.floor(Math.random() * todos.length));
    }
    return password.split('').sort(() => 0.5 - Math.random()).join('');
  }

  logout(): void {
    this.toastr.warning('Cerrando su sesión', 'NuplinTv', { timeOut: 5000 });
    sessionStorage.removeItem('JWT');
    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('sessionStartTime');
    setTimeout(() => {
      this.router.navigate(['/auth/login']).then(() => window.location.reload());
    }, 5500);
  }

  
}
