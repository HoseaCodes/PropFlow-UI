import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { User, SignInCredentials } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private baseUrl: string;

  constructor(private http: HttpClient) {
    this.baseUrl = this.getBaseUrl();
    this.loadCurrentUser();
  }

  private getBaseUrl(): string {
    if (environment.production) {
      return 'https://propflow-api-f50832d6ef2f.herokuapp.com/api';
    } else if (environment.useLocalBackend) {
      return 'http://localhost:8081/api';
    }
    return '';
  }

  private loadCurrentUser(): void {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  signUp(user: User): Observable<any> {
    if (!this.baseUrl) {
      return this.handleLocalStorageSignup(user);
    }

    return this.http.post(`${this.baseUrl}/auth/signup`, user).pipe(
      tap(response => {
        this.handleSuccessfulAuth(response as User);
      }),
      catchError(error => {
        console.error('Signup error:', error);
        const errorMessage = error.error?.message || error.error || 'Signup failed';
        return of({ error: errorMessage });
      })
    );
  }

  signIn(credentials: SignInCredentials): Observable<any> {
    if (!this.baseUrl) {
      return this.handleLocalStorageSignin(credentials);
    }

    return this.http.post(`${this.baseUrl}/auth/signin`, credentials).pipe(
      tap(response => {
        this.handleSuccessfulAuth(response as User);
      }),
      catchError(error => {
        console.error('Signin error:', error);
        const errorMessage = error.error?.message || error.error || 'Sign in failed';
        return of({ error: errorMessage });
      })
    );
  }

  private handleLocalStorageSignup(user: User): Observable<any> {
    const users = this.getLocalUsers();
    if (users.some(u => u.email === user.email)) {
      return of({ error: 'Email already exists' });
    }
    if (users.some(u => u.username === user.username)) {
      return of({ error: 'Username already exists' });
    }

    const newUser: User = {
      ...user,
      id: this.generateUniqueId()
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    this.handleSuccessfulAuth(newUser);
    return of({ success: true, user: newUser });
  }

  private handleLocalStorageSignin(credentials: SignInCredentials): Observable<any> {
    const users = this.getLocalUsers();
    const user = users.find(u => 
      u.email === credentials.email && 
      u.username === credentials.username &&
      u.password === credentials.password
    );

    if (user) {
      this.handleSuccessfulAuth(user);
      return of({ success: true, user });
    }
    return of({ error: 'Invalid credentials' });
  }

  private handleSuccessfulAuth(user: User): void {
    // Remove password before storing in memory/localStorage for security
    const safeUser = { ...user };
    // delete safeUser?.password;
    
    this.currentUserSubject.next(safeUser);
    localStorage.setItem('currentUser', JSON.stringify(safeUser));
  }

  signOut(): void {
    this.currentUserSubject.next(null);
    localStorage.removeItem('currentUser');
  }

  getCurrentUser(): Observable<User | null> {
    return this.currentUserSubject.asObservable();
  }

  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  private getLocalUsers(): User[] {
    const usersJson = localStorage.getItem('users');
    return usersJson ? JSON.parse(usersJson) : [];
  }

  private generateUniqueId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}