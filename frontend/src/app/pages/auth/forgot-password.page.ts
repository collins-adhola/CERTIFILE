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
  IonLabel,
} from '@ionic/angular/standalone';

@Component({
  standalone: true,
  selector: 'app-forgot-password',
  imports: [CommonModule, FormsModule, RouterModule, IonContent, IonList, IonItem, IonInput, IonButton, IonCard, IonCardContent, IonLabel],
  template: `
    <ion-content class="auth-content">
      <div class="auth-container">
        <!-- Header Section -->
        <div class="auth-header">
          <div class="logo-container">
            <div class="logo">
              <span>CF</span>
            </div>
            <h1>Reset Password</h1>
            <p class="subtitle">We'll help you get back into your account</p>
          </div>
        </div>

        <!-- Form Section -->
        <div class="auth-form">
          <ion-card class="form-card">
            <ion-card-content>
              <!-- Email Step -->
              <div *ngIf="!otpSent">
                <p class="step-description">Enter your email address and we'll send you a verification code.</p>
                
                <div class="input-group">
                  <ion-item class="custom-input">
                    <ion-label position="stacked">Email Address</ion-label>
                    <ion-input 
                      type="email"
                      [(ngModel)]="email"
                      placeholder="Enter your email address">
                    </ion-input>
                  </ion-item>
                </div>
                
                <ion-button 
                  expand="block" 
                  (click)="sendOTP()" 
                  [disabled]="!email"
                  class="send-button">
                  Send Verification Code
                </ion-button>
              </div>

              <!-- OTP Step -->
              <div *ngIf="otpSent">
                <p class="step-description">We've sent a 6-digit verification code to <strong>{{ email }}</strong></p>
                <p class="step-description">Please enter the code below:</p>
                
                <div class="otp-container">
                  <div class="otp-inputs">
                    <ion-input 
                      *ngFor="let digit of otpDigits; let i = index"
                      [(ngModel)]="otpDigits[i]"
                      maxlength="1"
                      type="text"
                      inputmode="numeric"
                      pattern="[0-9]"
                      class="otp-input"
                      (input)="onOTPInput(i, $event)"
                      (keydown)="onOTPKeydown(i, $event)">
                    </ion-input>
                  </div>
                </div>
                
                <ion-button 
                  expand="block" 
                  (click)="verifyOTP()" 
                  [disabled]="!isOTPComplete()"
                  class="verify-button">
                  Verify Code
                </ion-button>
                
                <div class="resend-section">
                  <p>Didn't receive the code? 
                    <a (click)="resendOTP()" class="resend-link">Resend</a>
                  </p>
                </div>
              </div>

              <!-- Success Step -->
              <div *ngIf="otpVerified" class="success-container">
                <div class="success-icon">✅</div>
                <h3>Verification Successful!</h3>
                <p>You can now reset your password.</p>
                <ion-button 
                  expand="block" 
                  fill="outline" 
                  routerLink="/login"
                  class="back-button">
                  Back to Login
                </ion-button>
              </div>
            </ion-card-content>
          </ion-card>
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

    .step-description {
      color: #4a5568;
      font-size: 14px;
      margin-bottom: 1.5rem;
      line-height: 1.5;
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

    .send-button, .verify-button {
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

    .send-button:disabled, .verify-button:disabled {
      --background: #e2e8f0;
      --color: #a0aec0;
      box-shadow: none;
    }

    .otp-container {
      margin: 2rem 0;
    }

    .otp-inputs {
      display: flex;
      gap: 12px;
      justify-content: center;
      flex-wrap: wrap;
    }

    .otp-input {
      width: 50px;
      height: 50px;
      text-align: center;
      font-size: 20px;
      font-weight: bold;
      border: 2px solid #e2e8f0;
      border-radius: 12px;
      background: #f8fafc;
      color: #1a202c;
      transition: all 0.2s ease;
    }

    .otp-input:focus {
      border-color: #5c2d91;
      background: white;
      box-shadow: 0 0 0 3px rgba(92, 45, 145, 0.1);
    }

    .resend-section {
      text-align: center;
      margin-top: 1.5rem;
    }

    .resend-section p {
      color: #4a5568;
      font-size: 14px;
      margin: 0;
    }

    .resend-link {
      color: #5c2d91;
      text-decoration: none;
      font-weight: 600;
      cursor: pointer;
    }

    .resend-link:hover {
      text-decoration: underline;
    }

    .success-container {
      text-align: center;
      padding: 2rem 0;
    }

    .success-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .success-container h3 {
      color: #1a202c;
      font-size: 1.5rem;
      font-weight: 700;
      margin: 0 0 0.5rem 0;
    }

    .success-container p {
      color: #4a5568;
      margin: 0 0 2rem 0;
    }

    .back-button {
      --color: #5c2d91;
      --border-color: #5c2d91;
      --border-radius: 12px;
      --padding-top: 16px;
      --padding-bottom: 16px;
      font-weight: 600;
    }

    @media (max-width: 480px) {
      .auth-container {
        padding: 16px;
      }
      
      .auth-header h1 {
        font-size: 1.5rem;
      }

      .otp-input {
        width: 45px;
        height: 45px;
        font-size: 18px;
      }
    }
  `]
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
    
    // Only allow single digits
    if (value.length > 1) {
      this.otpDigits[index] = value.slice(-1);
      event.target.value = value.slice(-1);
    } else {
      this.otpDigits[index] = value;
    }
    
    // Auto-focus next input
    if (value && index < 5) {
      setTimeout(() => {
        const nextInput = document.querySelector(`ion-input:nth-child(${index + 2}) input`) as HTMLInputElement;
        if (nextInput) nextInput.focus();
      }, 10);
    }
  }

  onOTPKeydown(index: number, event: KeyboardEvent) {
    // Handle backspace
    if (event.key === 'Backspace' && !this.otpDigits[index] && index > 0) {
      setTimeout(() => {
        const prevInput = document.querySelector(`ion-input:nth-child(${index}) input`) as HTMLInputElement;
        if (prevInput) prevInput.focus();
      }, 10);
    }
    
    // Only allow numbers
    if (!/[0-9]/.test(event.key) && !['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
      event.preventDefault();
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
