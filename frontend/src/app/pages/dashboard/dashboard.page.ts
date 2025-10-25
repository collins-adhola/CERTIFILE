import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, IonicModule],
  template: `
    <ion-content class="ion-padding">
      <div class="dashboard-container">
        <h1>Dashboard</h1>
        <p>Welcome to your CertiFile dashboard!</p>

        <ion-card>
          <ion-card-header>
            <ion-card-title>Quick Actions</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <ion-button
              expand="block"
              routerLink="/payments"
              class="ion-margin-bottom"
            >
              View Payments
            </ion-button>
            <ion-button
              expand="block"
              routerLink="/settings"
              class="ion-margin-bottom"
            >
              Account Settings
            </ion-button>
            <ion-button expand="block" fill="outline" (click)="logout()">
              Logout
            </ion-button>
          </ion-card-content>
        </ion-card>
      </div>
    </ion-content>
  `,
  styles: [
    `
      .dashboard-container {
        max-width: 600px;
        margin: 0 auto;
      }
    `,
  ],
})
export class DashboardPage {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
