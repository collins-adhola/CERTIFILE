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
          <ion-title>CertiFile</ion-title>
          <ion-buttons slot="end">
            <ion-button routerLink="/login">Login</ion-button>
            <ion-button routerLink="/register">Register</ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>

      <ion-content id="main">
        <router-outlet></router-outlet>
      </ion-content>

      <ion-footer class="ion-text-center ion-padding">
        <small>© {{ year }} CertiFile</small>
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
