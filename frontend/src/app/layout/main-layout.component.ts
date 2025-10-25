import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, IonicModule],
  template: `
    <ion-app>
      <ion-header>
        <ion-toolbar color="primary">
          <ion-title>CertiFile Compliance</ion-title>
          <ion-buttons slot="end">
            <ion-button routerLink="/login" fill="clear" color="light">Login</ion-button>
            <ion-button routerLink="/register" fill="solid" color="light">Register</ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>

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
