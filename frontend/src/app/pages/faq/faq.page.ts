import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { IonContent, IonButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronDown, chevronUp, callOutline, mailOutline, chatbubbleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.page.html',
  styleUrls: ['./faq.page.scss'],
  standalone: true,
  imports: [IonContent, IonButton, IonIcon, CommonModule, FormsModule, RouterLink],
})
export class FaqPage implements OnInit {
  expandedItems: Set<string> = new Set();
  hoveredItem: string | null = null;

  constructor() {
    // Register icons
    addIcons({ 
      'chevron-down': chevronDown, 
      'chevron-up': chevronUp,
      'call-outline': callOutline,
      'mail-outline': mailOutline,
      'chatbubble-outline': chatbubbleOutline
    });
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

  setHovered(value: string | null) {
    this.hoveredItem = value;
  }

  isHovered(value: string): boolean {
    return this.hoveredItem === value;
  }
}
