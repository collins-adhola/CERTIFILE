/**
 * Admin Login Page
 * 
 * Standalone component for admin authentication.
 */

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonToast,
  IonSpinner,
} from '@ionic/angular/standalone';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.page.html',
  styleUrls: ['./admin-login.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonToast,
    IonSpinner,
    CommonModule,
    FormsModule,
  ],
})
export class AdminLoginPage {
  email = '';
  password = '';
  isLoading = false;
  showErrorToast = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Please enter both email and password.';
      this.showErrorToast = true;
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        // Login successful, redirect to admin submissions
        this.router.navigate(['/admin/submissions']);
      },
      error: (err) => {
        console.error('Login error:', err);
        this.isLoading = false;
        this.errorMessage = 'Login failed';
        this.showErrorToast = true;
      },
    });
  }
}

