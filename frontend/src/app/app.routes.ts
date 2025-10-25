import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/home/home.page').then((m) => m.HomePage),
      },
      {
        path: 'pricing',
        loadComponent: () =>
          import('./pages/pricing/pricing.page').then((m) => m.PricingPage),
      },
      {
        path: 'how',
        loadComponent: () =>
          import('./pages/how/how.page').then((m) => m.HowPage),
      },
      {
        path: 'services',
        loadComponent: () =>
          import('./pages/services/services.page').then((m) => m.ServicesPage),
      },
      {
        path: 'faq',
        loadComponent: () =>
          import('./pages/faq/faq.page').then((m) => m.FaqPage),
      },
      {
        path: 'contact',
        loadComponent: () =>
          import('./pages/contact/contact.page').then((m) => m.ContactPage),
      },
      {
        path: 'login',
        loadComponent: () =>
          import('./pages/auth/login.page').then((m) => m.LoginPage),
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./pages/auth/register.page').then((m) => m.RegisterPage),
      },
      {
        path: 'forgot-password',
        loadComponent: () =>
          import('./pages/auth/forgot-password.page').then(
            (m) => m.ForgotPasswordPage,
          ),
      },
      {
        path: 'dashboard',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./pages/dashboard/dashboard.page').then(
            (m) => m.DashboardPage,
          ),
      },
      {
        path: 'payments',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./pages/payments/payments.page').then((m) => m.PaymentsPage),
      },
      {
        path: 'settings',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./pages/settings/settings.page').then((m) => m.SettingsPage),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
