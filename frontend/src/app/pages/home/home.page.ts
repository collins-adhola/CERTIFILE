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
} from 'ionicons/icons';

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
  constructor() {
    addIcons({
      shieldOutline,
      lockClosedOutline,
      globeOutline,
      timeOutline,
      arrowForwardOutline,
    });
  }

  ngOnInit() {}
}
