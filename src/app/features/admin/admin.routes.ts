import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: 'categories',
    loadComponent: () =>
      import('./pages/admin-categories/admin-categories.component').then(
        (m) => m.AdminCategoriesComponent,
      ),
  },
  {
    path: 'classifications',
    loadComponent: () =>
      import('./pages/admin-classifications/admin-classifications.component').then(
        (m) => m.AdminClassificationsComponent,
      ),
  },
  {
    path: 'chatbots',
    loadComponent: () =>
      import('./pages/admin-chatbots/admin-chatbots.component').then(
        (m) => m.AdminChatbotsComponent,
      ),
  },
];
