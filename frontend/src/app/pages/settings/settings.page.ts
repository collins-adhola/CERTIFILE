import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
  template: `
    <ion-content class="ion-padding">
      <div class="settings-container">
        <h1>Account Settings</h1>

        <ion-card>
          <ion-card-header>
            <ion-card-title>Profile Information</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <form (ngSubmit)="onSaveProfile()" #profileForm="ngForm">
              <ion-item>
                <ion-label position="stacked">Full Name</ion-label>
                <ion-input
                  type="text"
                  [(ngModel)]="profile.fullName"
                  name="fullName"
                >
                </ion-input>
              </ion-item>

              <ion-item>
                <ion-label position="stacked">Email</ion-label>
                <ion-input
                  type="email"
                  [(ngModel)]="profile.email"
                  name="email"
                >
                </ion-input>
              </ion-item>

              <ion-button
                expand="block"
                type="submit"
                [disabled]="!profileForm.form.valid"
              >
                Save Changes
              </ion-button>
            </form>
          </ion-card-content>
        </ion-card>
      </div>
    </ion-content>
  `,
  styles: [
    `
      .settings-container {
        max-width: 600px;
        margin: 0 auto;
      }
    `,
  ],
})
export class SettingsPage {
  profile = {
    fullName: '',
    email: '',
  };

  onSaveProfile() {
    // TODO: Implement profile save logic
    console.log('Profile saved:', this.profile);
  }
}
