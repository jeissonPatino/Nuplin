import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';

@Injectable({
  providedIn: 'root',
})

export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const expectedRole = route.data['role']; 
    const user = this.authService.getUser(); 
  
    if (user) {
      if (user.role === 'Admin' || user.role === expectedRole) {
        return true;
      }
    }
    this.router.navigate(['/auth/login']);
    return false;
  }
}
