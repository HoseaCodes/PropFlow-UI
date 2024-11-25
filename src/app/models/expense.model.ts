export enum ExpenseCategory {
    CLEANING = 'CLEANING',
    MAINTENANCE = 'MAINTENANCE',
    UTILITIES = 'UTILITIES',
    SUPPLIES = 'SUPPLIES',
    INSURANCE = 'INSURANCE',
    TAXES = 'TAXES',
    MORTGAGE = 'MORTGAGE',
    HOA_FEES = 'HOA_FEES',
    MARKETING = 'MARKETING',
    FURNISHING = 'FURNISHING',
    REPAIRS = 'REPAIRS',
    PROPERTY_MANAGEMENT = 'PROPERTY_MANAGEMENT',
    PERMITS_LICENSES = 'PERMITS_LICENSES',
    LEGAL_PROFESSIONAL = 'LEGAL_PROFESSIONAL',
    PLATFORM_FEES = 'PLATFORM_FEES',
    OTHER = 'OTHER'
  }
  
  export enum ExpenseFrequency {
    ONE_TIME = 'ONE_TIME',
    DAILY = 'DAILY',
    WEEKLY = 'WEEKLY',
    BI_WEEKLY = 'BI_WEEKLY',
    MONTHLY = 'MONTHLY',
    QUARTERLY = 'QUARTERLY',
    SEMI_ANNUAL = 'SEMI_ANNUAL',
    ANNUAL = 'ANNUAL'
  }
  
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
  
  export enum ExpenseStatus {
    PENDING = 'PENDING',
    PAID = 'PAID',
    OVERDUE = 'OVERDUE',
    CANCELLED = 'CANCELLED',
    DISPUTED = 'DISPUTED',
    REFUNDED = 'REFUNDED'
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
  
  export interface Receipt {
    id?: number;
    fileUrl: string;
    fileName: string;
    fileType: string;
    uploadDate: Date;
    thumbnailUrl?: string;
  }
  
  export interface TaxDetails {
    taxable: boolean;
    taxCategory?: string;
    taxAmount?: number;
    deductible?: boolean;
    deductionCategory?: string;
  }
  
  export interface Expense {
    id?: number;
    propertyId: number;
    bookingId?: number; // If expense is related to a specific booking
  
    // Basic Information
    category: ExpenseCategory;
    subcategory?: string;
    description: string;
    amount: number;
    currency: string;
  
    // Dates
    date: Date;
    dueDate?: Date;
    paidDate?: Date;
    createdAt: Date;
    updatedAt: Date;
  
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
  
    // Metadata
    metadata?: {
      [key: string]: any;
    };
  }

  export interface ExpenseSummary {
    totalAmount: number;
    categoryBreakdown: {
      category: ExpenseCategory;
      amount: number;
      percentage: number;
    }[];
    monthlyAverage: number;
    unpaidAmount: number;
    overdueAmount: number;
  }
  
  export const EXPENSE_CATEGORY_PROPERTIES = {
    [ExpenseCategory.CLEANING]: {
      label: 'Cleaning',
      icon: 'cleaning_services',
      color: 'blue',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-800'
    },
    [ExpenseCategory.MAINTENANCE]: {
      label: 'Maintenance',
      icon: 'build',
      color: 'orange',
      bgColor: 'bg-orange-100',
      textColor: 'text-orange-800'
    },
    [ExpenseCategory.UTILITIES]: {
      label: 'Utilities',
      icon: 'electric_bolt',
      color: 'yellow',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-800'
    },
    [ExpenseCategory.SUPPLIES]: {
      label: 'Supplies',
      icon: 'shopping_cart',
      color: 'green',
      bgColor: 'bg-green-100',
      textColor: 'text-green-800'
    },
    [ExpenseCategory.INSURANCE]: {
      label: 'Insurance',
      icon: 'security',
      color: 'purple',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-800'
    },
    [ExpenseCategory.TAXES]: {
      label: 'Taxes',
      icon: 'description',
      color: 'red',
      bgColor: 'bg-red-100',
      textColor: 'text-red-800'
    },
    // Add more categories as needed
  };
  
  export const PAYMENT_METHOD_PROPERTIES = {
    [PaymentMethod.CREDIT_CARD]: {
      label: 'Credit Card',
      icon: 'credit_card',
      color: 'blue'
    },
    [PaymentMethod.BANK_TRANSFER]: {
      label: 'Bank Transfer',
      icon: 'account_balance',
      color: 'green'
    },
    [PaymentMethod.PAYPAL]: {
      label: 'PayPal',
      icon: 'payment',
      color: 'blue'
    },
    // Add more payment methods as needed
  };
  
  export const EXPENSE_FREQUENCY_PROPERTIES = {
    [ExpenseFrequency.ONE_TIME]: {
      label: 'One Time',
      daysInterval: 0
    },
    [ExpenseFrequency.DAILY]: {
      label: 'Daily',
      daysInterval: 1
    },
    [ExpenseFrequency.WEEKLY]: {
      label: 'Weekly',
      daysInterval: 7
    },
    [ExpenseFrequency.BI_WEEKLY]: {
      label: 'Bi-Weekly',
      daysInterval: 14
    },
    [ExpenseFrequency.MONTHLY]: {
      label: 'Monthly',
      daysInterval: 30
    },
    [ExpenseFrequency.QUARTERLY]: {
      label: 'Quarterly',
      daysInterval: 90
    },
    [ExpenseFrequency.SEMI_ANNUAL]: {
      label: 'Semi-Annual',
      daysInterval: 180
    },
    [ExpenseFrequency.ANNUAL]: {
      label: 'Annual',
      daysInterval: 365
    }
  };