import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ExpenseService } from '../../core/services/expense.service';
import { PropertyService } from '../../core/services/property.service';
import { 
  Expense, 
  ExpenseCategory, 
  ExpenseFrequency,
  EXPENSE_CATEGORY_PROPERTIES 
} from '../../models/expense.model';
import { Property } from '../../models/property.model';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
//   styleUrls: ['./expenses.component.scss']
    // standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        ReactiveFormsModule
    ]
})
export class ExpensesComponent implements OnInit, OnDestroy {
  expenses: Expense[] = [];
  filteredExpenses: Expense[] = [];
  properties: Property[] = [];
  isLoading = false;
  filterForm: FormGroup | any;
  expenseForm: FormGroup | any;
  showExpenseForm = false;
  
  // Enums for template
  expenseCategories = Object.values(ExpenseCategory);
  expenseFrequencies = Object.values(ExpenseFrequency);
  categoryProperties = EXPENSE_CATEGORY_PROPERTIES;
  
  // Statistics
  totalExpenses = 0;
  monthlyAverage = 0;
  expensesByCategory: { category: string; amount: number; percentage: number }[] = [];
  topExpenseCategory = '';

  private destroy$ = new Subject<void>();

  constructor(
    private expenseService: ExpenseService,
    private propertyService: PropertyService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.initializeForms();
  }

  ngOnInit(): void {
    this.loadProperties();
    this.loadExpenses();
    this.setupFilterSubscription();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForms(): void {
    // Filter Form
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

    // Expense Form
    this.expenseForm = this.fb.group({
      propertyId: ['', Validators.required],
      category: ['', Validators.required],
      description: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0)]],
      date: ['', Validators.required],
      recurring: [false],
      frequency: [{ value: '', disabled: true }],
      notes: [''],
      vendor: [''],
      receipt: ['']
    });

    // Enable/disable frequency based on recurring checkbox
    // this.expenseForm.get('recurring')?.valueChanges.subscribe(isRecurring => {
    //   const frequencyControl = this.expenseForm.get('frequency');
    //   if (isRecurring) {
    //     frequencyControl?.enable();
    //     frequencyControl?.setValidators(Validators.required);
    //   } else {
    //     frequencyControl?.disable();
    //     frequencyControl?.clearValidators();
    //   }
    //   frequencyControl?.updateValueAndValidity();
    // });
  }

  private loadProperties(): void {
    // this.propertyService.getProperties()
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe({
    //     next: (properties: any) => {
    //       this.properties = properties;
    //     },
    //     error: (error: any) => {
    //       console.error('Error loading properties:', error);
    //       this.snackBar.open('Error loading properties', 'Close', {
    //         duration: 3000
    //       });
    //     }
    //   });
  }

  private loadExpenses(): void {
    this.isLoading = true;
    // this.expenseService.getExpenses()
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe({
    //     next: (expenses: any) => {
    //       this.expenses = expenses;
    //       this.applyFilters();
    //       this.calculateStatistics();
    //       this.isLoading = false;
    //     },
    //     error: (error: any) => {
    //       console.error('Error loading expenses:', error);
    //       this.snackBar.open('Error loading expenses', 'Close', {
    //         duration: 3000
    //       });
    //       this.isLoading = false;
    //     }
    //   });
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
    
    this.filteredExpenses = this.expenses.filter(expense => {
      // Search filter
      const searchTerm = filters.search.toLowerCase();
    //   const matchesSearch = !searchTerm || 
    //     expense.description.toLowerCase().includes(searchTerm) ||
    //     expense.vendor?.toLowerCase().includes(searchTerm);
      const matchesSearch = expense

      // Category filter
      const matchesCategory = filters.category === 'all' || 
        expense.category === filters.category;

      // Property filter
      const matchesProperty = filters.property === 'all' || 
        expense.propertyId.toString() === filters.property;

      // Date range filter
      const expenseDate = new Date(expense.date);
      const matchesDateRange = (!filters.startDate || expenseDate >= new Date(filters.startDate)) &&
        (!filters.endDate || expenseDate <= new Date(filters.endDate));

      // Amount range filter
      const matchesAmount = (!filters.minAmount || expense.amount >= filters.minAmount) &&
        (!filters.maxAmount || expense.amount <= filters.maxAmount);

      return matchesSearch && matchesCategory && matchesProperty && 
             matchesDateRange && matchesAmount;
    });

    // Apply sorting
    this.sortExpenses(filters.sortBy);
  }

  private sortExpenses(sortBy: string): void {
    this.filteredExpenses.sort((a, b) => {
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
    // Calculate total expenses
    this.totalExpenses = this.expenses.reduce(
      (sum, expense) => sum + expense.amount, 
      0
    );

    // Calculate monthly average (last 12 months)
    const today = new Date();
    const lastYear = new Date(today.getFullYear() - 1, today.getMonth());
    const recentExpenses = this.expenses.filter(
      expense => new Date(expense.date) >= lastYear
    );
    this.monthlyAverage = this.totalExpenses / 12;

    // Calculate expenses by category
    const categoryTotals: { [key: string]: number } = {};
    this.expenses.forEach(expense => {
      categoryTotals[expense.category] = 
        (categoryTotals[expense.category] || 0) + expense.amount;
    });

    this.expensesByCategory = Object.entries(categoryTotals).map(([category, amount]) => ({
      category,
      amount,
      percentage: (amount / this.totalExpenses) * 100
    })).sort((a, b) => b.amount - a.amount);

    this.topExpenseCategory = this.expensesByCategory[0]?.category || '';
  }

  submitExpense(): void {
    if (this.expenseForm.valid) {
      const expenseData = this.expenseForm.value;
      
    //   this.expenseService.createExpense(expenseData)
    //     .pipe(takeUntil(this.destroy$))
    //     .subscribe({
    //       next: () => {
    //         this.snackBar.open('Expense created successfully', 'Close', {
    //           duration: 3000
    //         });
    //         this.loadExpenses();
    //         this.resetExpenseForm();
    //       },
    //       error: (error: any) => {
    //         console.error('Error creating expense:', error);
    //         this.snackBar.open('Error creating expense', 'Close', {
    //           duration: 3000
    //         });
    //       }
    //     });
    } else {
      this.snackBar.open('Please fill in all required fields', 'Close', {
        duration: 3000
      });
    }
  }

  editExpense(expense: Expense): void {
    this.showExpenseForm = true;
    this.expenseForm.patchValue({
      propertyId: expense.propertyId,
      category: expense.category,
      description: expense.description,
      amount: expense.amount,
      date: expense.date,
      recurring: expense.recurring,
      frequency: expense.frequency,
      notes: expense.notes,
      vendor: expense.vendor
    });
  }

  deleteExpense(id: number): void {
    // const dialogRef = this.dialog.open(/* Confirmation Dialog Component ,*/ {
    // //   data: { message: 'Are you sure you want to delete this expense?' }
    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   if (result) {
    //     this.expenseService.deleteExpense(id)
    //       .pipe(takeUntil(this.destroy$))
    //       .subscribe({
    //         next: () => {
    //           this.snackBar.open('Expense deleted successfully', 'Close', {
    //             duration: 3000
    //           });
    //           this.loadExpenses();
    //         },
    //         error: (error: any) => {
    //           console.error('Error deleting expense:', error);
    //           this.snackBar.open('Error deleting expense', 'Close', {
    //             duration: 3000
    //           });
    //         }
    //       });
    //   }
    // });
  }

  resetExpenseForm(): void {
    this.expenseForm.reset();
    this.showExpenseForm = false;
  }

  toggleExpenseForm(): void {
    this.showExpenseForm = !this.showExpenseForm;
    if (!this.showExpenseForm) {
      this.resetExpenseForm();
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Handle file upload
      const formData = new FormData();
      formData.append('receipt', file);
      // Implement file upload logic
    }
  }

  getCategoryIcon(category: ExpenseCategory): string {
    return 'attach_money';
    // return EXPENSE_CATEGORY_PROPERTIES[category]?.icon || 'attach_money';
  }

  getCategoryColor(category: ExpenseCategory): string {
    return 'gray';
    // return EXPENSE_CATEGORY_PROPERTIES[category]?.color || 'gray';
  }
}