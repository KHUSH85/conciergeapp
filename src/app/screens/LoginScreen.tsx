import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlassCard, GoldButton } from '../components/GlassCard';
import { Shield, Mail, Phone, ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { motion } from 'motion/react';

export const LoginScreen = () => {
  const navigate = useNavigate();
  const { setUser } = useApp();
  const [contact, setContact] = useState('');
  const [role, setRole] = useState<'concierge' | 'manager'>('concierge');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Timer countdown for resend OTP
  useEffect(() => {
    if (otpSent && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [otpSent, timer]);

  const handleSendOTP = () => {
    if (contact.trim()) {
      setOtpSent(true);
      setTimer(30);
      setCanResend(false);
      // Mock OTP sent - in production, this would call an API
      console.log('OTP sent to:', contact);
    }
  };

  const handleResendOTP = () => {
    setOtp(['', '', '', '', '', '']);
    setTimer(30);
    setCanResend(false);
    inputRefs.current[0]?.focus();
    // Mock resend OTP
    console.log('OTP resent to:', contact);
  };

  const handleOtpChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all fields are filled
    if (newOtp.every(digit => digit !== '') && index === 5) {
      handleVerifyOTP(newOtp.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = pastedData.split('').concat(Array(6 - pastedData.length).fill(''));
    setOtp(newOtp);

    // Focus the next empty input or last input
    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();

    // Auto-submit if all fields filled
    if (pastedData.length === 6) {
      handleVerifyOTP(pastedData);
    }
  };

  const handleVerifyOTP = (otpCode: string) => {
    // Mock verification - in production, verify with backend
    console.log('Verifying OTP:', otpCode);
    
    // Simulate successful verification
    setUser({
      id: '1',
      name: 'James Anderson',
      email: contact.includes('@') ? contact : 'james@grandhotel.com',
      phone: contact.includes('@') ? '+1 (555) 123-4567' : contact,
      role,
      hotelId: 'hotel-1',
      hotelName: 'The Grand Majestic Hotel',
      deviceBound: true,
      deviceName: 'Concierge Desk Mobile',
      kycStatus: 'approved',
    });
    navigate('/home');
  };

  const handleBack = () => {
    setOtpSent(false);
    setOtp(['', '', '', '', '', '']);
    setTimer(30);
    setCanResend(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-black">
      <GlassCard className="w-full max-w-md p-8">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.div
            className="inline-block p-4 rounded-full bg-[#D4AF37]/20 border-2 border-[#D4AF37]/30 mb-4"
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ duration: 0.3 }}
          >
            <Shield className="w-12 h-12 text-[#D4AF37]" />
          </motion.div>
          <h1 className="text-3xl mb-2 text-white tracking-tight font-bold">TUXEDO CONCIERGE</h1>
          <p className="text-base text-gray-400 font-medium">Luxury Ride Management</p>
        </motion.div>

        {!otpSent ? (
          // Step 1: Contact Input
          <>
            <motion.div
              className="space-y-4 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="flex justify-center gap-3 mb-6">
                {(['concierge', 'manager'] as const).map((r, index) => (
                  <motion.button
                    key={r}
                    onClick={() => setRole(r)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                    className={`px-6 py-3 rounded-lg capitalize transition-all text-base font-bold border-2 ${
                      role === r
                        ? 'bg-[#D4AF37] text-black border-[#D4AF37] shadow-lg shadow-[#D4AF37]/40'
                        : 'bg-black/50 border-[#D4AF37]/30 text-[#D4AF37] hover:bg-black/70 hover:border-[#D4AF37]/50'
                    }`}
                  >
                    {r}
                  </motion.button>
                ))}
              </div>

              <motion.div
                className="relative"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.6 }}
              >
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#D4AF37]" />
                <input
                  type="tel"
                  placeholder="Phone Number or Email"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-black/50 border-2 border-[#D4AF37]/30 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] text-white placeholder-gray-500 text-base font-medium transition-all duration-200"
                />
              </motion.div>

              {/* Demo Credentials */}
              <motion.div
                className="p-4 bg-black/60 rounded-xl border-2 border-[#D4AF37]/20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.7 }}
              >
                <p className="text-xs text-gray-500 font-medium mb-3">Demo Accounts (Click to use):</p>
                <div className="space-y-2">
                  {[
                    { number: '+1 (555) 100-0001', label: 'Concierge Demo' },
                    { number: '+1 (555) 200-0002', label: 'Manager Demo' },
                  ].map((demo, index) => (
                    <motion.button
                      key={demo.number}
                      onClick={() => setContact(demo.number)}
                      className="w-full p-3 bg-black/40 rounded-lg border border-[#D4AF37]/20 hover:border-[#D4AF37]/40 hover:bg-black/60 transition-all text-left"
                      whileHover={{ x: 3 }}
                      whileTap={{ scale: 0.98 }}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: 0.8 + index * 0.05 }}
                    >
                      <p className="text-sm text-white font-semibold">{demo.number}</p>
                      <p className="text-xs text-gray-500 font-medium">{demo.label}</p>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.8 }}
            >
              <GoldButton
                onClick={handleSendOTP}
                className="w-full text-xl py-5"
                disabled={!contact.trim()}
              >
                Send OTP
              </GoldButton>
            </motion.div>
          </>
        ) : (
          // Step 2: OTP Verification
          <>
            <motion.button
              onClick={handleBack}
              className="mb-6 text-base text-[#D4AF37] hover:text-[#B8962A] flex items-center gap-2 font-semibold"
              whileHover={{ x: -5 }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </motion.button>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-8"
            >
              <h2 className="text-xl mb-2 text-white font-bold text-center">Enter Verification Code</h2>
              <p className="text-sm text-gray-400 font-medium text-center mb-6">
                Code sent to {contact}
              </p>

              <div className="flex justify-center gap-2 mb-6" onPaste={handlePaste}>
                {otp.map((digit, index) => (
                  <motion.input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    autoComplete={index === 0 ? "one-time-code" : "off"}
                    className="w-12 h-14 text-center text-2xl font-bold bg-black/50 border-2 border-[#D4AF37]/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-all duration-200"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2, delay: 0.3 + index * 0.05 }}
                  />
                ))}
              </div>

              {/* Demo OTP */}
              <motion.div
                className="mb-6 p-4 bg-black/60 rounded-xl border-2 border-[#D4AF37]/20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.5 }}
              >
                <p className="text-xs text-gray-500 font-medium mb-3 text-center">Demo OTP (Click to auto-fill):</p>
                <motion.button
                  onClick={() => {
                    const demoOtp = '123456';
                    setOtp(demoOtp.split(''));
                    handleVerifyOTP(demoOtp);
                  }}
                  className="w-full p-4 bg-[#D4AF37]/10 rounded-lg border-2 border-[#D4AF37]/40 hover:bg-[#D4AF37]/20 hover:border-[#D4AF37]/60 transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <p className="text-3xl text-[#D4AF37] font-black tracking-widest">1 2 3 4 5 6</p>
                  <p className="text-xs text-gray-400 font-medium mt-2">Tap to use demo code</p>
                </motion.button>
              </motion.div>

              <div className="text-center mb-6">
                {!canResend ? (
                  <p className="text-sm text-gray-400 font-medium">
                    Resend code in <span className="text-[#D4AF37] font-bold">{timer}s</span>
                  </p>
                ) : (
                  <motion.button
                    onClick={handleResendOTP}
                    className="text-sm text-[#D4AF37] hover:text-[#B8962A] font-bold transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Resend OTP
                  </motion.button>
                )}
              </div>

              <GoldButton
                onClick={() => handleVerifyOTP(otp.join(''))}
                className="w-full text-xl py-5"
                disabled={otp.some(digit => digit === '')}
              >
                Verify & Login
              </GoldButton>
            </motion.div>
          </>
        )}

        <motion.p
          className="text-center text-sm text-gray-400 mt-6 font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.9 }}
        >
          Secure Device-Bound Authentication
        </motion.p>
      </GlassCard>
    </div>
  );
};