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
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
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
  ],
});
