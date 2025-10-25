import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonInput,
  IonItem,
  IonList,
} from '@ionic/angular/standalone';
import { AuthService } from '../../core/auth.service';

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [FormsModule, IonList, IonItem, IonInput, IonButton, RouterModule],
  template: `
    <h2>Create account</h2>
    <ion-list>
      <ion-item>
        <ion-input
          label="Email"
          labelPlacement="floating"
          [(ngModel)]="email"
        ></ion-input>
      </ion-item>
      <ion-item>
        <ion-input
          type="password"
          label="Password"
          labelPlacement="floating"
          [(ngModel)]="password"
        ></ion-input>
      </ion-item>
    </ion-list>
    <ion-button expand="block" (click)="doRegister()">Register</ion-button>
  `,
})
export class RegisterPage {
  private auth = inject(AuthService);
  private router = inject(Router);
  email = '';
  password = '';

  doRegister() {
    if (this.auth.register(this.email, this.password)) {
      this.router.navigate(['/dashboard']).catch(() => {});
    }
  }
}
