import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [CommonModule, IonicModule],
  template: `
    <ion-content class="ion-padding">
      <div class="payments-container">
        <h1>Payment History</h1>
        <p>View and manage your payment history.</p>

        <ion-card>
          <ion-card-header>
            <ion-card-title>Recent Payments</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <p>No payments found.</p>
          </ion-card-content>
        </ion-card>
      </div>
    </ion-content>
  `,
  styles: [
    `
      .payments-container {
        max-width: 600px;
        margin: 0 auto;
      }
    `,
  ],
})
export class PaymentsPage {}
