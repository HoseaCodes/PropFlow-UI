import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BookingService } from '../../core/services/booking.service';
import { Booking, BookingStatus } from '../../models/booking.model';
import { BookingUtils } from '../../utils/booking.utils';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
//   styleUrls: ['./bookings.component.scss']
  // standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule
  ]
})

export class BookingsComponent implements OnInit, OnDestroy {
  bookings: Booking[] = [];
  filteredBookings: Booking[] = [];
  isLoading = false;
  filterForm: FormGroup;
  
  // Statistics
  totalBookings = 0;
  totalRevenue = 0;
  averageBookingValue = 0;
  occupancyRate = 0;

  private destroy$ = new Subject<void>();

  constructor(
    private bookingService: BookingService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.filterForm = this.fb.group({
      search: [''],
      status: ['all'],
      dateRange: this.fb.group({
        start: [''],
        end: ['']
      }),
      propertyId: ['all'],
      sortBy: ['checkIn']
    });
  }

  ngOnInit(): void {
    this.loadBookings();
    this.setupFilterSubscription();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupFilterSubscription(): void {
    this.filterForm.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.applyFilters();
    });
  }

  private loadBookings(): void {
    this.isLoading = true;
    // this.bookingService.getBookings()
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe({
    //     next: (bookings: any) => {
    //       this.bookings = bookings;
    //       this.applyFilters();
    //       this.calculateStatistics();
    //       this.isLoading = false;
    //     },
    //     error: (error: any) => {
    //       console.error('Error loading bookings:', error);
    //       this.snackBar.open('Error loading bookings', 'Close', {
    //         duration: 3000
    //       });
    //       this.isLoading = false;
    //     }
    //   });
  }

  private applyFilters(): void {
    const filters = this.filterForm.value;
    
    this.filteredBookings = this.bookings.filter(booking => {
      // Search filter
      const searchTerm = filters.search.toLowerCase();
      const matchesSearch = !searchTerm || 
        booking.guest.firstName.toLowerCase().includes(searchTerm) ||
        booking.guest.lastName.toLowerCase().includes(searchTerm) ||
        booking.guest.email.toLowerCase().includes(searchTerm) ||
        booking.confirmationCode.toLowerCase().includes(searchTerm);

      // Status filter
      const matchesStatus = filters.status === 'all' || 
        booking.status === filters.status;

      // Date range filter
      const checkIn = new Date(booking.checkIn);
      const matchesDateRange = !filters.dateRange.start || !filters.dateRange.end ||
        (checkIn >= new Date(filters.dateRange.start) && 
         checkIn <= new Date(filters.dateRange.end));

      // Property filter
      const matchesProperty = filters.propertyId === 'all' || 
        booking.propertyId === filters.propertyId;

      return matchesSearch && matchesStatus && matchesDateRange && matchesProperty;
    });

    // Apply sorting
    this.sortBookings(filters.sortBy);
  }

  private sortBookings(sortBy: string): void {
    this.filteredBookings.sort((a, b) => {
      switch (sortBy) {
        case 'checkIn':
          return new Date(a.checkIn).getTime() - new Date(b.checkIn).getTime();
        case 'price':
          return b.price.totalPrice - a.price.totalPrice;
        case 'status':
          return a.status.localeCompare(b.status);
        case 'guestName':
          return a.guest.lastName.localeCompare(b.guest.lastName);
        default:
          return 0;
      }
    });
  }

  private calculateStatistics(): void {
    this.totalBookings = this.bookings.length;
    
    this.totalRevenue = this.bookings.reduce(
      (sum, booking) => sum + booking.price.totalPrice, 
      0
    );
    
    this.averageBookingValue = this.totalBookings ? 
      this.totalRevenue / this.totalBookings : 0;

    // Calculate occupancy rate
    const now = new Date();
    const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
    
    const bookedDays = this.bookings.reduce((sum, booking) => {
      const checkIn = new Date(booking.checkIn);
      const checkOut = new Date(booking.checkOut);
      
      if (checkIn <= now && checkOut >= thirtyDaysAgo) {
        const days = BookingUtils.calculateNights(
          checkIn > thirtyDaysAgo ? checkIn : thirtyDaysAgo,
          checkOut < now ? checkOut : now
        );
        return sum + days;
      }
      return sum;
    }, 0);

    this.occupancyRate = (bookedDays / 30) * 100;
  }

  viewBooking(id: number): void {
    // Navigate to booking details
  }

  editBooking(id: number): void {
    // Open edit booking dialog
  }

  cancelBooking(booking: Booking): void {
    if (!BookingUtils.isBookingCancellable(booking)) {
      this.snackBar.open('This booking cannot be cancelled', 'Close', {
        duration: 3000
      });
      return;
    }

    // const dialogRef = this.dialog.open(/* Cancellation Dialog Component ,*/ {
    //   data: { booking }
    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   if (result) {
        // this.bookingService.cancelBooking(booking.id)
        //   .pipe(takeUntil(this.destroy$))
        //   .subscribe({
        //     next: () => {
        //       this.snackBar.open('Booking cancelled successfully', 'Close', {
        //         duration: 3000
        //       });
        //       this.loadBookings();
        //     },
        //     error: (error) => {
        //       console.error('Error cancelling booking:', error);
        //       this.snackBar.open('Error cancelling booking', 'Close', {
        //         duration: 3000
        //       });
        //     }
        //   });
    //   }
    // });
  }

  getStatusDisplay(status: BookingStatus): any {
    return BookingUtils.getBookingStatusProperties(status);
  }
}