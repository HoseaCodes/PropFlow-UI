
import { 
    ExpenseCategory, 
    ExpenseFrequency, 
    PaymentMethod, 
    ExpenseStatus,
    Vendor,
    Receipt,
    TaxDetails
  } from '../../models/expense.model';
  
  export interface CreateExpenseDto {
    propertyId: number;
    bookingId?: number;
    
    // Basic Information
    category: ExpenseCategory;
    subcategory?: string;
    description: string;
    amount: number;
    currency: string;
  
    // Dates
    date: Date;
    dueDate?: Date;
  
    // Status and Payment
    status: ExpenseStatus;
    paymentMethod?: PaymentMethod;
    paymentReference?: string;
    recurring: boolean;
    frequency?: ExpenseFrequency;
    
    // Related Entities
    vendor?: Vendor;
    receipts?: Receipt[];
    
    // Tax Information
    taxDetails?: TaxDetails;
  
    // Additional Details
    notes?: string;
    tags?: string[];
  }
  
  export interface UpdateExpenseDto extends Partial<CreateExpenseDto> {
    id: number;
  }
  
  export interface ExpenseFilterDto {
    startDate?: Date;
    endDate?: Date;
    categories?: ExpenseCategory[];
    propertyIds?: number[];
    minAmount?: number;
    maxAmount?: number;
    status?: ExpenseStatus[];
    recurring?: boolean;
    vendors?: string[];
    searchTerm?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
  }
  
  export interface ExpenseResponseDto {
    id: number;
    propertyId: number;
    category: ExpenseCategory;
    amount: number;
    date: Date;
    status: ExpenseStatus;
    // ... other fields
  }
  
  export interface ExpenseSummaryDto {
    totalAmount: number;
    categoryBreakdown: {
      category: ExpenseCategory;
      amount: number;
      percentage: number;
    }[];
    monthlyAverage: number;
    unpaidAmount: number;
    overdueAmount: number;
    propertyBreakdown?: {
      propertyId: number;
      propertyName: string;
      amount: number;
      percentage: number;
    }[];
  }