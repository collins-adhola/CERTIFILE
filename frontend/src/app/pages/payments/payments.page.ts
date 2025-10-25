import { Component } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';

@Component({
  standalone: true,
  selector: 'app-payments',
  imports: [IonContent],
  template: `
    <ion-content>
      <h2>Payments</h2>
      <p>Payment management (placeholder)</p>
    </ion-content>
  `,
})
export class PaymentsPage {}
