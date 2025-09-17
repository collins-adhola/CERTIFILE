import { bootstrapApplication } from '@angular/platform-browser';
import {
  RouteReuseStrategy,
  provideRouter,
  withPreloading,
  PreloadAllModules,
} from '@angular/router';
import {
  IonicRouteStrategy,
  provideIonicAngular,
} from '@ionic/angular/standalone';
import { ServiceWorkerModule } from '@angular/service-worker';
import { isDevMode } from '@angular/core';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { CheckForUpdateService } from './sw-registration';

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
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
    provideRouter(routes, withPreloading(PreloadAllModules)),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }).providers || [],
    CheckForUpdateService,
  ],
});
