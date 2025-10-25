import { Component, inject } from '@angular/core';
import { IonButton, IonContent } from '@ionic/angular/standalone';
import { AuthService } from '../../core/auth.service';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [IonContent, IonButton],
  template: `
    <ion-content>
      <h2>Dashboard</h2>
      <p>Welcome, {{ auth.user()?.name }}!</p>
      <ion-button (click)="logout()">Logout</ion-button>
    </ion-content>
  `,
})
export class DashboardPage {
  auth = inject(AuthService);

  logout() {
    this.auth.logout();
  }
}
