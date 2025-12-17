import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  IonContent,
  IonButton,
  IonIcon,
  IonItem,
  IonLabel,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonToast,
  IonSegment,
  IonSegmentButton,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  shieldOutline,
  lockClosedOutline,
  globeOutline,
  timeOutline,
  arrowForwardOutline,
  chevronDown,
  chevronUp,
  checkmarkCircle,
} from 'ionicons/icons';

interface FaqItem {
  question: string;
  answer: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonButton,
    IonIcon,
    IonItem,
    IonLabel,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonTextarea,
    IonToast,
    IonSegment,
    IonSegmentButton,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
  ],
})
export class HomePage implements OnInit {
  openFaqIndex: number | null = null;
  contactForm: FormGroup;
  showToast = false;
  showErrorToast = false;
  errorMessage = '';
  isSubmitting = false;
  activeComplianceTab: 'compliance' | 'pack' = 'compliance';

  faqs: FaqItem[] = [
    {
      question: 'Do you verify non‑UK passports?',
      answer:
        'Yes. We can verify UK and non-UK passports, as well as other government-issued photo ID, subject to our provider coverage and a risk-based assessment. We will confirm accepted documents as part of your onboarding.',
    },
    {
      question: 'Is the process fully remote?',
      answer:
        'Yes. The entire identity verification process is designed to be completed remotely on a smartphone, tablet, or desktop device. Your clients receive a secure link and can complete the process from anywhere with a camera and internet connection.',
    },
    {
      question: 'How fast is the turnaround?',
      answer:
        'In most cases, results are available within a few hours of your client completing their checks. More complex cases, such as where manual review or enhanced due diligence is required, may take longer, but we will keep you informed throughout.',
    },
    {
      question: 'What happens to my data?',
      answer:
        'We only collect and process the data necessary to perform identity verification and meet our legal and regulatory obligations. Data is stored securely, retained in accordance with UK AML and data protection requirements, and then deleted or anonymised when no longer needed.',
    },
    {
      question: 'Can you handle my Companies House filings?',
      answer:
        'Yes. In addition to identity verification for directors and PSCs, we can support related Companies House filings such as director or PSC updates, confirmation statements and other compliance submissions, as agreed with you.',
    },
  ];

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
    private router: Router,
    private http: HttpClient,
  ) {
    addIcons({
      shieldOutline,
      lockClosedOutline,
      globeOutline,
      timeOutline,
      arrowForwardOutline,
      'chevron-down': chevronDown,
      'chevron-up': chevronUp,
      'checkmark-circle': checkmarkCircle,
    });

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

  toggleFaq(index: number): void {
    this.openFaqIndex = this.openFaqIndex === index ? null : index;
  }

  onSubmit(event: Event): void {
    event.preventDefault();

    if (this.contactForm.invalid || this.isSubmitting) {
      this.contactForm.markAllAsTouched();
      return;
    }

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
      .post(`${environment.apiUrl}/api/v1/submissions`, submissionPayload)
      .subscribe({
        next: (res: any) => {
          console.log('Submission success:', res);
          this.isSubmitting = false;
          this.showToast = true;
          this.contactForm.reset();
          // Navigate to thank you page after a short delay
          setTimeout(() => {
            this.router.navigate(['/thank-you']);
          }, 1500);
        },
        error: (err) => {
          console.error('Submission failed - Full error object:', err);
          console.error('Error status:', err.status);
          console.error('Error message:', err.message);
          console.error('Error name:', err.name);
          this.isSubmitting = false;

          // Determine error message based on error type
          if (!err.status || err.status === 0) {
            // Network error - backend not reachable or CORS issue
            this.errorMessage =
              'Unable to connect to server. Please check: 1) Backend is running on port 5050, 2) No CORS blocking, 3) Network connectivity.';
          } else if (err.status === 400) {
            // Validation error from backend
            this.errorMessage =
              err?.error?.error?.message ||
              'Invalid form data. Please check your inputs.';
          } else if (err.status === 404) {
            // Endpoint not found
            this.errorMessage =
              'API endpoint not found. Please check the backend routes.';
          } else if (err.status >= 500) {
            // Server error
            this.errorMessage = 'Server error. Please try again later.';
          } else {
            // Other errors
            this.errorMessage =
              err?.error?.error?.message ||
              `Failed to submit form (Status: ${err.status}). Please try again.`;
          }

          this.showErrorToast = true;
        },
      });
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
