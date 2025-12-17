import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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
} from '@ionic/angular/standalone';
import { environment } from '../../../environments/environment';

const ADMIN_KEY = '<TEMP_ADMIN_KEY_PLACEHOLDER>';

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
    CommonModule,
  ],
})
export class AdminSubmissionsPage implements OnInit {
  submissions: SubmissionDisplay[] = [];
  isLoading = false;
  errorMessage = '';
  showErrorToast = false;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadSubmissions();
  }

  loadSubmissions() {
    this.isLoading = true;
    this.errorMessage = '';

    const headers = new HttpHeaders({
      'x-admin-key': ADMIN_KEY,
    });

    this.http
      .get<{ submissions: Submission[] }>(
        `${environment.apiUrl}/api/v1/submissions`,
        { headers }
      )
      .subscribe({
        next: (response) => {
          this.submissions = (response.submissions || []).map((sub) =>
            this.mapSubmission(sub)
          );
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Failed to load submissions:', err);
          
          if (err.status === 401) {
            this.errorMessage = 'Access denied (admin only).';
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
}

