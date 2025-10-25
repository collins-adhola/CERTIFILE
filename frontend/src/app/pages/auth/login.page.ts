import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonInput,
  IonItem,
  IonList,
} from '@ionic/angular/standalone';
import { AuthService } from '../../core/auth.service';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [FormsModule, IonList, IonItem, IonInput, IonButton, RouterModule],
  template: `
    <h2>Login</h2>
    <ion-list>
      <ion-item>
        <ion-input
          label="Email"
          labelPlacement="floating"
          [(ngModel)]="email"
        ></ion-input>
      </ion-item>
      <ion-item>
        <ion-input
          type="password"
          label="Password"
          labelPlacement="floating"
          [(ngModel)]="password"
        ></ion-input>
      </ion-item>
    </ion-list>
    <ion-button expand="block" (click)="doLogin()">Login</ion-button>
    <ion-button fill="clear" routerLink="/register">Create account</ion-button>
    <ion-button fill="clear" routerLink="/forgot-password"
      >Forgot password?</ion-button
    >
  `,
})
export class LoginPage {
  private auth = inject(AuthService);
  private router = inject(Router);
  email = '';
  password = '';

  doLogin() {
    if (this.auth.login(this.email, this.password)) {
      this.router.navigate(['/dashboard']).catch(() => {});
    }
  }
}
