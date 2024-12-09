// src/app/core/services/transaction.service.spec.ts

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TransactionService } from './transaction.service';
import { Transaction, TransactionType, TransactionCategory, TransactionFrequency } from '../../models/transaction.model';

describe('TransactionService', () => {
  let service: TransactionService;
  const mockTransaction: Transaction = {
    type: TransactionType.EXPENSE,
    category: TransactionCategory.UTILITIES,
    description: 'Test transaction',
    amount: 100,
    date: new Date(),
    propertyId: 1,
    propertyName: 'Test Property',
    recurring: false,
    frequency: TransactionFrequency.ONE_TIME
  };

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TransactionService]
    });
    service = TestBed.inject(TransactionService);
  });

  afterEach(() => {
    // Clean up after each test
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('createTransaction', () => {
    it('should create a new transaction in localStorage', (done) => {
      service.createTransaction(mockTransaction).subscribe(newTransaction => {
        expect(newTransaction.id).toBe(1);
        expect(newTransaction.description).toBe(mockTransaction.description);
        expect(newTransaction.amount).toBe(mockTransaction.amount);
        done();
      });
    });

    it('should increment id for each new transaction', (done) => {
      service.createTransaction(mockTransaction).subscribe(() => {
        service.createTransaction(mockTransaction).subscribe(secondTransaction => {
          expect(secondTransaction.id).toBe(2);
          done();
        });
      });
    });
  });

  describe('getTransactions', () => {
    it('should return empty array when no transactions exist', (done) => {
      service.getTransactions().subscribe(transactions => {
        expect(transactions).toEqual([]);
        done();
      });
    });

    it('should return all transactions', (done) => {
      service.createTransaction(mockTransaction).subscribe(() => {
        service.getTransactions().subscribe(transactions => {
          expect(transactions.length).toBe(1);
          expect(transactions[0].description).toBe(mockTransaction.description);
          done();
        });
      });
    });
  });

  describe('deleteTransaction', () => {
    it('should delete a transaction', (done) => {
      service.createTransaction(mockTransaction).subscribe(newTransaction => {
        service.deleteTransaction(newTransaction.id!).subscribe(() => {
          service.getTransactions().subscribe(transactions => {
            expect(transactions.length).toBe(0);
            done();
          });
        });
      });
    });

    it('should not affect other transactions when deleting', (done) => {
      service.createTransaction(mockTransaction).subscribe(() => {
        service.createTransaction({
          ...mockTransaction,
          description: 'Second transaction'
        }).subscribe(secondTransaction => {
          service.deleteTransaction(secondTransaction.id!).subscribe(() => {
            service.getTransactions().subscribe(transactions => {
              expect(transactions.length).toBe(1);
              expect(transactions[0].description).toBe(mockTransaction.description);
              done();
            });
          });
        });
      });
    });
  });

  describe('updateTransaction', () => {
    it('should update an existing transaction', (done) => {
      service.createTransaction(mockTransaction).subscribe(newTransaction => {
        const updatedTransaction = {
          ...newTransaction,
          description: 'Updated description'
        };
        service.updateTransaction(updatedTransaction).subscribe(() => {
          service.getTransactions().subscribe(transactions => {
            expect(transactions[0].description).toBe('Updated description');
            done();
          });
        });
      });
    });
  });

  describe('clearTransactions', () => {
    it('should remove all transactions', (done) => {
      service.createTransaction(mockTransaction).subscribe(() => {
        service.createTransaction(mockTransaction).subscribe(() => {
          service.clearTransactions();
          service.getTransactions().subscribe(transactions => {
            expect(transactions.length).toBe(0);
            done();
          });
        });
      });
    });
  });

  describe('error handling', () => {
    it('should handle localStorage errors gracefully', (done) => {
      // Simulate localStorage error
      spyOn(localStorage, 'getItem').and.throwError('localStorage error');
      
      service.getTransactions().subscribe(transactions => {
        expect(transactions).toEqual([]);
        done();
      });
    });

    it('should handle save errors gracefully', (done) => {
      // Simulate localStorage error
      spyOn(localStorage, 'setItem').and.throwError('localStorage error');
      
      service.createTransaction(mockTransaction).subscribe(transaction => {
        expect(transaction).toEqual(mockTransaction);
        done();
      });
    });
  });

  describe('localStorage persistence', () => {
    it('should persist data between service instances', (done) => {
      service.createTransaction(mockTransaction).subscribe(() => {
        // Create new service instance
        const newService = TestBed.inject(TransactionService);
        
        newService.getTransactions().subscribe(transactions => {
          expect(transactions.length).toBe(1);
          expect(transactions[0].description).toBe(mockTransaction.description);
          done();
        });
      });
    });
  });
});