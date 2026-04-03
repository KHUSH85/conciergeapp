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
  isMember: boolean;
  rideCredit: number;
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  photo: string;
  vehicle: {
    brand: string;
    model: string;
    plate: string;
    year: string | number;
    interior: string;
    photo: string;
    color?: string;
  };
  rating: number;
  experience: string | number;
  eta: number;
  distance: number;
  verified: boolean;
  hotelPreferred: boolean;
  vipOnly?: boolean;
  backgroundCheck?: boolean;
  languages?: string[];
  status?: string;
  acceptanceRate?: number;
  onTimeRate?: number;
  chauffeurId?: string;
  amenities: {
    wifi: boolean;
    music: boolean;
    childSeat: boolean;
    refreshments?: boolean;
    water?: boolean;
    charger?: boolean;
    luggage?: number;
    wheelchair?: boolean;
    silentMode?: boolean;
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
  isScheduled?: boolean;
  scheduledAt?: Date;
}

export interface Commission {
  date: string;
  rides: number;
  total: number;
}
