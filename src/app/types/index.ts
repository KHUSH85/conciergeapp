export type UserRole = 'concierge' | 'manager' | 'passenger';

export type RideStatus = 'creating' | 'matching' | 'assigned' | 'arriving' | 'onboard' | 'enroute' | 'completed' | 'cancelled';

export type VehicleType = 'sedan' | 'suv' | 'luxury' | 'van';

export type PaymentType = 'card' | 'cash';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  hotelId: string;
  hotelName: string;
  deviceBound: boolean;
  deviceName?: string;
  kycStatus: 'pending' | 'approved' | 'rejected';
  isMember: boolean; // Requirement 6.3: Unlocks driver selection
  rideCredit: number; // Requirement 6.2: $100 credit logic
}

export interface Driver {
  id: string;
  name: string; // Note: Rendering logic must truncate last name per 6.5
  phone: string;
  photo: string; // Chauffeur headshot
  vehicle: {
    brand: string;
    model: string;
    plate: string;
    year: string;
    interior: string;
    photo: string; // Requirement 5.2/5.3: Standardized vehicle photo
  };
  rating: number;
  experience: string;
  eta: number;
  distance: number;
  verified: boolean;
  hotelPreferred: boolean;
  amenities: {
    wifi: boolean;
    music: boolean;
    childSeat: boolean;
    refreshments: boolean;
  };
}

export interface Guest {
  phone?: string;
  email?: string;
  present: boolean;
}

export interface Ride {
  id: string;
  status: RideStatus;
  guestInfo: Guest;
  pickupLocation: string;
  destination?: string;
  vehicleType: VehicleType;
  paymentType: PaymentType;
  fare: number;
  commission: number;
  driver?: Driver;
  createdBy: string;
  createdAt: Date;
  completedAt?: Date;
  addOns?: string[];
  cashConfirmed?: boolean;
  rating?: number;
  tip?: number;
  isScheduled?: boolean; // Requirement 5.1: Logic gate for manual selection
  scheduledAt?: Date;
}

export interface Commission {
  date: string;
  rides: number;
  total: number;
}