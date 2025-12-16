import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonButton,
  IonToast,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonItem,
    IonLabel,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonTextarea,
    IonButton,
    IonToast,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    CommonModule,
    ReactiveFormsModule,
  ],
})
export class ContactPage implements OnInit {
  contactForm: FormGroup;
  showToast = false;
  showErrorToast = false;
  errorMessage = '';
  isSubmitting = false;

  topics = [
    { value: 'id-verification', label: 'ID Verification Services' },
    { value: 'companies-house-filings', label: 'Companies House Filings' },
    { value: 'kyc-shareholders', label: 'KYC for Shareholders' },
    { value: 'ongoing-monitoring', label: 'Ongoing Monitoring' },
    { value: 'registered-office', label: 'Registered Office Services' },
    { value: 'training-advisory', label: 'Training & Advisory' },
    { value: 'enterprise-solution', label: 'Enterprise Solution' },
    { value: 'api-integration', label: 'API Integration' },
    { value: 'other', label: 'Other' },
  ];

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
  ) {
    this.contactForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.pattern(/^[\+]?[\d\s\-\(\)]+$/)]],
      company: ['', [Validators.required, Validators.minLength(2)]],
      topic: ['', Validators.required],
      message: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  ngOnInit() {}

  onSubmit() {
    if (this.contactForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      const payload = this.contactForm.value;

      // Map contact form fields to your backend "submission" fields (MVP)
      const submissionPayload = {
        fullName: payload.name,
        email: payload.email,
        phone: payload.phone || undefined,
        documentType: 'contact-enquiry', // required by backend right now
        documentNumber: payload.company || undefined,
        issuedBy: payload.topic || undefined,
        fileUrl: undefined,
      };

      this.http
        .post('http://localhost:5050/api/v1/submissions', submissionPayload)
        .subscribe({
          next: (res: any) => {
            console.log('Submission success:', res);
            this.isSubmitting = false;
            this.showToast = true;
            this.contactForm.reset();
          },
          error: (err) => {
            console.error('Submission failed:', err);
            this.isSubmitting = false;

            // Determine error message based on error type
            if (err.status === 0 || err.name === 'HttpErrorResponse') {
              // Network error - backend not reachable
              this.errorMessage =
                'Unable to connect to server. Please ensure the backend server is running on port 5050.';
            } else if (err.status === 400) {
              // Validation error from backend
              this.errorMessage =
                err?.error?.error?.message ||
                'Invalid form data. Please check your inputs.';
            } else if (err.status >= 500) {
              // Server error
              this.errorMessage = 'Server error. Please try again later.';
            } else {
              // Other errors
              this.errorMessage =
                err?.error?.error?.message ||
                'Failed to submit form. Please try again.';
            }

            this.showErrorToast = true;
          },
        });
    } else {
      this.contactForm.markAllAsTouched();
    }
  }

  getFieldError(fieldName: string): string {
    const field = this.contactForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
      }
      if (field.errors['email']) {
        return 'Please enter a valid email address';
      }
      if (field.errors['minlength']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be at least ${field.errors['minlength'].requiredLength} characters`;
      }
      if (field.errors['pattern']) {
        return 'Please enter a valid phone number';
      }
    }
    return '';
  }
}
