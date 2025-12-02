import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonContent, IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-payg-plan',
  standalone: true,
  imports: [IonContent, IonButton, CommonModule],
  templateUrl: './payg-plan.page.html',
  styleUrls: ['./payg-plan.page.scss'],
})
export class PaygPlanPage {
  hoveredItem: string | null = null;

  constructor(private router: Router) {}

  setHovered(value: string | null) {
    this.hoveredItem = value;
  }

  isHovered(value: string): boolean {
    return this.hoveredItem === value;
  }

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


