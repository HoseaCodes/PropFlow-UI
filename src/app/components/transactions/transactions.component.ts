import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TransactionService } from '../../core/services/transaction.service';
import { PropertyService } from '../../core/services/property.service';
import { 
  Transaction, 
  TransactionType,
  TransactionCategory,
  TransactionFrequency 
} from '../../models/transaction.model';
import { Property } from '../../models/property.model';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule
  ]
})
export class TransactionsComponent implements OnInit, OnDestroy {
  transactions: Transaction[] = [];
  filteredTransactions: Transaction[] = [];
  properties: Property[] = [];
  isLoading = false;
  filterForm: FormGroup | any;
  transactionForm: FormGroup | any;
  showTransactionForm = false;
  isDevelopment = environment.isDevelopment;
  isDebugPanelOpen = false;
  useApi = environment.useApi;
  environment = environment;
  isEdit = false;
  transId: any;
  
  // Enums for template
  transactionTypes = Object.values(TransactionType);
  transactionCategories = Object.values(TransactionCategory);
  transactionFrequencies = Object.values(TransactionFrequency);
  
  // Statistics
  totalIncome = 0;
  totalExpenses = 0;
  netIncome = 0;
  monthlyAverage = 0;
  transactionsByCategory: { category: string; amount: number; percentage: number }[] = [];
  topCategory = '';

  private destroy$ = new Subject<void>();

  constructor(
    private transactionService: TransactionService,
    private propertyService: PropertyService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.initializeForms();
  }

  ngOnInit(): void {
    this.loadProperties();
    this.loadTransactions();
    this.setupFilterSubscription();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForms(): void {
    // Initialize transaction form with default values
    this.transactionForm = this.fb.group({
      // Default values for main selects
      type: ['INCOME', Validators.required],
      propertyId: [1, Validators.required],
      propertyName: ['Luxury Villa'],
      category: ['BOOKING_PAYMENT', Validators.required],

      // Rest of the form fields
      bookingReference: [''],
      bookingId: [''],
      subcategory: [''],
      description: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0)]],
      status: ['PENDING'],
      paymentMethod: [''],
      paymentReference: [''],
      recurring: [false],
      frequency: [''],
      vendor: [''],
      receiptUrl: [''],
      notes: [''],
      approvalStatus: ['PENDING'],
      approvedBy: [''],
      approvedDate: [''],
      date: [new Date().toISOString().split('T')[0], Validators.required],
      dueDate: [''],
      tags: [''],

      // Initialize nested form groups properly
      taxDetails: this.fb.group({
        taxable: [false],
        taxCategory: [''],
        taxAmount: [0],
        deductible: [false],
        deductionCategory: ['']
      }),

      metadata: this.fb.group({
        source: ['web'],
        campaign: ['']
      })
    });

    // Initialize filter form
    this.filterForm = this.fb.group({
      search: [''],
      category: ['all'],
      property: ['all'],
      startDate: [''],
      endDate: [''],
      minAmount: [''],
      maxAmount: [''],
      sortBy: ['date']
    });

    // Update propertyName when propertyId changes
    this.transactionForm.get('propertyId')?.valueChanges.subscribe((propertyId: number) => {
      const selectedProperty = this.properties.find(p => p.id === propertyId);
      if (selectedProperty) {
        this.transactionForm.patchValue({
          propertyName: selectedProperty.name
        }, { emitEvent: false });
      }
    });
  }


  private loadProperties(): void {
    const mockProperties: Property[] = [
      {
        id: 1, name: 'Dallas Downtown Loft', address: '', description: '', basePrice: 0, maxGuests: 0,
        bedrooms: 1,
        bathrooms: 1,
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2, name: 'Beach House', address: '', description: '', basePrice: 0, maxGuests: 0,
        bedrooms: 0,
        bathrooms: 0,
        active: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];
    this.properties = mockProperties;
  }

  private getMockTransactions(): Transaction[] {
    return [
      {
        id: 1,
        userId: '',
        type: TransactionType.EXPENSE,
        category: TransactionCategory.MAINTENANCE,
        description: 'Plumbing repair',
        amount: 150,
        date: new Date(),
        propertyId: 1,
        propertyName: 'Downtown Loft',
        recurring: false,
        frequency: TransactionFrequency.ONE_TIME,
        notes: 'Leaky faucet in the kitchen',
        vendor: 'Joe\'s Plumbing',
        receiptUrl: 'https://example.com/receipts/123',
        bookingReference: 'ABC123'
      },
      // ... your other mock transactions ...
    ];
  }

  private loadTransactions(): void {
    this.isLoading = true;
    this.transactionService.getTransactions().subscribe({
      next: (transactions) => {
        // If no transactions received, use mock data
        if (transactions.length === 0) {
          this.transactions = this.getMockTransactions();
        } else {
          const mockTransactions: Transaction[] = [
                    {
                      id: 1,
                      userId: '',
                      type: TransactionType.EXPENSE,
                      category: TransactionCategory.MAINTENANCE,
                      description: 'Plumbing repair',
                      amount: 150,
                      date: new Date(),
                      propertyId: 1,
                      propertyName: 'Downtown Loft',
                      recurring: false,
                      frequency: TransactionFrequency.ONE_TIME,
                      notes: 'Leaky faucet in the kitchen',
                      vendor: 'Joe\'s Plumbing',
                      receiptUrl: 'https://example.com/receipts/123',
                      bookingReference: 'ABC123'
                    },
                    {
                      id: 2,
                      userId: '',
                      type: TransactionType.EXPENSE,
                      category: TransactionCategory.UTILITIES,
                      description: 'Electricity bill',
                      amount: 75,
                      date: new Date(),
                      propertyId: 1,
                      propertyName: 'Downtown Loft',
                      recurring: true,
                      frequency: TransactionFrequency.MONTHLY,
                      notes: 'Monthly electricity bill',
                      vendor: 'Power Co.',
                      receiptUrl: 'https://example.com/receipts/456',
                      bookingReference: 'DEF456'
                    },
                    {
                      id: 3,
                      userId: '',
                      type: TransactionType.INCOME,
                      category: TransactionCategory.BOOKING_PAYMENT,
                      description: 'Monthly rent',
                      amount: 2000,
                      date: new Date(),
                      propertyId: 2,
                      propertyName: 'Beach House',
                      recurring: true,
                      frequency: TransactionFrequency.MONTHLY,
                      notes: 'Rent from tenant',
                      vendor: 'Tenant Co.',
                      receiptUrl: 'https://example.com/receipts/789',
                      bookingReference: 'GHI789'
                    }
                  ];
          // this.transactions = mockTransactions;
          this.transactions = transactions;
        }
        this.applyFilters();
        this.calculateStatistics();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading transactions:', error);
        // Use mock data on error
        this.transactions = this.getMockTransactions();
        this.applyFilters();
        this.calculateStatistics();
        this.isLoading = false;
        this.snackBar.open('Using offline data', 'Close', {
          duration: 3000
        });
      }
    });
  }
  

  private setupFilterSubscription(): void {
    this.filterForm.valueChanges
      .pipe(
        debounceTime(300),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.applyFilters();
      });
  }

  private applyFilters(): void {
    const filters = this.filterForm.value;
    
    this.filteredTransactions = this.transactions.filter(transaction => {
      // Search filter
      const searchTerm = (filters.search || '').toLowerCase();
      const matchesSearch = !searchTerm || 
        transaction.description?.toLowerCase().includes(searchTerm) ||
        transaction.propertyName?.toLowerCase().includes(searchTerm) ||
        transaction.category?.toLowerCase().includes(searchTerm) ||
        transaction.vendor?.toLowerCase().includes(searchTerm);
  
      // Category filter
      const matchesCategory = filters.category === 'all' || 
        transaction.category === filters.category;
  
      // Property filter
      const matchesProperty = filters.property === 'all' || 
        transaction.propertyId.toString() === filters.property.toString();
  
      // Date range filter
      const transactionDate = new Date(transaction.date);
      const matchesDateRange = (!filters.startDate || transactionDate >= new Date(filters.startDate)) &&
        (!filters.endDate || transactionDate <= new Date(filters.endDate));
  
      // Amount range filter
      const matchesAmount = (!filters.minAmount || transaction.amount >= filters.minAmount) &&
        (!filters.maxAmount || transaction.amount <= filters.maxAmount);
  
      return matchesSearch && matchesCategory && matchesProperty && 
             matchesDateRange && matchesAmount;
    });
  
    // Apply sorting
    this.sortTransactions(filters.sortBy);
  }

  private sortTransactions(sortBy: string): void {
    this.filteredTransactions.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'amount':
          return b.amount - a.amount;
        case 'category':
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });
  }

  private calculateStatistics(): void {
    const today = new Date();
    const lastYear = new Date(today.getFullYear() - 1, today.getMonth());

    this.totalIncome = this.transactions
      .filter(t => t.type === TransactionType.INCOME)
      .reduce((sum, t) => sum + t.amount, 0);

    this.totalExpenses = this.transactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .reduce((sum, t) => sum + t.amount, 0);

    this.netIncome = this.totalIncome - this.totalExpenses;
    this.monthlyAverage = this.netIncome / 12;

    // Calculate by category
    const categoryTotals: { [key: string]: number } = {};
    this.transactions.forEach(transaction => {
      categoryTotals[transaction.category] = 
        (categoryTotals[transaction.category] || 0) + transaction.amount;
    });

    this.transactionsByCategory = Object.entries(categoryTotals)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: (amount / (this.totalIncome + this.totalExpenses)) * 100
      }))
      .sort((a, b) => b.amount - a.amount);

    this.topCategory = this.transactionsByCategory[0]?.category || '';
  }

  submitTransaction(): void {
    if (this.transactionForm.valid) {
      const formValue = this.transactionForm.getRawValue();
      
      // Transform tags from string to array if needed
      const tags = formValue.tags ? formValue.tags.split(',').map((tag: string) => tag.trim()) : [];
      const transactionData = {
        ...formValue,
        tags,
        date: new Date(formValue.date).toISOString(),
        dueDate: formValue.dueDate ? new Date(formValue.dueDate).toISOString() : null,
        approvedDate: formValue.approvedDate ? new Date(formValue.approvedDate).toISOString() : null,
      };

      // Determine if this is an edit or create based on presence of ID
      const operation = this.isEdit ? 
        this.transactionService.updateTransaction(transactionData, this.transId) :
        this.transactionService.createTransaction(transactionData);

      operation.subscribe({
        next: (response) => {
          console.log(`Transaction ${this.isEdit ? 'updated' : 'created'}:`, response);
          this.snackBar.open(
            `Transaction ${this.isEdit ? 'updated' : 'created'} successfully`, 
            'Close', 
            { duration: 3000 }
          );
          this.loadTransactions();
          this.resetTransactionForm();
        },
        error: (error) => {
          console.error(`Error ${this.isEdit ? 'updating' : 'creating'} transaction:`, error);
          this.snackBar.open(
            `Error ${this.isEdit ? 'updating' : 'creating'} transaction`, 
            'Close', 
            { duration: 3000 }
          );
        }
      });
    }
  }

  resetTransactionForm(): void {
    this.transactionForm.reset({
      type: 'INCOME',
      propertyId: 1,
      propertyName: 'Luxury Villa',
      category: 'BOOKING_PAYMENT',
      status: 'PENDING',
      approvalStatus: 'PENDING',
      date: new Date().toISOString().split('T')[0],
      recurring: false,
      taxDetails: {
        taxable: false,
        taxAmount: 0,
        deductible: false
      },
      metadata: {
        source: 'web',
        campaign: ''
      }
    });
    this.showTransactionForm = false;
  }

  toggleTransactionForm(): void {
    this.showTransactionForm = !this.showTransactionForm;
    if (!this.showTransactionForm) {
      this.resetTransactionForm();
    }
  }

  viewStorageState(): void {
    const currentState = this.transactionService.getStorageState();
    console.log('Current localStorage state:', currentState);
  }
  
  // Debug method to clear storage
  clearStorage(): void {
    this.transactionService.clearTransactions();
    this.loadTransactions();
    this.snackBar.open('Storage cleared', 'Close', {
      duration: 3000
    });
  }

  editTransaction(transaction: Transaction): void {
    // Format dates for form inputs
    this.transId = transaction.id;
    const formattedTransaction = {
      ...transaction,
      date: new Date(transaction.date).toISOString().split('T')[0],
      dueDate: transaction.dueDate ? new Date(transaction.dueDate).toISOString().split('T')[0] : '',
      approvedDate: transaction.approvedDate ? new Date(transaction.approvedDate).toISOString().split('T')[0] : '',
      // Convert tags array to comma-separated string
      tags: Array.isArray(transaction.tags) ? transaction.tags.join(', ') : '',
      // Ensure nested objects exist
      taxDetails: {
        taxable: false,
        taxCategory: '',
        taxAmount: 0,
        deductible: false,
        deductionCategory: '',
        ...transaction.taxDetails
      },
      metadata: {
        source: 'web',
        campaign: '',
        ...transaction.metadata
      }
    };

    // Reset form with existing values
    this.transactionForm.patchValue(formattedTransaction);
    this.isEdit = true;
    
    // Show the form
    this.showTransactionForm = true;
    
    // Scroll to form
    setTimeout(() => {
      document.querySelector('.transaction-form')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }

  deleteTransaction(transaction: Transaction): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        message: `Are you sure you want to delete this ${transaction.type.toLowerCase()} transaction for $${transaction.amount}?`
      }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.transactionService.deleteTransaction(transaction.id!).subscribe({
          next: () => {
            this.snackBar.open('Transaction deleted successfully', 'Close', {
              duration: 3000
            });
            this.loadTransactions();
          },
          error: (error) => {
            console.error('Error deleting transaction:', error);
            this.snackBar.open('Error deleting transaction', 'Close', {
              duration: 3000
            });
          }
        });
      }
    });
  }

  resetFilters(): void {
    this.filterForm.reset({
      search: '',
      category: 'all',
      property: 'all',
      startDate: '',
      endDate: '',
      minAmount: '',
      maxAmount: '',
      sortBy: 'date'
    });
  }

  // Keyboard shortcuts
  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    // Only handle shortcuts in development mode
    if (!this.isDevelopment) return;

    // Ctrl/Cmd + Shift + D to toggle debug panel
    if (event.key === 'D' && (event.ctrlKey || event.metaKey) && event.shiftKey) {
      event.preventDefault();
      this.isDebugPanelOpen = !this.isDebugPanelOpen;
    }
    
    // Only handle when debug panel is open
    if (!this.isDebugPanelOpen) return;

    // Ctrl/Cmd + Shift + V to view storage
    if (event.key === 'V' && (event.ctrlKey || event.metaKey) && event.shiftKey) {
      event.preventDefault();
      this.viewStorageState();
    }
    
    // Ctrl/Cmd + Shift + C to clear storage
    if (event.key === 'C' && (event.ctrlKey || event.metaKey) && event.shiftKey) {
      event.preventDefault();
      this.confirmClearStorage();
    }
  }

  confirmClearStorage(): void {
    if (confirm('Are you sure you want to clear all storage data?')) {
      this.clearStorage();
    }
  }

  // Method to copy storage state to clipboard
  copyStorageState(): void {
    const state = JSON.stringify(this.transactionService.getStorageState(), null, 2);
    navigator.clipboard.writeText(state).then(() => {
      this.snackBar.open('Storage state copied to clipboard', 'Close', {
        duration: 3000
      });
    });
  }

}

