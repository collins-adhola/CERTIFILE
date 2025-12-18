import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import {
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonLabel,
  IonSpinner,
  IonToast,
  IonButton,
  IonSearchbar,
  IonBadge,
  IonIcon,
  IonChip,
} from '@ionic/angular/standalone';
import {
  copyOutline,
  refreshOutline,
  mailOutline,
  timeOutline,
  checkmarkOutline,
  closeOutline,
  callOutline,
  documentTextOutline,
  chevronDownOutline,
  chevronUpOutline,
  documentOutline,
} from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../services/auth.service';

interface Submission {
  id: string;
  fullName?: string;
  full_name?: string;
  email: string;
  phone?: string | null;
  issuedBy?: string;
  issued_by?: string;
  status: string;
  createdAt?: string;
  created_at?: string;
}

interface SubmissionDisplay {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  issuedBy: string;
  status: string;
  createdAt: string;
  createdAtRaw?: string; // For sorting
}

interface StatusMeta {
  color: string;
  icon: string;
  label: string;
}

@Component({
  selector: 'app-admin-submissions',
  templateUrl: './admin-submissions.page.html',
  styleUrls: ['./admin-submissions.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonSpinner,
    IonToast,
    IonButton,
    IonSearchbar,
    IonBadge,
    IonIcon,
    IonChip,
    CommonModule,
    FormsModule,
  ],
})
export class AdminSubmissionsPage implements OnInit {
  submissions: SubmissionDisplay[] = [];
  filteredSubmissions: SubmissionDisplay[] = [];
  searchQuery = '';
  selectedStatusFilter: string = 'all';
  availableStatuses: string[] = [];
  isLoading = false;
  errorMessage = '';
  showErrorToast = false;
  showCopyToast = false;
  copyToastMessage = '';
  lastRefreshed: Date | null = null;
  showIdMap: { [key: string]: boolean } = {}; // Track which IDs are expanded

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {
    addIcons({
      refreshOutline,
      documentOutline,
      mailOutline,
      callOutline,
      documentTextOutline,
      timeOutline,
      copyOutline,
      checkmarkOutline,
      closeOutline,
      chevronDownOutline,
      chevronUpOutline,
    });
  }

  ngOnInit() {
    this.filteredSubmissions = [];
    
    // Check if user is logged in
    const token = this.authService.getToken();
    if (!token) {
      // No token, redirect to login
      this.router.navigate(['/admin/login']);
      return;
    }

    // Load submissions
    this.loadSubmissions();
  }

  loadSubmissions() {
    this.isLoading = true;
    this.errorMessage = '';

    const token = this.authService.getToken();
    if (!token) {
      // No token, redirect to login
      this.router.navigate(['/admin/login']);
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    this.http
      .get<{
        submissions: Submission[];
      }>(`${environment.apiUrl}/api/v1/submissions`, { headers })
      .subscribe({
        next: (response) => {
          const mapped = (response.submissions || []).map((sub) =>
            this.mapSubmission(sub),
          );
          // Sort by createdAt (newest first)
          this.submissions = mapped.sort((a, b) => {
            const dateA = a.createdAtRaw
              ? new Date(a.createdAtRaw).getTime()
              : 0;
            const dateB = b.createdAtRaw
              ? new Date(b.createdAtRaw).getTime()
              : 0;
            return dateB - dateA; // Descending order (newest first)
          });
          // Extract unique statuses for filter chips
          this.availableStatuses = [
            ...new Set(this.submissions.map((s) => s.status.toLowerCase())),
          ].sort();
          this.applyFilters();
          this.lastRefreshed = new Date();
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Failed to load submissions:', err);
          console.error('API URL:', `${environment.apiUrl}/api/v1/submissions`);

          if (err.status === 401) {
            // Token expired or invalid, logout and redirect to login
            this.authService.logout();
            this.router.navigate(['/admin/login']);
            return;
          } else {
            this.errorMessage =
              err?.error?.error?.message ||
              err?.error?.message ||
              'Failed to load submissions. Please try again.';
            this.showErrorToast = true;
            this.isLoading = false;
          }
        },
      });
  }

  private mapSubmission(sub: Submission): SubmissionDisplay {
    const createdAtRaw = sub.createdAt || sub.created_at;
    return {
      id: sub.id,
      fullName: sub.fullName || sub.full_name || 'N/A',
      email: sub.email || 'N/A',
      phone: sub.phone || 'Not provided',
      issuedBy: sub.issuedBy || sub.issued_by || 'N/A',
      status: sub.status || 'unknown',
      createdAt: this.formatDate(createdAtRaw),
      createdAtRaw: createdAtRaw,
    };
  }

  private formatDate(dateString?: string): string {
    if (!dateString) return 'N/A';

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  }

  onSearchChange(event: any) {
    this.searchQuery = event.detail.value || '';
    this.applyFilters();
  }

  onStatusFilterChange(status: string) {
    this.selectedStatusFilter = status;
    this.applyFilters();
  }

  applyFilters() {
    let filtered = [...this.submissions];

    // Apply status filter
    if (this.selectedStatusFilter !== 'all') {
      filtered = filtered.filter(
        (sub) =>
          sub.status.toLowerCase() === this.selectedStatusFilter.toLowerCase(),
      );
    }

    // Apply search filter
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (sub) =>
          sub.fullName.toLowerCase().includes(query) ||
          sub.email.toLowerCase().includes(query) ||
          sub.issuedBy.toLowerCase().includes(query) ||
          sub.status.toLowerCase().includes(query),
      );
    }

    this.filteredSubmissions = filtered;
  }

  copyToClipboard(text: string) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          this.copyToastMessage = 'Reference copied';
          this.showCopyToast = true;
        })
        .catch((err) => {
          console.error('Failed to copy:', err);
          this.fallbackCopyToClipboard(text);
        });
    } else {
      // Fallback for older browsers
      this.fallbackCopyToClipboard(text);
    }
  }

  private fallbackCopyToClipboard(text: string) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand('copy');
      if (successful) {
        this.copyToastMessage = 'Reference copied';
        this.showCopyToast = true;
      } else {
        this.copyToastMessage = 'Failed to copy';
        this.showCopyToast = true;
      }
    } catch (err) {
      console.error('Fallback copy failed:', err);
      this.copyToastMessage = 'Failed to copy';
      this.showCopyToast = true;
    } finally {
      document.body.removeChild(textArea);
    }
  }

  toggleId(submissionId: string) {
    this.showIdMap[submissionId] = !this.showIdMap[submissionId];
  }

  isIdVisible(submissionId: string): boolean {
    return this.showIdMap[submissionId] || false;
  }

  formatLastRefreshed(): string {
    if (!this.lastRefreshed) return '';
    return this.lastRefreshed.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }

  /**
   * Maps submission status to color and icon metadata
   * @param status - The submission status string
   * @returns Status metadata with color, icon, and label
   */
  getStatusMeta(status: string): StatusMeta {
    const normalizedStatus = status.toLowerCase().trim();

    switch (normalizedStatus) {
      case 'received':
        return {
          color: 'medium',
          icon: 'mail-outline',
          label: 'Received',
        };
      case 'in_review':
      case 'in review':
        return {
          color: 'warning',
          icon: 'time-outline',
          label: 'In Review',
        };
      case 'awaiting_info':
      case 'awaiting_documents':
      case 'awaiting documents':
        return {
          color: 'tertiary',
          icon: 'help-circle-outline',
          label: 'Awaiting Info',
        };
      case 'approved':
        return {
          color: 'success',
          icon: 'checkmark-outline',
          label: 'Approved',
        };
      case 'rejected':
        return {
          color: 'danger',
          icon: 'close-outline',
          label: 'Rejected',
        };
      default:
        return {
          color: 'medium',
          icon: 'mail-outline',
          label: status.charAt(0).toUpperCase() + status.slice(1),
        };
    }
  }
}
