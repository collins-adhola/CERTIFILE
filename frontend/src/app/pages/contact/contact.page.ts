import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
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
  IonIcon,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkmarkCircle } from 'ionicons/icons';

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
    IonIcon,
    CommonModule,
    ReactiveFormsModule,
  ],
})
export class ContactPage implements OnInit {
  contactForm: FormGroup;
  showToast = false;
  private router = inject(Router);

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
    // Register icons
    addIcons({ 'checkmark-circle': checkmarkCircle });

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
    if (this.contactForm.invalid) return;

    const formEl = document.createElement('form');
    const formData = new FormData(formEl);

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

    fetch('/', {
      method: 'POST',
      body: formData,
    })
      .then(() => {
        // Optional: show your existing toast flag if present
        this.showToast = true;
        // Reset if you want
        this.contactForm.reset();
        // Navigate to thank-you route if you have one
        // this.router.navigate(['/thank-you']);
      })
      .catch(() => {
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
