import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../features/auth/services/auth.service';

export const oauthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  const token = route.queryParams['token'];
  const username = route.queryParams['username'];
  const role = route.queryParams['role'];

  if (token && username && role) {
    const firstName = username.split(' ')[0];

    authService.saveAuthData({
      token: token,
      username: firstName,
      role: role,
    });

    return router.createUrlTree(['/']);
  }

  return true;
};