/**
 * Authentication Service
 * 
 * Handles JWT token management for admin authentication.
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

const TOKEN_KEY = 'certifile_admin_token';

interface LoginResponse {
  token: string;
  expiresIn: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  /**
   * Login with email and password
   * @param email Admin email
   * @param password Admin password
   * @returns Observable with login response
   */
  login(email: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${environment.apiUrl}/api/v1/auth/login`, {
        email,
        password,
      })
      .pipe(
        map((response) => {
          // Store token on successful login
          this.setToken(response.token);
          return response;
        }),
        catchError((error) => {
          throw error;
        })
      );
  }

  /**
   * Get stored JWT token
   */
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  /**
   * Store JWT token
   */
  private setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  }

  /**
   * Check if user is logged in (has valid token)
   */
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  /**
   * Logout - clear stored token
   */
  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
  }
}

