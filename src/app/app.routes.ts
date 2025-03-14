import { Routes } from '@angular/router';
import { ContentLayoutComponent } from './shared/layouts/content-layout/content-layout.component';
import { content } from './shared/routes/content.routes';
import { AuthenticationLayoutComponent } from './shared/layouts/authentication-layout/authentication-layout.component';
import { authen } from './shared/routes/auth.routes';
import { AuthGuard } from './guards/auth.guard';
export const routes: Routes = [
    { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
    {
        path: 'auth/login',
        loadComponent: () =>
          import('../app/authentication/login/login.component').then((m) => m.LoginComponent),
      },
    { path: '', component: ContentLayoutComponent, children: content ,canActivate: [AuthGuard], data: { role: 'Cliente' } },
    { path: '', component: AuthenticationLayoutComponent, children: authen  ,canActivate: [AuthGuard], data: { role: 'Cliente' }},
    { path: '**', redirectTo: '/error/error404', pathMatch: 'full' },
];
