import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';

@Injectable({
  providedIn: 'root',
})

export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const expectedRoles = Array.isArray(route.data['role'])
    ? route.data['role'].map(Number)       // Convertimos todos los roles a números
    : [Number(route.data['role'])];        // Lo hacemos array de 1 solo número
    const userRole = Number(this.authService.getUserRole());
  
    if (userRole) {
      
      if (expectedRoles.includes(userRole)) {
        return true;
      }
    }
    this.router.navigate(['/auth/login']);
    return false;
  }
}
