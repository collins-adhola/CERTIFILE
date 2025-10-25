import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  selector: 'app-register',
  imports: [CommonModule, FormsModule, IonList, IonItem, IonInput, IonButton, RouterModule],
  template: `
    <h2>Create account</h2>
    <ion-list>
      <ion-item>
        <ion-input
          label="Email"
          labelPlacement="floating"
          type="email"
          [(ngModel)]="email"
          placeholder="Enter your email address"
        ></ion-input>
      </ion-item>
      <ion-item>
        <ion-input
          type="password"
          label="Password"
          labelPlacement="floating"
          [(ngModel)]="password"
          placeholder="Enter your password"
        ></ion-input>
      </ion-item>
      <ion-item>
        <ion-input
          type="password"
          label="Confirm Password"
          labelPlacement="floating"
          [(ngModel)]="confirmPassword"
          placeholder="Confirm your password"
        ></ion-input>
      </ion-item>
    </ion-list>
    <ion-button expand="block" (click)="doRegister()" [disabled]="!isFormValid()">Register</ion-button>
    
    <div *ngIf="password && confirmPassword && password !== confirmPassword" style="text-align: center; margin-top: 8px;">
      <p style="color: var(--ion-color-danger); font-size: 14px;">Passwords do not match</p>
    </div>
    
    <div style="text-align: center; margin-top: 16px;">
      <p>Already have an account? <a routerLink="/login" style="color: var(--ion-color-primary); text-decoration: none;">Login</a></p>
    </div>
  `,
})
export class RegisterPage {
  private auth = inject(AuthService);
  private router = inject(Router);
  email = '';
  password = '';
  confirmPassword = '';

  isFormValid(): boolean {
    return this.email.length > 0 && 
           this.password.length > 0 && 
           this.confirmPassword.length > 0 &&
           this.password === this.confirmPassword;
  }

  doRegister() {
    if (!this.isFormValid()) {
      return;
    }

    if (this.password !== this.confirmPassword) {
      // In a real app, you'd show an error message
      console.error('Passwords do not match');
      return;
    }

    if (this.auth.register(this.email, this.password)) {
      this.router.navigate(['/dashboard']).catch(() => {});
    }
  }
}
