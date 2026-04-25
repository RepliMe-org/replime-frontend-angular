import { Routes } from '@angular/router';
import { oauthGuard } from './core/guards/oauth.guard';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layout/public-layout/public-layout.component').then(
        (m) => m.PublicLayoutComponent,
      ),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/landing/home/home.component').then(
            (m) => m.HomeComponent,
          ),
      },
    ],
  },

  {
    path: 'auth',
    loadComponent: () =>
      import('./layout/auth-layout/auth-layout.component').then(
        (m) => m.AuthLayoutComponent,
      ),
    children: [
      {
        path: 'callback',
        canActivate: [oauthGuard],
        loadComponent: () =>
          import('./features/auth/pages/auth-callback/auth-callback.component').then(
            (m) => m.AuthCallbackComponent,
          ),
      },
    ],
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./layout/dashboard-layout/dashboard-layout.component').then(
        (m) => m.DashboardLayoutComponent,
      ),
    children: [
      {
        path: 'influencer',
        loadComponent: () =>
          import('./features/influencer/influencer-dashboard/influencer-dashboard.component').then(
            (m) => m.InfluencerDashboardComponent,
          ),
      },
      {
        path: '',
        redirectTo: 'influencer',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
