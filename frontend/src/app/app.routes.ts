import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'how',
    loadComponent: () => import('./pages/how/how.page').then((m) => m.HowPage),
  },
  {
    path: 'services',
    loadComponent: () =>
      import('./pages/services/services.page').then((m) => m.ServicesPage),
  },
  {
    path: 'pricing',
    loadComponent: () =>
      import('./pages/pricing/pricing.page').then((m) => m.PricingPage),
  },
  {
    path: 'faq',
    loadComponent: () => import('./pages/faq/faq.page').then((m) => m.FaqPage),
  },
  {
    path: 'contact',
    loadComponent: () =>
      import('./pages/contact/contact.page').then((m) => m.ContactPage),
  },
];
