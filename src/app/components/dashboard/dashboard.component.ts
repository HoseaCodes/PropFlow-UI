import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BookingService } from '../../core/services/booking.service';
// import { ExpenseService } from '../../core/services/expense.service';
import { PropertyService } from '../../core/services/property.service';
import { Property } from '../../models/property.model';
import { Booking } from '../../models/booking.model';
// import { Expense } from '../../models/expense.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface PropertyMetrics {
  id: number;
  name: string;
  revenue: number;
  expenses: number;
  occupancyRate: number;
  averageNightlyRate: number;
  bookings: number;
  reviews: number;
  averageRating: number;
  profit: number;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
//   styleUrls: ['./dashboard.component.scss']
  // standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule
  ]
})
export class DashboardComponent implements OnInit, OnDestroy {
  // Properties
  properties: Property[] = [];
  selectedPropertyId: number | 'all' = 'all';
  isLoading = true;

  // Time range filter
  filterForm: FormGroup;
  dateRanges = [
    { label: 'Last 7 Days', value: '7d' },
    { label: 'Last 30 Days', value: '30d' },
    { label: 'Last 90 Days', value: '90d' },
    { label: 'Year to Date', value: 'ytd' },
    { label: 'Last Year', value: 'ly' }
  ];

  // Metrics
  totalRevenue = 0;
  totalExpenses = 0;
  netProfit = 0;
  occupancyRate = 0;
  averageNightlyRate = 0;
  totalBookings = 0;
  cancelationRate = 0;
  averageRating = 0;

  // Charts data
  revenueChartData: any[] = [];
  occupancyChartData: any[] = [];
  expenseChartData: any[] = [];
  bookingSourceChartData: any[] = [];

  // Property metrics
  propertyMetrics: PropertyMetrics[] = [];

  // Recent activity
  recentBookings: Booking[] = [];
  upcomingCheckIns: Booking[] = [];
  pendingTasks: any[] = [];

  private destroy$ = new Subject<void>();

  constructor(
    private bookingService: BookingService,
    // private expenseService: ExpenseService,
    private propertyService: PropertyService,
    private fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({
      dateRange: ['30d'],
      propertyId: ['all']
    });
  }

  ngOnInit(): void {
    this.loadProperties();
    this.setupFilterSubscription();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupFilterSubscription(): void {
    this.filterForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.loadDashboardData();
      });
  }

  private loadProperties(): void {
    // this.propertyService.getProperties()
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe(properties => {
    //     this.properties = properties;
    //     this.loadDashboardData();
    //   });
  }

  private loadDashboardData(): void {
    this.isLoading = true;
    const filters = this.filterForm.value;
    const dateRange = this.getDateRange(filters.dateRange);

    // Load all required data in parallel
    const requests = {
    //   bookings: this.bookingService.getBookings({
    //     startDate: dateRange.start,
    //     endDate: dateRange.end,
    //     propertyId: filters.propertyId === 'all' ? undefined : filters.propertyId
    //   }),
    //   expenses: this.expenseService.getExpenses({
    //     startDate: dateRange.start,
    //     endDate: dateRange.end,
    //     propertyId: filters.propertyId === 'all' ? undefined : filters.propertyId
    //   }),
    //   recentBookings: this.bookingService.getRecentBookings(5),
    //   upcomingCheckIns: this.bookingService.getUpcomingCheckIns(5)
    };

    // Handle responses
    // forkJoin(requests)
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe({
    //     next: (data: any) => {
    //       this.calculateMetrics(data.bookings, data.expenses);
    //       this.prepareChartData(data.bookings, data.expenses);
    //       this.calculatePropertyMetrics(data.bookings, data.expenses);
    //       this.recentBookings = data.recentBookings;
    //       this.upcomingCheckIns = data.upcomingCheckIns;
    //       this.isLoading = false;
    //     },
    //     error: (error: any) => {
    //       console.error('Error loading dashboard data:', error);
    //       this.isLoading = false;
    //     }
    //   });
  }

  private getDateRange(range: string): { start: Date; end: Date } {
    const end = new Date();
    const start = new Date();

    switch (range) {
      case '7d':
        start.setDate(end.getDate() - 7);
        break;
      case '30d':
        start.setDate(end.getDate() - 30);
        break;
      case '90d':
        start.setDate(end.getDate() - 90);
        break;
      case 'ytd':
        start.setFullYear(end.getFullYear(), 0, 1);
        break;
      case 'ly':
        start.setFullYear(end.getFullYear() - 1, 0, 1);
        end.setFullYear(end.getFullYear() - 1, 11, 31);
        break;
    }

    return { start, end };
  }

  // private calculateMetrics(bookings: Booking[], expenses: Expense[]): void {
  //   // Calculate total revenue
  //   this.totalRevenue = bookings.reduce(
  //     (sum, booking) => sum + booking.price.totalPrice, 
  //     0
  //   );

  //   // Calculate total expenses
  //   this.totalExpenses = expenses.reduce(
  //     (sum, expense) => sum + expense.amount, 
  //     0
  //   );

  //   // Calculate net profit
  //   this.netProfit = this.totalRevenue - this.totalExpenses;

  //   // Calculate occupancy rate
  //   const totalDays = bookings.reduce((sum, booking) => {
  //     const days = Math.floor(
  //       (new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) 
  //       / (1000 * 60 * 60 * 24)
  //     );
  //     return sum + days;
  //   }, 0);

  //   const dateRange = this.getDateRange(this.filterForm.value.dateRange);
  //   const totalPossibleDays = Math.floor(
  //     (dateRange.end.getTime() - dateRange.start.getTime()) 
  //     / (1000 * 60 * 60 * 24)
  //   ) * this.properties.length;

  //   this.occupancyRate = (totalDays / totalPossibleDays) * 100;

  //   // Calculate average nightly rate
  //   this.averageNightlyRate = totalDays ? this.totalRevenue / totalDays : 0;

  //   // Calculate total bookings and cancellation rate
  //   this.totalBookings = bookings.length;
  //   const canceledBookings = bookings.filter(b => b.status === 'CANCELLED').length;
  //   this.cancelationRate = (canceledBookings / this.totalBookings) * 100;

  //   // Calculate average rating
  //   const ratingsSum = bookings.reduce(
  //     (sum, booking) => sum + (booking.guestReview?.rating || 0), 
  //     0
  //   );
  //   const totalRatings = bookings.filter(b => b.guestReview?.rating).length;
  //   this.averageRating = totalRatings ? ratingsSum / totalRatings : 0;
  // }

  // private prepareChartData(bookings: Booking[], expenses: Expense[]): void {
  //   // Revenue Chart Data
  //   this.revenueChartData = this.groupByMonth(bookings, b => b.price.totalPrice);

  //   // Occupancy Chart Data
  //   this.occupancyChartData = this.calculateOccupancyByMonth(bookings);

  //   // Expense Chart Data
  //   this.expenseChartData = this.groupByCategory(expenses);

  //   // Booking Source Chart Data
  //   this.bookingSourceChartData = this.groupBySource(bookings);
  // }

  // private calculatePropertyMetrics(bookings: Booking[], expenses: Expense[]): void {
  //   this.propertyMetrics = this.properties.map(property => {
  //     const propertyBookings = bookings.filter(b => b.propertyId === property.id);
  //     const propertyExpenses = expenses.filter(e => e.propertyId === property.id);

  //     const revenue = propertyBookings.reduce(
  //       (sum, booking) => sum + booking.price.totalPrice, 
  //       0
  //     );
  //     const expenseTotal = propertyExpenses.reduce(
  //       (sum, expense) => sum + expense.amount, 
  //       0
  //     );

  //     return {
  //       id: property.id,
  //       name: property.name,
  //       revenue,
  //       expenses: expenseTotal,
  //       profit: revenue - expenseTotal,
  //       occupancyRate: this.calculatePropertyOccupancy(propertyBookings),
  //       averageNightlyRate: this.calculateAverageNightlyRate(propertyBookings),
  //       bookings: propertyBookings.length,
  //       reviews: propertyBookings.filter(b => b.guestReview).length,
  //       averageRating: this.calculateAverageRating(propertyBookings)
  //     };
  //   });
  // }

  private groupByMonth(data: any[], valueSelector: (item: any) => number): any[] {
    const grouped = data.reduce((acc, item) => {
      const date = new Date(item.date);
      const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
      acc[key] = (acc[key] || 0) + valueSelector(item);
      return acc;
    }, {});

    return Object.entries(grouped).map(([date, value]) => ({
      date,
      value
    }));
  }

  private calculateOccupancyByMonth(bookings: Booking[]): any[] {
    // Implementation for occupancy calculation by month
    return [];
  }

  // private groupByCategory(expenses: Expense[]): any[] {
  //   const grouped = expenses.reduce((acc, expense) => {
  //   //   acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
  //     return acc;
  //   }, {});

  //   return Object.entries(grouped).map(([category, amount]) => ({
  //     category,
  //     amount
  //   }));
  // }

  private groupBySource(bookings: Booking[]): any[] {
    const grouped = bookings.reduce((acc, booking) => {
      const source = booking.metadata?.source || 'DIRECT';
    //   acc[source] = (acc[source] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(grouped).map(([source, count]) => ({
      source,
      count
    }));
  }

  private calculatePropertyOccupancy(bookings: Booking[]): number {
    // Implementation for property occupancy calculation
    return 0;
  }

  private calculateAverageNightlyRate(bookings: Booking[]): number {
    // Implementation for average nightly rate calculation
    return 0;
  }

  private calculateAverageRating(bookings: Booking[]): number {
    const ratings = bookings
      .filter(b => b.guestReview?.rating)
      .map(b => b.guestReview!.rating);
    return ratings.length ? 
      ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length : 
      0;
  }

  exportData(): void {
    // Implementation for data export
  }

  navigateToProperty(propertyId: number): void {
    // Implementation for property navigation
  }

  viewAllBookings(): void {
    // Implementation for viewing all bookings
  }

  viewAllExpenses(): void {
    // Implementation for viewing all expenses
  }
}