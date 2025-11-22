import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  IonContent,
  IonButton,
  IonIcon,
  IonCard,
  IonCardContent,
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
    IonCard,
    IonCardContent,
    CommonModule,
    FormsModule,
    RouterModule,
  ],
})
export class HomePage implements OnInit {
  openFaqIndex: number | null = null;

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

  constructor() {
    addIcons({
      shieldOutline,
      lockClosedOutline,
      globeOutline,
      timeOutline,
      arrowForwardOutline,
      'chevron-down': chevronDown,
      'chevron-up': chevronUp,
    });
  }

  ngOnInit() {}

  toggleFaq(index: number): void {
    this.openFaqIndex = this.openFaqIndex === index ? null : index;
  }
}
