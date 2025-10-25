import {
  ApplicationConfig,
  provideZoneChangeDetection,
  APP_INITIALIZER,
  inject,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';
import { AuthService } from './core/auth.service';

export function hydrateUserFactory() {
  const auth = inject(AuthService);
  return () => auth.hydrate();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    { provide: APP_INITIALIZER, useFactory: hydrateUserFactory, multi: true },
    provideIonicAngular({
      mode: 'ios',
      // Performance optimizations
      scrollAssist: false,
      hideCaretOnScroll: true,
      inputBlurring: false,
      // Accessibility improvements
      statusTap: true,
      swipeBackEnabled: true,
    }),
  ],
};
