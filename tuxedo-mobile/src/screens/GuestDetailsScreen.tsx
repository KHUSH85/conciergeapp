  import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { Phone, Mail, MapPin, Sparkles } from 'lucide-react-native';
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

const PREMIUM_ADD_ON_GROUPS = [
  {
    title: 'Vehicle & seating',
    items: ["Executive captain's chairs", '7-passenger premium bench', 'Armored primary vehicle'],
  },
  {
    title: 'Security & protection',
    items: ['Armored support vehicle', 'Armed chauffeur', 'Protection personnel', 'Motorcade escort'],
  },
  {
    title: 'Cabin ambiance',
    items: ['Starlight headliner', 'Club ambiance', 'Pre-chilled cabin', 'Quiet mode', 'Panoramic skylight'],
  },
  {
    title: 'Comfort & refreshments',
    items: ['Massage seating', 'Chilled water', 'Beverage refrigeration', 'Eucalyptus towels', 'Grooming kit'],
  },
  {
    title: 'Connectivity & entertainment',
    items: ['5G Wi-Fi', 'Satellite TV & sports', 'Rear media suite', 'Karaoke', 'Digital press', 'Fast charging'],
  },
  {
    title: 'Child safety',
    items: ['Infant seat', 'Toddler seat', 'Booster seat'],
  },
  {
    title: 'Lifestyle & bespoke',
    items: ['Lifestyle courier', 'VIP concierge', 'Custom chauffeur instructions'],
  },
] as const;

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
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [step, setStep] = useState<'contact' | 'addons'>('contact');

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

  const handleContactContinue = async () => {
    await medium();
    setStep('addons');
  };

  const handleRequest = async () => {
    await medium();
    const link = buildPassengerLink(pickupLocation);
    addOpenRideRequest({
      guestLabel,
      pickup: pickupLocation,
      serviceType: 'transfer',
      status: 'awaiting_guest',
      premiumAddOns: selectedAddOns,
    });
    navigation.navigate('WaitingForPayment', {
      guestPhone: contactMethod === 'phone' ? guestPhone : '',
      guestEmail: contactMethod === 'email' ? guestEmail : '',
      bookingMode: 'instant',
      pickupLocation,
      passengerLink: link,
      serviceType: 'transfer',
      premiumAddOns: selectedAddOns,
    });
  };

  const selectContact = async (method: 'phone' | 'email') => {
    await light();
    setContactMethod(method);
  };

  const toggleAddOn = async (item: string) => {
    await light();
    setSelectedAddOns((current) =>
      current.includes(item) ? current.filter((name) => name !== item) : [...current, item],
    );
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

      {step === 'contact' ? (
        <>
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

          <MotiView
            from={{ opacity: 0, translateY: 8 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 220, delay: 80 }}
            style={styles.ctaWrap}
          >
            <AppButton
              label="Send ride request"
              onPress={handleContactContinue}
              disabled={!canSubmit}
              haptic="medium"
              style={styles.ctaBtn}
            />
          </MotiView>
        </>
      ) : (
        <>
          {/* Premium add-ons */}
          <MotiView
            from={{ opacity: 0, translateY: 10 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 220, delay: 60 }}
          >
            <AppCard style={styles.card}>
              <View style={styles.addOnHeader}>
                <View style={styles.addOnIconWrap}>
                  <View style={styles.addOnIcon}>
                    <Sparkles color="#000" size={20} fill={GOLD} />
                  </View>
                </View>
                <View style={styles.addOnCopy}>
                  <Text style={styles.cardTitle}>Premium add-ons</Text>
                  <Text style={styles.cardSub}>
                    Select only what this guest needs. Continue without add-ons if no premium services are required.
                  </Text>
                </View>
                <View style={styles.selectedCountBadge}>
                  <Text style={styles.selectedCountValue}>{selectedAddOns.length}</Text>
                  <Text style={styles.selectedCountLabel}>selected</Text>
                </View>
              </View>

              <View style={styles.addOnSelectedStrip}>
                <Text style={styles.addOnSelectedText}>
                  {selectedAddOns.length > 0
                    ? `${selectedAddOns.length} premium option${selectedAddOns.length === 1 ? '' : 's'} added`
                    : 'No premium options selected yet'}
                </Text>
              </View>

              {PREMIUM_ADD_ON_GROUPS.map((group) => {
                const groupSelected = group.items.filter((item) => selectedAddOns.includes(item)).length;
                return (
                  <View key={group.title} style={styles.addOnGroup}>
                    <View style={styles.addOnGroupHeader}>
                      <Text style={styles.addOnGroupTitle}>{group.title}</Text>
                      {groupSelected > 0 ? (
                        <View style={styles.groupCountPill}>
                          <Text style={styles.groupCountText}>{groupSelected}</Text>
                        </View>
                      ) : null}
                    </View>
                    <View style={styles.addOnChipWrap}>
                      {group.items.map((item) => {
                        const selected = selectedAddOns.includes(item);
                        return (
                          <Pressable
                            key={item}
                            onPress={() => toggleAddOn(item)}
                            style={({ pressed }) => [
                              styles.addOnChip,
                              selected && styles.addOnChipSelected,
                              pressed && { opacity: 0.82 },
                            ]}
                          >
                            <Text style={[styles.addOnChipText, selected && styles.addOnChipTextSelected]}>
                              {item}
                            </Text>
                          </Pressable>
                        );
                      })}
                    </View>
                  </View>
                );
              })}
            </AppCard>
          </MotiView>

          <MotiView
            from={{ opacity: 0, translateY: 8 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 220, delay: 80 }}
            style={styles.ctaWrap}
          >
            <AppButton
              label="Send ride request"
              onPress={handleRequest}
              haptic="medium"
              style={styles.ctaBtn}
            />
            <Pressable
              onPress={() => setStep('contact')}
              style={({ pressed }) => [styles.backToContactBtn, pressed && { opacity: 0.75 }]}
            >
              <Text style={styles.backToContactText}>Back to guest contact</Text>
            </Pressable>
          </MotiView>
        </>
      )}
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
  addOnHeader: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
    padding: 12,
    borderRadius: 14,
    backgroundColor: 'rgba(212,175,55,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.28)',
  },
  addOnIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 16,
    backgroundColor: 'rgba(212,175,55,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addOnIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: GOLD,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addOnCopy: {
    flex: 1,
    minWidth: 0,
  },
  selectedCountBadge: {
    minWidth: 54,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.34)',
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.28)',
    alignItems: 'center',
  },
  selectedCountValue: {
    color: GOLD,
    fontSize: 18,
    fontWeight: '900',
    lineHeight: 20,
  },
  selectedCountLabel: {
    color: 'rgba(255,255,255,0.42)',
    fontSize: 9,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  addOnSelectedStrip: {
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.045)',
    borderWidth: 1,
    borderColor: BORDER,
  },
  addOnSelectedText: {
    color: 'rgba(255,255,255,0.68)',
    fontSize: TYPE.body,
    fontWeight: '700',
  },
  addOnGroup: {
    marginTop: 12,
    gap: 10,
    padding: 12,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.035)',
    borderWidth: 1,
    borderColor: BORDER,
  },
  addOnGroupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  addOnGroupTitle: {
    color: GOLD,
    fontSize: TYPE.small,
    fontWeight: '800',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    flex: 1,
  },
  groupCountPill: {
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: GOLD,
    alignItems: 'center',
    justifyContent: 'center',
  },
  groupCountText: {
    color: '#000',
    fontSize: TYPE.small,
    fontWeight: '900',
  },
  addOnChipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
  },
  addOnChip: {
    paddingHorizontal: 11,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(0,0,0,0.32)',
  },
  addOnChipSelected: {
    borderColor: GOLD,
    backgroundColor: 'rgba(212,175,55,0.18)',
  },
  addOnChipText: {
    color: 'rgba(255,255,255,0.62)',
    fontSize: TYPE.body,
    fontWeight: '700',
  },
  addOnChipTextSelected: {
    color: GOLD,
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
  backToContactBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  backToContactText: {
    color: GOLD,
    fontSize: TYPE.body,
    fontWeight: '700',
  },
});
