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
  ],
})
export class AppComponent {
  currentYear = new Date().getFullYear();

  // ACSP Brand Variables
  acspRef = 'ACSP123456';
  icoNumber = 'ZA123456';
  supervisoryBody = 'CGI UK & Ireland';

  constructor() {
    addIcons({ arrowForwardOutline });
  }
}
