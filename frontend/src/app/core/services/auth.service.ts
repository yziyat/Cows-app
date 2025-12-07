import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signOut, user, User as FirebaseUser } from '@angular/fire/auth';
import { Firestore, doc, docData, setDoc, getDoc } from '@angular/fire/firestore';
import { Observable, BehaviorSubject, from, of, switchMap } from 'rxjs';
import { User, LoginRequest } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  public currentUser: Observable<User | null> = this.currentUserSubject.asObservable();

  constructor(private auth: Auth, private firestore: Firestore) {
    // Monitor Auth State
    user(this.auth).pipe(
      switchMap(firebaseUser => {
        if (!firebaseUser) return of(null);
        return this.syncUserWithFirestore(firebaseUser);
      })
    ).subscribe(appUser => {
      this.currentUserSubject.next(appUser);
    });
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  private syncUserWithFirestore(firebaseUser: FirebaseUser): Observable<User> {
    const userDocRef = doc(this.firestore, `users/${firebaseUser.uid}`);

    // Listen to the user document in real-time
    return docData(userDocRef).pipe(
      switchMap(async (userData: any) => {
        if (userData) {
          return {
            uid: firebaseUser.uid,
            email: firebaseUser.email!,
            displayName: userData.displayName || firebaseUser.displayName,
            role: userData.role || 'viewer', // Default behavior
            photoURL: firebaseUser.photoURL || undefined
          } as User;
        } else {
          // First time login? Create user doc.
          const newUser: User = {
            uid: firebaseUser.uid,
            email: firebaseUser.email!,
            role: 'viewer', // Default role for new users
            created_at: new Date(),
            updated_at: new Date()
          };
          await setDoc(userDocRef, newUser);
          return newUser;
        }
      })
    );
  }

  login(credentials: LoginRequest): Observable<any> {
    let email = credentials.username;
    if (!email.includes('@')) {
      email = `${email}@farm.app`;
    }
    return from(signInWithEmailAndPassword(this.auth, email, credentials.password));
  }

  logout(): Promise<void> {
    return signOut(this.auth);
  }

  isAuthenticated(): boolean {
    return !!this.currentUserSubject.value;
  }

  hasRole(allowedRoles: string[]): boolean {
    const user = this.currentUserSubject.value;
    if (!user) return false;
    return allowedRoles.includes(user.role);
  }

  getCurrentUser(): Observable<{ user: User }> {
    return this.currentUser.pipe(
      switchMap(u => {
        if (u) return of({ user: u });
        return of({ user: {} as User }); // Should handle better, but keeps API shape
      })
    );
  }
}
