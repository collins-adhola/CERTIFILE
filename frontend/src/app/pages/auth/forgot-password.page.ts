import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
  template: `
    <ion-content class="ion-padding">
      <div class="forgot-password-container">
        <h1>Reset Password</h1>
        <p>
          Enter your email address and we'll send you a link to reset your
          password.
        </p>

        <form (ngSubmit)="onResetPassword()" #resetForm="ngForm">
          <ion-item>
            <ion-label position="stacked">Email</ion-label>
            <ion-input type="email" [(ngModel)]="email" name="email" required>
            </ion-input>
          </ion-item>

          <ion-button
            expand="block"
            type="submit"
            [disabled]="!resetForm.form.valid || isLoading"
          >
            {{ isLoading ? 'Sending...' : 'Send Reset Link' }}
          </ion-button>
        </form>

        <div class="ion-text-center ion-margin-top">
          <p><a routerLink="/login">Back to Login</a></p>
        </div>
      </div>
    </ion-content>
  `,
  styles: [
    `
      .forgot-password-container {
        max-width: 400px;
        margin: 0 auto;
        padding-top: 2rem;
      }
    `,
  ],
})
export class ForgotPasswordPage {
  email = '';
  isLoading = false;

  constructor(private router: Router) {}

  onResetPassword() {
    this.isLoading = true;
    // TODO: Implement password reset logic
    setTimeout(() => {
      this.isLoading = false;
      // Show success message
      this.router.navigate(['/login']);
    }, 2000);
  }
}
