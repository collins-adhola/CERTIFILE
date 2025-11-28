import { Component, HostListener } from '@angular/core';
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
import { arrowForwardOutline, chevronDownOutline } from 'ionicons/icons';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
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
    CommonModule,
  ],
})
export class AppComponent {
  currentYear = new Date().getFullYear();
  mobileMenuOpen = false;

  // ACSP Brand Variables
  acspRef = 'ACSP123456';
  icoNumber = 'ZA123456';
  supervisoryBody = 'CGI UK & Ireland';

  constructor() {
    addIcons({ arrowForwardOutline, chevronDownOutline });
  }

  toggleMobileMenu(event?: Event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu() {
    this.mobileMenuOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    // Only close if clicking outside the menu trigger and dropdown
    if (
      !target.closest('.cf-mobile-menu-trigger') &&
      !target.closest('.cf-mobile-dropdown') &&
      !target.closest('.cf-logo-container')
    ) {
      this.mobileMenuOpen = false;
    }
  }
}
