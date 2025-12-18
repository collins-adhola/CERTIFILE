import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
} from '@ionic/angular/standalone';
import { copyOutline, refreshOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { environment } from '../../../environments/environment';

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
    IonItem,
    IonLabel,
    IonSpinner,
    IonToast,
    IonButton,
    IonSearchbar,
    IonBadge,
    IonIcon,
    CommonModule,
    FormsModule,
  ],
})
export class AdminSubmissionsPage implements OnInit {
  submissions: SubmissionDisplay[] = [];
  filteredSubmissions: SubmissionDisplay[] = [];
  searchQuery = '';
  isLoading = false;
  errorMessage = '';
  showErrorToast = false;
  showCopyToast = false;
  copyToastMessage = '';

  constructor(private http: HttpClient) {
    addIcons({ copyOutline, refreshOutline });
  }

  ngOnInit() {
    this.filteredSubmissions = [];
    this.loadSubmissions();
  }

  loadSubmissions() {
    this.isLoading = true;
    this.errorMessage = '';

    if (!environment.adminKey) {
      this.errorMessage = 'Admin key not configured.';
      this.showErrorToast = true;
      this.isLoading = false;
      return;
    }

    // Ensure the admin key is sent as-is without encoding issues
    const adminKeyValue = String(environment.adminKey).trim();

    const headers = new HttpHeaders({
      'x-admin-key': adminKeyValue,
    });

    this.http
      .get<{
        submissions: Submission[];
      }>(`${environment.apiUrl}/api/v1/submissions`, { headers })
      .subscribe({
        next: (response) => {
          this.submissions = (response.submissions || []).map((sub) =>
            this.mapSubmission(sub),
          );
          this.applySearchFilter();
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Failed to load submissions:', err);
          console.error('API URL:', `${environment.apiUrl}/api/v1/submissions`);
          console.error('Admin key present:', !!environment.adminKey);

          if (err.status === 401) {
            this.errorMessage =
              'Access denied. Please verify the admin key matches the backend configuration.';
          } else {
            this.errorMessage =
              err?.error?.error?.message ||
              err?.error?.message ||
              'Failed to load submissions. Please try again.';
          }

          this.showErrorToast = true;
          this.isLoading = false;
        },
      });
  }

  private mapSubmission(sub: Submission): SubmissionDisplay {
    return {
      id: sub.id,
      fullName: sub.fullName || sub.full_name || 'N/A',
      email: sub.email || 'N/A',
      phone: sub.phone || 'Not provided',
      issuedBy: sub.issuedBy || sub.issued_by || 'N/A',
      status: sub.status || 'unknown',
      createdAt: this.formatDate(sub.createdAt || sub.created_at),
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
    this.applySearchFilter();
  }

  applySearchFilter() {
    if (!this.searchQuery.trim()) {
      this.filteredSubmissions = [...this.submissions];
      return;
    }

    const query = this.searchQuery.toLowerCase().trim();
    this.filteredSubmissions = this.submissions.filter(
      (sub) =>
        sub.fullName.toLowerCase().includes(query) ||
        sub.email.toLowerCase().includes(query) ||
        sub.issuedBy.toLowerCase().includes(query) ||
        sub.status.toLowerCase().includes(query),
    );
  }

  copyToClipboard(text: string) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        this.copyToastMessage = 'Copied!';
        this.showCopyToast = true;
      })
      .catch((err) => {
        console.error('Failed to copy:', err);
        this.copyToastMessage = 'Failed to copy';
        this.showCopyToast = true;
      });
  }

  getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'success';
      case 'rejected':
        return 'danger';
      case 'in_review':
        return 'warning';
      case 'received':
        return 'primary';
      default:
        return 'medium';
    }
  }
}
