import { Injectable, NgZone  } from '@angular/core';
import { Router } from '@angular/router';
import { EncryptionService } from './encryption.service';
import { User } from '../models/user.model';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
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

  constructor( 
      private http: HttpClient,
      private router: Router, 
      private encryptionService: EncryptionService,
      private toastr: ToastrService ,) 
  {
    this.setupInactivityListener();
  }
  
  // Datos de prueba antes de conectar con el backend
  private users: User[] = [
      {
        sub: "nuplinautenticacion@gmail.com",
        profile: "1",
        userRegistered: "2025-03-19T16:25:34.000+00:00",
        token: "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJudXBsaW5hdXRlbnRpY2FjaW9uQGdtYWlsLmNvbSIsImlhdCI6MTc0MzE5MzUzOCwiZXhwIjoxNzQzMTk3MTM4fQ.vGKmqvg5JmCdwWUvvHb_HD7EISsr4LhbzOTARLSFamU",
        activationType: "standard",
        password: "12345",
        id: 1,
        userType: "admin",
        partnerId: "TeleVVD",
        resetToken: "123e4567-e89b-12d3-a456-426614174000",
        exp: 1743197138000,
        email: "nuplinautenticacion@gmail.com",
        status: 1
      },
      {
        sub: "cliente@test.com",
        profile: "2",
        userRegistered: "2025-03-19T16:25:34.000+00:00",
        token: "fake-jwt-cliente",
        activationType: "standard",
        password: "123456",
        id: 2,
        userType: "user",
        partnerId: "TeleVVD",
        resetToken: "69f7968f-2188-42f6-993c-7261d1625dae",
        exp: 1743197138000,
        email: "cliente@test.com",
        status: 1
      }
    
    
  ];

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

  async validateUser(formUser: any): Promise<boolean> {
    try {
      let [password, email] = this.encryptionService.decrypt(formUser).split('&');
      try {
        const response = await this.http.post<LoginResponse>(`${environment.ApiUrl}user/login`, { formUser } ).toPromise();
        if (response) {
          const { token, ...userData } = response; 
          this.encryptionService.encryptUser({user: userData});
          sessionStorage.setItem('JWT', token );
          sessionStorage.setItem('sessionStartTime', Date.now().toString());
          return this.verificarToken();
        }
      } catch (backendError) {
        console.warn('El backend no está disponible, buscando localmente...');
        const user = this.users.find(u => u.email === email && u.password === password);
        if (user) {
          const { token, ...userData } = user; 
          this.encryptionService.encryptUser({user: userData});
          sessionStorage.setItem('JWT', token );
          sessionStorage.setItem('sessionStartTime', Date.now().toString());
          return this.verificarToken();
        }
      }
    } catch (error) {
      console.error('Error al validar usuario:', error);
    }
    return false;
  }

  async validateUserStatus(username: string): Promise<{  active: number }>{
    return new Promise((resolve) => {
      const status = this.encryptionService.decryptUser().split('&')[2];
      resolve({
        active: status ? Number(status) : 0 
      });
    });
  }

  async loginConCodigo(codigo: string): Promise<boolean> {
    return new Promise((resolve) => {
      const user = this.isAuthenticated();
      const validacion = this.verificarCodigo(codigo);
      resolve(!!user && validacion);
    });
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

  verificarToken(): boolean {
    const token = sessionStorage.getItem('JWT');
    if (!token) {
      console.error('No se encontró el token en sessionStorage');
      return false;
    }
    const decoded = this.encryptionService.decodeToken(token);
    if (!decoded || !decoded.sub) {
      console.error('Error al decodificar el token o el "sub" no existe.');
      return false;
    }
    const decryptedData = this.encryptionService.decryptUser();
    const email = decryptedData.split('&')[0]; 
    return email === decoded.sub;
  }

  verificarCodigo(code: string): boolean {
    const token = sessionStorage.getItem('JWT');
    if (!token) {
      console.error('No se encontró el token en sessionStorage');
      return false;
    }
    const decoded = this.encryptionService.decodeToken(token);
    return true;
  }

  setUser(user: any) {
    this.email = user.value.username;
    this.pass = user.value.password;
  }

  sendEmailCodeVerification(code: string) {
    this.codigo = code;
  }

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

  actualizarPassword(username: string, newPassword: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = this.users.find(u => u.email === username);
        if (user) {
          this.toastr.success('Contraseña Actualizada', 'NuplinTv', { timeOut: 3000, positionClass: 'toast-top-right' });
          resolve(true);
        } else {
          this.toastr.error('Hubo un problema al actualizar', 'NuplinTv', { timeOut: 3000, positionClass: 'toast-top-right' });
          resolve(false);
        }
      }, 3000);
    });
  }

  
}
