import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  IonButton,
  IonInput,
  IonItem,
  IonList,
  IonCard,
  IonCardContent,
  IonContent,
} from '@ionic/angular/standalone';

@Component({
  standalone: true,
  selector: 'app-forgot-password',
  imports: [CommonModule, FormsModule, RouterModule, IonContent, IonList, IonItem, IonInput, IonButton, IonCard, IonCardContent],
  template: `
    <ion-content class="ion-padding">
      <div style="max-width: 400px; margin: 0 auto;">
        <h2>Reset Password</h2>
        
        <!-- Email Step -->
        <div *ngIf="!otpSent">
          <p>Enter your email address and we'll send you a verification code.</p>
          <ion-list>
            <ion-item>
              <ion-input 
                label="Email" 
                labelPlacement="floating" 
                type="email"
                [(ngModel)]="email"
                placeholder="Enter your email address">
              </ion-input>
            </ion-item>
          </ion-list>
          <ion-button expand="block" (click)="sendOTP()" [disabled]="!email">
            Send Verification Code
          </ion-button>
        </div>

        <!-- OTP Step -->
        <div *ngIf="otpSent">
          <p>We've sent a 6-digit verification code to <strong>{{ email }}</strong></p>
          <p>Please enter the code below:</p>
          
          <ion-card>
            <ion-card-content>
              <div style="display: flex; gap: 8px; justify-content: center; margin: 20px 0;">
                <ion-input 
                  *ngFor="let digit of otpDigits; let i = index"
                  [(ngModel)]="otpDigits[i]"
                  maxlength="1"
                  style="width: 40px; text-align: center; font-size: 18px; font-weight: bold;"
                  (input)="onOTPInput(i, $event)"
                  (keydown)="onOTPKeydown(i, $event)">
                </ion-input>
              </div>
            </ion-card-content>
          </ion-card>
          
          <ion-button expand="block" (click)="verifyOTP()" [disabled]="!isOTPComplete()">
            Verify Code
          </ion-button>
          
          <div style="text-align: center; margin-top: 16px;">
            <p>Didn't receive the code? <a (click)="resendOTP()" style="color: var(--ion-color-primary); cursor: pointer;">Resend</a></p>
          </div>
        </div>

        <!-- Success Step -->
        <div *ngIf="otpVerified">
          <ion-card>
            <ion-card-content style="text-align: center;">
              <h3>✅ Verification Successful!</h3>
              <p>You can now reset your password.</p>
              <ion-button expand="block" fill="outline" routerLink="/login">
                Back to Login
              </ion-button>
            </ion-card-content>
          </ion-card>
        </div>
      </div>
    </ion-content>
  `,
})
export class ForgotPasswordPage {
  email = '';
  otpSent = false;
  otpVerified = false;
  otpDigits = ['', '', '', '', '', ''];

  sendOTP() {
    if (!this.email) return;
    
    // Simulate sending OTP (in real app, this would call your backend)
    console.log('Sending OTP to:', this.email);
    this.otpSent = true;
    
    // For demo purposes, show a mock OTP in console
    const mockOTP = '123456';
    console.log('Mock OTP sent:', mockOTP);
  }

  onOTPInput(index: number, event: any) {
    const value = event.target.value;
    this.otpDigits[index] = value;
    
    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.querySelector(`ion-input:nth-child(${index + 2})`) as HTMLInputElement;
      if (nextInput) nextInput.focus();
    }
  }

  onOTPKeydown(index: number, event: KeyboardEvent) {
    // Handle backspace
    if (event.key === 'Backspace' && !this.otpDigits[index] && index > 0) {
      const prevInput = document.querySelector(`ion-input:nth-child(${index})`) as HTMLInputElement;
      if (prevInput) prevInput.focus();
    }
  }

  isOTPComplete(): boolean {
    return this.otpDigits.every(digit => digit !== '');
  }

  verifyOTP() {
    const otpCode = this.otpDigits.join('');
    
    // For demo purposes, accept any 6-digit code
    if (otpCode.length === 6) {
      console.log('OTP verified:', otpCode);
      this.otpVerified = true;
    }
  }

  resendOTP() {
    this.otpSent = false;
    this.otpDigits = ['', '', '', '', '', ''];
    this.otpVerified = false;
  }
}
