// This file contains all remaining screens for the TUXEDO CONCIERGE app
import { useNavigate } from 'react-router-dom';
import { GlassCard, GoldButton } from '../components/GlassCard';
import {
  Shield,
  Upload,
  Loader2,
  Phone,
  Mail,
  MapPin,
  Car,
  CreditCard,
  DollarSign,
  QrCode,
  Users,
  Clock,
  Check,
  Star,
  TrendingUp,
  Calendar,
  CircleAlert,
  Wifi,
  Lock,
  User,
  UserCheck,
  Building,
  ArrowLeft,
} from 'lucide-react';
import { useState,useEffect } from 'react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';

// Device Binding Screen
export const DeviceBindingScreen = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-black">
      <GlassCard className="w-full max-w-md p-8">
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Lock className="w-16 h-16 text-[#D4AF37] mx-auto mb-4" />
          </motion.div>
          <h2 className="text-2xl mb-3 text-white font-bold">Device Binding Required</h2>
          <p className="text-base text-gray-400 font-medium">
            Secure this device for commission protection
          </p>
        </motion.div>
        <motion.div 
          className="space-y-4 mb-8 text-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.div 
            className="flex items-center gap-4 p-4 bg-black/60 rounded-xl border-2 border-[#D4AF37]/20"
            whileHover={{ scale: 1.02, borderColor: 'rgba(212, 175, 55, 0.4)' }}
          >
            <Building className="w-6 h-6 text-[#D4AF37] flex-shrink-0" />
            <div>
              <p className="text-gray-500 font-medium">Hotel</p>
              <p className="text-white font-bold text-base">The Grand Majestic Hotel</p>
            </div>
          </motion.div>
          <motion.div 
            className="flex items-center gap-4 p-4 bg-black/60 rounded-xl border-2 border-[#D4AF37]/20"
            whileHover={{ scale: 1.02, borderColor: 'rgba(212, 175, 55, 0.4)' }}
          >
            <Shield className="w-6 h-6 text-[#D4AF37] flex-shrink-0" />
            <div>
              <p className="text-gray-500 font-medium">Device</p>
              <p className="text-white font-bold text-base">Concierge Desk - Mobile</p>
            </div>
          </motion.div>
        </motion.div>
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <GoldButton onClick={() => navigate('/home')} className="w-full">
            Register This Device
          </GoldButton>
          <GoldButton variant="secondary" onClick={() => navigate('/login')} className="w-full">
            Request Admin Approval
          </GoldButton>
        </motion.div>
      </GlassCard>
    </div>
  );
};

// KYC Required Screen
export const KYCRequiredScreen = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-black">
      <GlassCard className="w-full max-w-md p-8">
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Upload className="w-16 h-16 text-[#D4AF37] mx-auto mb-4" />
          </motion.div>
          <h2 className="text-2xl mb-3 text-white font-bold">KYC Verification Required</h2>
          <p className="text-base text-gray-400 font-medium">Upload required documents to continue</p>
        </motion.div>
        <div className="space-y-4 mb-8">
          {['Hotel ID Badge', 'Employee ID Card', 'Authorization Letter'].map((doc, index) => (
            <motion.div
              key={doc}
              className="flex items-center justify-between p-4 bg-black/60 rounded-xl border-2 border-[#D4AF37]/20 hover:border-[#D4AF37]/40 transition-all"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
              whileHover={{ x: 5 }}
            >
              <span className="text-base text-white font-semibold">{doc}</span>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-3 rounded-lg bg-[#D4AF37]/20 hover:bg-[#D4AF37]/30 transition-colors border-2 border-[#D4AF37]/30"
              >
                <Upload className="w-5 h-5 text-[#D4AF37]" />
              </motion.button>
            </motion.div>
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <GoldButton onClick={() => navigate('/kyc-pending')} className="w-full">
            Submit Documents
          </GoldButton>
        </motion.div>
      </GlassCard>
    </div>
  );
};

// KYC Pending Screen
export const KYCPendingScreen = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-black">
      <GlassCard className="w-full max-w-md p-8 text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-[#D4AF37] border-t-transparent rounded-full mx-auto mb-6"
        />
        <motion.h2 
          className="text-2xl mb-3 text-white font-bold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Verification in Progress
        </motion.h2>
        <motion.p 
          className="text-base text-gray-400 font-medium mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          Your documents are being reviewed. You'll be notified once approved.
        </motion.p>
        <motion.p 
          className="text-sm text-gray-500 font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Estimated time: 24-48 hours
        </motion.p>
      </GlassCard>
    </div>
  );
};

// Guest Details Screen

// export const GuestDetailsScreen = () => {
//   const navigate = useNavigate();
//   const [guestPresent, setGuestPresent] = useState(true);
//   const [sendTracking, setSendTracking] = useState(true);
//   const [guestPhone, setGuestPhone] = useState('');
//   const [guestEmail, setGuestEmail] = useState('');
  
//   return (
//     <div className="min-h-screen p-4 bg-black">
//       <div className="max-w-2xl mx-auto">
//         <motion.button
//           onClick={() => navigate('/home')}
//           className="mb-6 text-base text-[#D4AF37] hover:text-[#B8962A] flex items-center gap-2 font-semibold"
//           whileHover={{ x: -5 }}
//           initial={{ opacity: 0, x: 20 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ duration: 0.3 }}
//         >
//           <ArrowLeft className="w-5 h-5" />
//           Back to Home
//         </motion.button>
//         <GlassCard className="p-8">
//           <motion.h2 
//             className="text-2xl mb-6 text-white font-bold"
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5 }}
//           >
//             Guest Information
//           </motion.h2>
//           <div className="space-y-5 mb-6">
//             <motion.div 
//               className="relative"
//               initial={{ opacity: 0, x: -20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ duration: 0.3, delay: 0.1 }}
//             >
//               <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#D4AF37]" />
//               <input
//                 type="tel"
//                 placeholder="Guest Phone Number"
//                 value={guestPhone}
//                 onChange={(e) => setGuestPhone(e.target.value)}
//                 className="w-full pl-12 pr-4 py-4 rounded-xl bg-black/60 border-2 border-[#D4AF37]/30 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] text-white placeholder-gray-500 text-base font-medium transition-all duration-200"
//               />
//             </motion.div>
//             <motion.div 
//               className="relative"
//               initial={{ opacity: 0, x: -20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ duration: 0.3, delay: 0.2 }}
//             >
//               <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#D4AF37]" />
//               <input
//                 type="email"
//                 placeholder="Guest Email (Optional)"
//                 value={guestEmail}
//                 onChange={(e) => setGuestEmail(e.target.value)}
//                 className="w-full pl-12 pr-4 py-4 rounded-xl bg-black/60 border-2 border-[#D4AF37]/30 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] text-white placeholder-gray-500 text-base font-medium transition-all duration-200"
//               />
//             </motion.div>

//             {/* Demo Guest Numbers */}
//             <motion.div
//               className="p-4 bg-black/60 rounded-xl border-2 border-[#D4AF37]/20"
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.3, delay: 0.3 }}
//             >
//               <p className="text-xs text-gray-500 font-medium mb-3">Demo Guest Numbers (Click to use):</p>
//               <div className="space-y-2">
//                 {[
//                   { number: '+1 (555) 300-0003', label: 'Guest - John Smith' },
//                   { number: '+1 (555) 400-0004', label: 'Guest - Emily Davis' },
//                   { number: '+1 (555) 500-0005', label: 'Guest - Robert Chen' },
//                 ].map((demo, index) => (
//                   <motion.button
//                     key={demo.number}
//                     onClick={() => setGuestPhone(demo.number)}
//                     className="w-full p-3 bg-black/40 rounded-lg border border-[#D4AF37]/20 hover:border-[#D4AF37]/40 hover:bg-black/60 transition-all text-left"
//                     whileHover={{ x: 3 }}
//                     whileTap={{ scale: 0.98 }}
//                     initial={{ opacity: 0, x: -10 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     transition={{ duration: 0.2, delay: 0.4 + index * 0.05 }}
//                   >
//                     <p className="text-sm text-white font-semibold">{demo.number}</p>
//                     <p className="text-xs text-gray-500 font-medium">{demo.label}</p>
//                   </motion.button>
//                 ))}
//               </div>
//             </motion.div>
//           </div>

//           {/* Guest Status Options */}
//           <div className="space-y-4 mb-6">
//             {/* <motion.div 
//               className="p-5 bg-black/60 rounded-xl border-2 border-[#D4AF37]/20"
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.3, delay: 0.5 }}
//             >
//               <label className="flex items-center gap-4 cursor-pointer">
//                 <motion.input
//                   type="checkbox"
//                   checked={guestPresent}
//                   onChange={(e) => setGuestPresent(e.target.checked)}
//                   className="w-6 h-6 text-[#D4AF37] focus:ring-[#D4AF37] rounded"
//                   whileTap={{ scale: 0.9 }}
//                 />
//                 <span className="text-base text-white font-semibold">Guest is present</span>
//               </label>
//             </motion.div> */}

//             <motion.div 
//               className="p-5 bg-black/60 rounded-xl border-2 border-[#D4AF37]/20"
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.3, delay: 0.6 }}
//             >
//               <label className="flex items-center gap-4 cursor-pointer">
//                 <motion.input
//                   type="checkbox"
//                   checked={sendTracking}
//                   onChange={(e) => setSendTracking(e.target.checked)}
//                   className="w-6 h-6 text-[#D4AF37] focus:ring-[#D4AF37] rounded"
//                   whileTap={{ scale: 0.9 }}
//                 />
//                 <div className="flex-1">
//                   <span className="text-base text-white font-semibold">Send tracking link to guest</span>
//                   {sendTracking && (
//                     <motion.p 
//                       className="text-sm text-gray-400 mt-2 font-medium"
//                       initial={{ opacity: 0, height: 0 }}
//                       animate={{ opacity: 1, height: 'auto' }}
//                       transition={{ duration: 0.3 }}
//                     >
//                       Guest will receive real-time updates via SMS/Email
//                     </motion.p>
//                   )}
//                 </div>
//               </label>
//             </motion.div>
//           </div>

//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.3, delay: 0.7 }}
//           >
//             <GoldButton onClick={() => navigate('/ride-config')} className="w-full">
//               Continue
//             </GoldButton>
//           </motion.div>
//         </GlassCard>
//       </div>
//     </div>
//   );
// };
export const GuestDetailsScreen = () => {
  const navigate = useNavigate();
  const [guestPhone, setGuestPhone] = useState('');
  
  return (
    <div className="min-h-screen p-4 bg-black">
      <div className="max-w-2xl mx-auto">
        <button onClick={() => navigate('/home')} className="mb-6 text-[#D4AF37] flex items-center gap-2 font-bold">
          <ArrowLeft className="w-5 h-5" /> Back
        </button>
        <GlassCard className="p-8">
          <h2 className="text-2xl mb-6 text-white font-bold">Guest Information</h2>
          <p className="text-sm text-gray-400 mb-6 font-medium italic">
            * Tracking link will be sent automatically to the guest.
          </p>
          <div className="space-y-5 mb-8">
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#D4AF37]" />
              <input
                type="tel"
                placeholder="Guest Phone Number"
                value={guestPhone}
                onChange={(e) => setGuestPhone(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-black/60 border-2 border-[#D4AF37]/30 text-white text-lg"
              />
            </div>
          </div>
          <GoldButton 
            onClick={() => navigate('/waiting-payment')} 
            className="w-full"
            disabled={!guestPhone}
          >
            Continue
          </GoldButton>
        </GlassCard>
      </div>
    </div>
  );
};

// Ride Configuration Screen
// export const RideConfigScreen = () => {
//   const navigate = useNavigate();
//   const [vehicleType, setVehicleType] = useState('stretch-limo');
//   const [paymentType, setPaymentType] = useState('card');
//   const [pickupLocation, setPickupLocation] = useState('The Grand Majestic Hotel');
//   const [destination, setDestination] = useState('');

//   return (
//     <div className="min-h-screen p-4 bg-black">
//       <div className="max-w-2xl mx-auto">
//         <motion.button
//           onClick={() => navigate('/guest-details')}
//           className="mb-6 text-base text-[#D4AF37] hover:text-[#B8962A] flex items-center gap-2 font-semibold"
//           whileHover={{ x: -5 }}
//           initial={{ opacity: 0, x: 20 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ duration: 0.3 }}
//         >
//           <ArrowLeft className="w-5 h-5" />
//           Back
//         </motion.button>
//         <GlassCard className="p-8">
//           <motion.h2 
//             className="text-2xl mb-6 text-white font-bold"
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5 }}
//           >
//             Ride Configuration
//           </motion.h2>

//           <div className="space-y-6">
//             {/* Map for Pickup Location */}
//             <motion.div
//               initial={{ opacity: 0, x: -20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ duration: 0.3, delay: 0.1 }}
//             >
//               <label className="block mb-3 text-base text-white font-bold">Pickup Location</label>
//               <motion.div 
//                 className="w-full h-48 bg-black/60 rounded-xl border-2 border-[#D4AF37]/20 overflow-hidden mb-3"
//                 whileHover={{ borderColor: '#D4AF3766' }}
//               >
//                 <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-black/80 via-black/60 to-black/80">
//                   <div className="absolute inset-0 flex items-center justify-center">
//                     <MapPin className="w-12 h-12 text-[#D4AF37] opacity-50" />
//                   </div>
//                   <div className="absolute bottom-4 left-4 right-4">
//                     <div className="bg-black/80 border border-[#D4AF37]/30 rounded-lg p-3">
//                       <p className="text-xs text-gray-500 font-medium mb-1">Current Pickup:</p>
//                       <p className="text-sm text-white font-bold">{pickupLocation}</p>
//                     </div>
//                   </div>
//                 </div>
//               </motion.div>
//               <div className="relative">
//                 <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#D4AF37]" />
//                 <input
//                   type="text"
//                   value={pickupLocation}
//                   onChange={(e) => setPickupLocation(e.target.value)}
//                   className="w-full pl-12 pr-4 py-4 rounded-xl bg-black/60 border-2 border-[#D4AF37]/30 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] text-white text-base font-medium transition-all duration-200"
//                 />
//               </div>
//             </motion.div>

//             {/* Map for Destination */}
//             <motion.div
//               initial={{ opacity: 0, x: -20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ duration: 0.3, delay: 0.2 }}
//             >
//               <label className="block mb-3 text-base text-white font-bold">Destination (Optional)</label>
//               <motion.div 
//                 className="w-full h-48 bg-black/60 rounded-xl border-2 border-[#D4AF37]/20 overflow-hidden mb-3"
//                 whileHover={{ borderColor: 'rgba(212, 175, 55, 0.4)' }}
//               >
//                 <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-black/80 via-black/60 to-black/80">
//                   <div className="absolute inset-0 flex items-center justify-center">
//                     <MapPin className="w-12 h-12 text-[#D4AF37] opacity-30" />
//                   </div>
//                   {destination && (
//                     <div className="absolute bottom-4 left-4 right-4">
//                       <div className="bg-black/80 border border-[#D4AF37]/30 rounded-lg p-3">
//                         <p className="text-xs text-gray-500 font-medium mb-1">Destination:</p>
//                         <p className="text-sm text-white font-bold">{destination}</p>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </motion.div>
//               <div className="relative">
//                 <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#D4AF37]" />
//                 <input
//                   type="text"
//                   placeholder="Enter destination"
//                   value={destination}
//                   onChange={(e) => setDestination(e.target.value)}
//                   className="w-full pl-12 pr-4 py-4 rounded-xl bg-black/60 border-2 border-[#D4AF37]/30 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] text-white placeholder-gray-500 text-base font-medium transition-all duration-200"
//                 />
//               </div>
//             </motion.div>

//             {/* Luxury Vehicle Types */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.3, delay: 0.3 }}
//             >
//               <label className="block mb-3 text-base text-white font-bold">Luxury Vehicle Type</label>
//               <div className="grid grid-cols-2 gap-3">
//                 {[
//                   { value: 'stretch-limo', label: 'Stretch Limousine', icon: Car },
//                   { value: 'sedan-limo', label: 'Sedan Limousine', icon: Car },
//                   { value: 'suv-limo', label: 'SUV Limousine', icon: Car },
//                   { value: 'executive-limo', label: 'Executive Limo', icon: Car },
//                 ].map(({ value, label, icon: Icon }, index) => (
//                   <motion.button
//                     key={value}
//                     onClick={() => setVehicleType(value)}
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     initial={{ opacity: 0, scale: 0.9 }}
//                     animate={{ opacity: 1, scale: 1 }}
//                     transition={{ duration: 0.2, delay: 0.4 + index * 0.05 }}
//                     className={`p-5 rounded-xl border-2 transition-all ${
//                       vehicleType === value
//                         ? 'border-[#D4AF37] bg-[#D4AF37]/10 shadow-lg shadow-[#D4AF37]/30'
//                         : 'border-[#D4AF37]/30 bg-black/60 hover:border-[#D4AF37]/50 hover:bg-black/80'
//                     }`}
//                   >
//                     <Icon className={`w-8 h-8 mx-auto mb-2 ${vehicleType === value ? 'text-[#D4AF37]' : 'text-gray-400'}`} />
//                     <p className={`text-sm font-bold ${vehicleType === value ? 'text-[#D4AF37]' : 'text-gray-400'}`}>
//                       {label}
//                     </p>
//                   </motion.button>
//                 ))}
//               </div>
//             </motion.div>

//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.3, delay: 0.5 }}
//             >
//               <label className="block mb-3 text-base text-white font-bold">Payment Method</label>
//               <div className="grid grid-cols-2 gap-3">
//                 {[
//                   { value: 'card', label: 'Card', icon: CreditCard },
//                   { value: 'cash', label: 'Cash', icon: DollarSign },
//                 ].map(({ value, label, icon: Icon }, index) => (
//                   <motion.button
//                     key={value}
//                     onClick={() => setPaymentType(value)}
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     initial={{ opacity: 0, scale: 0.9 }}
//                     animate={{ opacity: 1, scale: 1 }}
//                     transition={{ duration: 0.2, delay: 0.6 + index * 0.05 }}
//                     className={`p-5 rounded-xl border-2 transition-all ${
//                       paymentType === value
//                         ? 'border-[#D4AF37] bg-[#D4AF37]/10 shadow-lg shadow-[#D4AF37]/30'
//                         : 'border-[#D4AF37]/30 bg-black/60 hover:border-[#D4AF37]/50 hover:bg-black/80'
//                     }`}
//                   >
//                     <Icon className={`w-8 h-8 mx-auto mb-2 ${paymentType === value ? 'text-[#D4AF37]' : 'text-gray-400'}`} />
//                     <p className={`text-sm font-bold ${paymentType === value ? 'text-[#D4AF37]' : 'text-gray-400'}`}>
//                       {label}
//                     </p>
//                   </motion.button>
//                 ))}
//               </div>
//             </motion.div>
//           </div>

//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.3, delay: 0.7 }}
//           >
//             <GoldButton onClick={() => navigate('/confirm-dispatch')} className="w-full mt-8">
//               Continue to Confirmation
//             </GoldButton>
//           </motion.div>
//         </GlassCard>
//       </div>
//     </div>
//   );
// };


export const RideConfigScreen = () => {
  const navigate = useNavigate();
  const { user } = useApp();

  return (
    <div className="min-h-screen p-4 bg-black">
      <div className="max-w-2xl mx-auto">
        <GlassCard className="p-8">
          <h2 className="text-2xl mb-6 text-white font-bold uppercase italic">Ride Configuration</h2>
          
          {/* Requirement 1.6: Auto-derived Pickup Location */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-6 bg-[#D4AF37]/10 rounded-xl border-2 border-[#D4AF37]/40 shadow-lg shadow-[#D4AF37]/5"
          >
            <p className="text-xs text-[#D4AF37] font-black uppercase tracking-widest mb-2">Pickup Location</p>
            <p className="text-2xl text-white font-bold">{user?.hotelName || "The Grand Majestic Hotel"}</p>
            <p className="text-xs text-gray-500 mt-3 font-medium uppercase">
              Location automatically derived from concierge profile
            </p>
          </motion.div>

          <div className="space-y-6 text-center">
            <div className="py-10">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Car className="w-20 h-20 text-[#D4AF37] mx-auto opacity-50" />
              </motion.div>
              <p className="text-gray-400 mt-4 font-medium">
                The guest will enter their destination and payment details <br />
                via the automated tracking link.
              </p>
            </div>

            {/* Requirement 1.1: Single Action: Call Car */}
            <GoldButton 
              onClick={() => navigate('/confirm-dispatch')} 
              className="w-full py-6 text-xl font-black uppercase tracking-tighter"
            >
              Request Chauffeur Now
            </GoldButton>
            
            <button 
              onClick={() => navigate('/home')}
              className="text-gray-500 text-sm font-bold uppercase hover:text-white transition-colors"
            >
              Cancel Request
            </button>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

// Confirm Dispatch Screen
export const ConfirmDispatchScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen p-4 bg-black">
      <div className="max-w-2xl mx-auto">
        <motion.button
          onClick={() => navigate('/ride-config')}
          className="mb-6 text-base text-[#D4AF37] hover:text-[#B8962A] flex items-center gap-2 font-semibold"
          whileHover={{ x: -5 }}
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </motion.button>
        <GlassCard className="p-8 text-center">
          <motion.h2 className="text-2xl mb-6 text-white font-bold">Confirm & Dispatch</motion.h2>
          
          <motion.div className="mb-8 p-6 bg-[#D4AF37]/10 rounded-xl border-2 border-[#D4AF37]/40">
            <p className="text-sm text-gray-400 font-medium">Estimated Fare</p>
            <p className="text-4xl text-white mb-3 font-bold">$45.00</p>
            <p className="text-base text-[#D4AF37] font-bold">Your Commission: $6.75 (15%)</p>
          </motion.div>

          <GoldButton 
            onClick={() => navigate('/guest-details')} 
            className="w-full uppercase font-black py-4"
          >
            Send Chauffeur Request
          </GoldButton>
        </GlassCard>
      </div>
    </div>
  );
};

// QR Booking Screen
export const QRBookingScreen = () => (
  <div className="min-h-screen flex items-center justify-center p-4 bg-black">
    <GlassCard className="p-8 text-center max-w-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <QrCode className="w-20 h-20 text-[#D4AF37] mx-auto mb-6" />
        </motion.div>
      </motion.div>
      <motion.h2 
        className="text-2xl mb-6 text-white font-bold"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Guest Self-Booking
      </motion.h2>
      <motion.div 
        className="w-64 h-64 bg-black/60 rounded-xl flex items-center justify-center mx-auto mb-6 border-2 border-[#D4AF37]/20"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        whileHover={{ borderColor: 'rgba(212, 175, 55, 0.5)' }}
      >
        <p className="text-gray-500 text-base font-medium">QR Code Here</p>
      </motion.div>
      <motion.p 
        className="text-sm text-gray-400 font-medium"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        Guest can scan to book their own ride
      </motion.p>
    </GlassCard>
  </div>
);

// Driver Matching Screen
// export const DriverMatchingScreen = () => {
//   const navigate = useNavigate();
//   return (
//     <div className="min-h-screen flex items-center justify-center p-4 bg-black">
//       <GlassCard className="p-8 text-center max-w-md w-full">
//         <motion.div 
//           className="mb-8"
//           animate={{ scale: [1, 1.1, 1] }}
//           transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
//         >
//           <Users className="w-16 h-16 text-[#D4AF37] mx-auto mb-6" />
//         </motion.div>
//         <motion.h2 
//           className="text-2xl mb-4 text-white font-bold"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ duration: 0.5 }}
//         >
//           Finding Chauffeur
//         </motion.h2>
//         <motion.p 
//           className="text-base text-gray-400 font-medium mb-8"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ duration: 0.5, delay: 0.1 }}
//         >
//           Searching for nearest available drivers...
//         </motion.p>
//         <div className="space-y-4">
//           {[1, 2, 3].map((i) => (
//             <motion.div 
//               key={i} 
//               className="p-4 bg-black/60 rounded-xl flex justify-between items-center text-base border-2 border-[#D4AF37]/20 hover:border-[#D4AF37]/40 transition-all"
//               initial={{ opacity: 0, x: -20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ duration: 0.3, delay: 0.2 + i * 0.1 }}
//               whileHover={{ x: 5 }}
//             >
//               <span className="text-white font-bold">Driver {i}</span>
//               <motion.span 
//                 className="text-[#D4AF37] font-bold"
//                 animate={{ opacity: [1, 0.6, 1] }}
//                 transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
//               >
//                 {i + 1} min away
//               </motion.span>
//             </motion.div>
//           ))}
//         </div>
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5, delay: 0.6 }}
//         >
//           <GoldButton onClick={() => navigate('/driver-eta')} className="w-full mt-8">
//             Driver Accepted
//           </GoldButton>
//         </motion.div>
//       </GlassCard>
//     </div>
//   );
// };
export const DriverMatchingScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Requirement 3.1 & 3.2: Automated Uber-style matching
    // Automatically navigates to the next screen after finding the closest driver
    const timer = setTimeout(() => {
      navigate('/driver-eta');
    }, 4000); // 4-second search simulation

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-black">
      <GlassCard className="p-10 text-center max-w-md w-full border-[#D4AF37]/30">
        {/* Requirement 3.7: Goal is fast booking with zero confusion */}
        <motion.div 
          className="mb-8 relative"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="absolute inset-0 bg-[#D4AF37]/20 rounded-full blur-3xl animate-pulse"></div>
          <Car className="w-20 h-20 text-[#D4AF37] mx-auto relative z-10" />
        </motion.div>

        <h2 className="text-2xl mb-4 text-white font-black tracking-tight uppercase">
          Finding Your Chauffeur
        </h2>
        <p className="text-gray-400 font-medium mb-10">
          Connecting you with the closest available premium vehicle...
        </p>
        
        {/* Requirement 3.3, 3.4, 3.5: No driver list selection, swiping, or filters */}
        <div className="flex justify-center mb-10">
          <Loader2 className="w-10 h-10 text-[#D4AF37] animate-spin" />
        </div>

        <button 
          onClick={() => navigate('/home')}
          className="text-gray-500 font-bold hover:text-white transition-colors text-sm uppercase tracking-widest"
        >
          Cancel Request
        </button>
      </GlassCard>
    </div>
  );
};

// Driver ETA Screen
// export const DriverETAScreen = () => {
//   const navigate = useNavigate();
//   return (
//     <div className="min-h-screen p-4 bg-black">
//       <div className="max-w-2xl mx-auto">
//         <motion.button
//           onClick={() => navigate('/driver-matching')}
//           className="mb-6 text-base text-[#D4AF37] hover:text-[#B8962A] flex items-center gap-2 font-semibold"
//           whileHover={{ x: -5 }}
//           initial={{ opacity: 0, x: 20 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ duration: 0.3 }}
//         >
//           <ArrowLeft className="w-5 h-5" />
//           Back
//         </motion.button>
//         <GlassCard className="p-8">
//           <div className="text-center mb-8">
//             <motion.div 
//               className="w-24 h-24 rounded-full bg-[#D4AF37]/20 mx-auto mb-6 flex items-center justify-center border-2 border-[#D4AF37]/30"
//               initial={{ opacity: 0, scale: 0.8 }}
//               animate={{ opacity: 1, scale: 1 }}
//               transition={{ duration: 0.5 }}
//               whileHover={{ scale: 1.05 }}
//             >
//               <motion.div
//                 animate={{ y: [0, -8, 0] }}
//                 transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
//               >
//                 <Car className="w-12 h-12 text-[#D4AF37]" />
//               </motion.div>
//             </motion.div>
//             <motion.h2 
//               className="text-2xl mb-3 text-white font-bold"
//               initial={{ opacity: 0, y: -20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5, delay: 0.1 }}
//             >
//               Driver Arriving
//             </motion.h2>
//             <motion.div 
//               className="text-5xl text-[#D4AF37] mb-3 font-black"
//               initial={{ opacity: 0, scale: 0.8 }}
//               animate={{ opacity: 1, scale: 1 }}
//               transition={{ duration: 0.5, delay: 0.2 }}
//             >
//               3 min
//             </motion.div>
//             <motion.p 
//               className="text-base text-gray-400 font-medium"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ duration: 0.5, delay: 0.3 }}
//             >
//               Mercedes-Benz S-Class
//             </motion.p>
//           </div>
//           <div className="space-y-4">
//             {[
//               { label: 'Driver', value: 'Michael Thompson' },
//               { label: 'Rating', value: '★ 4.9' },
//               { label: 'Plate', value: 'LUX 2024' },
//             ].map(({ label, value }, index) => (
//               <motion.div 
//                 key={label}
//                 className="flex justify-between p-4 bg-black/60 rounded-xl text-base border-2 border-[#D4AF37]/20 hover:border-[#D4AF37]/40 transition-all"
//                 initial={{ opacity: 0, x: -20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
//                 whileHover={{ x: 5 }}
//               >
//                 <span className="text-gray-400 font-medium">{label}</span>
//                 <span className="text-white font-bold">{value}</span>
//               </motion.div>
//             ))}
//           </div>
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5, delay: 0.7 }}
//           >
//             <GoldButton onClick={() => navigate('/active-ride')} className="w-full mt-8">
//               Track Driver
//             </GoldButton>
//           </motion.div>
//         </GlassCard>
//       </div>
//     </div>
//   );
// };
export const DriverETAScreen = () => {
  const navigate = useNavigate();

  // Requirement 3.6: Data revealed only after driver accepts (this screen)
  const driverData = {
    name: "Michael T.", // Requirement 6.5: Hidden last name
    rating: "4.9",
    car: "Mercedes-Benz S-Class",
    plate: "LUX 2024",
    eta: "3 min"
  };

  return (
    <div className="min-h-screen p-4 bg-black">
      <div className="max-w-2xl mx-auto">
        <motion.button
          onClick={() => navigate('/home')}
          className="mb-6 text-base text-[#D4AF37] hover:text-[#B8962A] flex items-center gap-2 font-semibold"
          whileHover={{ x: -5 }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ArrowLeft className="w-5 h-5" />
          Cancel Ride
        </motion.button>
        
        <GlassCard className="p-8">
          <div className="text-center mb-8">
            <motion.div 
              className="w-24 h-24 rounded-full bg-[#D4AF37]/20 mx-auto mb-6 flex items-center justify-center border-2 border-[#D4AF37]/30"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Car className="w-12 h-12 text-[#D4AF37]" />
              </motion.div>
            </motion.div>
            
            <motion.h2 
              className="text-2xl mb-3 text-white font-bold uppercase tracking-tight"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Chauffeur Arriving
            </motion.h2>
            
            <motion.div 
              className="text-6xl text-[#D4AF37] mb-3 font-black"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {driverData.eta}
            </motion.div>
            
            <motion.p 
              className="text-lg text-gray-400 font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {driverData.car}
            </motion.p>
          </div>

          <div className="space-y-4">
            {[
              { label: 'Chauffeur', value: driverData.name },
              { label: 'Rating', value: `★ ${driverData.rating}` },
              { label: 'License Plate', value: driverData.plate },
            ].map(({ label, value }, index) => (
              <motion.div 
                key={label}
                className="flex justify-between p-5 bg-black/60 rounded-xl text-base border-2 border-[#D4AF37]/20"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
              >
                <span className="text-gray-400 font-bold uppercase text-xs tracking-widest">{label}</span>
                <span className="text-white font-bold">{value}</span>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <GoldButton onClick={() => navigate('/active-ride')} className="w-full mt-8 py-5 text-xl">
              TRACK RIDE
            </GoldButton>
          </motion.div>
        </GlassCard>
      </div>
    </div>
  );
};

// Active Ride Screen
export const ActiveRideScreen = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen p-4 bg-black">
      <div className="max-w-2xl mx-auto">
        <motion.button
          onClick={() => navigate('/driver-eta')}
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
            className="text-2xl mb-6 text-white font-bold"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Active Ride Timeline
          </motion.h2>
          <div className="space-y-5 mb-8">
            {[
              { status: 'Assigned', time: '2:15 PM', done: true },
              { status: 'Arriving', time: '2:18 PM', done: true },
              { status: 'Onboard', time: '2:20 PM', done: true },
              { status: 'En Route', time: 'Now', done: false },
              { status: 'Completed', time: 'Pending', done: false },
            ].map(({ status, time, done }, index) => (
              <motion.div 
                key={status} 
                className="flex items-center gap-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 + index * 0.1 }}
              >
                <motion.div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all border-2 ${
                    done ? 'bg-[#D4AF37] shadow-lg shadow-[#D4AF37]/40 border-[#D4AF37]' : 'bg-black/60 border-gray-600'
                  }`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
                  whileHover={{ scale: 1.1 }}
                >
                  {done && <Check className="w-5 h-5 text-black" />}
                </motion.div>
                <div className="flex-1">
                  <p className="text-base text-white font-bold">{status}</p>
                  <p className="text-sm text-gray-400 font-medium">{time}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <GoldButton onClick={() => navigate('/ride-completion')} className="w-full">
              Complete Ride
            </GoldButton>
          </motion.div>
        </GlassCard>
      </div>
    </div>
  );
};

// Cash Confirmation Screen
// export const CashConfirmationScreen = () => (
//   <div className="min-h-screen flex items-center justify-center p-4 bg-black">
//     <GlassCard className="p-8 text-center max-w-md w-full">
//       <motion.div
//         animate={{ scale: [1, 1.1, 1] }}
//         transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
//       >
//         <DollarSign className="w-20 h-20 text-[#D4AF37] mx-auto mb-6" />
//       </motion.div>
//       <motion.h2 
//         className="text-2xl mb-4 text-white font-bold"
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ duration: 0.5, delay: 0.1 }}
//       >
//         Cash Confirmation
//       </motion.h2>
//       <motion.p 
//         className="text-base text-gray-400 font-medium mb-8"
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ duration: 0.5, delay: 0.2 }}
//       >
//         Waiting for driver to confirm cash payment received
//       </motion.p>
//       <motion.div 
//         className="p-5 bg-yellow-500/10 border-2 border-yellow-500/40 rounded-xl"
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ y: 0, opacity: [1, 0.7, 1] }}
//         transition={{ y: { duration: 0.5, delay: 0.3 }, opacity: { duration: 2, repeat: Infinity } }}
//       >
//         <p className="text-sm text-yellow-500 font-bold">
//           Payment confirmation pending
//         </p>
//       </motion.div>
//     </GlassCard>
//   </div>
// );
export const CashConfirmationScreen = () => (
  <div className="min-h-screen flex items-center justify-center p-4 bg-black">
    <GlassCard className="p-8 text-center max-w-md w-full">
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <DollarSign className="w-20 h-20 text-[#D4AF37] mx-auto mb-6" />
      </motion.div>
      <motion.h2 
        className="text-2xl mb-4 text-white font-bold"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        Cash Confirmation
      </motion.h2>
      <motion.p 
        className="text-base text-gray-400 font-medium mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {/* Requirement 1.7: Concierge only waits for payment confirmation */}
        Waiting for driver to confirm cash payment received
      </motion.p>
      <motion.div 
        className="p-5 bg-yellow-500/10 border-2 border-yellow-500/40 rounded-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ y: 0, opacity: [1, 0.7, 1] }}
        transition={{ y: { duration: 0.5, delay: 0.3 }, opacity: { duration: 2, repeat: Infinity } }}
      >
        <p className="text-sm text-yellow-500 font-bold">
          Payment confirmation pending
        </p>
      </motion.div>
    </GlassCard>
  </div>
);

// Ride Completion Screen
export const RideCompletionScreen = () => {
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-black">
      <GlassCard className="p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
          >
            <Check className="w-20 h-20 text-green-500 mx-auto mb-6" />
          </motion.div>
          <motion.h2 
            className="text-2xl mb-4 text-white font-bold"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Ride Completed
          </motion.h2>
          <motion.div 
            className="p-6 bg-[#D4AF37]/10 rounded-xl mb-6 border-2 border-[#D4AF37]/40"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <p className="text-sm text-gray-400 font-medium">Fare</p>
            <motion.p 
              className="text-4xl text-white font-black my-2"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              $45.00
            </motion.p>
            <p className="text-base text-[#D4AF37] font-bold">Commission Earned: $6.75</p>
          </motion.div>
        </div>
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <p className="mb-4 text-center text-white font-bold text-base">Rate Driver</p>
          <div className="flex justify-center gap-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <motion.button 
                key={star} 
                onClick={() => setRating(star)}
                whileHover={{ scale: 1.2, rotate: 10 }}
                whileTap={{ scale: 0.9 }}
              >
                <Star
                  className={`w-10 h-10 transition-all duration-200 ${star <= rating ? 'text-[#D4AF37] fill-[#D4AF37]' : 'text-gray-600'}`}
                />
              </motion.button>
            ))}
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <GoldButton onClick={() => navigate('/home')} className="w-full">
            Done
          </GoldButton>
        </motion.div>
      </GlassCard>
    </div>
  );
};

// Commission Wallet Screen
export const CommissionWalletScreen = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen p-4 bg-black">
      <div className="max-w-2xl mx-auto">
        <motion.button 
          onClick={() => navigate('/home')} 
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
            className="text-2xl mb-6 text-white font-bold"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Commission Wallet
          </motion.h2>
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { label: 'Today', value: '$142.50', delay: 0.1 },
              { label: 'Week', value: '$856', delay: 0.2 },
              { label: 'Month', value: '$3,420', delay: 0.3 },
            ].map(({ label, value, delay }) => (
              <motion.div 
                key={label}
                className="p-4 bg-black/60 rounded-xl text-center border-2 border-[#D4AF37]/20 hover:border-[#D4AF37]/40 transition-all"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay }}
                whileHover={{ y: -5, scale: 1.05 }}
              >
                <p className="text-xs text-gray-400 font-medium mb-2">{label}</p>
                <motion.p 
                  className="text-lg text-[#D4AF37] font-black"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3, delay: delay + 0.1 }}
                >
                  {value}
                </motion.p>
              </motion.div>
            ))}
          </div>
          <motion.div 
            className="h-64 bg-black/60 rounded-xl flex items-center justify-center border-2 border-[#D4AF37]/20"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            whileHover={{ borderColor: 'rgba(212, 175, 55, 0.4)' }}
          >
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <TrendingUp className="w-16 h-16 text-gray-500" />
            </motion.div>
          </motion.div>
        </GlassCard>
      </div>
    </div>
  );
};

// Ride History Screen
export const RideHistoryScreen = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen p-4 bg-black">
      <div className="max-w-2xl mx-auto">
        <motion.button 
          onClick={() => navigate('/home')} 
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
            className="text-2xl mb-6 text-white font-bold"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Ride History
          </motion.h2>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <motion.div 
                key={i} 
                className="p-5 bg-black/60 rounded-xl border-2 border-[#D4AF37]/20 hover:border-[#D4AF37]/40 transition-all"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 + i * 0.05 }}
                whileHover={{ x: 5, scale: 1.02 }}
              >
                <div className="flex justify-between mb-2">
                  <span className="text-white font-bold text-base">Ride #{1000 + i}</span>
                  <span className="text-[#D4AF37] font-black text-base">$6.75</span>
                </div>
                <div className="flex justify-between text-sm text-gray-400">
                  <span className="font-medium">Dec {18 - i}, 2025</span>
                  <span className="text-green-500 font-semibold">Completed</span>
                </div>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

// Manager Dashboard Screen
export const ManagerDashboardScreen = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen p-4 bg-black">
      <div className="max-w-4xl mx-auto">
        <motion.button 
          onClick={() => navigate('/home')} 
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
            className="text-2xl mb-6 text-white font-bold"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Hotel Performance
          </motion.h2>
          <div className="grid grid-cols-2 gap-4 mb-6">
            {[
              { label: 'Total Rides', value: '284', delay: 0.1 },
              { label: 'Commission', value: '$4,260', delay: 0.2 },
              { label: 'Avg ETA', value: '3.8 min', delay: 0.3 },
              { label: 'Top Driver', value: '★ 4.9', delay: 0.4 },
            ].map(({ label, value, delay }) => (
              <motion.div 
                key={label} 
                className="p-5 bg-black/60 rounded-xl text-center border-2 border-[#D4AF37]/20 hover:border-[#D4AF37]/40 transition-all"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay }}
                whileHover={{ y: -5, scale: 1.05 }}
              >
                <p className="text-sm text-gray-400 font-medium mb-2">{label}</p>
                <motion.p 
                  className="text-xl text-[#D4AF37] font-black"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3, delay: delay + 0.1 }}
                >
                  {value}
                </motion.p>
              </motion.div>
            ))}
          </div>
          <motion.div 
            className="h-64 bg-black/60 rounded-xl flex items-center justify-center border-2 border-[#D4AF37]/20"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            whileHover={{ borderColor: 'rgba(212, 175, 55, 0.4)' }}
          >
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <Calendar className="w-16 h-16 text-gray-500" />
            </motion.div>
          </motion.div>
        </GlassCard>
      </div>
    </div>
  );
};

// Profile Screen
export const ProfileScreen = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen p-4 bg-black">
      <div className="max-w-2xl mx-auto">
        <motion.button 
          onClick={() => navigate('/home')} 
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
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div 
              className="w-24 h-24 rounded-full bg-[#D4AF37]/20 mx-auto mb-5 flex items-center justify-center border-2 border-[#D4AF37]/40"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ duration: 0.3 }}
            >
              <User className="w-12 h-12 text-[#D4AF37]" />
            </motion.div>
            <h2 className="text-2xl text-white font-black mb-2">James Anderson</h2>
            <p className="text-base text-[#D4AF37] font-bold">Concierge</p>
          </motion.div>
          <div className="space-y-4 mb-8">
            {[
              { label: 'Hotel', value: 'The Grand Majestic Hotel' },
              { label: 'Email', value: 'james@grandhotel.com' },
              { label: 'Phone', value: '+1 (555) 123-4567' },
              { label: 'Device', value: 'Mobile Device' },
            ].map(({ label, value }, index) => (
              <motion.div 
                key={label} 
                className="p-4 bg-black/60 rounded-xl flex justify-between border-2 border-[#D4AF37]/20 hover:border-[#D4AF37]/40 transition-all"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
                whileHover={{ x: 5 }}
              >
                <span className="text-gray-400 font-medium text-sm">{label}</span>
                <span className="text-white font-bold text-sm">{value}</span>
              </motion.div>
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <GoldButton variant="secondary" onClick={() => navigate('/login')} className="w-full">
              Logout
            </GoldButton>
          </motion.div>
        </GlassCard>
      </div>
    </div>
  );
};

// No Drivers Screen
export const NoDriversScreen = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-black">
      <GlassCard className="p-8 text-center max-w-md w-full">
        <motion.div
          animate={{ rotate: [0, -10, 10, -10, 0], y: [0, -5, 0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <CircleAlert className="w-20 h-20 text-yellow-500 mx-auto mb-6" />
        </motion.div>
        <motion.h2 
          className="text-2xl mb-4 text-white font-bold"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          No Drivers Available
        </motion.h2>
        <motion.p 
          className="text-base text-gray-400 font-medium mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          All chauffeurs are currently busy. Would you like to try again or schedule for later?
        </motion.p>
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <GoldButton onClick={() => navigate('/driver-matching')} className="w-full">
            Retry
          </GoldButton>
          <GoldButton variant="secondary" onClick={() => navigate('/home')} className="w-full">
            Schedule Later
          </GoldButton>
        </motion.div>
      </GlassCard>
    </div>
  );
};