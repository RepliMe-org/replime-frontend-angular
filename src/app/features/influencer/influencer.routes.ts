import { Routes } from '@angular/router';

export const INFLUENCER_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/dashboard/influencer-dashboard.component').then(
        (m) => m.InfluencerDashboardComponent,
      ),
    children: [
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
      {
        path: 'classifications',
        loadComponent: () =>
          import('./pages/dashboard/classifications/classifications.component').then(
            (m) => m.ClassificationsComponent,
          ),
      },
    ],
  },
];
