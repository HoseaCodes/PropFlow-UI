export enum BookingStatus {
    PENDING = 'PENDING',
    CONFIRMED = 'CONFIRMED',
    CHECKED_IN = 'CHECKED_IN',
    CHECKED_OUT = 'CHECKED_OUT',
    CANCELLED = 'CANCELLED',
    NO_SHOW = 'NO_SHOW',
    REFUNDED = 'REFUNDED'
  }
  
  export enum PaymentStatus {
    PENDING = 'PENDING',
    AUTHORIZED = 'AUTHORIZED',
    PAID = 'PAID',
    PARTIALLY_REFUNDED = 'PARTIALLY_REFUNDED',
    REFUNDED = 'REFUNDED',
    FAILED = 'FAILED'
  }
  
  export enum PaymentMethod {
    CREDIT_CARD = 'CREDIT_CARD',
    DEBIT_CARD = 'DEBIT_CARD',
    PAYPAL = 'PAYPAL',
    BANK_TRANSFER = 'BANK_TRANSFER',
    CRYPTO = 'CRYPTO'
  }
  
  export interface GuestDetails {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address?: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
    identification?: {
      type: 'PASSPORT' | 'DRIVERS_LICENSE' | 'ID_CARD';
      number: string;
      issuingCountry: string;
    };
    specialRequests?: string;
  }
  
  export interface PriceBreakdown {
    basePrice: number;
    cleaningFee: number;
    occupancyTax: number;
    serviceFee: number;
    additionalGuestFee: number;
    discounts?: {
      type: 'WEEKLY' | 'MONTHLY' | 'PROMOTIONAL' | 'LOYALTY';
      amount: number;
      description: string;
    }[];
    totalPrice: number;
  }
  
  export interface PaymentDetails {
    status: PaymentStatus;
    method: PaymentMethod;
    transactionId?: string;
    paymentDate?: Date;
    lastFour?: string;
    refundDetails?: {
      amount: number;
      reason: string;
      date: Date;
      transactionId: string;
    };
  }
  
  export interface Booking {
    id: number;
    propertyId: number;
    
    // Guest Information
    guest: GuestDetails;
    numberOfGuests: number;
    numberOfAdults: number;
    numberOfChildren: number;
    numberOfPets?: number;
    
    // Dates and Times
    checkIn: Date;
    checkOut: Date;
    bookedAt: Date;
    lastModified: Date;
    actualCheckIn?: Date;
    actualCheckOut?: Date;
    
    // Status
    status: BookingStatus;
    confirmationCode: string;
    
    // Pricing
    price: PriceBreakdown;
    payment: PaymentDetails;
    
    // Communication
    messageThread?: {
      id: number;
      lastMessageDate: Date;
      unreadMessages: number;
    };
    
    // Additional Services
    addons?: {
      id: number;
      name: string;
      price: number;
      quantity: number;
    }[];
    
    // Cleaning
    cleaningSchedule?: {
      scheduledDate: Date;
      cleanerId?: number;
      status: 'PENDING' | 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
      notes?: string;
    };
    
    // Reviews
    guestReview?: {
      rating: number;
      comment: string;
      date: Date;
      response?: string;
    };
    
    // Cancellation
    cancellation?: {
      date: Date;
      reason: string;
      cancelledBy: 'HOST' | 'GUEST' | 'SYSTEM';
      refundAmount: number;
    };
    
    // Flags and Settings
    isBusinessTrip: boolean;
    requiresEarlyCheckIn: boolean;
    requiresLateCheckOut: boolean;
    hasSecurityDeposit: boolean;
    
    // Metadata
    metadata?: {
      source: 'DIRECT' | 'AIRBNB' | 'VRBO' | 'BOOKING_COM';
      externalId?: string;
      channel?: string;
      utm?: {
        source: string;
        medium: string;
        campaign: string;
      };
    };
  }