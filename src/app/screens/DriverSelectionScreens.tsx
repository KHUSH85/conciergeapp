// Driver Selection Screens for TUXEDO CONCIERGE
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { GlassCard, GoldButton } from '../components/GlassCard';
import { DriverCard, DriverSwipeCard, Driver } from '../components/DriverCard';
import { mockDrivers } from '../data/mockDrivers';
import { useApp } from '../context/AppContext';
import {
  ArrowLeft,
  Zap,
  List,
  Heart,
  SlidersHorizontal,
  Star,
  MapPin,
  Car,
  Shield,
  Wifi,
  Music,
  Baby,
  Check,
  X,
  ChevronUp,
  Sparkles,
  User,
  Clock,
  Info,
  Lock,
  Wallet
} from 'lucide-react';

// SCREEN 1: Driver Assignment Mode Choice
export const DriverAssignmentModeScreen = () => {
  const navigate = useNavigate();

  const modes = [
    {
      id: 'auto',
      title: 'Auto Match',
      description: 'System selects best available driver',
      icon: Zap,
      color: 'from-green-500/20 to-green-600/10',
      border: 'border-green-500/40',
      path: '/driver-matching',
    },
    {
      id: 'manual',
      title: 'Manual Selection',
      description: 'Browse and choose from available drivers',
      icon: List,
      color: 'from-[#D4AF37]/20 to-[#B8962A]/10',
      border: 'border-[#D4AF37]/40',
      path: '/driver-list',
    },
    {
      id: 'swipe',
      title: 'Swipe Match',
      description: 'Luxury experience - swipe to find perfect match',
      icon: Heart,
      color: 'from-purple-500/20 to-pink-600/10',
      border: 'border-purple-500/40',
      path: '/driver-swipe',
    },
  ];

  return (
    <div className="min-h-screen p-4 bg-black">
      <div className="max-w-2xl mx-auto">
        <motion.button
          onClick={() => navigate(-1)}
          className="mb-6 text-base text-[#D4AF37] hover:text-[#B8962A] flex items-center gap-2 font-semibold"
          whileHover={{ x: -5 }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </motion.button>

        <GlassCard className="p-8">
          <motion.h2
            className="text-2xl mb-3 text-white font-bold text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Select Driver Assignment Mode
          </motion.h2>
          <motion.p
            className="text-base text-gray-400 font-medium text-center mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Choose how you'd like to assign a chauffeur
          </motion.p>

          <div className="space-y-4">
            {modes.map((mode, index) => {
              const Icon = mode.icon;
              return (
                <motion.button
                  key={mode.id}
                  onClick={() => navigate(mode.path)}
                  className={`w-full p-6 rounded-xl border-2 ${mode.border} bg-gradient-to-br ${mode.color} hover:scale-[1.02] transition-all`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-4 rounded-xl bg-black/40 border-2 ${mode.border}`}>
                      <Icon className="w-8 h-8 text-[#D4AF37]" />
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="text-xl font-bold text-white mb-1">{mode.title}</h3>
                      <p className="text-sm text-gray-400 font-medium">{mode.description}</p>
                    </div>
                    <ArrowLeft className="w-6 h-6 text-[#D4AF37] rotate-180" />
                  </div>
                </motion.button>
              );
            })}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

// SCREEN 2: Driver List View
export const DriverListScreen = () => {
  const navigate = useNavigate();
  const { user } = useApp();
  const isMember = user?.isMember || false;
  const [drivers] = useState<Driver[]>(mockDrivers);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    hotelPreferred: false,
    verified: true,
    minRating: 4.5,
    maxDistance: 5,
  });

  const filteredDrivers = drivers.filter(driver => {
    if (filters.hotelPreferred && !driver.hotelPreferred) return false;
    if (filters.verified && !driver.verified) return false;
    if (driver.rating < filters.minRating) return false;
    if (driver.distance > filters.maxDistance) return false;
    return true;
  });

  return (
    <div className="min-h-screen p-4 bg-black">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <motion.button
            onClick={() => navigate(-1)}
            className="text-base text-[#D4AF37] hover:text-[#B8962A] flex items-center gap-2 font-semibold"
            whileHover={{ x: -5 }}
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </motion.button>

          {isMember && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3 px-4 py-2 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30">
              <Wallet className="w-4 h-4 text-[#D4AF37]" />
              <span className="text-[10px] text-white font-black uppercase tracking-widest">Credit: ${user?.rideCredit?.toFixed(2)}</span>
            </motion.div>
          )}

          <motion.button
            onClick={() => isMember ? setShowFilters(!showFilters) : navigate('/membership')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-black/60 border-2 border-[#D4AF37]/30 hover:border-[#D4AF37]/50 text-[#D4AF37] font-bold transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isMember ? <SlidersHorizontal className="w-5 h-5" /> : <Lock className="w-4 h-4" />}
            {isMember ? 'Filters' : 'Unlock Filters'}
          </motion.button>
        </div>

        <GlassCard className="p-8 mb-4">
          <motion.h2 className="text-2xl mb-3 text-white font-bold uppercase italic tracking-tight">Available Chauffeurs</motion.h2>
          <p className="text-base text-gray-400 font-medium mb-6">
            {filteredDrivers.length} driver{filteredDrivers.length !== 1 ? 's' : ''} found for your schedule
          </p>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                className="mb-6 p-5 bg-black/60 rounded-xl border-2 border-[#D4AF37]/20 overflow-hidden"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <h3 className="text-base font-bold text-white mb-4">Search Filters</h3>
                <div className="space-y-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.hotelPreferred}
                      onChange={(e) => setFilters({ ...filters, hotelPreferred: e.target.checked })}
                      className="w-5 h-5 accent-[#D4AF37]"
                    />
                    <span className="text-sm text-white font-medium">Hotel Preferred Only</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.verified}
                      onChange={(e) => setFilters({ ...filters, verified: e.target.checked })}
                      className="w-5 h-5 accent-[#D4AF37]"
                    />
                    <span className="text-sm text-white font-medium">Verified Only</span>
                  </label>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-4">
            {filteredDrivers.map((driver, index) => (
              <motion.div key={driver.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
                <GlassCard className="p-5 border-white/5 relative overflow-hidden group">
                  <div className="flex items-center gap-5">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-16 h-16 rounded-full bg-gray-800 border-2 border-[#D4AF37]/30 flex items-center justify-center overflow-hidden">
                          <User className="text-gray-600 w-10 h-10" />
                        </div>
                        {driver.verified && <div className="absolute -bottom-1 -right-1 bg-[#D4AF37] rounded-full p-1 border-2 border-black"><Shield className="w-3 h-3 text-black" /></div>}
                      </div>
                      <div className="w-24 h-14 bg-white/5 rounded-xl flex items-center justify-center p-2 border border-white/10">
                        <Car className="text-[#D4AF37] w-8 h-8 opacity-40 group-hover:opacity-100" />
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg text-white font-bold">{driver.name.split(' ')[0]} {driver.name.split(' ')[1]?.[0]}.</h3>
                        <div className="flex items-center gap-1 text-[#D4AF37] font-bold text-sm"><Star className="w-4 h-4 fill-[#D4AF37]" /> {driver.rating}</div>
                      </div>
                      <p className="text-gray-400 text-sm font-medium">{driver.vehicle.brand} {driver.vehicle.model}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-[10px] text-gray-500 flex items-center gap-1 uppercase tracking-widest font-bold"><MapPin className="w-3 h-3" /> {driver.distance} miles</span>
                        <span className="text-[10px] text-[#D4AF37] flex items-center gap-1 uppercase tracking-widest font-bold"><Clock className="w-3 h-3" /> {driver.eta} mins</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 flex gap-3">
                    <button 
                      onClick={() => navigate('/driver-profile', { state: { driver } })}
                      className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-[10px] uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-white/10"
                    >
                      <Info className="w-4 h-4" /> View Profile
                    </button>
                    <GoldButton 
                      onClick={() => navigate('/driver-confirmation', { state: { driver } })}
                      className="flex-1 py-3 text-[10px] font-black uppercase tracking-widest"
                    >
                      Select Chauffeur
                    </GoldButton>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

// SCREEN 3: Driver Profile Detail
export const DriverProfileScreen = () => {
  const navigate = useNavigate();
  const { user } = useApp();
  const isMember = user?.isMember || false;
  const location = (window.history.state && window.history.state.usr) || {};
  const driver = location.driver || mockDrivers[0];

  return (
    <div className="min-h-screen p-4 bg-black">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <motion.button onClick={() => navigate(-1)} className="text-[#D4AF37] flex items-center gap-2 font-semibold"><ArrowLeft className="w-5 h-5" /> Back</motion.button>
          {isMember && (
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-[10px] font-black uppercase">
              <Wallet className="w-3.5 h-3.5" /> ${user?.rideCredit?.toFixed(2)} Credit
            </div>
          )}
        </div>

        <GlassCard className="p-8">
          <motion.div className="text-center mb-8" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
            <div className="relative inline-block mb-4">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#D4AF37]/20 to-black/50 border-4 border-[#D4AF37]/40 flex items-center justify-center overflow-hidden">
                <span className="text-6xl text-[#D4AF37] font-black">{driver.name.charAt(0)}</span>
              </div>
              {driver.verified && <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#D4AF37] rounded-full flex items-center justify-center border-4 border-black"><Shield className="w-6 h-6 text-black" /></div>}
            </div>
            <h1 className="text-3xl font-black text-white mb-2">{driver.name.split(' ')[0]} {driver.name.split(' ')[1]?.[0]}.</h1>
            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="text-center">
                <p className="text-2xl text-[#D4AF37] font-bold">{driver.rating}</p>
                <p className="text-[10px] text-gray-500 uppercase font-black tracking-tighter">Rating</p>
              </div>
              <div className="w-px h-8 bg-white/10"></div>
              <div className="text-center">
                <p className="text-2xl text-white font-bold">{driver.experience}</p>
                <p className="text-[10px] text-gray-500 uppercase font-black tracking-tighter">Years Exp</p>
              </div>
            </div>
          </motion.div>

          <div className="space-y-6">
            <div className="p-6 bg-black/40 rounded-2xl border-2 border-[#D4AF37]/20">
              <h3 className="text-xs font-black text-white mb-4 uppercase tracking-widest flex items-center gap-2"><Car className="w-4 h-4 text-[#D4AF37]" /> Vehicle Details</h3>
              <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                <div><p className="text-[10px] text-gray-500 uppercase font-black">Make/Model</p><p className="text-white font-bold text-sm">{driver.vehicle.brand} {driver.vehicle.model}</p></div>
                <div><p className="text-[10px] text-gray-500 uppercase font-black">Plate</p><p className="text-white font-bold text-sm">{driver.vehicle.plate}</p></div>
                <div><p className="text-[10px] text-gray-500 uppercase font-black">Year</p><p className="text-white font-bold text-sm">{driver.vehicle.year}</p></div>
                <div><p className="text-[10px] text-gray-500 uppercase font-black">Interior</p><p className="text-white font-bold text-sm">{driver.vehicle.interior}</p></div>
              </div>
            </div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              {isMember ? (
                <div className="p-6 bg-black/40 rounded-2xl border-2 border-[#D4AF37]/20">
                  <h3 className="text-xs font-black text-white mb-4 uppercase tracking-widest flex items-center gap-2"><Sparkles className="w-4 h-4 text-[#D4AF37]" /> Premium Amenities</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {driver.amenities.wifi && <div className="p-3 bg-[#D4AF37]/10 rounded-xl border border-[#D4AF37]/20 flex items-center gap-2 text-xs text-white font-bold"><Wifi className="w-3.5 h-3.5" /> WiFi</div>}
                    {driver.amenities.music && <div className="p-3 bg-[#D4AF37]/10 rounded-xl border border-[#D4AF37]/20 flex items-center gap-2 text-xs text-white font-bold"><Music className="w-3.5 h-3.5" /> Audio</div>}
                    {driver.amenities.childSeat && <div className="p-3 bg-[#D4AF37]/10 rounded-xl border border-[#D4AF37]/20 flex items-center gap-2 text-xs text-white font-bold"><Baby className="w-3.5 h-3.5" /> Child Seat</div>}
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center bg-[#D4AF37]/5 rounded-3xl border-2 border-dashed border-[#D4AF37]/30">
                  <Lock className="w-10 h-10 text-[#D4AF37] mx-auto mb-3" />
                  <p className="text-xs text-white font-black uppercase mb-1">Premium Amenities Locked</p>
                  <button onClick={() => navigate('/membership')} className="text-[10px] text-[#D4AF37] underline uppercase font-black">Join Membership to View</button>
                </div>
              )}
              <p className="text-gray-400 text-xs leading-relaxed italic">"Professional chauffeur providing a seamless luxury experience. Certified for executive protection and concierge-level service."</p>
              <GoldButton onClick={() => navigate('/driver-confirmation', { state: { driver } })} className="w-full py-5 text-lg uppercase font-black">Assign This Chauffeur</GoldButton>
            </motion.div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

// SCREEN 4: Swipe Match Mode
export const DriverSwipeScreen = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [drivers] = useState<Driver[]>(mockDrivers);

  const handleSwipeRight = () => {
    const driver = drivers[currentIndex];
    navigate('/driver-confirmation', { state: { driver } });
  };

  const handleSwipeLeft = () => {
    if (currentIndex < drivers.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      navigate('/driver-assignment-mode');
    }
  };

  const handleSwipeUp = () => {
    const driver = drivers[currentIndex];
    navigate('/driver-profile', { state: { driver } });
  };

  return (
    <div className="min-h-screen p-4 bg-black flex flex-col items-center justify-center overflow-hidden">
      <div className="w-full max-w-2xl relative">
        <motion.button onClick={() => navigate(-1)} className="absolute -top-12 left-0 text-[#D4AF37] flex items-center gap-2 font-bold z-50"><ArrowLeft className="w-5 h-5" /> Back</motion.button>
        
        {currentIndex < drivers.length ? (
          <div className="relative h-[650px] w-full mt-4">
             <AnimatePresence>
              <DriverSwipeCard
                key={drivers[currentIndex].id}
                driver={drivers[currentIndex]}
                onSwipeRight={handleSwipeRight}
                onSwipeLeft={handleSwipeLeft}
                onSwipeUp={handleSwipeUp}
              />
            </AnimatePresence>

            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-6 z-50">
              <motion.button onClick={handleSwipeLeft} whileTap={{ scale: 0.9 }} className="w-16 h-16 rounded-full bg-black border-2 border-red-500/40 flex items-center justify-center"><X className="w-8 h-8 text-red-500" /></motion.button>
              <motion.button onClick={handleSwipeUp} whileTap={{ scale: 0.9 }} className="w-16 h-16 rounded-full bg-black border-2 border-[#D4AF37]/40 flex items-center justify-center"><ChevronUp className="w-8 h-8 text-[#D4AF37]" /></motion.button>
              <motion.button onClick={handleSwipeRight} whileTap={{ scale: 0.9 }} className="w-16 h-16 rounded-full bg-[#D4AF37] flex items-center justify-center shadow-lg shadow-[#D4AF37]/20"><Check className="w-8 h-8 text-black" /></motion.button>
            </div>
          </div>
        ) : (
          <GlassCard className="p-12 text-center max-w-md mx-auto">
            <Car className="w-20 h-20 text-gray-700 mx-auto mb-6" />
            <h2 className="text-2xl font-black text-white mb-2">Queue Empty</h2>
            <p className="text-gray-500 mb-8">No more available chauffeurs in your area.</p>
            <GoldButton onClick={() => navigate('/driver-assignment-mode')} className="w-full">Back to Menu</GoldButton>
          </GlassCard>
        )}
      </div>
    </div>
  );
};