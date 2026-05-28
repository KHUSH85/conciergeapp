import { NavigatorScreenParams } from '@react-navigation/native';

// ─── Auth ────────────────────────────────────────────────────────────────────
export type AuthStackParamList = {
  Login: undefined;
  FirstTimeSetup: { role: 'concierge' | 'manager'; pendingUser?: any };
};

// ─── Home (booking flow) ─────────────────────────────────────────────────────
export type HomeStackParamList = {
  ConciergeHome: undefined;
  GuestDetails: { bookingMode: 'instant' | 'scheduled'; pickupLocation: string };
  ScheduleBooking: undefined;
  SmsPreviewLab: undefined;
  WaitingForPayment: {
    guestPhone?: string;
    guestEmail?: string;
    bookingMode?: string;
    pickupLocation?: string;
    passengerLink?: string;
    scheduledDate?: string;
    scheduledTime?: string;
    serviceType?: 'transfer' | 'hourly';
    hourlyHours?: number;
    premiumAddOns?: string[];
  };
  TrackRide: undefined;
};

// ─── Rides ───────────────────────────────────────────────────────────────────
export type RidesStackParamList = {
  OpenRidesList: undefined;
  ActiveRide:
    | {
        driver?: any;
        paymentType?: string;
        estimatedFare?: number;
        openRideId?: string;
      }
    | undefined;
  RideHistory: undefined;
  RideCompletion: undefined;
};

// ─── Wallet ──────────────────────────────────────────────────────────────────
export type WalletStackParamList = {
  CommissionWallet: undefined;
  Membership: undefined;
  MembershipPayment: undefined;
};

// ─── Profile ─────────────────────────────────────────────────────────────────
export type ProfileStackParamList = {
  Profile: undefined;
};

// ─── Main Tabs ───────────────────────────────────────────────────────────────
export type MainTabsParamList = {
  Home: NavigatorScreenParams<HomeStackParamList>;
  Rides: NavigatorScreenParams<RidesStackParamList>;
  Wallet: NavigatorScreenParams<WalletStackParamList>;
  ProfileTab: NavigatorScreenParams<ProfileStackParamList>;
};

// ─── Root ────────────────────────────────────────────────────────────────────
export type RootParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabsParamList>;
};
