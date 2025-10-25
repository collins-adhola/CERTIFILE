import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonInput,
  IonItem,
  IonList,
  IonCard,
  IonCardContent,
  IonContent,
  IonLabel,
} from '@ionic/angular/standalone';
import { AuthService } from '../../core/auth.service';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [FormsModule, IonList, IonItem, IonInput, IonButton, IonCard, IonCardContent, IonContent, IonLabel, RouterModule],
  template: `
    <ion-content class="auth-content">
      <div class="auth-container">
        <!-- Header Section -->
        <div class="auth-header">
          <div class="logo-container">
            <div class="logo">
              <span>CF</span>
            </div>
            <h1>Welcome Back</h1>
            <p class="subtitle">Sign in to your CertiFile account</p>
          </div>
        </div>

        <!-- Form Section -->
        <div class="auth-form">
          <ion-card class="form-card">
            <ion-card-content>
              <form (ngSubmit)="doLogin()" #loginForm="ngForm">
                <div class="input-group">
                  <ion-item class="custom-input">
                    <ion-label position="stacked">Email Address</ion-label>
                    <ion-input
                      type="email"
                      [(ngModel)]="email"
                      name="email"
                      placeholder="Enter your email"
                      required>
                    </ion-input>
                  </ion-item>
                </div>

                <div class="input-group">
                  <ion-item class="custom-input">
                    <ion-label position="stacked">Password</ion-label>
                    <ion-input
                      type="password"
                      [(ngModel)]="password"
                      name="password"
                      placeholder="Enter your password"
                      required>
                    </ion-input>
                  </ion-item>
                </div>

                <ion-button 
                  expand="block" 
                  type="submit"
                  class="login-button"
                  [disabled]="!loginForm.form.valid">
                  Sign In
                </ion-button>
              </form>

              <div class="auth-links">
                <a routerLink="/forgot-password" class="forgot-link">Forgot your password?</a>
              </div>
            </ion-card-content>
          </ion-card>

          <!-- Sign Up Section -->
          <div class="signup-section">
            <p>Don't have an account? 
              <a routerLink="/register" class="signup-link">Create account</a>
            </p>
          </div>
        </div>
      </div>
    </ion-content>
  `,
  styles: [`
    .auth-content {
      --background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      --padding-start: 0;
      --padding-end: 0;
    }

    .auth-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 20px;
    }

    .auth-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .logo-container {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .logo {
      width: 60px;
      height: 60px;
      border-radius: 16px;
      background: linear-gradient(135deg, #5c2d91, #8a2be2);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 24px;
      box-shadow: 0 8px 16px rgba(92, 45, 145, 0.3);
      margin-bottom: 1rem;
    }

    .auth-header h1 {
      color: white;
      font-size: 2rem;
      font-weight: 700;
      margin: 0 0 0.5rem 0;
    }

    .subtitle {
      color: rgba(255, 255, 255, 0.8);
      font-size: 1rem;
      margin: 0;
    }

    .auth-form {
      width: 100%;
      max-width: 400px;
    }

    .form-card {
      background: white;
      border-radius: 16px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
      margin: 0;
    }

    .input-group {
      margin-bottom: 1.5rem;
    }

    .custom-input {
      --background: #f8fafc;
      --border-radius: 12px;
      --padding-start: 16px;
      --padding-end: 16px;
      --inner-padding-end: 0;
      margin-bottom: 8px;
    }

    .custom-input ion-label {
      color: #5c2d91;
      font-weight: 600;
      margin-bottom: 8px;
    }

    .custom-input ion-input {
      --color: #1a202c;
      --placeholder-color: #a0aec0;
    }

    .login-button {
      --background: linear-gradient(135deg, #5c2d91, #8a2be2);
      --color: white;
      --border-radius: 12px;
      --padding-top: 16px;
      --padding-bottom: 16px;
      font-weight: 600;
      font-size: 16px;
      margin-top: 1rem;
      box-shadow: 0 4px 12px rgba(92, 45, 145, 0.3);
    }

    .login-button:disabled {
      --background: #e2e8f0;
      --color: #a0aec0;
      box-shadow: none;
    }

    .auth-links {
      text-align: center;
      margin-top: 1.5rem;
    }

    .forgot-link {
      color: #5c2d91;
      text-decoration: none;
      font-weight: 500;
      font-size: 14px;
    }

    .forgot-link:hover {
      text-decoration: underline;
    }

    .signup-section {
      text-align: center;
      margin-top: 2rem;
    }

    .signup-section p {
      color: rgba(255, 255, 255, 0.9);
      margin: 0;
    }

    .signup-link {
      color: white;
      text-decoration: none;
      font-weight: 600;
    }

    .signup-link:hover {
      text-decoration: underline;
    }

    @media (max-width: 480px) {
      .auth-container {
        padding: 16px;
      }
      
      .auth-header h1 {
        font-size: 1.5rem;
      }
    }
  `]
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
