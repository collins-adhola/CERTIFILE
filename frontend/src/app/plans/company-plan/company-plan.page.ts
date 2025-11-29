import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-company-plan',
  standalone: true,
  imports: [IonContent, IonButton, CommonModule],
  templateUrl: './company-plan.page.html',
  styleUrls: ['./company-plan.page.scss'],
})
export class CompanyPlanPage {}


