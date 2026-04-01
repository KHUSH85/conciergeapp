// Schedule Booking Screen - Scheduled ride flow only
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { GlassCard, GoldButton } from '../components/GlassCard';
import { useApp } from '../context/AppContext';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Car,
  Phone,
  Mail,
  ChevronRight,
  User,
  // MessageSquare, // used when Counter Request step is uncommented
} from 'lucide-react';

// Step indicator
type Step = 'schedule' | 'chauffeur' | 'counter' | 'confirm';

// Counter Request step is temporarily disabled (UI preserved in comment block below).
const STEPS: Step[] = ['schedule', 'chauffeur', 'confirm'];

export const ScheduleBookingScreen = () => {
  const navigate = useNavigate();
  const { user } = useApp();

  const [step, setStep] = useState<Step>('schedule');

  // Date / time fields
  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  // Chauffeur preference (optional)
  const [chooseChauffeur, setChooseChauffeur] = useState<boolean | null>(null);

  // Counter request (only in schedule flow)
  const [hasCounterRequest, setHasCounterRequest] = useState<boolean | null>(null);
  const [counterNote, setCounterNote] = useState('');

  // Booking form
  const [guestPhone, setGuestPhone] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [contactMethod, setContactMethod] = useState<'phone' | 'email'>('phone');

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleEmailChange = (val: string) => {
    setGuestEmail(val);
    if (val && !validateEmail(val)) {
      setEmailError('Please enter a valid email address');
    } else {
      setEmailError('');
    }
  };

  const canProceedSchedule = selectedDate && selectedTime;
  const canProceedChauffeur = chooseChauffeur !== null;
  // const canProceedCounter = hasCounterRequest !== null; // when Counter Request step is re-enabled
  const canSubmit = contactMethod === 'phone' 
    ? guestPhone.length > 5 
    : (guestEmail && validateEmail(guestEmail) && !emailError);

  const goNext = () => {
    const idx = STEPS.indexOf(step);
    if (idx < STEPS.length - 1) setStep(STEPS[idx + 1]);
  };

  const goBack = () => {
    const idx = STEPS.indexOf(step);
    if (idx === 0) navigate(-1);
    else setStep(STEPS[idx - 1]);
  };

  const handleRequest = () => {
    // REQUIREMENT: Tracking link send logic trigger
    if (contactMethod === 'email' && guestEmail) {
      console.log(`[Email Service] Tracking link sent to email: ${guestEmail}`);
    } else if (contactMethod === 'phone' && guestPhone) {
      console.log(`[SMS Service] Tracking link sent to phone: ${guestPhone}`);
    }

    // Pass schedule data along in navigation state to maintain API structure
    navigate('/waiting-payment', {
      state: {
        bookingMode: 'scheduled',
        scheduledDate: selectedDate,
        scheduledTime: selectedTime,
        chooseChauffeur,
        counterRequest: hasCounterRequest ? counterNote : null,
        guestPhone: contactMethod === 'phone' ? guestPhone : '',
        guestEmail: contactMethod === 'email' ? guestEmail : '',
        pickupLocation: user?.hotelName || "The Grand Majestic Hotel",
      },
    });
  };

  return (
    <div className="min-h-screen p-4 bg-black">
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <motion.button
          onClick={goBack}
          className="mb-6 text-base text-[#D4AF37] hover:text-[#B8962A] flex items-center gap-2 font-semibold"
          whileHover={{ x: -5 }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </motion.button>

        {/* Step Indicators */}
        <motion.div
          className="flex items-center justify-center gap-2 mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  STEPS.indexOf(step) >= i
                    ? 'bg-[#D4AF37]'
                    : 'bg-gray-700'
                }`}
              />
              {i < STEPS.length - 1 && (
                <div className="w-6 h-px bg-gray-700" />
              )}
            </div>
          ))}
        </motion.div>

        {/* ─── STEP 1: Date & Time ─── */}
        {step === 'schedule' && (
          <GlassCard className="p-8">
            <motion.h2
              className="text-2xl mb-2 text-white font-bold"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Schedule a Ride
            </motion.h2>
            <p className="text-sm text-gray-400 font-medium mb-8 italic">
              Choose the date and time for the guest's ride.
            </p>

            <div className="space-y-5 mb-8">
              {/* Date Picker */}
              <motion.div
                className="relative"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#D4AF37]" />
                <input
                  type="date"
                  value={selectedDate}
                  min={today}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-black/60 border-2 border-[#D4AF37]/30 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] text-white text-base font-medium transition-all duration-200 [color-scheme:dark]"
                />
              </motion.div>

              {/* Time Picker */}
              <motion.div
                className="relative"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#D4AF37]" />
                <input
                  type="time"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-black/60 border-2 border-[#D4AF37]/30 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] text-white text-base font-medium transition-all duration-200 [color-scheme:dark]"
                />
              </motion.div>
            </div>

            {/* Schedule summary if filled */}
            {canProceedSchedule && (
              <motion.div
                className="mb-6 p-4 bg-[#D4AF37]/10 rounded-xl border-2 border-[#D4AF37]/40"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <p className="text-xs text-[#D4AF37] font-black uppercase tracking-widest mb-1">Scheduled For</p>
                <p className="text-lg text-white font-bold">
                  {new Date(selectedDate + 'T' + selectedTime).toLocaleString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </motion.div>
            )}

            <GoldButton
              onClick={goNext}
              className="w-full py-5 text-xl font-black uppercase"
              disabled={!canProceedSchedule}
              icon={<ChevronRight className="w-5 h-5" />}
            >
              Continue
            </GoldButton>
          </GlassCard>
        )}

        {/* ─── STEP 2: Choose Chauffeur ─── */}
        {step === 'chauffeur' && (
          <GlassCard className="p-8">
            <motion.h2
              className="text-2xl mb-2 text-white font-bold"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Choose Chauffeur
            </motion.h2>
            <p className="text-sm text-gray-400 font-medium mb-8 italic">
              Would you like to pre-select a chauffeur for this booking?
            </p>

            <div className="space-y-4 mb-8">
              {[
                {
                  id: true,
                  title: 'Yes, Choose a Chauffeur',
                  desc: 'Browse and select a preferred driver',
                  icon: User,
                },
                {
                  id: false,
                  title: 'Auto-Assign',
                  desc: 'Best available chauffeur will be assigned',
                  icon: Car,
                },
              ].map(({ id, title, desc, icon: Icon }) => (
                <motion.button
                  key={String(id)}
                  onClick={() => setChooseChauffeur(id)}
                  className={`w-full p-5 rounded-xl border-2 transition-all text-left ${
                    chooseChauffeur === id
                      ? 'border-[#D4AF37] bg-[#D4AF37]/10'
                      : 'border-[#D4AF37]/20 bg-black/40 hover:border-[#D4AF37]/40'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-black/40 border border-[#D4AF37]/20">
                      <Icon className="w-6 h-6 text-[#D4AF37]" />
                    </div>
                    <div>
                      <p className="text-base font-bold text-white">{title}</p>
                      <p className="text-sm text-gray-400 font-medium">{desc}</p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>

            <GoldButton
              onClick={() => {
                if (chooseChauffeur === true) {
                  // Go to driver list first, then come back to counter step
                  navigate('/driver-list', {
                    state: {
                      bookingMode: 'scheduled',
                      returnTo: '/schedule-booking',
                      scheduleStep: 'confirm',
                    },
                  });
                } else {
                  goNext();
                }
              }}
              className="w-full py-5 text-xl font-black uppercase"
              disabled={!canProceedChauffeur}
              icon={<ChevronRight className="w-5 h-5" />}
            >
              Continue
            </GoldButton>
          </GlassCard>
        )}

        {/* ─── STEP 3: Counter Request (commented out — re-add 'counter' to STEPS above to restore) ─── */}
        {/*
        {step === 'counter' && (
          <GlassCard className="p-8">
            <motion.h2
              className="text-2xl mb-2 text-white font-bold"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Counter Request
            </motion.h2>
            <p className="text-sm text-gray-400 font-medium mb-8 italic">
              Would you like to add a special counter request or note for this booking?
            </p>

            <div className="space-y-4 mb-6">
              {[
                { id: true, title: 'Yes, Add a Request', desc: 'Add special instructions or notes' },
                { id: false, title: 'No Special Requests', desc: 'Proceed with standard booking' },
              ].map(({ id, title, desc }) => (
                <motion.button
                  key={String(id)}
                  onClick={() => setHasCounterRequest(id)}
                  className={`w-full p-5 rounded-xl border-2 transition-all text-left ${
                    hasCounterRequest === id
                      ? 'border-[#D4AF37] bg-[#D4AF37]/10'
                      : 'border-[#D4AF37]/20 bg-black/40 hover:border-[#D4AF37]/40'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <p className="text-base font-bold text-white">{title}</p>
                  <p className="text-sm text-gray-400 font-medium">{desc}</p>
                </motion.button>
              ))}
            </div>

            {hasCounterRequest === true && (
              <motion.div
                className="relative mb-6"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
              >
                <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-[#D4AF37]" />
                <textarea
                  rows={3}
                  placeholder="e.g. Please have water & newspaper in the vehicle..."
                  value={counterNote}
                  onChange={(e) => setCounterNote(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-black/60 border-2 border-[#D4AF37]/30 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] text-white placeholder-gray-500 text-base font-medium transition-all duration-200 resize-none"
                />
              </motion.div>
            )}

            <GoldButton
              onClick={goNext}
              className="w-full py-5 text-xl font-black uppercase"
              disabled={hasCounterRequest === null}
              icon={<ChevronRight className="w-5 h-5" />}
            >
              Continue
            </GoldButton>
          </GlassCard>
        )}
        */}

        {/* ─── STEP 4: Booking Form / Confirm ─── */}
        {step === 'confirm' && (
          <GlassCard className="p-8">
            <motion.h2
              className="text-2xl mb-2 text-white font-bold"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Guest Information
            </motion.h2>
            <p className="text-sm text-gray-400 mb-6 font-medium italic">
              * Tracking link will be sent automatically to the guest.
            </p>

            {/* Schedule Summary */}
            <motion.div
              className="mb-6 p-4 bg-[#D4AF37]/10 rounded-xl border-2 border-[#D4AF37]/40"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
            >
              <p className="text-xs text-[#D4AF37] font-black uppercase tracking-widest mb-1">Scheduled Ride</p>
              <p className="text-base text-white font-bold">
                {(() => {
                  const d = new Date(selectedDate + 'T' + selectedTime);
                  const weekday = d.toLocaleString('en-US', { weekday: 'long' });
                  const day = d.getDate();
                  const month = d.toLocaleString('en-US', { month: 'long' });
                  const timeStr = d.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
                  return `${weekday}, ${day} ${month} at ${timeStr}`;
                })()}
              </p>
              {hasCounterRequest && counterNote && (
                <p className="text-sm text-gray-400 mt-2 font-medium">Note: {counterNote}</p>
              )}
            </motion.div>

            <div className="space-y-6 mb-8">
              <AnimatePresence mode="wait">
                {contactMethod === 'phone' ? (
                  <motion.div
                    key="phone"
                    className="relative"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#D4AF37]" />
                    <input
                      type="tel"
                      placeholder="Guest Phone Number"
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 rounded-xl bg-black/60 border-2 border-[#D4AF37]/30 text-white text-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-all duration-200"
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="email"
                    className="relative"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#D4AF37]" />
                    <input
                      type="email"
                      placeholder="Guest Email Address"
                      value={guestEmail}
                      onChange={(e) => handleEmailChange(e.target.value)}
                      className={`w-full pl-12 pr-4 py-4 rounded-xl bg-black/60 border-2 text-white text-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition-all duration-200 ${
                        emailError
                          ? 'border-red-500/60 focus:border-red-500'
                          : 'border-[#D4AF37]/30 focus:border-[#D4AF37]'
                      }`}
                    />
                    {emailError && (
                      <motion.p
                        className="text-xs text-red-400 mt-1 ml-1 font-medium"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        {emailError}
                      </motion.p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              <button 
                onClick={() => setContactMethod(contactMethod === 'phone' ? 'email' : 'phone')}
                className="text-[#D4AF37] text-sm font-bold hover:underline transition-all flex items-center gap-2"
              >
                {contactMethod === 'phone' ? (
                  <>Don't have a phone? Use Email instead</>
                ) : (
                  <>Use Phone Number instead</>
                )}
              </button>
            </div>

            <GoldButton
              onClick={handleRequest}
              className="w-full uppercase font-black py-5 text-lg"
              disabled={!canSubmit}
            >
              Send Chauffeur Request
            </GoldButton>

            {/* Requirement: Counter Request Button (Only in scheduled flow) — commented out with Counter step */}
            {/*
            <GoldButton
              variant="secondary"
              onClick={() => setStep('counter')}
              className="w-full mt-4 uppercase font-black py-4 text-xs tracking-widest border-[#D4AF37]/20"
            >
              Counter Request
            </GoldButton>
            */}
          </GlassCard>
        )}
      </div>
    </div>
  );
};
