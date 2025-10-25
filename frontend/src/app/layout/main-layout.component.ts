import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { MobileMenuComponent } from './mobile-menu.component';
import { ResponsiveHeaderComponent } from './responsive-header.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    IonicModule,
    MobileMenuComponent,
    ResponsiveHeaderComponent,
  ],
  template: `
    <ion-app>
      <app-mobile-menu></app-mobile-menu>
      <app-responsive-header></app-responsive-header>

      <ion-content id="main">
        <router-outlet></router-outlet>
      </ion-content>

      <ion-footer class="ion-text-center ion-padding">
        <small>© {{ year }} CertiFile Compliance</small>
      </ion-footer>
    </ion-app>
  `,
  styles: [
    `
      ion-content {
        --padding-start: 16px;
        --padding-end: 16px;
      }
    `,
  ],
})
export class MainLayoutComponent {
  year = new Date().getFullYear();
}
