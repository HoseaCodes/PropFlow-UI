// src/app/core/services/transaction.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Transaction } from '../../models/transaction.model';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private localStorageKey = 'hosthaven_transactions';

  constructor(private http: HttpClient) {
    // Initialize localStorage if empty
    if (!localStorage.getItem(this.localStorageKey)) {
      localStorage.setItem(this.localStorageKey, JSON.stringify([]));
    }
  }

  getTransactions(): Observable<Transaction[]> {
    try {
      const transactions = this.getLocalTransactions();
      return of(transactions);
    } catch (error) {
      return of([]);
    }
  }

  createTransaction(transaction: Transaction): Observable<Transaction> {
    try {
      const newTransaction = this.saveToLocalStorage(transaction);
      return of(newTransaction);
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      return of(transaction);
    }
  }

  private getLocalTransactions(): Transaction[] {
    const stored = localStorage.getItem(this.localStorageKey);
    return stored ? JSON.parse(stored) : [];
  }

  private saveToLocalStorage(transaction: Transaction): Transaction {
    const transactions = this.getLocalTransactions();
    const newTransaction = {
      ...transaction,
      id: transactions.length + 1,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    transactions.push(newTransaction);
    localStorage.setItem(this.localStorageKey, JSON.stringify(transactions));
    return newTransaction;
  }

  deleteTransaction(id: number): Observable<void> {
    const transactions = this.getLocalTransactions();
    const filteredTransactions = transactions.filter(t => t.id !== id);
    localStorage.setItem(this.localStorageKey, JSON.stringify(filteredTransactions));
    return of(void 0);
  }

  updateTransaction(transaction: Transaction): Observable<Transaction> {
    const transactions = this.getLocalTransactions();
    const index = transactions.findIndex(t => t.id === transaction.id);
    
    if (index !== -1) {
      transactions[index] = {
        ...transaction,
        updatedAt: new Date()
      };
      localStorage.setItem(this.localStorageKey, JSON.stringify(transactions));
    }
    
    return of(transaction);
  }

  clearTransactions(): void {
    localStorage.setItem(this.localStorageKey, JSON.stringify([]));
  }

  // Helper method for debugging
  getStorageState(): Transaction[] {
    return this.getLocalTransactions();
  }
}