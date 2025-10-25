import { Component } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';

@Component({
  standalone: true,
  selector: 'app-settings',
  imports: [IonContent],
  template: `
    <ion-content>
      <h2>Settings</h2>
      <p>User settings (placeholder)</p>
    </ion-content>
  `,
})
export class SettingsPage {}
