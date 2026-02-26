import { Routes } from '@angular/router';

export const routes: Routes = [
   {
    path: '',
    loadComponent: () =>
      import('./core/layout/public-layout/public-layout.component')
        .then(m => m.PublicLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/landing//home/home.component')
            .then(m => m.HomeComponent)
      }
    ]
  },
  {
    path: 'auth',
    loadComponent: () =>
      import('./core/layout/auth-layout/auth-layout.component')
        .then(m => m.AuthLayoutComponent)
  },
];