import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
// import { DashboardService } from '../../../core/services/dashboard.service';
import { PropertyService } from '../../../core/services/property.service';
import { BookingService } from '../../../core/services/booking.service';
import { ExpenseService } from '../../../core/services/expense.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardResolver implements Resolve<any> {
  constructor(
    // private dashboardService: DashboardService,
    private propertyService: PropertyService,
    private bookingService: BookingService,
    private expenseService: ExpenseService
  ) {}

  resolve(): Observable<any> {
    return forkJoin({
    //   properties: this.propertyService.getProperties(),
    //   recentBookings: this.bookingService.getRecentBookings(5),
    //   upcomingCheckIns: this.bookingService.getUpcomingCheckIns(5),
    //   monthlyRevenue: this.dashboardService.getMonthlyRevenue(),
    //   expenses: this.expenseService.getRecentExpenses()
    }).pipe(
    //   map(data => ({
    //     ...data,
    //     totalProperties: data.properties.length,
    //     totalRevenue: this.calculateTotalRevenue(data.monthlyRevenue),
    //     occupancyRate: this.calculateOccupancyRate(data.properties)
    //   }))
    );
  }

  private calculateTotalRevenue(monthlyRevenue: any[]): number {
    return monthlyRevenue.reduce((sum, month) => sum + month.amount, 0);
  }

  private calculateOccupancyRate(properties: any[]): number {
    // Implementation for occupancy rate calculation
    return 0;
  }
}
