import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Share } from 'react-native';
import { MotiView } from 'moti';
import { Phone, Mail, Link, Copy, CheckCircle2 } from 'lucide-react-native';
import { Clipboard } from 'react-native';
import { AppCard } from '../components/AppCard';
import { AppButton } from '../components/AppButton';
import { AppInput } from '../components/AppInput';
import { AppScreen } from '../components/AppScreen';
import { useHaptics } from '../hooks/useHaptics';
import { useApp } from '../context/AppContext';

const GOLD       = '#D4AF37';
const GOLD_FAINT = 'rgba(212,175,55,0.08)';
const GOLD_DIM   = 'rgba(212,175,55,0.25)';
const WEBSITE_BASE_URL = 'https://conciergeapptuxedo.vercel.app';

function generateRideToken(): string {
  return Math.random().toString(36).slice(2, 10).toUpperCase();
}

function buildPassengerLink(pickup: string): string {
  const token  = generateRideToken();
  const params = new URLSearchParams({ token, pickup });
  return `${WEBSITE_BASE_URL}/track-ride?${params.toString()}`;
}

export const GuestDetailsScreen = ({ navigation, route }: any) => {
  const { user } = useApp();
  const { light, medium } = useHaptics();

  const [guestPhone,     setGuestPhone]     = useState('');
  const [guestEmail,     setGuestEmail]     = useState('');
  const [emailError,     setEmailError]     = useState('');
  const [contactMethod,  setContactMethod]  = useState<'phone' | 'email'>('phone');
  const [generatedLink,  setGeneratedLink]  = useState('');
  const [copied,         setCopied]         = useState(false);

  const validateEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  const handleEmailChange = (val: string) => {
    setGuestEmail(val);
    setEmailError(val && !validateEmail(val) ? 'Enter a valid email address' : '');
  };

  const canSubmit = contactMethod === 'phone'
    ? guestPhone.length > 5
    : guestEmail.length > 0 && validateEmail(guestEmail) && !emailError;

  const pickupLocation = route.params?.pickupLocation || user?.hotelName || 'The Grand Majestic Hotel';

  const handleRequest = async () => {
    await medium();
    const link = buildPassengerLink(pickupLocation);
    navigation.navigate('WaitingForPayment', {
      guestPhone:    contactMethod === 'phone' ? guestPhone : '',
      guestEmail:    contactMethod === 'email' ? guestEmail : '',
      bookingMode:   'instant',
      pickupLocation,
      passengerLink: link,
    });
  };

  const handleGenerateLink = () => {
    setGeneratedLink(buildPassengerLink(pickupLocation));
  };

  const handleCopy = () => {
    Clipboard.setString(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShare = () => {
    Share.share({
      message: `Your Tuxedo Chauffeur is ready. Tap to track your ride: ${generatedLink}`,
      url: generatedLink,
    });
  };

  return (
    <AppScreen keyboardAvoiding noTopPad>
      {/* ── Contact method toggle ── */}
      <MotiView
        from={{ opacity: 0, translateY: 12 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 240, delay: 60 }}
      >
        <AppCard style={styles.card}>
          <Text style={styles.cardTitle}>Guest Contact</Text>
          <Text style={styles.cardSub}>
            A tracking link will be sent automatically.
          </Text>

          {/* Toggle */}
          <View style={styles.toggleRow}>
            {(['phone', 'email'] as const).map(method => (
              <TouchableOpacity
                key={method}
                onPress={async () => { await light(); setContactMethod(method); }}
                style={[styles.toggleBtn, contactMethod === method && styles.toggleBtnActive]}
                accessibilityRole="radio"
                accessibilityState={{ selected: contactMethod === method }}
                activeOpacity={0.7}
              >
                {method === 'phone'
                  ? <Phone color={contactMethod === method ? GOLD : '#6b7280'} size={15} />
                  : <Mail  color={contactMethod === method ? GOLD : '#6b7280'} size={15} />
                }
                <Text style={[
                  styles.toggleText,
                  contactMethod === method && styles.toggleTextActive,
                ]}>
                  {method === 'phone' ? 'Phone' : 'Email'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Input */}
          <MotiView
            key={contactMethod}
            from={{ opacity: 0, translateX: contactMethod === 'phone' ? -12 : 12 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ type: 'timing', duration: 220 }}
          >
            <AppInput
              leftSlot={
                <View style={styles.inputIcon}>
                  {contactMethod === 'phone'
                    ? <Phone color={GOLD} size={18} />
                    : <Mail  color={GOLD} size={18} />
                  }
                </View>
              }
              placeholder={
                contactMethod === 'phone'
                  ? 'Guest phone number'
                  : 'Guest email address'
              }
              value={contactMethod === 'phone' ? guestPhone : guestEmail}
              onChangeText={contactMethod === 'phone' ? setGuestPhone : handleEmailChange}
              keyboardType={contactMethod === 'phone' ? 'phone-pad' : 'email-address'}
              autoCapitalize="none"
              containerStyle={styles.inputContainer}
            />
            {emailError ? (
              <Text style={styles.errorText}>{emailError}</Text>
            ) : null}
          </MotiView>
        </AppCard>
      </MotiView>

      {/* ── Passenger link ── */}
      <MotiView
        from={{ opacity: 0, translateY: 10 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 220, delay: 120 }}
      >
        <AppCard style={styles.linkCard}>
          <View style={styles.linkHeader}>
            <Link color={GOLD} size={15} />
            <Text style={styles.linkTitle}>Passenger Tracking Link</Text>
          </View>

          {!generatedLink ? (
            <TouchableOpacity
              onPress={handleGenerateLink}
              style={styles.generateBtn}
              activeOpacity={0.7}
            >
              <Text style={styles.generateBtnText}>Preview link</Text>
            </TouchableOpacity>
          ) : (
            <MotiView
              from={{ opacity: 0, translateY: 6 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', duration: 220 }}
            >
              <Text style={styles.linkText} numberOfLines={2}>
                {generatedLink}
              </Text>
              <View style={styles.linkActions}>
                <TouchableOpacity
                  onPress={handleCopy}
                  style={[styles.linkActionBtn, copied && styles.linkActionBtnSuccess]}
                  activeOpacity={0.7}
                >
                  {copied
                    ? <CheckCircle2 color="#22c55e" size={14} />
                    : <Copy color={GOLD} size={14} />
                  }
                  <Text style={[styles.linkActionText, copied && { color: '#22c55e' }]}>
                    {copied ? 'Copied!' : 'Copy'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleShare}
                  style={styles.linkActionBtn}
                  activeOpacity={0.7}
                >
                  <Link color={GOLD} size={14} />
                  <Text style={styles.linkActionText}>Share</Text>
                </TouchableOpacity>
              </View>
            </MotiView>
          )}
        </AppCard>
      </MotiView>

      {/* ── CTA ── */}
      <MotiView
        from={{ opacity: 0, translateY: 10 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 220, delay: 160 }}
        style={styles.ctaWrap}
      >
        <AppButton
          label="Send Chauffeur Request"
          onPress={handleRequest}
          disabled={!canSubmit}
          haptic="medium"
          style={styles.ctaBtn}
        />
      </MotiView>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  card: { padding: 20, marginBottom: 12 },
  cardTitle: { fontSize: 16, color: '#fff', fontWeight: '700', marginBottom: 4 },
  cardSub:   { fontSize: 12, color: '#6b7280', fontWeight: '500', marginBottom: 16 },
  toggleRow: {
    flexDirection: 'row', gap: 10, marginBottom: 16,
  },
  toggleBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 7, paddingVertical: 12, borderRadius: 10,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(255,255,255,0.03)',
    minHeight: 44,
  },
  toggleBtnActive: {
    borderColor: GOLD_DIM,
    backgroundColor: GOLD_FAINT,
  },
  toggleText:       { color: '#6b7280', fontSize: 14, fontWeight: '600' },
  toggleTextActive: { color: GOLD },
  inputIcon: { paddingLeft: 14, paddingRight: 6 },
  inputContainer: { marginBottom: 4 },
  errorText: { color: '#f87171', fontSize: 12, fontWeight: '500', marginBottom: 4, marginLeft: 4 },
  linkCard: { padding: 16, marginBottom: 12 },
  linkHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  linkTitle: { color: '#fff', fontSize: 14, fontWeight: '600' },
  generateBtn: {
    paddingVertical: 10, paddingHorizontal: 14,
    borderRadius: 8, borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.25)',
    borderStyle: 'dashed',
    alignItems: 'center', minHeight: 44, justifyContent: 'center',
  },
  generateBtnText: { color: GOLD, fontSize: 13, fontWeight: '600' },
  linkText: {
    color: '#9ca3af', fontSize: 11, fontWeight: '500',
    lineHeight: 17, marginBottom: 10,
  },
  linkActions: { flexDirection: 'row', gap: 8 },
  linkActionBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingVertical: 8, paddingHorizontal: 12,
    backgroundColor: 'rgba(212,175,55,0.06)',
    borderWidth: 1, borderColor: 'rgba(212,175,55,0.2)',
    borderRadius: 8, minHeight: 36,
  },
  linkActionBtnSuccess: {
    backgroundColor: 'rgba(34,197,94,0.08)',
    borderColor: 'rgba(34,197,94,0.25)',
  },
  linkActionText: { color: GOLD, fontSize: 12, fontWeight: '700' },
  ctaWrap: { marginTop: 4 },
  ctaBtn: { width: '100%' },
});
