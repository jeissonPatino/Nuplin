import { Routes } from '@angular/router';
import { ContentLayoutComponent } from './shared/layouts/content-layout/content-layout.component';
import { content } from './shared/routes/content.routes';
import { AuthenticationLayoutComponent } from './shared/layouts/authentication-layout/authentication-layout.component';
import { authen } from './shared/routes/auth.routes';
import { AuthGuard } from './guards/auth.guard';
import { TowStepVerificationsComponent } from './authentication/tow-step-verifications/tow-step-verifications.component';
import { RememberPasswordComponent } from './authentication/remember-password/remember-password.component';
import { RegisterUserComponent } from './authentication/register-user/register-user.component';

export const routes: Routes = [
    { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
    {
        path: 'auth/login',
        loadComponent: () =>
          import('../app/authentication/login/login.component').then((m) => m.LoginComponent),
    },
    { 
      path: 'auth/remember-password', 
      component: RememberPasswordComponent
    },
    { 
      path: 'auth/two-step-verification', 
      component: TowStepVerificationsComponent,
      
    },
    { 
      path: 'auth/register-user', 
      component: RegisterUserComponent,
      
    },
    { path: '', component: ContentLayoutComponent, children: content },
    { path: '', component: AuthenticationLayoutComponent, children: authen  ,canActivate: [AuthGuard], data: { role: [1,2,3,4] }},
    { path: '**', redirectTo: '/error/acceso-denegado', pathMatch: 'full' },
];
