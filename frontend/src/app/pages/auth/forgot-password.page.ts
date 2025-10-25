import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonInput,
  IonItem,
  IonList,
} from '@ionic/angular/standalone';

@Component({
  standalone: true,
  selector: 'app-forgot-password',
  imports: [FormsModule, IonList, IonItem, IonInput, IonButton],
  template: `
    <h2>Forgot password</h2>
    <p>
      Enter your email and we will send reset instructions (placeholder UI).
    </p>
    <ion-list>
      <ion-item>
        <ion-input label="Email" labelPlacement="floating"></ion-input>
      </ion-item>
    </ion-list>
    <ion-button expand="block">Send reset link</ion-button>
  `,
})
export class ForgotPasswordPage {}
