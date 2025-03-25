import { Injectable, NgZone  } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { EncryptionService } from './encryption.service';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  public currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();
  private inactivityTimeout: any;
  private readonly INACTIVITY_LIMIT = 5 * 60 * 1000;
  private email: string | null = null;
  private pass: string | null = null;
  private codigo: string = '';

  constructor( private router: Router, private encryptionService: EncryptionService, private ngZone: NgZone ) {

    this.setupInactivityListener();

  }

  // Datos de prueba antes de conectar con el backend
  private users: User[] = [
    { id: 1, displayName: 'Admin Pruebas', email: 'admin@test.com', role: 'Admin', password: '12345', token: 'fake-jwt-admin', status: true },
    { id: 2, displayName: 'Cliente Pruebas', email: 'cliente@test.com', role: 'Cliente', password: '123456', token: 'fake-jwt-cliente', status: true }
  ];

  private setupInactivityListener() {
    this.resetInactivityTimer();
    ['mousemove', 'keydown', 'click'].forEach(event => {
      document.addEventListener(event, () => this.resetInactivityTimer());
    });
  }

  private resetInactivityTimer() {
    clearTimeout(this.inactivityTimeout);
    this.inactivityTimeout = setTimeout(() => this.logout(), this.INACTIVITY_LIMIT);
  }

  async validateUser(formUser: any): Promise<boolean> {
    const [password, username] = this.encryptionService.decrypt(formUser).split('-');
    this.email = username;
    this.pass = password;

    return new Promise((resolve) => {
      const user = this.users.find(u => u.email === this.email && u.password === this.pass);
      resolve(!!user);
    });
  }

  async validateUserStatus(username: string): Promise<{ exists: boolean; active: boolean }>{
     
    return new Promise((resolve) => {
      const decryptedUsername = this.encryptionService.decrypt(username).split('-')[1];
      const user = this.users.find(u => u.email === decryptedUsername);
      resolve({
        exists: !!user, 
        active: user ? user.status : false
      });
    });
  }

  async loginConCodigo(codigo: string): Promise<boolean> {
    return new Promise((resolve) => {
      const user = this.users.find(u => u.email === this.email && u.password === this.pass);
      const validacion = this.verificarCodigo(codigo);

      if (user && validacion) { 
        this.currentUserSubject.next(user);
        resolve(true);
      } else {
        resolve(false);
      }
    });
  }

  logout(): void {
    this.currentUserSubject.next(null); // Borra el usuario en memoria
    this.router.navigate(['/auth/login']).then(() => window.location.reload());
  }

  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  getUserRole(): string | null {
    return this.currentUserSubject.value?.role || null;
  }

  verificarCodigo(code: string): boolean {
    return code === this.codigo;
  }

  setUser(user: any) {
    this.email = user.value.username;
    this.pass = user.value.password;
  }

  getUser(){
    return this.email
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
        console.log(user)
        if (user) {
          console.log(`✅ Contraseña de ${username} actualizada a: ${newPassword}`);
          resolve(true);
        } else {
          console.error("❌ Usuario no encontrado");
          resolve(false);
        }
      }, 1000);
    });
  }
}
