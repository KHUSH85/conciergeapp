import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
} from 'react-native';
import { MotiView } from 'moti';
import { Easing } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppScreen } from '../components/AppScreen';
import { AppButton } from '../components/AppButton';
import { AppInput } from '../components/AppInput';
import { useHaptics } from '../hooks/useHaptics';
import { useStaggerAnimation } from '../hooks/useStaggerAnimation';
import { useApp } from '../context/AppContext';

const GOLD       = '#D4AF37';
const GOLD_DIM   = 'rgba(212,175,55,0.25)';
const GOLD_FAINT = 'rgba(212,175,55,0.08)';
const WHITE      = '#FFFFFF';
const GREY       = '#6B7280';
const GREY_LIGHT = '#9CA3AF';
const BLACK      = '#000000';
const SURFACE    = 'rgba(255,255,255,0.04)';
const BORDER     = 'rgba(255,255,255,0.08)';
const TRACK_BG   = 'rgba(255,255,255,0.06)';

export const KEY_PROFILE = 'user_profile';

interface StoredProfile {
  fullName: string;
  hotelName: string;
  role: string;
  onboarded: boolean;
}

export async function isUserOnboarded(): Promise<boolean> {
  const raw = await AsyncStorage.getItem(KEY_PROFILE);
  if (!raw) return false;
  try {
    const p: StoredProfile = JSON.parse(raw);
    return p.onboarded === true;
  } catch {
    return false;
  }
}

const ROLE_OPTIONS = [
  { label: 'Concierge', value: 'concierge' },
  { label: 'Manager',   value: 'manager'   },
];

interface SegmentedControlProps {
  options: { label: string; value: string }[];
  selected: string;
  onSelect: (v: string) => void;
}

const SegmentedControl: React.FC<SegmentedControlProps> = ({ options, selected, onSelect }) => {
  const { light } = useHaptics();
  const selectedIndex = options.findIndex(o => o.value === selected);
  const pct = (100 / options.length);

  return (
    <View style={styles.segmentTrack}>
      <MotiView
        animate={{ left: `${selectedIndex * pct}%` as any }}
        transition={{ type: 'timing', duration: 190, easing: Easing.out(Easing.cubic) }}
        style={[styles.segmentPill, { width: `${pct}%` as any }]}
      />
      {options.map(opt => (
        <TouchableOpacity
          key={opt.value}
          onPress={async () => { await light(); onSelect(opt.value); }}
          activeOpacity={0.8}
          style={styles.segmentOption}
          accessibilityRole="radio"
          accessibilityState={{ selected: selected === opt.value }}
        >
          <Text style={[styles.segmentText, selected === opt.value && styles.segmentTextActive]}>
            {opt.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export const FirstTimeSetupScreen = ({ navigation, route }: any) => {
  const { user, setUser } = useApp();
  const { success } = useHaptics();
  const delays = useStaggerAnimation();

  const pendingUser = route?.params?.pendingUser ?? null;
  const prefillRole: string = route?.params?.role ?? pendingUser?.role ?? user?.role ?? 'concierge';

  const [fullName,  setFullName]  = useState(pendingUser?.name ?? user?.name ?? '');
  const [hotelName, setHotelName] = useState(pendingUser?.hotelName ?? user?.hotelName ?? '');
  const [role,      setRole]      = useState<string>(prefillRole);
  const [loading,   setLoading]   = useState(false);
  const [done,      setDone]      = useState(false);

  const nameRef  = useRef<TextInput | null>(null);
  const hotelRef = useRef<TextInput | null>(null);

  useEffect(() => {
    const t = setTimeout(() => nameRef.current?.focus(), 120);
    return () => clearTimeout(t);
  }, []);

  const canContinue = fullName.trim().length >= 2;

  const handleContinue = useCallback(async () => {
    if (!canContinue || loading || done) return;
    setLoading(true);

    const profile: StoredProfile = {
      fullName:  fullName.trim(),
      hotelName: hotelName.trim(),
      role,
      onboarded: true,
    };

    await AsyncStorage.setItem(KEY_PROFILE, JSON.stringify(profile));

    // Build the final user — either from pendingUser (first login) or existing user (profile edit)
    const base = pendingUser ?? user;
    if (base) {
      setUser({
        ...base,
        name:      profile.fullName,
        hotelName: profile.hotelName || base.hotelName,
        role:      role as 'concierge' | 'manager',
      });
    }

    setLoading(false);
    setDone(true);
    await success();
    // setUser above triggers AppNavigator key switch to 'main' — no manual navigation needed.
  }, [canContinue, loading, done, fullName, hotelName, role, pendingUser, user, setUser, success]);

  return (
    <AppScreen keyboardAvoiding contentStyle={styles.scroll}>
      <MotiView
        from={{ opacity: 0, translateY: -16 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 280, delay: delays.header, easing: Easing.out(Easing.quad) }}
        style={styles.header}
      >
        <View style={styles.logoRing}>
          <Text style={styles.logoMark}>T</Text>
        </View>
        <Text style={styles.title}>Complete Your Profile</Text>
        <Text style={styles.subtitle}>Set up your concierge account</Text>
      </MotiView>

      <MotiView
        from={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ type: 'timing', duration: 240, delay: delays.content }}
        style={styles.divider}
      />

      <MotiView
        from={{ opacity: 0, translateY: 14 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 240, delay: delays.content, easing: Easing.out(Easing.quad) }}
      >
        <Text style={styles.fieldLabel}>Full Name</Text>
        <AppInput
          ref={nameRef}
          value={fullName}
          onChangeText={setFullName}
          placeholder="Your full name"
          autoCapitalize="words"
          returnKeyType="next"
          onSubmitEditing={() => hotelRef.current?.focus()}
          containerStyle={styles.inputContainer}
        />

        <Text style={styles.fieldLabel}>
          Hotel or Organisation  <Text style={styles.optional}>(optional)</Text>
        </Text>
        <AppInput
          ref={hotelRef}
          value={hotelName}
          onChangeText={setHotelName}
          placeholder="e.g. The Grand Majestic Hotel"
          autoCapitalize="words"
          returnKeyType="done"
          onSubmitEditing={canContinue ? handleContinue : undefined}
          containerStyle={styles.inputContainer}
        />

        <Text style={styles.fieldLabel}>Role</Text>
        <SegmentedControl options={ROLE_OPTIONS} selected={role} onSelect={setRole} />
      </MotiView>

      <MotiView
        from={{ opacity: 0, translateY: 10 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 220, delay: delays.cta, easing: Easing.out(Easing.quad) }}
      >
        <AppButton
          label="Continue"
          onPress={handleContinue}
          disabled={!canContinue}
          loading={loading}
          success={done}
          haptic="success"
          style={styles.ctaBtn}
        />
        <Text style={styles.hint}>You can update these details later in your profile.</Text>
      </MotiView>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  scroll: { paddingTop: 48, paddingBottom: 48 },
  header: { alignItems: 'center', marginBottom: 36 },
  logoRing: {
    width: 80, height: 80, borderRadius: 40,
    borderWidth: 1, borderColor: GOLD_DIM,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: GOLD_FAINT, marginBottom: 24,
  },
  logoMark: { fontSize: 36, fontWeight: '200', color: GOLD, lineHeight: 42 },
  title:    { fontSize: 24, fontWeight: '300', color: WHITE, marginBottom: 8 },
  subtitle: { fontSize: 14, color: GREY_LIGHT, fontWeight: '400' },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: BORDER,
    marginBottom: 40,
  },
  fieldLabel: {
    fontSize: 11, color: GREY, letterSpacing: 1.5,
    textTransform: 'uppercase', marginBottom: 10, fontWeight: '500',
  },
  optional: {
    textTransform: 'none', letterSpacing: 0,
    color: GREY, fontSize: 11, fontWeight: '400',
  },
  inputContainer: { marginBottom: 28 },
  segmentTrack: {
    flexDirection: 'row',
    height: 48,
    borderRadius: 12,
    backgroundColor: TRACK_BG,
    borderWidth: 1,
    borderColor: BORDER,
    marginBottom: 36,
    overflow: 'hidden',
    position: 'relative',
  },
  segmentPill: {
    position: 'absolute',
    top: 3, bottom: 3,
    borderRadius: 9,
    backgroundColor: GOLD_FAINT,
    borderWidth: 1,
    borderColor: GOLD_DIM,
  },
  segmentOption: {
    flex: 1, alignItems: 'center', justifyContent: 'center', zIndex: 1,
  },
  segmentText: { fontSize: 14, color: GREY_LIGHT, fontWeight: '500' },
  segmentTextActive: { color: GOLD, fontWeight: '600' },
  ctaBtn: { width: '100%', marginBottom: 24 },
  hint: { fontSize: 12, color: GREY, textAlign: 'center', lineHeight: 18 },
});