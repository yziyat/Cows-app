// src/app/core/services/auth.service.ts
import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signOut, user, User as FirebaseUser } from '@angular/fire/auth';
import { Observable, map, from, of } from 'rxjs';
import { User, LoginRequest } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public currentUser: Observable<User | null>;

  constructor(private auth: Auth) {
    this.currentUser = user(this.auth).pipe(
      map(firebaseUser => this.mapFirebaseUserToLocalUser(firebaseUser))
    );
  }

  // Helper to map Firebase User to our App User model
  private mapFirebaseUserToLocalUser(firebaseUser: FirebaseUser | null): User | null {
    if (!firebaseUser) return null;
    return {
      id: 1, // Mock ID or hash from uid
      username: firebaseUser.email || 'admin',
      email: firebaseUser.email || '',
      role: 'admin', // Defaulting to admin for this migration
      first_name: 'Admin',
      last_name: 'User',
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    };
  }

  login(credentials: LoginRequest): Observable<any> {
    let email = credentials.username;
    if (!email.includes('@')) {
      email = `${email}@farm.app`; // Auto-append domain for simple usernames
    }
    const promise = signInWithEmailAndPassword(this.auth, email, credentials.password);
    return from(promise);
  }

  logout(): Promise<void> {
    return signOut(this.auth);
  }

  isAuthenticated(): boolean {
    return !!this.auth.currentUser;
  }

  hasRole(roles: string[]): boolean {
    // Simplified role check since we default to admin
    return true;
  }

  getCurrentUser(): Observable<{ user: User }> {
    // Mocking the response structure expected by components
    return this.currentUser.pipe(
      map(user => ({ user: user! }))
    );
  }
}
