// src/app/models/transaction.model.ts
  export enum PaymentMethod {
    CASH = 'CASH',
    CREDIT_CARD = 'CREDIT_CARD',
    DEBIT_CARD = 'DEBIT_CARD',
    BANK_TRANSFER = 'BANK_TRANSFER',
    CHECK = 'CHECK',
    PAYPAL = 'PAYPAL',
    VENMO = 'VENMO',
    ZELLE = 'ZELLE',
    OTHER = 'OTHER'
  }

  export enum TransactionStatus {
    PENDING = 'PENDING',
    PAID = 'PAID',
    OVERDUE = 'OVERDUE',
    CANCELLED = 'CANCELLED',
    DISPUTED = 'DISPUTED',
    REFUNDED = 'REFUNDED'
  }

  export enum TransactionType {
    EXPENSE = 'EXPENSE',
    INCOME = 'INCOME'
  }
  
  export enum TransactionCategory {
    // Income Categories
    BOOKING_PAYMENT = 'BOOKING_PAYMENT',
    CLEANING_FEE = 'CLEANING_FEE',
    SECURITY_DEPOSIT = 'SECURITY_DEPOSIT',
    LATE_CHECKOUT_FEE = 'LATE_CHECKOUT_FEE',
    ADDITIONAL_GUEST_FEE = 'ADDITIONAL_GUEST_FEE',
    OTHER_INCOME = 'OTHER_INCOME',
  
    // Expense Categories
    CLEANING = 'CLEANING',
    MAINTENANCE = 'MAINTENANCE',
    UTILITIES = 'UTILITIES',
    SUPPLIES = 'SUPPLIES',
    INSURANCE = 'INSURANCE',
    MORTGAGE = 'MORTGAGE',
    PROPERTY_TAX = 'PROPERTY_TAX',
    PLATFORM_FEES = 'PLATFORM_FEES',
    MARKETING = 'MARKETING',
    OTHER_EXPENSE = 'OTHER_EXPENSE',
    TAXES = 'TAXES',
    HOA_FEES = 'HOA_FEES',
    REPAIRS = 'REPAIRS',
    FURNISHING = 'FURNISHING',
    PROPERTY_MANAGEMENT = 'PROPERTY_MANAGEMENT',
    PERMITS_LICENSES = 'PERMITS_LICENSES',
    LEGAL_PROFESSIONAL = 'LEGAL_PROFESSIONAL'
  }
  
  export enum TransactionFrequency {
    ONE_TIME = 'ONE_TIME',
    DAILY = 'DAILY',
    WEEKLY = 'WEEKLY',
    BI_WEEKLY = 'BI_WEEKLY',
    MONTHLY = 'MONTHLY',
    QUARTERLY = 'QUARTERLY',
    SEMI_ANNUALLY = 'SEMI_ANNUALLY',
    ANNUALLY = 'ANNUALLY'
  }

  export interface Vendor {
    id?: number;
    name: string;
    contactPerson?: string;
    email?: string;
    phone?: string;
    website?: string;
    address?: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
    taxId?: string;
    preferredPaymentMethod?: PaymentMethod;
    notes?: string;
  }

  export interface TaxDetails {
    taxable: boolean;
    taxCategory?: string;
    taxAmount?: number;
    deductible?: boolean;
    deductionCategory?: string;
  }
  
  export interface Transaction {
    id?: number;
    propertyId: number;
    propertyName: string;
    bookingReference?: string; // If expense is related to a specific booking
    // bookingId?: number; // If expense is related to a specific booking

    // Basic Information
    type: TransactionType;
    category: TransactionCategory;
    subcategory?: string;
    description: string;
    amount: number;
    
    // Status and Payment
    status?: TransactionStatus;
    paymentMethod?: PaymentMethod;
    paymentReference?: string;
    recurring: boolean;
    frequency?: TransactionFrequency;

    // Related Entities
    vendor?: string;
    receiptUrl?: string;

    // Tax Information
    taxDetails?: TaxDetails;
    
    // Additional details
    notes?: string;
    tags?: string[];
    warranties?: {
        startDate: Date;
        endDate: Date;
        description: string;
        documentUrl?: string;
    }[];

    // Approval Workflow
    approvalStatus?: 'PENDING' | 'APPROVED' | 'REJECTED';
    approvedBy?: string;
    approvedDate?: Date;
  
    // Refund Information
    refund?: {
      amount: number;
      date: Date;
      reason: string;
      reference: string;
    };

    // Dates
    date: Date;
    dueDate?: Date;
    paidAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;

    // Metadata
    metadata?: {
        [key: string]: any;
    };
  }
  
  export interface TransactionFilter {
    startDate?: Date;
    endDate?: Date;
    type?: TransactionType;
    category?: TransactionCategory;
    propertyId?: number;
    minAmount?: number;
    maxAmount?: number;
    searchTerm?: string;
  }
  
  export interface TransactionSummary {
    totalIncome: number;
    totalExpenses: number;
    netIncome: number;
    expensesByCategory: CategorySummary[];
    incomeByCategory: CategorySummary[];
    monthlyTrend: MonthlyTrend[];
  }
  
  export interface CategorySummary {
    category: TransactionCategory;
    amount: number;
    percentage: number;
  }
  
  export interface MonthlyTrend {
    month: string;
    income: number;
    expenses: number;
    net: number;
  }
  
  // Metadata for categories
  export const CATEGORY_METADATA = {
    [TransactionCategory.BOOKING_PAYMENT]: {
      label: 'Booking Payment',
      icon: 'payment',
      color: 'green'
    },
    [TransactionCategory.CLEANING_FEE]: {
      label: 'Cleaning Fee',
      icon: 'cleaning_services',
      color: 'blue'
    },
    // ... add metadata for other categories
  };