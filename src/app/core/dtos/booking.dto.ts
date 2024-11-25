
import { 
    BookingStatus, 
    PaymentStatus, 
    PaymentMethod,
    GuestDetails 
  } from '../../models/booking.model';
  
  export interface CreateBookingDto {
    propertyId: number;
    
    // Guest Information
    guest: {
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
    };
    
    // Booking Details
    numberOfGuests: number;
    numberOfAdults: number;
    numberOfChildren: number;
    numberOfPets?: number;
    checkIn: Date;
    checkOut: Date;
    specialRequests?: string;
  
    // Pricing
    basePrice: number;
    cleaningFee: number;
    additionalGuestFee?: number;
    securityDeposit?: number;
    
    // Payment
    paymentMethod: PaymentMethod;
    
    // Options
    isBusinessTrip?: boolean;
    requiresEarlyCheckIn?: boolean;
    requiresLateCheckOut?: boolean;
    
    // Additional Services
    addons?: {
      id: number;
      quantity: number;
    }[];
  }
  
  export interface UpdateBookingDto {
    id: number;
    status?: BookingStatus;
    checkIn?: Date;
    checkOut?: Date;
    numberOfGuests?: number;
    specialRequests?: string;
    paymentStatus?: PaymentStatus;
    addons?: {
      id: number;
      quantity: number;
    }[];
  }
  
  export interface BookingFilterDto {
    startDate?: Date;
    endDate?: Date;
    propertyId?: number;
    status?: BookingStatus[];
    guestName?: string;
    minPrice?: number;
    maxPrice?: number;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
  }
  
  export interface BookingResponseDto {
    id: number;
    propertyId: number;
    property: {
      id: number;
      name: string;
      address: string;
    };
    guest: GuestDetails;
    checkIn: Date;
    checkOut: Date;
    numberOfGuests: number;
    status: BookingStatus;
    confirmationCode: string;
    price: {
      basePrice: number;
      cleaningFee: number;
      additionalGuestFee: number;
      totalPrice: number;
    };
    payment: {
      status: PaymentStatus;
      method: PaymentMethod;
    };
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface CancelBookingDto {
    reason: string;
    cancellationFee?: number;
    refundAmount?: number;
    cancelledBy: 'HOST' | 'GUEST' | 'SYSTEM';
  }
  
  export interface BookingAvailabilityDto {
    propertyId: number;
    checkIn: Date;
    checkOut: Date;
    numberOfGuests: number;
  }
  
  export interface BookingPriceCalculationDto {
    propertyId: number;
    checkIn: Date;
    checkOut: Date;
    numberOfGuests: number;
    addons?: {
      id: number;
      quantity: number;
    }[];
    promoCode?: string;
  }
  
  export interface BookingPriceBreakdownDto {
    basePrice: number;
    numberOfNights: number;
    cleaningFee: number;
    additionalGuestFee: number;
    addonsFee: number;
    taxAmount: number;
    discounts: {
      type: string;
      amount: number;
      description: string;
    }[];
    totalPrice: number;
  }

  export class BookingDtoUtils {
    static createBookingFromForm(formData: any): CreateBookingDto {
      return {
        propertyId: formData.propertyId,
        guest: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address ? {
            street: formData.address.street,
            city: formData.address.city,
            state: formData.address.state,
            zipCode: formData.address.zipCode,
            country: formData.address.country
          } : undefined
        },
        numberOfGuests: formData.numberOfGuests,
        numberOfAdults: formData.numberOfAdults,
        numberOfChildren: formData.numberOfChildren,
        checkIn: new Date(formData.checkIn),
        checkOut: new Date(formData.checkOut),
        paymentMethod: formData.paymentMethod,
        basePrice: formData.basePrice,
        cleaningFee: formData.cleaningFee,
        specialRequests: formData.specialRequests,
        addons: formData.addons?.map((addon: any) => ({
          id: addon.id,
          quantity: addon.quantity
        }))
      };
    }
  
    static validateCreateBookingDto(dto: CreateBookingDto): string[] {
      const errors: string[] = [];
  
      if (!dto.propertyId) {
        errors.push('Property ID is required');
      }
  
      if (!dto.guest?.firstName || !dto.guest?.lastName) {
        errors.push('Guest first and last name are required');
      }
  
      if (!dto.guest?.email) {
        errors.push('Guest email is required');
      }
  
      if (!dto.checkIn || !dto.checkOut) {
        errors.push('Check-in and check-out dates are required');
      }
  
      if (dto.checkIn && dto.checkOut && dto.checkIn >= dto.checkOut) {
        errors.push('Check-out date must be after check-in date');
      }
  
      if (!dto.numberOfGuests || dto.numberOfGuests < 1) {
        errors.push('Number of guests must be at least 1');
      }
  
      if (!dto.paymentMethod) {
        errors.push('Payment method is required');
      }
  
      return errors;
    }
  
    static createFilterParams(filter: BookingFilterDto): URLSearchParams {
      const params = new URLSearchParams();
  
      if (filter.startDate) {
        params.append('startDate', filter.startDate.toISOString());
      }
      if (filter.endDate) {
        params.append('endDate', filter.endDate.toISOString());
      }
      if (filter.propertyId) {
        params.append('propertyId', filter.propertyId.toString());
      }
      if (filter.status?.length) {
        filter.status.forEach(status => {
          params.append('status', status);
        });
      }
      if (filter.guestName) {
        params.append('guestName', filter.guestName);
      }
      if (filter.minPrice) {
        params.append('minPrice', filter.minPrice.toString());
      }
      if (filter.maxPrice) {
        params.append('maxPrice', filter.maxPrice.toString());
      }
      if (filter.page) {
        params.append('page', filter.page.toString());
      }
      if (filter.limit) {
        params.append('limit', filter.limit.toString());
      }
      if (filter.sortBy) {
        params.append('sortBy', filter.sortBy);
        params.append('sortDirection', filter.sortDirection || 'asc');
      }
  
      return params;
    }
  }
  
  // Types for API responses
  export interface BookingApiResponse<T> {
    data: T;
    message?: string;
    errors?: string[];
    metadata?: {
      page?: number;
      limit?: number;
      total?: number;
      totalPages?: number;
    };
  }
  