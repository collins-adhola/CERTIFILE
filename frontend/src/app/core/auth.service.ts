import { Injectable, signal } from '@angular/core';
import { User } from './models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _user = signal<User | null>(null);
  user = this._user.asReadonly();

  get isAuthenticated(): boolean {
    return !!this._user();
  }

  login(email: string, password: string): boolean {
    if (!email || !password) return false;
    const user: User = {
      id: crypto.randomUUID(),
      email,
      name: email.split('@')[0],
      role: 'user',
    };
    localStorage.setItem('auth_user', JSON.stringify(user));
    this._user.set(user);
    return true;
  }

  register(email: string, password: string): boolean {
    // For frontend-only, just reuse login semantics
    return this.login(email, password);
  }

  logout(): void {
    localStorage.removeItem('auth_user');
    this._user.set(null);
  }

  hydrate(): void {
    const raw = localStorage.getItem('auth_user');
    if (raw) {
      try {
        this._user.set(JSON.parse(raw));
      } catch {
        this._user.set(null);
      }
    }
  }
}
