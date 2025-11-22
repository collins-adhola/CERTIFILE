import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronDown, chevronUp } from 'ionicons/icons';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.page.html',
  styleUrls: ['./faq.page.scss'],
  standalone: true,
  imports: [IonContent, IonButton, IonIcon, CommonModule, FormsModule],
})
export class FaqPage implements OnInit {
  expandedItems: Set<string> = new Set();

  constructor() {
    // Register icons
    addIcons({ 'chevron-down': chevronDown, 'chevron-up': chevronUp });
  }

  ngOnInit() {}

  toggleItem(value: string) {
    if (this.expandedItems.has(value)) {
      this.expandedItems.delete(value);
    } else {
      this.expandedItems.add(value);
    }
  }

  isExpanded(value: string): boolean {
    return this.expandedItems.has(value);
  }
}
