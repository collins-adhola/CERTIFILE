/**
 * Admin Authentication Guard
 * 
 * Protects admin routes by checking for valid JWT token.
 * Redirects to login if not authenticated.
 */

import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminAuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  }

  // Not logged in, redirect to login page
  router.navigate(['/admin/login']);
  return false;
};

