import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { Phone, Mail, MapPin } from 'lucide-react-native';
import { AppCard } from '../components/AppCard';
import { AppButton } from '../components/AppButton';
import { AppInput } from '../components/AppInput';
import { AppScreen } from '../components/AppScreen';
import { useHaptics } from '../hooks/useHaptics';
import { useApp } from '../context/AppContext';
import { PASSENGER_WEB_BASE_URL } from '../config/passengerWeb';

const GOLD = '#D4AF37';
const GOLD_FAINT = 'rgba(212,175,55,0.08)';
const GOLD_DIM = 'rgba(212,175,55,0.25)';
const BORDER = 'rgba(255,255,255,0.08)';
const SURFACE = 'rgba(255,255,255,0.04)';

const TYPE = {
  caption: 10,
  small: 11,
  body: 13,
  title: 15,
} as const;

function generateRideToken(): string {
  return Math.random().toString(36).slice(2, 10).toUpperCase();
}

function buildPassengerLink(pickup: string): string {
  const token = generateRideToken();
  const params = new URLSearchParams({ token, pickup });
  return `${PASSENGER_WEB_BASE_URL}/track-ride?${params.toString()}`;
}

function Segment({
  selected,
  onSelect,
  options,
}: {
  selected: string;
  onSelect: (id: string) => void;
  options: { id: string; label: string; icon: React.ReactNode }[];
}) {
  return (
    <View style={styles.segmentTrack}>
      {options.map((opt) => {
        const active = selected === opt.id;
        return (
          <Pressable
            key={opt.id}
            onPress={() => onSelect(opt.id)}
            style={({ pressed }) => [
              styles.segmentBtn,
              active && styles.segmentBtnActive,
              pressed && !active && styles.segmentBtnPressed,
            ]}
            accessibilityRole="radio"
            accessibilityState={{ selected: active }}
          >
            {opt.icon}
            <Text style={[styles.segmentLabel, active && styles.segmentLabelActive]}>{opt.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export const GuestDetailsScreen = ({ navigation, route }: any) => {
  const { user, addOpenRideRequest } = useApp();
  const { light, medium } = useHaptics();

  const [guestPhone, setGuestPhone] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [contactMethod, setContactMethod] = useState<'phone' | 'email'>('phone');

  const validateEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  const handleEmailChange = (val: string) => {
    setGuestEmail(val);
    setEmailError(val && !validateEmail(val) ? 'Enter a valid email address' : '');
  };

  const canSubmit =
    contactMethod === 'phone'
      ? guestPhone.length > 5
      : guestEmail.length > 0 && validateEmail(guestEmail) && !emailError;

  const pickupLocation = route.params?.pickupLocation || user?.hotelName || 'The Grand Majestic Hotel';

  const guestLabel = contactMethod === 'phone' ? guestPhone : guestEmail;

  const handleRequest = async () => {
    await medium();
    const link = buildPassengerLink(pickupLocation);
    addOpenRideRequest({
      guestLabel,
      pickup: pickupLocation,
      serviceType: 'transfer',
      status: 'awaiting_guest',
    });
    navigation.navigate('WaitingForPayment', {
      guestPhone: contactMethod === 'phone' ? guestPhone : '',
      guestEmail: contactMethod === 'email' ? guestEmail : '',
      bookingMode: 'instant',
      pickupLocation,
      passengerLink: link,
      serviceType: 'transfer',
    });
  };

  const selectContact = async (method: 'phone' | 'email') => {
    await light();
    setContactMethod(method);
  };

  return (
    <AppScreen keyboardAvoiding noTopPad>
      {/* Pickup context */}
      <MotiView
        from={{ opacity: 0, translateY: 8 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 220, delay: 40 }}
        style={styles.pickupBanner}
      >
        <View style={styles.pickupIconWrap}>
          <MapPin color={GOLD} size={14} />
        </View>
        <Text style={styles.pickupText} numberOfLines={2}>
          {pickupLocation}
        </Text>
      </MotiView>

      {/* Guest contact */}
      <MotiView
        from={{ opacity: 0, translateY: 10 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 220, delay: 60 }}
      >
        <AppCard style={styles.card}>
          <Text style={styles.cardTitle}>Guest contact</Text>
          <Text style={styles.cardSub}>
            A tracking link will be sent automatically. Chauffeurs are auto-assigned (manual pick is for members in the passenger app only).
          </Text>

          <Segment
            selected={contactMethod}
            onSelect={(id) => selectContact(id as 'phone' | 'email')}
            options={[
              {
                id: 'phone',
                label: 'Phone',
                icon: <Phone color={contactMethod === 'phone' ? GOLD : '#6b7280'} size={15} />,
              },
              {
                id: 'email',
                label: 'Email',
                icon: <Mail color={contactMethod === 'email' ? GOLD : '#6b7280'} size={15} />,
              },
            ]}
          />

          <MotiView
            key={contactMethod}
            from={{ opacity: 0, translateY: 6 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 180 }}
            style={styles.inputBlock}
          >
            <AppInput
              leftSlot={
                <View style={styles.inputIcon}>
                  {contactMethod === 'phone' ? (
                    <Phone color={GOLD} size={17} />
                  ) : (
                    <Mail color={GOLD} size={17} />
                  )}
                </View>
              }
              placeholder={contactMethod === 'phone' ? 'Guest phone number' : 'Guest email address'}
              value={contactMethod === 'phone' ? guestPhone : guestEmail}
              onChangeText={contactMethod === 'phone' ? setGuestPhone : handleEmailChange}
              keyboardType={contactMethod === 'phone' ? 'phone-pad' : 'email-address'}
              autoCapitalize="none"
              containerStyle={styles.inputContainer}
            />
            {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
          </MotiView>
        </AppCard>
      </MotiView>

      {/* CTA */}
      <MotiView
        from={{ opacity: 0, translateY: 8 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 220, delay: 80 }}
        style={styles.ctaWrap}
      >
        <AppButton
          label="Send ride request"
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
  pickupBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: BORDER,
  },
  pickupIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: GOLD_FAINT,
    borderWidth: 1,
    borderColor: GOLD_DIM,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickupText: {
    flex: 1,
    color: 'rgba(255,255,255,0.75)',
    fontSize: TYPE.body,
    fontWeight: '600',
    lineHeight: 18,
  },

  card: {
    padding: 14,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: TYPE.title,
    color: '#fff',
    fontWeight: '700',
    marginBottom: 4,
  },
  cardSub: {
    fontSize: TYPE.small,
    color: 'rgba(255,255,255,0.45)',
    fontWeight: '500',
    lineHeight: 16,
    marginBottom: 12,
  },

  segmentTrack: {
    flexDirection: 'row',
    padding: 3,
    borderRadius: 11,
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderWidth: 1,
    borderColor: BORDER,
    gap: 4,
  },
  segmentBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    minHeight: 40,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  segmentBtnActive: {
    backgroundColor: GOLD_FAINT,
    borderWidth: 1,
    borderColor: GOLD_DIM,
  },
  segmentBtnPressed: {
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  segmentLabel: {
    color: '#6b7280',
    fontSize: TYPE.body,
    fontWeight: '600',
  },
  segmentLabelActive: {
    color: GOLD,
  },
  inputBlock: {
    marginTop: 12,
  },
  inputIcon: {
    paddingLeft: 12,
    paddingRight: 4,
  },
  inputContainer: {
    marginBottom: 0,
  },
  errorText: {
    color: '#f87171',
    fontSize: TYPE.small,
    fontWeight: '500',
    marginTop: 6,
    marginLeft: 2,
  },

  ctaWrap: {
    marginTop: 6,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: BORDER,
  },
  ctaBtn: {
    width: '100%',
  },
});
