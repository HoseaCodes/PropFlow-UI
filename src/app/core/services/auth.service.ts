import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  public isAuthenticated$ = this.currentUser$.pipe(map(user => !!user));
  public redirectUrl: string | null = null;

  constructor(private http: HttpClient) {
    // Check for stored user token on init
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  // login(email: string, password: string): Observable<any> {
  //   return this.http.post<any>(`${environment.apiUrl}/auth/login`, { email, password })
  //     .pipe(map(response => {
  //       // Store user details and token
  //       localStorage.setItem('currentUser', JSON.stringify(response));
  //       this.currentUserSubject.next(response);
  //       return response;
  //     }));
  // }
}