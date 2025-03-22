import { Routes } from '@angular/router';
import { ContentLayoutComponent } from './shared/layouts/content-layout/content-layout.component';
import { content } from './shared/routes/content.routes';
import { AuthenticationLayoutComponent } from './shared/layouts/authentication-layout/authentication-layout.component';
import { authen } from './shared/routes/auth.routes';
import { AuthGuard } from './guards/auth.guard';
import { TowStepVerificationsComponent } from './authentication/tow-step-verifications/tow-step-verifications.component';
import { RememberPasswordComponent } from './authentication/remember-password/remember-password.component';

export const routes: Routes = [
    { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
    {
        path: 'auth/login',
        loadComponent: () =>
          import('../app/authentication/login/login.component').then((m) => m.LoginComponent),
    },
    { 
      path: 'auth/remember-password', 
      component: RememberPasswordComponent,
      canActivate: [AuthGuard] 
    },
    { 
      path: 'auth/two-step-verification', 
      component: TowStepVerificationsComponent,
      
    },
    { path: '', component: ContentLayoutComponent, children: content ,canActivate: [AuthGuard], data: { role: 'Cliente' } },
    { path: '', component: AuthenticationLayoutComponent, children: authen  ,canActivate: [AuthGuard], data: { role: 'Cliente' }},
    { path: '**', redirectTo: '/error/acceso-denegado', pathMatch: 'full' },
];
