import { Routes } from '@angular/router';

export const INFLUENCER_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'content',
    pathMatch: 'full',
  },

  {
    path: 'content',
    loadComponent: () =>
      import('./pages/dashboard/content/content.component').then(
        (m) => m.ContentComponent,
      ),
  },
];
