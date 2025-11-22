import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
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

  constructor(private formBuilder: FormBuilder) {
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

  onSubmit() {
    if (this.contactForm.invalid) return;

    // Prepare form data for Netlify
    const formData = new FormData();

    // Netlify requires this field:
    formData.append('form-name', 'contact');

    // Honeypot (leave empty)
    formData.append('bot-field', '');

    // Append your reactive form values:
    const v = this.contactForm.value;
    formData.append('name', v.name ?? '');
    formData.append('email', v.email ?? '');
    formData.append('phone', v.phone ?? '');
    formData.append('company', v.company ?? '');
    formData.append('topic', v.topic ?? '');
    formData.append('message', v.message ?? '');

    // Submit to Netlify Forms
    fetch('/', {
      method: 'POST',
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          this.showToast = true;
          this.contactForm.reset();
        } else {
          // Handle error
          console.error('Form submission failed');
        }
      })
      .catch((error) => {
        console.error('Form submission error:', error);
        // Optionally handle error UI
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
