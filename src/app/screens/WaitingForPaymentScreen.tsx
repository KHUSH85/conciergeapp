import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Loader2, Car, ArrowLeft } from 'lucide-react';
import { GlassCard, GoldButton } from '../components/GlassCard';

export const WaitingForPaymentScreen = () => {
  const navigate = useNavigate();

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
                onClick={() => navigate(-1)}
                className="flex items-center justify-center gap-2 w-full text-gray-600 hover:text-gray-400 transition-colors text-xs font-bold uppercase"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Config
              </button>
            </div>
          </GlassCard>
        </motion.div>

        {/* Informational footer for the concierge */}
        <p className="mt-8 text-center text-[10px] text-gray-600 font-bold uppercase tracking-widest px-6">
          Concierge will be notified once the passenger <br /> completes the secure payment flow.
        </p>
      </div>
    </div>
  );
};