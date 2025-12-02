import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonContent, IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-company-plan',
  standalone: true,
  imports: [IonContent, IonButton, CommonModule],
  templateUrl: './company-plan.page.html',
  styleUrls: ['./company-plan.page.scss'],
})
export class CompanyPlanPage {
  constructor(private router: Router) {}

  onSubmit(event: Event): void {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    fetch('/', {
      method: 'POST',
      body: formData,
    })
      .then((response) => {
        if (!response.ok) throw new Error('Network error');
        this.router.navigate(['/thank-you']);
      })
      .catch((error) => {
        console.error('Form submission error', error);
      });
  }
}


