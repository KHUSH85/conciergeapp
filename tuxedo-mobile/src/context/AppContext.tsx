import React, { createContext, useContext, useState, Dispatch, SetStateAction, useCallback } from 'react';
import { User, Ride, Commission, OpenRideRequest } from '../types';

interface AppContextType {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  rides: Ride[];
  setRides: Dispatch<SetStateAction<Ride[]>>;
  activeRide: Ride | null;
  setActiveRide: Dispatch<SetStateAction<Ride | null>>;
  commissions: Commission[];
  setCommissions: Dispatch<SetStateAction<Commission[]>>;
  openRideRequests: OpenRideRequest[];
  addOpenRideRequest: (input: {
    guestLabel: string;
    pickup: string;
    serviceType: 'transfer' | 'hourly';
    status?: OpenRideRequest['status'];
    scheduledFor?: string;
    hourlyHours?: number;
    premiumAddOns?: string[];
  }) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

function newOpenRideId() {
  return `ride_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [rides, setRides] = useState<Ride[]>([]);
  const [activeRide, setActiveRide] = useState<Ride | null>(null);
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [openRideRequests, setOpenRideRequests] = useState<OpenRideRequest[]>([]);

  const addOpenRideRequest = useCallback(
    (input: {
      guestLabel: string;
      pickup: string;
      serviceType: 'transfer' | 'hourly';
      status?: OpenRideRequest['status'];
      scheduledFor?: string;
      hourlyHours?: number;
      premiumAddOns?: string[];
    }) => {
      const row: OpenRideRequest = {
        id: newOpenRideId(),
        guestLabel: input.guestLabel,
        pickup: input.pickup,
        serviceType: input.serviceType,
        status: input.status ?? 'awaiting_guest',
        createdAt: new Date().toISOString(),
        scheduledFor: input.scheduledFor,
        hourlyHours: input.hourlyHours,
        premiumAddOns: input.premiumAddOns,
      };
      setOpenRideRequests((prev) => [row, ...prev]);
    },
    []
  );

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        rides,
        setRides,
        activeRide,
        setActiveRide,
        commissions,
        setCommissions,
        openRideRequests,
        addOpenRideRequest,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
