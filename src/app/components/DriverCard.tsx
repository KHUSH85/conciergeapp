// Driver Card Components for TUXEDO CONCIERGE
import { motion } from 'motion/react';
import {
  Star,
  MapPin,
  Car,
  Wifi,
  Battery,
  Baby,
  Briefcase,
  Shield,
  CheckCircle2,
  Music,
  Languages,
  Award,
} from 'lucide-react';

export interface Driver {
  id: string;
  name: string;
  photo: string;
  rating: number;
  experience: number;
  languages: string[];
  vehicle: {
    brand: string;
    model: string;
    year: number;
    color: string;
    interior: string;
    plate: string;
    photo: string;
  };
  amenities: {
    wifi: boolean;
    water: boolean;
    charger: boolean;
    childSeat: boolean;
    luggage: number;
    wheelchair: boolean;
    music: boolean;
    silentMode: boolean;
  };
  eta: number;
  distance: number;
  status: 'online' | 'busy' | 'reserved';
  acceptanceRate: number;
  onTimeRate: number;
  verified: boolean;
  backgroundCheck: boolean;
  hotelPreferred: boolean;
  vipOnly: boolean;
  chauffeurId: string;
}

interface DriverCardProps {
  driver: Driver;
  onSelect?: () => void;
  onViewProfile?: () => void;
  compact?: boolean;
}

export const DriverCard = ({ driver, onSelect, onViewProfile, compact = false }: DriverCardProps) => {
  const amenityIcons = [
    { key: 'wifi', icon: Wifi, active: driver.amenities.wifi },
    { key: 'charger', icon: Battery, active: driver.amenities.charger },
    { key: 'childSeat', icon: Baby, active: driver.amenities.childSeat },
    { key: 'luggage', icon: Briefcase, active: driver.amenities.luggage > 0 },
    { key: 'music', icon: Music, active: driver.amenities.music },
  ];

  if (compact) {
    return (
      <motion.div
        className="p-4 bg-black/60 rounded-xl border-2 border-[#D4AF37]/20 hover:border-[#D4AF37]/40 transition-all"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex gap-4">
          {/* Driver Photo */}
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-[#D4AF37]/20 border-2 border-[#D4AF37]/30 overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-[#D4AF37]/30 to-black/50 flex items-center justify-center">
                <span className="text-2xl text-[#D4AF37] font-black">{driver.name.charAt(0)}</span>
              </div>
            </div>
            {driver.verified && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#D4AF37] rounded-full flex items-center justify-center border-2 border-black">
                <CheckCircle2 className="w-4 h-4 text-black" />
              </div>
            )}
          </div>

          {/* Driver Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-base font-bold text-white truncate">{driver.name}</h3>
              {driver.hotelPreferred && (
                <Award className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
              )}
            </div>
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-4 h-4 text-[#D4AF37] fill-[#D4AF37]" />
              <span className="text-sm text-[#D4AF37] font-bold">{driver.rating.toFixed(1)}</span>
              <span className="text-xs text-gray-500 font-medium">• {driver.experience} yrs</span>
            </div>
            <p className="text-sm text-gray-400 font-medium truncate">
              {driver.vehicle.brand} {driver.vehicle.model}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <MapPin className="w-3 h-3 text-[#D4AF37]" />
              <span className="text-xs text-gray-500 font-medium">{driver.distance} mi • {driver.eta} min</span>
            </div>
          </div>

          {/* Quick Amenities */}
          <div className="flex flex-col gap-1">
            {amenityIcons.filter(a => a.active).slice(0, 3).map(({ key, icon: Icon }) => (
              <Icon key={key} className="w-4 h-4 text-[#D4AF37]" />
            ))}
          </div>
        </div>

        {/* Actions */}
        {(onSelect || onViewProfile) && (
          <div className="flex gap-2 mt-4">
            {onViewProfile && (
              <motion.button
                onClick={onViewProfile}
                className="flex-1 py-2 px-4 rounded-lg bg-black/60 border border-[#D4AF37]/30 text-[#D4AF37] text-sm font-bold hover:bg-black/80 hover:border-[#D4AF37]/50 transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                View Profile
              </motion.button>
            )}
            {onSelect && (
              <motion.button
                onClick={onSelect}
                className="flex-1 py-2 px-4 rounded-lg bg-[#D4AF37] text-black text-sm font-bold hover:bg-[#B8962A] transition-all shadow-lg shadow-[#D4AF37]/30"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Assign Driver
              </motion.button>
            )}
          </div>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      className="p-6 bg-black/60 rounded-xl border-2 border-[#D4AF37]/20 hover:border-[#D4AF37]/40 transition-all"
      whileHover={{ scale: 1.01 }}
    >
      <div className="flex gap-4 mb-4">
        {/* Driver Photo */}
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-[#D4AF37]/20 border-2 border-[#D4AF37]/30 overflow-hidden">
            <div className="w-full h-full bg-gradient-to-br from-[#D4AF37]/30 to-black/50 flex items-center justify-center">
              <span className="text-3xl text-[#D4AF37] font-black">{driver.name.charAt(0)}</span>
            </div>
          </div>
          {driver.verified && (
            <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#D4AF37] rounded-full flex items-center justify-center border-2 border-black">
              <CheckCircle2 className="w-5 h-5 text-black" />
            </div>
          )}
        </div>

        {/* Driver Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-xl font-bold text-white">{driver.name}</h3>
            {driver.hotelPreferred && (
              <Award className="w-5 h-5 text-[#D4AF37]" />
            )}
          </div>
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-5 h-5 text-[#D4AF37] fill-[#D4AF37]" />
            <span className="text-base text-[#D4AF37] font-bold">{driver.rating.toFixed(1)}</span>
            <span className="text-sm text-gray-500 font-medium">• {driver.experience} years exp</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400 font-medium">
            <Languages className="w-4 h-4 text-[#D4AF37]" />
            <span>{driver.languages.join(', ')}</span>
          </div>
        </div>
      </div>

      {/* Vehicle Info */}
      <div className="mb-4 p-4 bg-black/40 rounded-lg border border-[#D4AF37]/20">
        <div className="flex items-center gap-3 mb-2">
          <Car className="w-5 h-5 text-[#D4AF37]" />
          <div>
            <p className="text-base text-white font-bold">
              {driver.vehicle.brand} {driver.vehicle.model}
            </p>
            <p className="text-sm text-gray-400 font-medium">
              {driver.vehicle.year} • {driver.vehicle.color} • {driver.vehicle.interior} interior
            </p>
          </div>
        </div>
      </div>

      {/* Amenities */}
      <div className="flex flex-wrap gap-2 mb-4">
        {amenityIcons.filter(a => a.active).map(({ key, icon: Icon }) => (
          <div
            key={key}
            className="flex items-center gap-2 px-3 py-1.5 bg-[#D4AF37]/10 rounded-lg border border-[#D4AF37]/30"
          >
            <Icon className="w-4 h-4 text-[#D4AF37]" />
          </div>
        ))}
      </div>

      {/* ETA & Distance */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[#D4AF37]" />
          <span className="text-sm text-gray-400 font-medium">{driver.distance} miles away</span>
        </div>
        <div className="px-3 py-1 bg-[#D4AF37]/20 rounded-lg border border-[#D4AF37]/40">
          <span className="text-sm text-[#D4AF37] font-bold">{driver.eta} min ETA</span>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="p-3 bg-black/40 rounded-lg border border-[#D4AF37]/20 text-center">
          <p className="text-xs text-gray-500 font-medium mb-1">Acceptance</p>
          <p className="text-base text-[#D4AF37] font-bold">{driver.acceptanceRate}%</p>
        </div>
        <div className="p-3 bg-black/40 rounded-lg border border-[#D4AF37]/20 text-center">
          <p className="text-xs text-gray-500 font-medium mb-1">On-Time</p>
          <p className="text-base text-[#D4AF37] font-bold">{driver.onTimeRate}%</p>
        </div>
      </div>

      {/* Actions */}
      {(onSelect || onViewProfile) && (
        <div className="flex gap-3">
          {onViewProfile && (
            <motion.button
              onClick={onViewProfile}
              className="flex-1 py-3 px-4 rounded-lg bg-black/60 border-2 border-[#D4AF37]/30 text-[#D4AF37] text-base font-bold hover:bg-black/80 hover:border-[#D4AF37]/50 transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              View Profile
            </motion.button>
          )}
          {onSelect && (
            <motion.button
              onClick={onSelect}
              className="flex-1 py-3 px-4 rounded-lg bg-[#D4AF37] text-black text-base font-bold hover:bg-[#B8962A] transition-all shadow-lg shadow-[#D4AF37]/40"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Assign Driver
            </motion.button>
          )}
        </div>
      )}
    </motion.div>
  );
};

// Swipe Card Component
interface SwipeCardProps {
  driver: Driver;
  onSwipeRight: () => void;
  onSwipeLeft: () => void;
  onSwipeUp: () => void;
}

export const DriverSwipeCard = ({ driver, onSwipeRight, onSwipeLeft, onSwipeUp }: SwipeCardProps) => {
  const amenityIcons = [
    { key: 'wifi', icon: Wifi, label: 'WiFi', active: driver.amenities.wifi },
    { key: 'charger', icon: Battery, label: 'Charger', active: driver.amenities.charger },
    { key: 'childSeat', icon: Baby, label: 'Child Seat', active: driver.amenities.childSeat },
    { key: 'music', icon: Music, label: 'Premium Audio', active: driver.amenities.music },
  ];

  return (
    <motion.div
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.7}
      onDragEnd={(e, { offset, velocity }) => {
        const swipe = Math.abs(offset.x) * velocity.x;
        
        if (swipe > 20000) {
          onSwipeRight();
        } else if (swipe < -20000) {
          onSwipeLeft();
        } else if (offset.y < -100 && velocity.y < -500) {
          onSwipeUp();
        }
      }}
      className="absolute inset-4 bg-black/80 rounded-3xl border-2 border-[#D4AF37]/40 overflow-hidden cursor-grab active:cursor-grabbing backdrop-blur-xl"
      whileHover={{ scale: 1.02 }}
      whileTap={{ cursor: 'grabbing' }}
    >
      {/* Driver Photo Background */}
      <div className="relative h-64 bg-gradient-to-b from-[#D4AF37]/20 via-black/60 to-black">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-32 h-32 rounded-full bg-[#D4AF37]/30 border-4 border-[#D4AF37]/50 flex items-center justify-center">
            <span className="text-6xl text-[#D4AF37] font-black">{driver.name.charAt(0)}</span>
          </div>
        </div>
        
        {/* Badges */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          {driver.verified && (
            <div className="p-2 bg-[#D4AF37] rounded-lg">
              <Shield className="w-5 h-5 text-black" />
            </div>
          )}
          {driver.hotelPreferred && (
            <div className="p-2 bg-[#D4AF37] rounded-lg">
              <Award className="w-5 h-5 text-black" />
            </div>
          )}
        </div>

        {/* Status */}
        <div className="absolute top-4 left-4">
          <div className={`px-3 py-1 rounded-full text-xs font-bold ${
            driver.status === 'online' 
              ? 'bg-green-500/20 text-green-400 border border-green-500/40' 
              : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40'
          }`}>
            {driver.status.toUpperCase()}
          </div>
        </div>
      </div>

      {/* Driver Info */}
      <div className="p-6 space-y-4">
        {/* Name & Rating */}
        <div>
          <h2 className="text-3xl font-black text-white mb-2">{driver.name}</h2>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Star className="w-5 h-5 text-[#D4AF37] fill-[#D4AF37]" />
              <span className="text-xl text-[#D4AF37] font-bold">{driver.rating.toFixed(1)}</span>
            </div>
            <span className="text-base text-gray-400 font-medium">• {driver.experience} years</span>
          </div>
        </div>

        {/* Vehicle */}
        <div className="p-4 bg-black/60 rounded-xl border border-[#D4AF37]/30">
          <div className="flex items-center gap-3">
            <Car className="w-6 h-6 text-[#D4AF37]" />
            <div>
              <p className="text-lg font-bold text-white">
                {driver.vehicle.brand} {driver.vehicle.model}
              </p>
              <p className="text-sm text-gray-400 font-medium">
                {driver.vehicle.color} • {driver.vehicle.year}
              </p>
            </div>
          </div>
        </div>

        {/* Amenities */}
        <div className="grid grid-cols-4 gap-2">
          {amenityIcons.filter(a => a.active).map(({ key, icon: Icon, label }) => (
            <div key={key} className="flex flex-col items-center p-2 bg-[#D4AF37]/10 rounded-lg border border-[#D4AF37]/30">
              <Icon className="w-5 h-5 text-[#D4AF37] mb-1" />
              <span className="text-xs text-gray-400 font-medium text-center">{label}</span>
            </div>
          ))}
        </div>

        {/* ETA */}
        <div className="flex items-center justify-between p-4 bg-[#D4AF37]/10 rounded-xl border border-[#D4AF37]/40">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#D4AF37]" />
            <span className="text-base text-gray-300 font-medium">{driver.distance} miles</span>
          </div>
          <span className="text-lg text-[#D4AF37] font-black">{driver.eta} min</span>
        </div>

        {/* Swipe Instructions */}
        <div className="text-center pt-2">
          <p className="text-sm text-gray-500 font-medium">
            ← Swipe to Skip • Swipe to Assign → • ↑ View Profile
          </p>
        </div>
      </div>
    </motion.div>
  );
};