import { 
    Booking, 
    BookingStatus, 
    PaymentStatus,
    PriceBreakdown 
  } from '../models/booking.model';
  
  export class BookingUtils {
    /**
     * Calculate the number of nights between check-in and check-out dates
     */
    static calculateNights(checkIn: Date, checkOut: Date): number {
      const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
  
    /**
     * Calculate the total price of a booking including all fees and discounts
     */
    static calculateTotalPrice(booking: Partial<Booking>): number {
      if (!booking.price) return 0;
      
      const {
        basePrice,
        cleaningFee,
        occupancyTax,
        serviceFee,
        additionalGuestFee,
        discounts
      } = booking.price;
  
      let total = basePrice + cleaningFee + occupancyTax + serviceFee + additionalGuestFee;
  
      if (discounts && discounts.length > 0) {
        const totalDiscounts = discounts.reduce((sum, discount) => sum + discount.amount, 0);
        total -= totalDiscounts;
      }
  
      return total;
    }
  
    /**
     * Check if a booking can be cancelled based on status and time until check-in
     */
    static isBookingCancellable(booking: Booking): boolean {
      const cancellableStatuses = [
        BookingStatus.PENDING,
        BookingStatus.CONFIRMED
      ];
  
      if (!cancellableStatuses.includes(booking.status)) {
        return false;
      }
  
      const checkInDate = new Date(booking.checkIn);
      const now = new Date();
      const hoursUntilCheckIn = (checkInDate.getTime() - now.getTime()) / (1000 * 60 * 60);
  
      return hoursUntilCheckIn >= 48;
    }
  
    /**
     * Get display properties for a booking status
     */
    static getBookingStatusProperties(status: BookingStatus): {
      label: string;
      color: string;
      icon: string;
      bgColor: string;
      textColor: string;
    } {
      const statusMap = {
        [BookingStatus.PENDING]: {
          label: 'Pending',
          color: 'yellow',
          icon: 'schedule',
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-800'
        },
        [BookingStatus.CONFIRMED]: {
          label: 'Confirmed',
          color: 'green',
          icon: 'check_circle',
          bgColor: 'bg-green-100',
          textColor: 'text-green-800'
        },
        [BookingStatus.CHECKED_IN]: {
          label: 'Checked In',
          color: 'blue',
          icon: 'login',
          bgColor: 'bg-blue-100',
          textColor: 'text-blue-800'
        },
        [BookingStatus.CHECKED_OUT]: {
          label: 'Checked Out',
          color: 'purple',
          icon: 'logout',
          bgColor: 'bg-purple-100',
          textColor: 'text-purple-800'
        },
        [BookingStatus.CANCELLED]: {
          label: 'Cancelled',
          color: 'red',
          icon: 'cancel',
          bgColor: 'bg-red-100',
          textColor: 'text-red-800'
        },
        [BookingStatus.NO_SHOW]: {
          label: 'No Show',
          color: 'gray',
          icon: 'person_off',
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800'
        },
        [BookingStatus.REFUNDED]: {
          label: 'Refunded',
          color: 'orange',
          icon: 'payment',
          bgColor: 'bg-orange-100',
          textColor: 'text-orange-800'
        }
      };
  
      return statusMap[status];
    }
  
    /**
     * Calculate refund amount based on cancellation policy and time until check-in
     */
    static calculateRefundAmount(booking: Booking): number {
      const hoursUntilCheckIn = this.getHoursUntilCheckIn(booking);
      const totalAmount = this.calculateTotalPrice(booking);
  
      if (hoursUntilCheckIn >= 168) { // 7 days or more
        return totalAmount * 0.95; // 95% refund
      } else if (hoursUntilCheckIn >= 72) { // 3-7 days
        return totalAmount * 0.50; // 50% refund
      } else if (hoursUntilCheckIn >= 48) { // 2-3 days
        return totalAmount * 0.25; // 25% refund
      }
      
      return 0; // No refund
    }
  
    /**
     * Get hours remaining until check-in
     */
    static getHoursUntilCheckIn(booking: Booking): number {
      const checkInDate = new Date(booking.checkIn);
      const now = new Date();
      return (checkInDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    }
  
    /**
     * Format price breakdown for display
     */
    static formatPriceBreakdown(price: PriceBreakdown): {label: string, amount: number}[] {
      const breakdown = [
        { label: 'Base Price', amount: price.basePrice },
        { label: 'Cleaning Fee', amount: price.cleaningFee },
        { label: 'Occupancy Tax', amount: price.occupancyTax },
        { label: 'Service Fee', amount: price.serviceFee }
      ];
  
      if (price.additionalGuestFee > 0) {
        breakdown.push({ 
          label: 'Additional Guest Fee', 
          amount: price.additionalGuestFee 
        });
      }
  
      if (price.discounts?.length) {
        price.discounts.forEach(discount => {
          breakdown.push({ 
            label: `${discount.type} Discount`, 
            amount: -discount.amount 
          });
        });
      }
  
      return breakdown;
    }
  
    /**
     * Check if booking dates overlap with existing bookings
     */
    static hasDateOverlap(
      checkIn: Date, 
      checkOut: Date, 
      existingBookings: Booking[]
    ): boolean {
      return existingBookings.some(booking => {
        const existingCheckIn = new Date(booking.checkIn);
        const existingCheckOut = new Date(booking.checkOut);
        
        return (
          (checkIn >= existingCheckIn && checkIn < existingCheckOut) ||
          (checkOut > existingCheckIn && checkOut <= existingCheckOut) ||
          (checkIn <= existingCheckIn && checkOut >= existingCheckOut)
        );
      });
    }
  
    /**
     * Get available check-in times for a given date
     */
    static getAvailableCheckInTimes(date: Date): string[] {
      const times = [];
      for (let hour = 15; hour <= 21; hour++) { // 3 PM to 9 PM
        times.push(`${hour}:00`);
        times.push(`${hour}:30`);
      }
      return times;
    }
  
    /**
     * Validate a booking request
     */
    static validateBooking(booking: Partial<Booking>): string[] {
      const errors: string[] = [];
  
      if (!booking.checkIn || !booking.checkOut) {
        errors.push('Check-in and check-out dates are required');
      }
  
      if (booking.checkIn && booking.checkOut && 
          new Date(booking.checkIn) >= new Date(booking.checkOut)) {
        errors.push('Check-out date must be after check-in date');
      }
  
      if (!booking.guest?.email) {
        errors.push('Guest email is required');
      }
  
      if (!booking.numberOfGuests || booking.numberOfGuests < 1) {
        errors.push('Number of guests must be at least 1');
      }
  
      return errors;
    }
  }