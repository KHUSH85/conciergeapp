// Driver Preferences and Confirmation Screens
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { GlassCard, GoldButton } from '../components/GlassCard';
import { Driver } from '../components/DriverCard';
import { mockDrivers } from '../data/mockDrivers';
import { useApp } from '../context/AppContext';
import {
  ArrowLeft,
  Sparkles,
  Volume2,
  VolumeX,
  Car,
  Wifi,
  Music,
  Baby,
  Languages,
  User,
  CheckCircle2,
  Star,
  MapPin,
  DollarSign,
  Shield,
  Award,
} from 'lucide-react';

// SCREEN 5: Guest Preference Matching
export const GuestPreferenceScreen = () => {
  const navigate = useNavigate();
  const [preferences, setPreferences] = useState({
    luxuryLevel: 'premium',
    silentRide: false,
    carBrand: '',
    wifi: false,
    music: false,
    childSeat: false,
    wheelchair: false,
    language: '',
  });

  const luxuryLevels = [
    { id: 'standard', label: 'Standard Luxury', desc: 'Premium sedans' },
    { id: 'premium', label: 'Premium', desc: 'S-Class, 7 Series' },
    { id: 'ultra', label: 'Ultra Luxury', desc: 'Rolls-Royce, Maybach' },
  ];

  const carBrands = ['Mercedes-Benz', 'BMW', 'Rolls-Royce', 'Cadillac', 'Lincoln'];
  const languages = ['English', 'Spanish', 'French', 'German', 'Italian', 'Mandarin'];

  const handleContinue = () => {
    navigate('/driver-list', { state: { preferences } });
  };

  return (
    <div className="min-h-screen p-4 bg-black">
      <div className="max-w-2xl mx-auto">
        <motion.button
          onClick={() => navigate(-1)}
          className="mb-6 text-base text-[#D4AF37] hover:text-[#B8962A] flex items-center gap-2 font-semibold"
          whileHover={{ x: -5 }}
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </motion.button>

        <GlassCard className="p-8">
          <motion.h2
            className="text-2xl mb-3 text-white font-bold"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Guest Preferences
          </motion.h2>
          <motion.p
            className="text-base text-gray-400 font-medium mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            Customize the ride experience for your guest
          </motion.p>

          <div className="space-y-8">
            {/* Luxury Level */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label className="block mb-4 text-base text-white font-bold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#D4AF37]" />
                Luxury Level
              </label>
              <div className="space-y-3">
                {luxuryLevels.map((level) => (
                  <motion.button
                    key={level.id}
                    onClick={() => setPreferences({ ...preferences, luxuryLevel: level.id })}
                    className={`w-full p-4 rounded-xl border-2 transition-all ${
                      preferences.luxuryLevel === level.id
                        ? 'border-[#D4AF37] bg-[#D4AF37]/10'
                        : 'border-[#D4AF37]/20 bg-black/40 hover:border-[#D4AF37]/40'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-left">
                        <p className="text-base font-bold text-white">{level.label}</p>
                        <p className="text-sm text-gray-400 font-medium">{level.desc}</p>
                      </div>
                      {preferences.luxuryLevel === level.id && (
                        <CheckCircle2 className="w-6 h-6 text-[#D4AF37]" />
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Ride Atmosphere */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label className="block mb-4 text-base text-white font-bold">Ride Atmosphere</label>
              <div className="grid grid-cols-2 gap-3">
                <motion.button
                  onClick={() => setPreferences({ ...preferences, silentRide: true })}
                  className={`p-5 rounded-xl border-2 transition-all ${
                    preferences.silentRide
                      ? 'border-[#D4AF37] bg-[#D4AF37]/10'
                      : 'border-[#D4AF37]/20 bg-black/40 hover:border-[#D4AF37]/40'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <VolumeX className="w-8 h-8 mx-auto mb-2 text-[#D4AF37]" />
                  <p className="text-sm font-bold text-white">Silent Ride</p>
                </motion.button>

                <motion.button
                  onClick={() => setPreferences({ ...preferences, silentRide: false })}
                  className={`p-5 rounded-xl border-2 transition-all ${
                    !preferences.silentRide
                      ? 'border-[#D4AF37] bg-[#D4AF37]/10'
                      : 'border-[#D4AF37]/20 bg-black/40 hover:border-[#D4AF37]/40'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Volume2 className="w-8 h-8 mx-auto mb-2 text-[#D4AF37]" />
                  <p className="text-sm font-bold text-white">Conversational</p>
                </motion.button>
              </div>
            </motion.div>

            {/* Preferred Car Brand */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label className="block mb-4 text-base text-white font-bold flex items-center gap-2">
                <Car className="w-5 h-5 text-[#D4AF37]" />
                Preferred Car Brand (Optional)
              </label>
              <select
                value={preferences.carBrand}
                onChange={(e) => setPreferences({ ...preferences, carBrand: e.target.value })}
                className="w-full p-4 rounded-xl bg-black/60 border-2 border-[#D4AF37]/30 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] text-white text-base font-medium"
              >
                <option value="">Any Brand</option>
                {carBrands.map((brand) => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
            </motion.div>

            {/* Required Amenities */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <label className="block mb-4 text-base text-white font-bold">Required Amenities</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { key: 'wifi', label: 'WiFi', icon: Wifi },
                  { key: 'music', label: 'Premium Audio', icon: Music },
                  { key: 'childSeat', label: 'Child Seat', icon: Baby },
                  { key: 'wheelchair', label: 'Wheelchair', icon: User },
                ].map((amenity) => {
                  const Icon = amenity.icon;
                  const isActive = preferences[amenity.key as keyof typeof preferences];
                  return (
                    <motion.button
                      key={amenity.key}
                      onClick={() => setPreferences({ ...preferences, [amenity.key]: !isActive })}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        isActive
                          ? 'border-[#D4AF37] bg-[#D4AF37]/10'
                          : 'border-[#D4AF37]/20 bg-black/40 hover:border-[#D4AF37]/40'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Icon className="w-6 h-6 mx-auto mb-2 text-[#D4AF37]" />
                      <p className="text-sm font-bold text-white">{amenity.label}</p>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>

            {/* Language Preference */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <label className="block mb-4 text-base text-white font-bold flex items-center gap-2">
                <Languages className="w-5 h-5 text-[#D4AF37]" />
                Preferred Language (Optional)
              </label>
              <select
                value={preferences.language}
                onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                className="w-full p-4 rounded-xl bg-black/60 border-2 border-[#D4AF37]/30 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] text-white text-base font-medium"
              >
                <option value="">Any Language</option>
                {languages.map((lang) => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </motion.div>
          </div>

          <motion.div
            className="mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <GoldButton onClick={handleContinue} className="w-full text-xl py-5">
              Find Matching Drivers
            </GoldButton>
          </motion.div>
        </GlassCard>
      </div>
    </div>
  );
};

// SCREEN 6: Driver Assignment Confirmation
export const DriverConfirmationScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useApp();
  
  // Requirement Logic: Check if we are in scheduling mode from navigation state
  const isScheduling = location.state?.bookingMode === 'scheduled';
  const isMember = user?.isMember;
  
  const driver: Driver = location.state?.driver || mockDrivers[0];

  const commission = 6.75;
  const estimatedFare = 45.00;

  const handleConfirm = () => {
    navigate('/driver-eta', { state: { driver } });
  };

  return (
    <div className="min-h-screen p-4 bg-black">
      <div className="max-w-2xl mx-auto">
        <motion.button
          onClick={() => navigate(-1)}
          className="mb-6 text-base text-[#D4AF37] hover:text-[#B8962A] flex items-center gap-2 font-semibold"
          whileHover={{ x: -5 }}
        >
          <ArrowLeft className="w-5 h-5" />
          Change Driver
        </motion.button>

        <GlassCard className="p-8">
          <motion.h2
            className="text-2xl mb-8 text-white font-bold text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Confirm Driver Assignment
          </motion.h2>

          {/* Driver Card */}
          <motion.div
            className="mb-8 p-6 bg-black/60 rounded-xl border-2 border-[#D4AF37]/30"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
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
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-xl font-bold text-white">{driver.name}</h3>
                  {driver.hotelPreferred && <Award className="w-5 h-5 text-[#D4AF37]" />}
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-5 h-5 text-[#D4AF37] fill-[#D4AF37]" />
                  <span className="text-base text-[#D4AF37] font-bold">{driver.rating.toFixed(1)}</span>
                  <span className="text-sm text-gray-500 font-medium">• {driver.experience} years</span>
                </div>
                <p className="text-base text-gray-400 font-medium">
                  {driver.vehicle.brand} {driver.vehicle.model} • {driver.vehicle.color}
                </p>
              </div>
            </div>

            {/* ETA */}
            <div className="flex items-center justify-between p-4 bg-[#D4AF37]/10 rounded-lg border border-[#D4AF37]/30">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#D4AF37]" />
                <span className="text-base text-gray-300 font-medium">{driver.distance} miles away</span>
              </div>
              <span className="text-lg text-[#D4AF37] font-black">{driver.eta} min ETA</span>
            </div>
          </motion.div>

          {/* Fare & Commission */}
          <motion.div
            className="mb-8 p-6 bg-[#D4AF37]/10 rounded-xl border-2 border-[#D4AF37]/40"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-base text-gray-400 font-medium">Estimated Fare</span>
              <span className="text-2xl text-white font-bold">${estimatedFare.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between pt-4 border-t-2 border-[#D4AF37]/30">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-[#D4AF37]" />
                <span className="text-base text-gray-300 font-medium">Your Commission (15%)</span>
              </div>
              <span className="text-2xl text-[#D4AF37] font-black">${commission.toFixed(2)}</span>
            </div>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            className="mb-8 flex flex-wrap justify-center gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {driver.verified && (
              <div className="px-4 py-2 bg-green-500/20 rounded-full border border-green-500/40 flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-400" />
                <span className="text-sm text-green-400 font-bold">KYC Verified</span>
              </div>
            )}
            {driver.backgroundCheck && (
              <div className="px-4 py-2 bg-blue-500/20 rounded-full border border-blue-500/40 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-blue-400 font-bold">Background Check</span>
              </div>
            )}
            {driver.hotelPreferred && (
              <div className="px-4 py-2 bg-[#D4AF37]/20 rounded-full border border-[#D4AF37]/40 flex items-center gap-2">
                <Award className="w-4 h-4 text-[#D4AF37]" />
                <span className="text-sm text-[#D4AF37] font-bold">Hotel Preferred</span>
              </div>
            )}
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            className="space-y-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <GoldButton onClick={handleConfirm} className="w-full text-xl py-5">
              Confirm Assignment
            </GoldButton>
            <motion.button
              onClick={() => navigate(-1)}
              className="w-full py-4 px-6 rounded-xl bg-black/60 border-2 border-[#D4AF37]/30 text-[#D4AF37] text-base font-bold hover:bg-black/80 hover:border-[#D4AF37]/50 transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Choose Different Driver
            </motion.button>
          </motion.div>
        </GlassCard>
      </div>
    </div>
  );
};  