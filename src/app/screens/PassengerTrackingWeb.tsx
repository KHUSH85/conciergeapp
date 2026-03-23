import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlassCard, GoldButton } from '../components/GlassCard';
import { 
  MapPin, Clock, Calendar, Car, Navigation, 
  CreditCard, Apple, DollarSign, CheckCircle2, Gift, UserCheck, Lock, Sparkles, 
  User, Crown, Wallet, ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';

export const PassengerTrackingWeb = () => {
  const navigate = useNavigate();
  const { user } = useApp();
  
  const [step, setStep] = useState<'config' | 'schedule' | 'payment' | 'tracking'>('config');
  const [bookingMode, setBookingMode] = useState<'instant' | 'scheduled'>('instant');
  const [vehicleType, setVehicleType] = useState('stretch-limo');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [showPromo, setShowPromo] = useState(false);

  // Requirement 4.3 & 6.3: Detect Membership Status
  const isMember = user?.isMember || false;
  const pickupLocation = user?.hotelName || "The Grand Majestic Hotel";
  const estimatedFare = "$48.50";

  // Requirement 6.5: Driver last names hidden per privacy rules
  const assignedDriver = {
    name: "Michael S.", 
    rating: "4.9",
    vehicle: "Black S-Class",
    amenities: ["WiFi", "Refreshments", "Leather Interior"]
  };

  const handleRequestChauffeur = () => {
    if (bookingMode === 'scheduled') {
      setStep('schedule');
    } else {
      setStep('payment');
    }
  };

  const handlePaymentSelection = () => {
    setStep('tracking');
    setTimeout(() => setShowPromo(true), 1000);
  };

  return (
    <div className="min-h-screen bg-black p-4 font-sans text-white flex flex-col">
      <div className="max-w-md mx-auto w-full space-y-6 pt-8 flex-grow">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black tracking-tight mb-2 uppercase italic">Tuxedo Concierge</h1>
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/30 text-[#D4AF37] text-sm font-bold">
            <Navigation className="w-4 h-4 animate-pulse" />
            {step === 'tracking' ? 'CHAUFFEUR EN ROUTE' : 'RIDE CONFIGURATION'}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* STEP 1: CONFIGURATION */}
          {step === 'config' && (
            <motion.div key="config" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <GlassCard className="p-6 border-[#D4AF37]/20">
                <h2 className="text-xl font-bold mb-4 uppercase italic">Finalize Your Journey</h2>
                <div className="space-y-6">
                  <div className="p-4 bg-[#D4AF37]/10 rounded-xl border-2 border-[#D4AF37]/40">
                    <p className="text-[10px] text-[#D4AF37] uppercase font-black mb-1">Pickup Location</p>
                    <p className="text-base text-white font-bold">{pickupLocation}</p>
                    <p className="text-[10px] text-gray-500 mt-1 uppercase">Set by Concierge</p>
                  </div>
                  
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D4AF37] w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Enter Drop-off Location"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      className="w-full bg-black/50 border-2 border-[#D4AF37]/30 rounded-xl py-4 pl-12 pr-4 focus:border-[#D4AF37] outline-none font-bold text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => setBookingMode('instant')} className={`py-4 rounded-xl border-2 font-black uppercase text-xs transition-all ${bookingMode === 'instant' ? 'border-[#D4AF37] bg-[#D4AF37]/10' : 'border-white/10 text-gray-500'}`}>
                      <Clock className="w-4 h-4 mx-auto mb-1" /> Instant
                    </button>
                    <button onClick={() => setBookingMode('scheduled')} className={`py-4 rounded-xl border-2 font-black uppercase text-xs transition-all ${bookingMode === 'scheduled' ? 'border-[#D4AF37] bg-[#D4AF37]/10' : 'border-white/10 text-gray-500'}`}>
                      <Calendar className="w-4 h-4 mx-auto mb-1" /> Schedule
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {['stretch-limo', 'sedan-limo'].map((v) => (
                      <button key={v} onClick={() => setVehicleType(v)} className={`py-4 rounded-xl border-2 font-black uppercase text-[10px] transition-all ${vehicleType === v ? 'border-[#D4AF37] bg-[#D4AF37]/10' : 'border-white/10 text-gray-500'}`}>
                        <Car className="w-4 h-4 mx-auto mb-1" /> {v.replace('-', ' ')}
                      </button>
                    ))}
                  </div>

                  <GoldButton onClick={handleRequestChauffeur} className="w-full py-5 text-xl uppercase font-black" disabled={!destination}>
                    Request Chauffeur
                  </GoldButton>
                </div>
              </GlassCard>
            </motion.div>
          )}

          {/* STEP 2: SCHEDULING (GATED) */}
          {step === 'schedule' && (
            <motion.div key="schedule" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <GlassCard className="p-6">
                <h2 className="text-xl font-bold mb-4 uppercase italic">Schedule Details</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <input type="date" className="bg-black border-2 border-[#D4AF37]/20 p-4 rounded-xl text-white outline-none" onChange={(e) => setDate(e.target.value)} />
                    <input type="time" className="bg-black border-2 border-[#D4AF37]/20 p-4 rounded-xl text-white outline-none" onChange={(e) => setTime(e.target.value)} />
                  </div>
                  
                  <GoldButton 
                    onClick={() => isMember ? navigate('/driver-list') : navigate('/membership')} 
                    className="w-full py-4 uppercase font-black border-dashed" 
                    icon={isMember ? <UserCheck className="w-5 h-5" /> : <Lock className="w-4 h-4" />}
                  >
                    {isMember ? "Select Manual Driver" : "Unlock Driver Selection"}
                  </GoldButton>
                  
                  {!isMember && (
                    <p className="text-[10px] text-gray-500 text-center uppercase font-bold tracking-widest">
                      Manual selection is a <span className="text-[#D4AF37]">Gold Member</span> exclusive
                    </p>
                  )}
                </div>
              </GlassCard>
            </motion.div>
          )}

          {/* STEP 3: PAYMENT */}
          {step === 'payment' && (
            <motion.div key="payment" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
              <GlassCard className="p-6">
                <div className="text-center mb-6">
                  <p className="text-gray-400 text-xs font-black uppercase tracking-widest">Total Fare</p>
                  <p className="text-6xl font-black text-[#D4AF37]">{estimatedFare}</p>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {['Apple Pay', 'Credit Card', 'Cash Payment'].map((method, idx) => (
                    <button key={method} onClick={handlePaymentSelection} className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-xl hover:border-[#D4AF37] transition-all">
                      {idx === 0 ? <Apple className="text-[#D4AF37]" /> : idx === 1 ? <CreditCard className="text-[#D4AF37]" /> : <DollarSign className="text-[#D4AF37]" />}
                      <span className="font-bold text-base">{method}</span>
                    </button>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          )}

          {/* STEP 4: TRACKING (GATED AMENITIES) */}
          {step === 'tracking' && (
            <motion.div key="tracking" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <GlassCard className="p-8 text-center border-green-500/20">
                <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                
                <div className="flex justify-center items-center gap-4 mb-6">
                  <div className="w-20 h-20 rounded-full border-2 border-[#D4AF37] overflow-hidden bg-gray-900">
                    <User className="w-12 h-12 m-auto mt-4 text-gray-700" />
                  </div>
                  <div className="w-28 h-16 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center">
                    <Car className="text-[#D4AF37] opacity-40 w-10 h-10" />
                  </div>
                </div>

                <h2 className="text-2xl font-black mb-1 uppercase italic">{assignedDriver.name}</h2>
                <p className="text-gray-400 font-medium mb-6 uppercase text-xs tracking-widest">
                   is arriving in 4 mins in a {assignedDriver.vehicle}
                </p>

                <div className="mb-6 p-4 bg-black/40 rounded-xl border border-white/5">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                    <span className="text-[10px] font-black uppercase text-gray-500 tracking-tighter">Premium Amenities</span>
                  </div>
                  
                  {isMember ? (
                    <div className="flex flex-wrap justify-center gap-2">
                      {assignedDriver.amenities.map(a => (
                        <span key={a} className="text-[10px] font-bold bg-[#D4AF37]/10 text-[#D4AF37] px-2 py-1 rounded border border-[#D4AF37]/20">{a}</span>
                      ))}
                    </div>
                  ) : (
                    <button onClick={() => navigate('/membership')} className="flex items-center justify-center gap-2 w-full py-2 bg-white/5 rounded-lg border border-dashed border-white/20 group hover:border-[#D4AF37]/40 transition-colors">
                      <Lock className="w-3 h-3 text-gray-600 group-hover:text-[#D4AF37]" />
                      <span className="text-[9px] font-black text-gray-600 uppercase group-hover:text-[#D4AF37]">Unlock with Membership</span>
                    </button>
                  )}
                </div>
                
                {showPromo && (
                  <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mt-4 p-4 bg-[#D4AF37]/10 border-2 border-dashed border-[#D4AF37]/40 rounded-xl">
                    <Gift className="w-5 h-5 inline mr-2 text-[#D4AF37]" />
                    <span className="text-[#D4AF37] font-black uppercase text-xs">20% Off Your Next Journey!</span>
                  </motion.div>
                )}
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* FOOTER: MEMBERSHIP GATE & CREDIT DISPLAY */}
      <div className="pb-6 mt-4">
        <div 
          onClick={() => !isMember && navigate('/membership')}
          className="cursor-pointer"
        >
          <GlassCard 
            className={`p-4 flex items-center justify-between transition-all border-2 ${
              isMember ? 'border-[#D4AF37]/40 bg-[#D4AF37]/5' : 'border-white/10 hover:border-[#D4AF37]/30'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${isMember ? 'bg-[#D4AF37]' : 'bg-white/5'}`}>
                <Crown className={`w-5 h-5 ${isMember ? 'text-black' : 'text-gray-500'}`} />
              </div>
              <div>
                <p className="text-[10px] font-black text-white uppercase italic tracking-tight">
                  {isMember ? 'Tuxedo Gold Member' : 'Tuxedo Basic Status'}
                </p>
                <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">
                  {isMember ? (
                    <span className="flex items-center gap-1">
                      <Wallet className="w-2.5 h-2.5" /> ${user?.rideCredit?.toFixed(2)} Ride Credit
                    </span>
                  ) : 'Join for $100 & Get $100 Credit'}
                </p>
              </div>
            </div>
            {!isMember ? (
              <div className="bg-[#D4AF37] text-black p-2 rounded-lg">
                <ArrowRight className="w-4 h-4" />
              </div>
            ) : (
              <div className="flex items-center gap-1 text-[8px] font-black text-[#D4AF37] uppercase">
                <CheckCircle2 className="w-3 h-3" /> Active
              </div>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  );
};