export interface Property {
    id: number;
    name: string;
    address: string;
    description: string;
    imageUrl?: string;
    basePrice: number;
    maxGuests: number;
    bedrooms: number;
    bathrooms: number;
    active: boolean;
    strPermitNumber?: string;
    amenities?: string[];
    houseRules?: string;
    checkInInstructions?: string;
    createdAt: Date;
    updatedAt: Date;
  }
  