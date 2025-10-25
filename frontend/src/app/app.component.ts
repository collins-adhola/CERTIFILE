import { Component } from '@angular/core';
import {
  IonApp,
  IonRouterOutlet,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonFooter,
} from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';
import { addIcons } from 'ionicons';
import { arrowForwardOutline } from 'ionicons/icons';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [
    IonApp,
    IonRouterOutlet,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonIcon,
    IonFooter,
    RouterModule,
  ],
})
export class AppComponent {
  currentYear = new Date().getFullYear();

  constructor() {
    addIcons({ arrowForwardOutline });
  }
}
