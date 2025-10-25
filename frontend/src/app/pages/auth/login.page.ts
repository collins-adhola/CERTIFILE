import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
  template: `
    <ion-content class="ion-padding">
      <div class="login-container">
        <h1>Login to CertiFile</h1>
        <form (ngSubmit)="onLogin()" #loginForm="ngForm">
          <ion-item>
            <ion-label position="stacked">Email</ion-label>
            <ion-input type="email" [(ngModel)]="email" name="email" required>
            </ion-input>
          </ion-item>

          <ion-item>
            <ion-label position="stacked">Password</ion-label>
            <ion-input
              type="password"
              [(ngModel)]="password"
              name="password"
              required
            >
            </ion-input>
          </ion-item>

          <ion-button
            expand="block"
            type="submit"
            [disabled]="!loginForm.form.valid || isLoading"
          >
            {{ isLoading ? 'Logging in...' : 'Login' }}
          </ion-button>
        </form>

        <div class="ion-text-center ion-margin-top">
          <p>
            Don't have an account? <a routerLink="/register">Register here</a>
          </p>
          <p><a routerLink="/forgot-password">Forgot your password?</a></p>
        </div>
      </div>
    </ion-content>
  `,
  styles: [
    `
      .login-container {
        max-width: 400px;
        margin: 0 auto;
        padding-top: 2rem;
      }
    `,
  ],
})
export class LoginPage {
  email = '';
  password = '';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  onLogin() {
    this.isLoading = true;
    this.authService.login(this.email, this.password).subscribe({
      next: (success) => {
        this.isLoading = false;
        if (success) {
          this.router.navigate(['/dashboard']);
        }
      },
      error: () => {
        this.isLoading = false;
        // Handle login error
      },
    });
  }
}
