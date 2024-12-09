// auth.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);

  constructor() {
    // Load user from local storage on service initialization
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  signUp(user: User): boolean {
    // Check if user already exists
    const existingUsers = this.getUsers();
    const userExists = existingUsers.some(u => u.email === user.email);
    
    if (userExists) {
      return false;
    }

    // Generate unique ID
    user.id = this.generateUniqueId();
    
    // Save user to local storage
    const updatedUsers = [...existingUsers, user];
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    
    // Set current user
    this.currentUserSubject.next(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    return true;
  }

  signIn(email: string, password: string): boolean {
    const users = this.getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      this.currentUserSubject.next(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      return true;
    }
    
    return false;
  }

  signOut(): void {
    this.currentUserSubject.next(null);
    localStorage.removeItem('currentUser');
  }

  getCurrentUser() {
    return this.currentUserSubject.asObservable();
  }

  private getUsers(): User[] {
    const usersJson = localStorage.getItem('users');
    return usersJson ? JSON.parse(usersJson) : [];
  }

  private generateUniqueId(): string {
    return Math.random().toString(36).substring(2, 15) +
           Math.random().toString(36).substring(2, 15);
  }
}