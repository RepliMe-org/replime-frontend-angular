import { Routes } from '@angular/router';
import { oauthGuard } from './core/guards/oauth.guard';

export const routes: Routes = [
   {
    path: '',
    loadComponent: () =>
      import('./layout/public-layout/public-layout.component')
        .then(m => m.PublicLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/landing//home/home.component')
            .then(m => m.HomeComponent)
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/influencer/influencer-dashboard/influencer-dashboard.component')
            .then(m => m.InfluencerDashboardComponent)
      }
    ]
  },
  {
    path: 'auth',
    loadComponent: () =>
      import('./layout/auth-layout/auth-layout.component')
        .then(m => m.AuthLayoutComponent),
    children: [
      {
        path: 'callback',
        canActivate: [oauthGuard],
        loadComponent: () =>
          import('./features/auth/pages/auth-callback/auth-callback.component')
        .then(m => m.AuthCallbackComponent)
      },
    ],
  },
];
