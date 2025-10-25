import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
  template: `
    <ion-content class="ion-padding">
      <div class="register-container">
        <h1>Create CertiFile Account</h1>
        <form (ngSubmit)="onRegister()" #registerForm="ngForm">
          <ion-item>
            <ion-label position="stacked">Full Name</ion-label>
            <ion-input
              type="text"
              [(ngModel)]="userData.fullName"
              name="fullName"
              required
            >
            </ion-input>
          </ion-item>

          <ion-item>
            <ion-label position="stacked">Email</ion-label>
            <ion-input
              type="email"
              [(ngModel)]="userData.email"
              name="email"
              required
            >
            </ion-input>
          </ion-item>

          <ion-item>
            <ion-label position="stacked">Password</ion-label>
            <ion-input
              type="password"
              [(ngModel)]="userData.password"
              name="password"
              required
            >
            </ion-input>
          </ion-item>

          <ion-item>
            <ion-label position="stacked">Confirm Password</ion-label>
            <ion-input
              type="password"
              [(ngModel)]="userData.confirmPassword"
              name="confirmPassword"
              required
            >
            </ion-input>
          </ion-item>

          <ion-button
            expand="block"
            type="submit"
            [disabled]="!registerForm.form.valid || isLoading"
          >
            {{ isLoading ? 'Creating Account...' : 'Create Account' }}
          </ion-button>
        </form>

        <div class="ion-text-center ion-margin-top">
          <p>Already have an account? <a routerLink="/login">Login here</a></p>
        </div>
      </div>
    </ion-content>
  `,
  styles: [
    `
      .register-container {
        max-width: 400px;
        margin: 0 auto;
        padding-top: 2rem;
      }
    `,
  ],
})
export class RegisterPage {
  userData = {
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  };
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  onRegister() {
    this.isLoading = true;
    this.authService.register(this.userData).subscribe({
      next: (success) => {
        this.isLoading = false;
        if (success) {
          this.router.navigate(['/login']);
        }
      },
      error: () => {
        this.isLoading = false;
        // Handle registration error
      },
    });
  }
}
