import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { User } from '../models/user.model';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUser: User | null = null;
  private codigo: string = ''
  private email: string | null = null;
  private pass: string | null = null;
  constructor(private router: Router) {}

  //Borrar despues de obtener los datos del usuario desde el backend
  private users: User[] = [
    { id: 1, displayName: 'Admin Pruebas', email: 'admin@test.com', role: 'Admin', password: '0fa76955abfa9dafd83facca8343a92aa09497f98101086611b0bfa95dbc0dcc661d62e9568a5a032ba81960f3e55d4a', token: 'fake-jwt-admin' },
    { id: 2, displayName: 'cliente Pruebas', email: 'cliente@test.com', role: 'Cliente', password: '0a989ebc4a77b56a6e2bb7b19d995d185ce44090c13e2984b7ecc6d446d4b61ea9991b76a4c2f04b1b4d244841449454', token: 'fake-jwt-cliente'}

  ];

  async validateUser(formUser: any) : Promise<boolean>{
    debugger;
    // validar back true o false
    return new Promise((resolve =>{
      const user = this.users.find(u => u.email === formUser.email && u.password === formUser.password);
      if(user){
        resolve(true)
      }else{
        resolve(false)
      }
    }))
  }

  async loginConCodigo(): Promise<boolean> {
    return new Promise((resolve) => {
      const user = this.users.find(u => u.email === this.email && u.password === this.email);
      if (user && this.codigo) { 
        this.currentUser = user;
        sessionStorage.setItem('user', JSON.stringify(user));
        resolve(true);
      } else {
        resolve(false);
      }
    });
  }

  logout(): void {
    this.currentUser = null;
    sessionStorage.removeItem('user');
    localStorage.removeItem('user'); 
    this.router.navigate(['/auth/login']).then(() => {
      window.location.reload(); 
    });
  }

  isAuthenticated(): boolean {
    return this.getUser() !== null;
  }

  getUserRole(): string | null {
    const userData = JSON.parse(sessionStorage.getItem('user') || '{}');
    return userData.role || 'default';
  }

  verificarCodigo(code: string) : Observable<any>{
    const esValido = code === this.codigo; 
    return of(esValido);
  }

  setUser(user :any){
    this.email = user.username;
    this.pass = user.password;
  }

  getUser(): string | null {
    return this.email;
  }
}
