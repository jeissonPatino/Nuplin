import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUser: User | null = null;

  constructor(private router: Router) {}

  //Borrar despues de obtener los datos del usuario desde el backend
  private users: User[] = [
    { id: 1, displayName: 'Admin Pruebas', email: 'admin@test.com', role: 'Admin', password: '0fa76955abfa9dafd83facca8343a92aa09497f98101086611b0bfa95dbc0dcc661d62e9568a5a032ba81960f3e55d4a', token: 'fake-jwt-admin' },
    { id: 2, displayName: 'cliente Pruebas', email: 'cliente@test.com', role: 'Cliente', password: '0a989ebc4a77b56a6e2bb7b19d995d185ce44090c13e2984b7ecc6d446d4b61ea9991b76a4c2f04b1b4d244841449454', token: 'fake-jwt-cliente' }
  ];

  loginWithEmail(email: string, hashedPassword: string, token: string): Promise<boolean> {
    return new Promise((resolve) => {
      const user = this.users.find(u => u.email === email && u.password === hashedPassword);
  
      if (user) {
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

  getUser(): User | null {
    return this.currentUser || JSON.parse(sessionStorage.getItem('user') || 'null');
  }

  isAuthenticated(): boolean {
    return this.getUser() !== null;
  }

  getUserRole(): string | null {
    return this.getUser()?.role || '';
  }
}
