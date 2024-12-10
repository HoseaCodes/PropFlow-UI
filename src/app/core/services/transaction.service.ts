import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Transaction } from '../../models/transaction.model';
import { AuthService } from '../../core/services/auth.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private localStorageKey = 'hosthaven_transactions';
  private baseUrl: string;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    this.baseUrl = this.getBaseUrl();
    this.initializeLocalStorage();
  }

  private getBaseUrl(): string {
    if (environment.production) {
      return 'https://propflow-api-f50832d6ef2f.herokuapp.com/api/transactions';
    } else if (environment.useLocalBackend) {
      return 'http://localhost:8081/api/transactions';
    }
    return '';
  }

  private initializeLocalStorage(): void {
    if (!localStorage.getItem(this.localStorageKey)) {
      localStorage.setItem(this.localStorageKey, JSON.stringify([]));
    }
  }

  getTransactions(): Observable<Transaction[]> {
    return this.authService.getCurrentUser().pipe(
      switchMap(currentUser => {
        if (!currentUser) {
          return of([]);
        }

        if (!this.baseUrl) {
          // Local storage mode
          return of(this.getLocalTransactions().filter(t => t.userId === currentUser.id));
        }

        // API mode
        return this.http.get<Transaction[]>(this.baseUrl).pipe(
          catchError(() => of([]))
        );
      })
    );
  }

  createTransaction(transaction: Transaction): Observable<Transaction> {
    return this.authService.getCurrentUser().pipe(
      switchMap(currentUser => {
        if (!currentUser) {
          return of(transaction);
        }

        const transactionWithUser = {
          ...transaction,
          userId: currentUser.id || '',
          frequency: null,
        };

        if (!this.baseUrl) {
          alert('Transaction created successfully locally');
          // Local storage mode
          return of(this.saveToLocalStorage(transactionWithUser));
        }

        // API mode
        return this.http.post<Transaction>(this.baseUrl, transactionWithUser).pipe(
          catchError(() => of(transaction))
        );
      })
    );
  }
  private getHeaders(): HttpHeaders {
    // Get the auth token from localStorage or your auth service
    // const token = localStorage.getItem('token'); // or this.authService.getToken();
    
    // Return headers with auth and content type
    return new HttpHeaders({
      'Content-Type': 'application/json',
      // 'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    });
  }

  updateTransaction(transaction: Transaction, id: string): Observable<Transaction> {
    return this.authService.getCurrentUser().pipe(
      switchMap(currentUser => {
        if (!currentUser) {
          return of(transaction);
        }

        if (!this.baseUrl) {
          // Local storage mode
          return of(this.updateInLocalStorage(transaction));
        }
    
        const transactionWithUser = {
          id,
          ...transaction,
          userId: currentUser.id,
          updatedAt: new Date().toISOString()
        };
        
        const options = {
          headers: this.getHeaders()
        };
    
        // API mode
        return this.http.put<Transaction>(`${this.baseUrl}/${id}`, 
          transactionWithUser,
          options
        ).pipe(
          catchError(() => of(transaction))
        );
      })
    );
    
  }

  deleteTransaction(id: number): Observable<void> {
    if (!this.baseUrl) {
      // Local storage mode
      this.deleteFromLocalStorage(id);
      return of(void 0);
    }

    // API mode
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
      catchError(() => of(void 0))
    );
  }

  // Local storage operations remain the same
  private getLocalTransactions(): Transaction[] {
    const stored = localStorage.getItem(this.localStorageKey);
    return stored ? JSON.parse(stored) : [];
  }

  private saveToLocalStorage(transaction: Transaction): Transaction {
    const transactions = this.getLocalTransactions();
    const newTransaction = {
      ...transaction,
      id: this.generateLocalId(transactions),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    transactions.push(newTransaction);
    localStorage.setItem(this.localStorageKey, JSON.stringify(transactions));
    return newTransaction;
  }

  private updateInLocalStorage(transaction: Transaction): Transaction {
    const transactions = this.getLocalTransactions();
    const index = transactions.findIndex(t => t.id === transaction.id);
    
    if (index !== -1) {
      transactions[index] = {
        ...transaction,
        updatedAt: new Date()
      };
      localStorage.setItem(this.localStorageKey, JSON.stringify(transactions));
    }
    
    return transaction;
  }

  private deleteFromLocalStorage(id: number): void {
    const transactions = this.getLocalTransactions();
    const filtered = transactions.filter(t => t.id !== id);
    localStorage.setItem(this.localStorageKey, JSON.stringify(filtered));
  }

  private generateLocalId(transactions: Transaction[]): number {
    return transactions.length > 0 
      ? Math.max(...transactions.map(t => Number(t.id))) + 1 
      : 1;
  }

  clearTransactions(): void {
    if (!this.baseUrl) {
      localStorage.setItem(this.localStorageKey, JSON.stringify([]));
    }
  }

  getStorageState(): Transaction[] {
    return this.getLocalTransactions();
  }
}