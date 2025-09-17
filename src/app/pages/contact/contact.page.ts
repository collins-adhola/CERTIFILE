import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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

  topics = [
    { value: 'idv', label: 'IDV' },
    { value: 'confirmation-statement', label: 'Confirmation statement' },
    { value: 'director-psc-changes', label: 'Director/PSC changes' },
    { value: 'company-incorporation', label: 'Company incorporation' },
    { value: 'other', label: 'Other' },
  ];

  constructor(private formBuilder: FormBuilder) {
    this.contactForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.pattern(/^[\+]?[\d\s\-\(\)]+$/)]],
      topic: ['', Validators.required],
      message: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  ngOnInit() {}

  onSubmit() {
    if (this.contactForm.valid) {
      console.log('Form payload:', this.contactForm.value);
      this.showToast = true;
      this.contactForm.reset();
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
