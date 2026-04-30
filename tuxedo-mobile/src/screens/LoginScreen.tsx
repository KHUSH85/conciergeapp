import React, { useState, useRef, useCallback } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Modal, FlatList,
} from 'react-native';
import { MotiView } from 'moti';
import { Easing } from 'react-native-reanimated';
import { AppScreen } from '../components/AppScreen';
import { AppButton } from '../components/AppButton';
import { AppInput } from '../components/AppInput';
import { useHaptics } from '../hooks/useHaptics';
import { useStaggerAnimation } from '../hooks/useStaggerAnimation';
import { useApp } from '../context/AppContext';
import { loadMembershipState } from '../utils/appStorage';
import { isUserOnboarded } from './FirstTimeSetupScreen';

const GOLD       = '#D4AF37';
const GOLD_DIM   = 'rgba(212,175,55,0.25)';
const GOLD_FAINT = 'rgba(212,175,55,0.08)';
const WHITE      = '#FFFFFF';
const GREY       = '#6B7280';
const GREY_LIGHT = '#9CA3AF';
const BLACK      = '#000000';
const SURFACE    = 'rgba(255,255,255,0.04)';
const BORDER     = 'rgba(255,255,255,0.08)';
const SHEET_BG   = '#111111';

interface Country { name: string; dial: string; code: string; }

const COUNTRIES: Country[] = [
  { name: 'Germany',        dial: '+49',  code: 'DE' },
  { name: 'United States',  dial: '+1',   code: 'US' },
  { name: 'United Kingdom', dial: '+44',  code: 'GB' },
  { name: 'France',         dial: '+33',  code: 'FR' },
  { name: 'Switzerland',    dial: '+41',  code: 'CH' },
  { name: 'Austria',        dial: '+43',  code: 'AT' },
  { name: 'Netherlands',    dial: '+31',  code: 'NL' },
  { name: 'Italy',          dial: '+39',  code: 'IT' },
  { name: 'Spain',          dial: '+34',  code: 'ES' },
  { name: 'Belgium',        dial: '+32',  code: 'BE' },
  { name: 'Sweden',         dial: '+46',  code: 'SE' },
  { name: 'Norway',         dial: '+47',  code: 'NO' },
  { name: 'Denmark',        dial: '+45',  code: 'DK' },
  { name: 'Poland',         dial: '+48',  code: 'PL' },
  { name: 'Portugal',       dial: '+351', code: 'PT' },
  { name: 'Canada',         dial: '+1',   code: 'CA' },
  { name: 'Australia',      dial: '+61',  code: 'AU' },
  { name: 'Japan',          dial: '+81',  code: 'JP' },
  { name: 'UAE',            dial: '+971', code: 'AE' },
  { name: 'Saudi Arabia',   dial: '+966', code: 'SA' },
  { name: 'Singapore',      dial: '+65',  code: 'SG' },
  { name: 'India',          dial: '+91',  code: 'IN' },
];

const DEFAULT_COUNTRY = COUNTRIES[0];

interface CountryPickerProps { selected: Country; onSelect: (c: Country) => void; }

const CountryPicker: React.FC<CountryPickerProps> = ({ selected, onSelect }) => {
  const [visible, setVisible] = useState(false);
  const [search, setSearch] = useState('');
  const { light } = useHaptics();

  const filtered = search.trim()
    ? COUNTRIES.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) || c.dial.includes(search))
    : COUNTRIES;

  const handleSelect = async (c: Country) => {
    await light();
    onSelect(c);
    setVisible(false);
    setSearch('');
  };

  return (
    <>
      <TouchableOpacity onPress={() => setVisible(true)} activeOpacity={0.7} style={styles.countryBtn}>
        <Text style={styles.countryCode}>{selected.code}</Text>
        <Text style={styles.dialCode}>{selected.dial}</Text>
        <Text style={styles.chevron}>v</Text>
        <View style={styles.codeDivider} />
      </TouchableOpacity>

      <Modal visible={visible} animationType="slide" transparent onRequestClose={() => setVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>Select country</Text>
            <View style={styles.searchWrap}>
              <TextInput
                style={styles.searchInput}
                value={search}
                onChangeText={setSearch}
                placeholder="Search country or code"
                placeholderTextColor={GREY}
                selectionColor={GOLD}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            <FlatList
              data={filtered}
              keyExtractor={item => item.code}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleSelect(item)}
                  activeOpacity={0.6}
                  style={[styles.countryRow, item.code === selected.code && styles.countryRowActive]}
                >
                  <Text style={styles.countryRowCode}>{item.code}</Text>
                  <Text style={styles.countryName}>{item.name}</Text>
                  <Text style={[styles.countryDial, item.code === selected.code && styles.countryDialActive]}>
                    {item.dial}
                  </Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              onPress={() => { setVisible(false); setSearch(''); }}
              activeOpacity={0.7}
              style={styles.sheetClose}
            >
              <Text style={styles.sheetCloseText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

interface PhoneStepProps {
  phone: string; setPhone: (v: string) => void;
  country: Country; setCountry: (c: Country) => void;
  role: 'concierge' | 'manager'; setRole: (r: 'concierge' | 'manager') => void;
  onContinue: () => void; loading: boolean;
}

const PhoneStep: React.FC<PhoneStepProps> = ({
  phone, setPhone, country, setCountry, role, setRole, onContinue, loading,
}) => {
  const { light } = useHaptics();
  const isValid = phone.replace(/\D/g, '').length >= 7;

  return (
    <MotiView
      from={{ opacity: 0, translateX: -24 }}
      animate={{ opacity: 1, translateX: 0 }}
      transition={{ type: 'timing', duration: 260, easing: Easing.out(Easing.quad) }}
    >
      <Text style={styles.fieldLabel}>Sign in as</Text>
      <View style={styles.roleRow}>
        {(['concierge', 'manager'] as const).map(r => (
          <TouchableOpacity
            key={r}
            onPress={async () => { await light(); setRole(r); }}
            activeOpacity={0.7}
            style={[styles.roleChip, role === r && styles.roleChipActive]}
            accessibilityRole="radio"
            accessibilityState={{ selected: role === r }}
          >
            <Text style={[styles.roleChipText, role === r && styles.roleChipTextActive]}>
              {r === 'concierge' ? 'Concierge' : 'Manager'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.fieldLabel}>Phone number</Text>
      <AppInput
        containerStyle={styles.phoneInputContainer}
        leftSlot={<CountryPicker selected={country} onSelect={setCountry} />}
        value={phone}
        onChangeText={setPhone}
        placeholder="Enter your number"
        keyboardType="phone-pad"
        autoFocus
        maxLength={15}
        onSubmitEditing={isValid ? onContinue : undefined}
        returnKeyType="done"
        autoCapitalize="none"
        style={styles.phoneInput}
      />

      <View style={styles.demoSection}>
        <Text style={styles.demoHeading}>Demo accounts</Text>
        {[
          { number: '1511000001', label: 'Concierge' },
          { number: '1522000002', label: 'Manager'   },
        ].map(d => (
          <TouchableOpacity
            key={d.number}
            onPress={async () => {
              await light();
              setPhone(d.number);
              setRole(d.label.toLowerCase() as 'concierge' | 'manager');
            }}
            activeOpacity={0.6}
            style={styles.demoRow}
          >
            <Text style={styles.demoNumber}>{country.dial} {d.number}</Text>
            <View style={styles.demoBadge}>
              <Text style={styles.demoBadgeText}>{d.label}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <AppButton
        label="Continue"
        onPress={onContinue}
        disabled={!isValid}
        loading={loading}
        style={styles.ctaBtn}
      />

      <Text style={styles.legal}>
        By continuing, you agree to our Terms of Service and Privacy Policy
      </Text>
    </MotiView>
  );
};

const OTP_LENGTH = 6;

interface OtpStepProps {
  phone: string; dialCode: string;
  onVerify: (code: string) => void;
  onBack: () => void; loading: boolean;
}

const OtpStep: React.FC<OtpStepProps> = ({ phone, dialCode, onVerify, onBack, loading }) => {
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''));
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { light, success } = useHaptics();

  const startTimer = useCallback(() => {
    setTimer(30); setCanResend(false);
    timerRef.current = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) { clearInterval(timerRef.current!); setCanResend(true); return 0; }
        return prev - 1;
      });
    }, 1000);
  }, []);

  React.useEffect(() => {
    setTimeout(() => inputRefs.current[0]?.focus(), 100);
    startTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const handleChange = useCallback((index: number, value: string) => {
    if (value && !/^\d$/.test(value)) return;
    const next = [...otp]; next[index] = value; setOtp(next);
    if (value && index < OTP_LENGTH - 1) inputRefs.current[index + 1]?.focus();
    if (next.every(d => d !== '') && index === OTP_LENGTH - 1) {
      success();
      onVerify(next.join(''));
    }
  }, [otp, onVerify, success]);

  const handleKeyPress = useCallback((index: number, key: string) => {
    if (key === 'Backspace' && !otp[index] && index > 0) inputRefs.current[index - 1]?.focus();
  }, [otp]);

  const handleResend = async () => {
    await light();
    setOtp(Array(OTP_LENGTH).fill(''));
    inputRefs.current[0]?.focus();
    startTimer();
  };

  const handleDemoFill = async () => {
    await light();
    setOtp('123456'.split(''));
    setTimeout(() => onVerify('123456'), 120);
  };

  const masked = phone.length > 4 ? phone.slice(0, 2) + '....' + phone.slice(-2) : phone;

  return (
    <MotiView
      from={{ opacity: 0, translateX: 24 }}
      animate={{ opacity: 1, translateX: 0 }}
      transition={{ type: 'timing', duration: 260, easing: Easing.out(Easing.quad) }}
    >
      <TouchableOpacity onPress={onBack} activeOpacity={0.7} style={styles.backRow}>
        <Text style={styles.backArrow}>Back</Text>
        <Text style={styles.backLabel}>Change number</Text>
      </TouchableOpacity>

      <Text style={styles.otpHeading}>Verification code</Text>
      <Text style={styles.otpSub}>Sent to {dialCode} {masked}</Text>

      <View style={styles.otpRow}>
        {otp.map((digit, i) => (
          <MotiView
            key={i}
            animate={{ borderColor: digit ? GOLD : GOLD_DIM, backgroundColor: digit ? GOLD_FAINT : SURFACE }}
            transition={{ type: 'timing', duration: 150 }}
            style={styles.otpBox}
          >
            <TextInput
              ref={el => { inputRefs.current[i] = el; }}
              style={styles.otpInput}
              value={digit}
              onChangeText={v => handleChange(i, v)}
              onKeyPress={({ nativeEvent }) => handleKeyPress(i, nativeEvent.key)}
              keyboardType="number-pad"
              maxLength={1}
              textAlign="center"
              selectionColor={GOLD}
              caretHidden
            />
          </MotiView>
        ))}
      </View>

      <View style={styles.resendRow}>
        {canResend
          ? <TouchableOpacity onPress={handleResend} activeOpacity={0.7}><Text style={styles.resendActive}>Resend code</Text></TouchableOpacity>
          : <Text style={styles.resendTimer}>Resend in <Text style={styles.resendGold}>{timer}s</Text></Text>
        }
      </View>

      <TouchableOpacity onPress={handleDemoFill} activeOpacity={0.6} style={styles.demoOtp}>
        <Text style={styles.demoOtpLabel}>Demo code</Text>
        <Text style={styles.demoOtpCode}>1 2 3 4 5 6</Text>
      </TouchableOpacity>

      <AppButton
        label="Verify and Sign in"
        onPress={() => onVerify(otp.join(''))}
        disabled={otp.some(d => !d)}
        loading={loading}
        haptic="success"
        style={styles.ctaBtn}
      />
    </MotiView>
  );
};

export const LoginScreen = ({ navigation }: any) => {
  const { setUser } = useApp();
  const delays = useStaggerAnimation();
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState<Country>(DEFAULT_COUNTRY);
  const [role, setRole] = useState<'concierge' | 'manager'>('concierge');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);

  const handleContinue = useCallback(async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setLoading(false);
    setStep('otp');
  }, []);

  const handleVerify = useCallback(async (code: string) => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const persisted = await loadMembershipState();
    setUser({
      id: '1',
      name: role === 'manager' ? 'Sarah Mitchell' : 'James Anderson',
      email: role === 'manager' ? 'sarah@grandhotel.com' : 'james@grandhotel.com',
      phone: `${country.dial}${phone}`,
      role,
      hotelId: 'hotel-1',
      hotelName: 'The Grand Majestic Hotel',
      deviceBound: true,
      deviceName: 'Concierge Desk Mobile',
      kycStatus: 'approved',
      isMember: persisted.isMember,
      rideCredit: persisted.isMember ? persisted.rideCredit : 0,
    });
    setLoading(false);
    const onboarded = await isUserOnboarded();
    if (onboarded) {
      navigation.replace('Home');
    } else {
      navigation.replace('FirstTimeSetup', { role });
    }
  }, [phone, country, role, setUser, navigation]);

  return (
    <AppScreen keyboardAvoiding contentStyle={styles.scroll}>
      <MotiView
        from={{ opacity: 0, translateY: -16 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 280, delay: delays.header }}
        style={styles.logoArea}
      >
        <View style={styles.logoRing}>
          <Text style={styles.logoMark}>T</Text>
        </View>
        <Text style={styles.brandName}>TUXEDO</Text>
        <Text style={styles.tagline}>Premium Chauffeur Service</Text>
      </MotiView>

      <MotiView
        from={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ type: 'timing', duration: 280, delay: delays.content }}
        style={styles.divider}
      />

      <MotiView
        from={{ opacity: 0, translateY: 12 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 260, delay: delays.cta }}
        style={styles.form}
      >
        {step === 'phone' ? (
          <PhoneStep
            phone={phone} setPhone={setPhone}
            country={country} setCountry={setCountry}
            role={role} setRole={setRole}
            onContinue={handleContinue} loading={loading}
          />
        ) : (
          <OtpStep
            phone={phone} dialCode={country.dial}
            onVerify={handleVerify}
            onBack={() => setStep('phone')}
            loading={loading}
          />
        )}
      </MotiView>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  scroll: { paddingTop: 32, paddingBottom: 40 },
  logoArea: { alignItems: 'center', marginBottom: 32 },
  logoRing: {
    width: 80, height: 80, borderRadius: 40,
    borderWidth: 1, borderColor: GOLD_DIM,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: GOLD_FAINT, marginBottom: 16,
  },
  logoMark: { fontSize: 38, fontWeight: '200', color: GOLD, letterSpacing: 2, lineHeight: 44 },
  brandName: { fontSize: 26, fontWeight: '300', color: WHITE, letterSpacing: 10, marginBottom: 6 },
  tagline: { fontSize: 12, color: GREY_LIGHT, letterSpacing: 2, fontWeight: '400' },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: BORDER, marginBottom: 32 },
  form: { flex: 1 },
  fieldLabel: {
    fontSize: 11, color: GREY, letterSpacing: 1.5,
    textTransform: 'uppercase', marginBottom: 10, fontWeight: '500',
  },
  roleRow: { flexDirection: 'row', gap: 10, marginBottom: 28 },
  roleChip: {
    flex: 1, paddingVertical: 14, borderRadius: 10,
    borderWidth: 1, borderColor: BORDER, backgroundColor: SURFACE, alignItems: 'center',
  },
  roleChipActive: { borderColor: GOLD_DIM, backgroundColor: GOLD_FAINT },
  roleChipText: { fontSize: 14, color: GREY_LIGHT, fontWeight: '500' },
  roleChipTextActive: { color: GOLD, fontWeight: '600' },
  phoneInputContainer: { marginBottom: 24 },
  phoneInput: { paddingLeft: 4 },
  countryBtn: {
    flexDirection: 'row', alignItems: 'center',
    paddingLeft: 14, paddingRight: 2, gap: 5,
  },
  countryCode: { fontSize: 12, color: WHITE, fontWeight: '600' },
  dialCode: { fontSize: 13, color: WHITE, fontWeight: '500' },
  chevron: { fontSize: 10, color: GREY, marginLeft: 2 },
  codeDivider: { width: 1, height: 20, backgroundColor: BORDER, marginLeft: 6 },
  ctaBtn: { width: '100%', marginBottom: 20 },
  demoSection: { marginBottom: 28, gap: 8 },
  demoHeading: {
    fontSize: 11, color: GREY, letterSpacing: 1.5,
    textTransform: 'uppercase', fontWeight: '500', marginBottom: 4,
  },
  demoRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 14, paddingHorizontal: 14,
    backgroundColor: SURFACE, borderWidth: 1, borderColor: BORDER, borderRadius: 10,
  },
  demoNumber: { fontSize: 14, color: WHITE, fontWeight: '500', letterSpacing: 0.5 },
  demoBadge: {
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6,
    borderWidth: 1, borderColor: GOLD_DIM, backgroundColor: GOLD_FAINT,
  },
  demoBadgeText: { fontSize: 11, color: GOLD, fontWeight: '600' },
  legal: { fontSize: 12, color: GREY, textAlign: 'center', lineHeight: 18 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalSheet: {
    backgroundColor: SHEET_BG, borderTopLeftRadius: 20, borderTopRightRadius: 20,
    paddingBottom: 32, maxHeight: '80%',
  },
  sheetHandle: {
    width: 36, height: 4, borderRadius: 2,
    backgroundColor: BORDER, alignSelf: 'center', marginTop: 12, marginBottom: 16,
  },
  sheetTitle: {
    fontSize: 16, color: WHITE, fontWeight: '500',
    paddingHorizontal: 20, marginBottom: 14, letterSpacing: 0.3,
  },
  searchWrap: {
    marginHorizontal: 16, marginBottom: 8,
    backgroundColor: SURFACE, borderWidth: 1, borderColor: BORDER,
    borderRadius: 10, paddingHorizontal: 14,
  },
  searchInput: { color: WHITE, fontSize: 15, paddingVertical: 11 },
  countryRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 13, paddingHorizontal: 20, gap: 12,
  },
  countryRowActive: { backgroundColor: GOLD_FAINT },
  countryRowCode: { fontSize: 13, width: 32, color: WHITE, fontWeight: '600' },
  countryName: { flex: 1, fontSize: 15, color: WHITE, fontWeight: '400' },
  countryDial: { fontSize: 14, color: GREY, fontWeight: '500' },
  countryDialActive: { color: GOLD },
  sheetClose: {
    marginHorizontal: 16, marginTop: 8, paddingVertical: 14,
    backgroundColor: SURFACE, borderRadius: 12, alignItems: 'center',
    borderWidth: 1, borderColor: BORDER,
  },
  sheetCloseText: { color: GREY_LIGHT, fontSize: 15, fontWeight: '500' },
  backRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 28 },
  backArrow: { fontSize: 14, color: GOLD, fontWeight: '600' },
  backLabel: { fontSize: 14, color: GOLD, fontWeight: '500' },
  otpHeading: { fontSize: 22, color: WHITE, fontWeight: '300', letterSpacing: 0.5, marginBottom: 6 },
  otpSub: { fontSize: 14, color: GREY_LIGHT, marginBottom: 32, fontWeight: '400' },
  otpRow: { flexDirection: 'row', gap: 10, marginBottom: 24, justifyContent: 'center' },
  otpBox: {
    width: 46, height: 56, borderRadius: 10,
    borderWidth: 1, borderColor: GOLD_DIM, backgroundColor: SURFACE,
    alignItems: 'center', justifyContent: 'center',
  },
  otpInput: { width: '100%', height: '100%', color: WHITE, fontSize: 22, fontWeight: '600', textAlign: 'center' },
  resendRow: { alignItems: 'center', marginBottom: 24 },
  resendTimer: { fontSize: 13, color: GREY },
  resendGold: { color: GOLD, fontWeight: '600' },
  resendActive: { fontSize: 13, color: GOLD, fontWeight: '600' },
  demoOtp: {
    alignItems: 'center', paddingVertical: 14, marginBottom: 24,
    backgroundColor: SURFACE, borderWidth: 1, borderColor: BORDER, borderRadius: 10, gap: 4,
  },
  demoOtpLabel: { fontSize: 11, color: GREY, letterSpacing: 1.5, textTransform: 'uppercase' },
  demoOtpCode: { fontSize: 24, color: GOLD, fontWeight: '300', letterSpacing: 8 },
});
