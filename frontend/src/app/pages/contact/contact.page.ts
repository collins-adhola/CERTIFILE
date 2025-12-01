import { Component, OnInit, AfterViewInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ViewportScroller } from '@angular/common';
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
import { ViewChild } from '@angular/core';
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
export class ContactPage implements OnInit, AfterViewInit {
  @ViewChild(IonContent) content!: IonContent;

  contactForm: FormGroup;
  showToast = false;
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private viewportScroller = inject(ViewportScroller);

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
    addIcons({ checkmarkCircle });

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

  ngAfterViewInit() {
    // Check for fragment and scroll to form section
    this.route.fragment.subscribe((fragment) => {
      if (fragment === 'book-demo') {
        // Use multiple attempts to ensure scroll works
        this.scrollToForm();
      }
    });

    // Also check on initial load if fragment is in URL
    if (this.route.snapshot.fragment === 'book-demo') {
      this.scrollToForm();
    }
  }

  private scrollToForm() {
    // Use a single attempt with proper timing
    setTimeout(() => {
      const section = document.getElementById('book-demo');

      if (section) {
        // Calculate scroll position to show the section from the top
        // This ensures "Book a demo" heading is visible
        const rect = section.getBoundingClientRect();
        const scrollTop =
          window.pageYOffset || document.documentElement.scrollTop || 0;
        const elementTop = rect.top + scrollTop;

        // Calculate position to show section from top with header space
        // This will show the "Book a demo" heading and the form
        // Reduced offset to show more of the form including the button
        const headerHeight = 60; // Reduced space to show more content
        const targetPosition = Math.max(0, elementTop - headerHeight);

        // Scroll using window.scrollTo
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth',
        });

        // Also try Ionic's scrollTo method
        if (this.content) {
          this.content.getScrollElement().then((scrollEl) => {
            scrollEl.scrollTo({
              top: targetPosition,
              behavior: 'smooth',
            });
          });
        }

        // Focus on first input after scroll
        setTimeout(() => {
          const formCard = section.querySelector('.contact-form-card');
          if (formCard) {
            const firstInput = formCard.querySelector('ion-input') as any;
            if (firstInput) {
              setTimeout(() => {
                const nativeInput = firstInput.shadowRoot?.querySelector(
                  'input',
                ) as HTMLInputElement;
                if (nativeInput) {
                  nativeInput.focus();
                }
              }, 300);
            }
          }
        }, 600);
      }
    }, 300);
  }

  onSubmit(event?: Event) {
    if (event) {
      event.preventDefault();
    }

    if (this.contactForm.invalid) {
      // Mark all fields as touched to show validation errors
      Object.keys(this.contactForm.controls).forEach((key) => {
        this.contactForm.get(key)?.markAsTouched();
      });
      return;
    }

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

    // Check if we're on localhost (for testing)
    const isLocalhost =
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1';

    // Submit to Netlify Forms
    // Note: Don't set Content-Type header - browser will set it with boundary for FormData
    fetch('/', {
      method: 'POST',
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          this.showToast = true;
          this.contactForm.reset();
          // Reset form state
          Object.keys(this.contactForm.controls).forEach((key) => {
            this.contactForm.get(key)?.setErrors(null);
            this.contactForm.get(key)?.markAsUntouched();
          });
        } else {
          // Handle error
          console.error(
            'Form submission failed:',
            response.status,
            response.statusText,
          );
          // On localhost, show success for testing; on production, show error
          if (isLocalhost) {
            this.showToast = true;
            this.contactForm.reset();
            Object.keys(this.contactForm.controls).forEach((key) => {
              this.contactForm.get(key)?.setErrors(null);
              this.contactForm.get(key)?.markAsUntouched();
            });
          } else {
            alert('There was an error submitting your form. Please try again.');
          }
        }
      })
      .catch((error) => {
        console.error('Form submission error:', error);
        // On localhost, show success for testing; on production, show error
        if (isLocalhost) {
      this.showToast = true;
      this.contactForm.reset();
          Object.keys(this.contactForm.controls).forEach((key) => {
            this.contactForm.get(key)?.setErrors(null);
            this.contactForm.get(key)?.markAsUntouched();
          });
    } else {
          alert('There was an error submitting your form. Please try again.');
    }
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
