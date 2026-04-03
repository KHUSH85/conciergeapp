import React, { createContext, useContext, useState, Dispatch, SetStateAction } from 'react';
import { User, Ride, Commission } from '../types';

interface AppContextType {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  rides: Ride[];
  setRides: Dispatch<SetStateAction<Ride[]>>;
  activeRide: Ride | null;
  setActiveRide: Dispatch<SetStateAction<Ride | null>>;
  commissions: Commission[];
  setCommissions: Dispatch<SetStateAction<Commission[]>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [rides, setRides] = useState<Ride[]>([]);
  const [activeRide, setActiveRide] = useState<Ride | null>(null);
  const [commissions, setCommissions] = useState<Commission[]>([]);

  return (
    <AppContext.Provider value={{ user, setUser, rides, setRides, activeRide, setActiveRide, commissions, setCommissions }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
