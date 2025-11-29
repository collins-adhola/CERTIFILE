import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-payg-plan',
  standalone: true,
  imports: [IonContent, IonButton, CommonModule],
  templateUrl: './payg-plan.page.html',
  styleUrls: ['./payg-plan.page.scss'],
})
export class PaygPlanPage {}


