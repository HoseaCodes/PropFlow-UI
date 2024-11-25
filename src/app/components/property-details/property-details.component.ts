import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PropertyService } from '../../core/services/property.service';
import { BookingService } from '../../core/services/booking.service';
import { ExpenseService } from '../../core/services/expense.service';
import { Property } from '../../models/property.model';
import { Booking } from '../../models/booking.model';
import { Expense } from '../../models/expense.model';
import { Subject, forkJoin } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-property-details',
  templateUrl: './property-details.component.html',
//   styleUrls: ['./property-details.component.scss']
  // standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule
  ]
})
export class PropertyDetailsComponent implements OnInit, OnDestroy {
  property: Property | null = null;
  bookings: Booking[] = [];
  expenses: Expense[] = [];
  isLoading = true;
  activeTab: 'overview' | 'bookings' | 'expenses' | 'maintenance' = 'overview';
  
  // Financial metrics
  totalRevenue = 0;
  totalExpenses = 0;
  netIncome = 0;
  occupancyRate = 0;
  averageNightlyRate = 0;

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private propertyService: PropertyService,
    private bookingService: BookingService,
    private expenseService: ExpenseService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const propertyId = Number(params['id']);
      this.loadPropertyData(propertyId);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadPropertyData(propertyId: number): void {
    this.isLoading = true;
    
    // forkJoin({
    //   property: this.propertyService.getProperty(propertyId),
    //   bookings: this.bookingService.getBookingsByProperty(propertyId),
    //   expenses: this.expenseService.getExpensesByProperty(propertyId)
    // }).pipe(
    //   takeUntil(this.destroy$)
    // ).subscribe({
    //   next: (data) => {
    //     this.property = data.property;
    //     this.bookings = data.bookings;
    //     this.expenses = data.expenses;
    //     this.calculateMetrics();
    //     this.isLoading = false;
    //   },
    //   error: (error) => {
    //     console.error('Error loading property data:', error);
    //     this.snackBar.open(
    //       'Error loading property details. Please try again.',
    //       'Close',
    //       { duration: 3000 }
    //     );
    //     this.isLoading = false;
    //   }
    // });
  }

  private calculateMetrics(): void {
    // Calculate total revenue
    // this.totalRevenue = this.bookings.reduce(
    //   (sum, booking) => sum + booking.totalPrice,
    //   0
    // );

    // Calculate total expenses
    this.totalExpenses = this.expenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );

    // Calculate net income
    this.netIncome = this.totalRevenue - this.totalExpenses;

    // Calculate occupancy rate
    const totalDays = 365;
    const bookedDays = this.bookings.reduce((sum, booking) => {
      const days = Math.floor(
        (new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) 
        / (1000 * 60 * 60 * 24)
      );
      return sum + days;
    }, 0);
    
    this.occupancyRate = (bookedDays / totalDays) * 100;

    // Calculate average nightly rate
    const totalBookings = this.bookings.length;
    this.averageNightlyRate = totalBookings ? 
      this.totalRevenue / bookedDays : 0;
  }

  setActiveTab(tab: 'overview' | 'bookings' | 'expenses' | 'maintenance'): void {
    this.activeTab = tab;
  }

  editProperty(): void {
    this.router.navigate(['edit'], { relativeTo: this.route });
  }

  deleteProperty(): void {
    // const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    //   data: {
    //     title: 'Delete Property',
    //     message: 'Are you sure you want to delete this property? This action cannot be undone.'
    //   }
    // });

    // dialogRef.afterClosed().subscribe(result => {
      // if (result && this.property) {
      //   this.propertyService.deleteProperty(this.property.id)
      //     .pipe(takeUntil(this.destroy$))
      //     .subscribe({
      //       next: () => {
      //         this.snackBar.open('Property deleted successfully', 'Close', {
      //           duration: 3000
      //         });
      //         this.router.navigate(['/properties']);
      //       },
      //       error: (error) => {
      //         console.error('Error deleting property:', error);
      //         this.snackBar.open(
      //           'Error deleting property. Please try again.',
      //           'Close',
      //           { duration: 3000 }
      //         );
      //       }
      //     });
      // }
    // });
  }

   // Add these methods to the component class
   getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
  
  getCategoryClass(category: string): string {
    switch (category.toLowerCase()) {
      case 'cleaning':
        return 'bg-blue-100 text-blue-800';
      case 'maintenance':
        return 'bg-orange-100 text-orange-800';
      case 'utilities':
        return 'bg-green-100 text-green-800';
      case 'supplies':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
  
  getMaintenanceStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
  
  getDaysBetween(checkIn: string | Date, checkOut: string | Date): number {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  }
  
  getLargestExpenseCategory(): string {
    const categories = this.expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as { [key: string]: number });
    
    return Object.entries(categories).sort((a, b) => b[1] - a[1])[0]?.[0] || 'None';
  }
  
  getLargestExpenseCategoryAmount(): number {
    const categories = this.expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as { [key: string]: number });
    
    return Math.max(...Object.values(categories), 0);
  }
  
  getMonthlyAverageExpense(): number {
    if (!this.expenses.length) return 0;
    return this.totalExpenses / 12;
  }
}