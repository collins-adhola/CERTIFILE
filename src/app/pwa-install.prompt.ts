import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PwaInstallPromptService {
  private deferredPrompt: any;

  constructor() {
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later
      this.deferredPrompt = e;
    });
  }

  async showInstallPrompt(): Promise<boolean> {
    if (!this.deferredPrompt) {
      return false;
    }

    // Show the install prompt
    this.deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await this.deferredPrompt.userChoice;

    // Clear the deferredPrompt so it can only be used once
    this.deferredPrompt = null;

    return outcome === 'accepted';
  }

  canInstall(): boolean {
    return !!this.deferredPrompt;
  }
}
