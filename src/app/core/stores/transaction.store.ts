// src/app/core/stores/transaction.store.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Transaction, TransactionFilter, TransactionSummary } from '../../models/transaction.model';
import { TransactionService } from '../services/transaction.service';

@Injectable({
  providedIn: 'root'
})
export class TransactionStore {
  private transactions = new BehaviorSubject<Transaction[]>([]);
  private filter = new BehaviorSubject<TransactionFilter>({});
  private loading = new BehaviorSubject<boolean>(false);
  private error = new BehaviorSubject<string | null>(null);

  transactions$ = this.transactions.asObservable();
  filter$ = this.filter.asObservable();
  loading$ = this.loading.asObservable();
  error$ = this.error.asObservable();

  // Computed observables
  filteredTransactions$ = this.transactions$.pipe(
    map(transactions => this.applyFilter(transactions))
  );

  summary$: Observable<TransactionSummary> = this.filteredTransactions$.pipe(
    map(transactions => this.calculateSummary(transactions))
  );

  constructor(private transactionService: TransactionService) {
    this.loadTransactions();
  }

  loadTransactions() {
    this.loading.next(true);
    this.transactionService.getTransactions().subscribe({
      next: (transactions) => {
        this.transactions.next(transactions);
        this.loading.next(false);
      },
      error: (err) => {
        this.error.next('Error loading transactions');
        this.loading.next(false);
      }
    });
  }

  addTransaction(transaction: Transaction) {
    this.loading.next(true);
    this.transactionService.createTransaction(transaction).subscribe({
      next: (newTransaction) => {
        const current = this.transactions.value;
        this.transactions.next([...current, newTransaction]);
        this.loading.next(false);
      },
      error: (err) => {
        this.error.next('Error creating transaction');
        this.loading.next(false);
      }
    });
  }

  updateFilter(filter: Partial<TransactionFilter>) {
    this.filter.next({ ...this.filter.value, ...filter });
  }

  private applyFilter(transactions: Transaction[]): Transaction[] {
    const filter = this.filter.value;
    return transactions.filter(transaction => {
      const matchesType = !filter.type || transaction.type === filter.type;
      const matchesCategory = !filter.category || transaction.category === filter.category;
      const matchesProperty = !filter.propertyId || transaction.propertyId === filter.propertyId;
      const matchesAmount = (!filter.minAmount || transaction.amount >= filter.minAmount) &&
                          (!filter.maxAmount || transaction.amount <= filter.maxAmount);
      const matchesDate = (!filter.startDate || new Date(transaction.date) >= filter.startDate) &&
                         (!filter.endDate || new Date(transaction.date) <= filter.endDate);
      const matchesSearch = !filter.searchTerm || 
                          transaction.description.toLowerCase().includes(filter.searchTerm.toLowerCase()) ||
                          transaction.propertyName.toLowerCase().includes(filter.searchTerm.toLowerCase());

      return matchesType && matchesCategory && matchesProperty && 
             matchesAmount && matchesDate && matchesSearch;
    });
  }

  private calculateSummary(transactions: Transaction[]): TransactionSummary {
    // Implementation of summary calculation
    // This would include total calculations, category breakdowns, etc.
    return {
      totalIncome: 0,
      totalExpenses: 0,
      netIncome: 0,
      expensesByCategory: [],
      incomeByCategory: [],
      monthlyTrend: []
    };
  }
}