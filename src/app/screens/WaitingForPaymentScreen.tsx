import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, Car, ArrowLeft, Sparkles } from 'lucide-react';
import { GlassCard, GoldButton } from '../components/GlassCard';

// App Download Popup
const AppDownloadPopup = ({ onClose }: { onClose: () => void }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="w-full max-w-sm"
      >
        <GlassCard className="p-8 text-center border-[#D4AF37]/40 shadow-2xl shadow-[#D4AF37]/30">
          <div className="w-16 h-16 bg-[#D4AF37]/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-[#D4AF37]/30">
            <Sparkles className="w-8 h-8 text-[#D4AF37]" />
          </div>
          
          <h3 className="text-xl font-bold text-white mb-6 leading-tight">
            Download our app and get <span className="text-[#D4AF37]">$100 coupon free</span> on your first ride
          </h3>
          
          <div className="space-y-3">
            <GoldButton 
              onClick={() => {
                window.open('https://apps.apple.com', '_blank');
                onClose();
              }} 
              className="w-full py-4 text-base font-black uppercase"
            >
              Download App
            </GoldButton>
            
            <button 
              onClick={onClose}
              className="w-full py-3 text-sm font-bold text-gray-500 uppercase tracking-widest hover:text-white transition-colors"
            >
              Skip for Now
            </button>
          </div>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
};

export const WaitingForPaymentScreen = () => {
  const navigate = useNavigate();
  const [showAppPopup, setShowAppPopup] = useState(false);

  return (
    <div className="min-h-screen p-4 bg-black flex flex-col items-center justify-center">
      <div className="max-w-md w-full">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
        >
          <GlassCard className="p-10 text-center border-[#D4AF37]/20 shadow-2xl shadow-[#D4AF37]/5">
            {/* Animated Loader representing the active request */}
            <div className="relative mb-8">
              <Loader2 className="w-16 h-16 text-[#D4AF37] mx-auto animate-spin" />
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Car className="w-6 h-6 text-[#D4AF37]" />
              </motion.div>
            </div>

            <h2 className="text-2xl font-black text-white mb-2 uppercase italic tracking-tight">
              Request Sent
            </h2>
            
            <p className="text-gray-400 mb-8 font-medium leading-relaxed">
              The automated tracking link has been sent to the guest. <br />
              Waiting for destination entry and payment.
            </p>

            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] text-[#D4AF37] font-black uppercase tracking-widest">
                Status: Chauffeur Radar Active
              </div>
              
              <GoldButton 
                onClick={() => navigate('/home')} 
                className="w-full py-4 uppercase font-black"
              >
                Return to Dashboard
              </GoldButton>

              <button 
                onClick={() => setShowAppPopup(true)}
                className="w-full py-4 px-6 rounded-xl bg-white/5 border-2 border-white/10 text-white text-xs font-bold uppercase hover:bg-white/10 transition-all"
              >
                Resend Tracking SMS
              </button>

              <button 
                onClick={() => navigate(-1)}
                className="flex items-center justify-center gap-2 w-full text-gray-600 hover:text-gray-400 transition-colors text-xs font-bold uppercase"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
            </div>
          </GlassCard>
          <AnimatePresence>
            {showAppPopup && (
              <AppDownloadPopup onClose={() => setShowAppPopup(false)} />
            )}
          </AnimatePresence>
        </motion.div>

        {/* Informational footer for the concierge */}
        <p className="mt-8 text-center text-[10px] text-gray-600 font-bold uppercase tracking-widest px-6">
          Concierge will be notified once the passenger <br /> completes the secure payment flow.
        </p>
      </div>
    </div>
  );
};