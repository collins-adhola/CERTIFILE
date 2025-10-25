import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor() {
    // Check if user is already logged in (e.g., from localStorage)
    const token = localStorage.getItem('authToken');
    this.isAuthenticatedSubject.next(!!token);
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  login(email: string, password: string): Observable<boolean> {
    // TODO: Implement actual login logic
    // For now, just simulate successful login
    const success = true; // Replace with actual authentication logic

    if (success) {
      localStorage.setItem('authToken', 'dummy-token');
      this.isAuthenticatedSubject.next(true);
    }

    return new Observable((observer) => {
      observer.next(success);
      observer.complete();
    });
  }

  logout(): void {
    localStorage.removeItem('authToken');
    this.isAuthenticatedSubject.next(false);
  }

  register(userData: any): Observable<boolean> {
    // TODO: Implement actual registration logic
    return new Observable((observer) => {
      observer.next(true);
      observer.complete();
    });
  }
}
