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
  WaitingForPayment: undefined;
  DriverMatching: undefined;
  DriverAssignmentMode: undefined;
  DriverList: undefined;
  DriverProfile: { driverId: string };
  DriverSwipe: undefined;
  DriverConfirmation: undefined;
  DriverETA: undefined;
  TrackRide: undefined;
};

// ─── Rides ───────────────────────────────────────────────────────────────────
export type RidesStackParamList = {
  ActiveRide: undefined;
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
