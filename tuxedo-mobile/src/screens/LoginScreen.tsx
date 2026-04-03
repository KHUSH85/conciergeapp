import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { MotiView } from 'moti';
import { Shield, Phone, ArrowLeft } from 'lucide-react-native';
import { GlassCard, GoldButton } from '../components/GlassCard';
import { ScreenShell } from '../components/ScreenShell';
import { useApp } from '../context/AppContext';
import { loadMembershipState } from '../utils/appStorage';

const GOLD = '#D4AF37';

export const LoginScreen = ({ navigation }: any) => {
  const { setUser } = useApp();
  const [contact, setContact] = useState('');
  const [role, setRole] = useState<'concierge' | 'manager'>('concierge');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    if (otpSent && timer > 0) {
      const interval = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) { setCanResend(true); return 0; }
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
    }
  };

  const handleResendOTP = () => {
    setOtp(['', '', '', '', '', '']);
    setTimer(30);
    setCanResend(false);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value && !/^\d$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
    if (newOtp.every(d => d !== '') && index === 5) handleVerifyOTP(newOtp.join(''));
  };

  const handleVerifyOTP = async (otpCode: string) => {
    const persisted = await loadMembershipState();
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
      isMember: persisted.isMember,
      rideCredit: persisted.isMember ? persisted.rideCredit : 0,
    });
    navigation.replace('Home');
  };

  return (
    <ScreenShell keyboardAvoiding centerContent>
        <GlassCard style={styles.card}>
          {/* Header */}
          <MotiView from={{ opacity: 0, translateY: -20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', duration: 500 }}>
            <View style={styles.headerIcon}>
              <Shield color={GOLD} size={48} />
            </View>
            <Text style={styles.title}>TUXEDO CONCIERGE</Text>
            <Text style={styles.subtitle}>Luxury Ride Management</Text>
          </MotiView>

          {!otpSent ? (
            <MotiView from={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ type: 'timing', duration: 500, delay: 200 }}>
              {/* Role Toggle */}
              <View style={styles.roleRow}>
                {(['concierge', 'manager'] as const).map(r => (
                  <TouchableOpacity
                    key={r}
                    onPress={() => setRole(r)}
                    style={[styles.roleBtn, role === r && styles.roleBtnActive]}
                  >
                    <Text style={[styles.roleBtnText, role === r && styles.roleBtnTextActive]}>
                      {r.charAt(0).toUpperCase() + r.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Phone Input */}
              <View style={styles.inputWrap}>
                <Phone color={GOLD} size={20} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Phone Number or Email"
                  placeholderTextColor="#6b7280"
                  value={contact}
                  onChangeText={setContact}
                  keyboardType="phone-pad"
                  autoCapitalize="none"
                />
              </View>

              {/* Demo Accounts */}
              <View style={styles.demoBox}>
                <Text style={styles.demoLabel}>Demo Accounts (Tap to use):</Text>
                {[
                  { number: '+1 (555) 100-0001', label: 'Concierge Demo' },
                  { number: '+1 (555) 200-0002', label: 'Manager Demo' },
                ].map(demo => (
                  <TouchableOpacity key={demo.number} onPress={() => setContact(demo.number)} style={styles.demoItem}>
                    <Text style={styles.demoNumber}>{demo.number}</Text>
                    <Text style={styles.demoRole}>{demo.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <GoldButton onPress={handleSendOTP} disabled={!contact.trim()} style={styles.btn}>
                <Text style={styles.btnText}>Send OTP</Text>
              </GoldButton>
            </MotiView>
          ) : (
            <MotiView from={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ type: 'timing', duration: 400 }}>
              <TouchableOpacity onPress={() => { setOtpSent(false); setOtp(['','','','','','']); }} style={styles.backBtn}>
                <ArrowLeft color={GOLD} size={18} />
                <Text style={styles.backText}>Back</Text>
              </TouchableOpacity>

              <Text style={styles.otpTitle}>Enter Verification Code</Text>
              <Text style={styles.otpSub}>Code sent to {contact}</Text>

              {/* OTP Inputs */}
              <View style={styles.otpRow}>
                {otp.map((digit, i) => (
                  <TextInput
                    key={i}
                    ref={el => {
                      inputRefs.current[i] = el;
                    }}
                    style={[styles.otpInput, digit ? styles.otpInputFilled : null]}
                    value={digit}
                    onChangeText={v => handleOtpChange(i, v)}
                    keyboardType="number-pad"
                    maxLength={1}
                    textAlign="center"
                  />
                ))}
              </View>

              {/* Demo OTP */}
              <View style={styles.demoBox}>
                <Text style={styles.demoLabel}>Demo OTP (Tap to auto-fill):</Text>
                <TouchableOpacity
                  onPress={() => { const d = '123456'; setOtp(d.split('')); handleVerifyOTP(d); }}
                  style={styles.demoOtpBtn}
                >
                  <Text style={styles.demoOtpCode}>1  2  3  4  5  6</Text>
                  <Text style={styles.demoOtpHint}>Tap to use demo code</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.resendRow}>
                {!canResend ? (
                  <Text style={styles.timerText}>Resend code in <Text style={{ color: GOLD, fontWeight: 'bold' }}>{timer}s</Text></Text>
                ) : (
                  <TouchableOpacity onPress={handleResendOTP}>
                    <Text style={styles.resendText}>Resend OTP</Text>
                  </TouchableOpacity>
                )}
              </View>

              <GoldButton onPress={() => handleVerifyOTP(otp.join(''))} disabled={otp.some(d => d === '')} style={styles.btn}>
                <Text style={styles.btnText}>Verify & Login</Text>
              </GoldButton>
            </MotiView>
          )}

          <Text style={styles.footer}>Secure Device-Bound Authentication</Text>
        </GlassCard>
    </ScreenShell>
  );
};

const styles = StyleSheet.create({
  card: { padding: 24, maxWidth: '100%' },
  headerIcon: { alignItems: 'center', padding: 16, borderRadius: 50, backgroundColor: 'rgba(212,175,55,0.15)', borderWidth: 2, borderColor: 'rgba(212,175,55,0.3)', alignSelf: 'center', marginBottom: 16 },
  title: { fontSize: 26, color: '#fff', fontWeight: '900', textAlign: 'center', letterSpacing: 1 },
  subtitle: { fontSize: 14, color: '#9ca3af', textAlign: 'center', marginBottom: 24, fontWeight: '500' },
  roleRow: { flexDirection: 'row', justifyContent: 'center', gap: 12, marginBottom: 20 },
  roleBtn: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 10, borderWidth: 2, borderColor: 'rgba(212,175,55,0.3)', backgroundColor: 'rgba(0,0,0,0.5)' },
  roleBtnActive: { backgroundColor: GOLD, borderColor: GOLD },
  roleBtnText: { color: GOLD, fontWeight: '700', fontSize: 14, textTransform: 'capitalize' },
  roleBtnTextActive: { color: '#000' },
  inputWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)', borderWidth: 2, borderColor: 'rgba(212,175,55,0.3)', borderRadius: 12, paddingHorizontal: 14, marginBottom: 16 },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, color: '#fff', fontSize: 16, paddingVertical: 14, fontWeight: '500' },
  demoBox: { backgroundColor: 'rgba(0,0,0,0.6)', borderWidth: 2, borderColor: 'rgba(212,175,55,0.2)', borderRadius: 12, padding: 14, marginBottom: 20 },
  demoLabel: { color: '#6b7280', fontSize: 11, fontWeight: '500', marginBottom: 10 },
  demoItem: { backgroundColor: 'rgba(0,0,0,0.4)', borderWidth: 1, borderColor: 'rgba(212,175,55,0.2)', borderRadius: 8, padding: 10, marginBottom: 6 },
  demoNumber: { color: '#fff', fontWeight: '600', fontSize: 13 },
  demoRole: { color: '#6b7280', fontSize: 11, fontWeight: '500' },
  btn: { width: '100%', paddingVertical: 18 },
  btnText: { color: '#000', fontWeight: '900', fontSize: 16, textAlign: 'center' },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 20 },
  backText: { color: GOLD, fontWeight: '700', fontSize: 14 },
  otpTitle: { fontSize: 20, color: '#fff', fontWeight: '700', textAlign: 'center', marginBottom: 6 },
  otpSub: { fontSize: 13, color: '#9ca3af', textAlign: 'center', marginBottom: 24, fontWeight: '500' },
  otpRow: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 20 },
  otpInput: { width: 44, height: 54, backgroundColor: 'rgba(0,0,0,0.5)', borderWidth: 2, borderColor: 'rgba(212,175,55,0.3)', borderRadius: 12, color: '#fff', fontSize: 22, fontWeight: '700' },
  otpInputFilled: { borderColor: GOLD },
  demoOtpBtn: { backgroundColor: 'rgba(212,175,55,0.1)', borderWidth: 2, borderColor: 'rgba(212,175,55,0.4)', borderRadius: 10, padding: 14, alignItems: 'center' },
  demoOtpCode: { fontSize: 26, color: GOLD, fontWeight: '900', letterSpacing: 4 },
  demoOtpHint: { fontSize: 11, color: '#9ca3af', marginTop: 6, fontWeight: '500' },
  resendRow: { alignItems: 'center', marginBottom: 20 },
  timerText: { color: '#9ca3af', fontSize: 13, fontWeight: '500' },
  resendText: { color: GOLD, fontWeight: '700', fontSize: 13 },
  footer: { color: '#6b7280', fontSize: 12, textAlign: 'center', marginTop: 20, fontWeight: '500' },
});
