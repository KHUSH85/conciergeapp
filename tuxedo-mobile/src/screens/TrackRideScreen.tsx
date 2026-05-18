import React, { useState, useEffect, useLayoutEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Linking } from 'react-native';
import { MotiView } from 'moti';
import {
  MapPin, Navigation, Car, CheckCircle2, Crown, Wallet,
  ArrowRight, Sparkles, Lock, Gift, User,
  CreditCard, DollarSign, Apple,
} from 'lucide-react-native';
import { GlassCard } from '../components/GlassCard';
import { AppButton } from '../components/AppButton';
import { AppInput } from '../components/AppInput';
import { AppScreen } from '../components/AppScreen';
import { AppHeader } from '../components/AppHeader';
import { useHaptics } from '../hooks/useHaptics';
import { useStaggerAnimation } from '../hooks/useStaggerAnimation';
import { useApp } from '../context/AppContext';
import { storePendingRideCreditOffer } from '../utils/appStorage';
import type { User as AppUser } from '../types';

const GOLD = '#D4AF37';
type Step = 'config' | 'payment' | 'tracking';

type TrackingDriver = { name: string; rating: string; vehicle: string; amenities: string[]; };

const DEFAULT_DRIVER: TrackingDriver = {
  name: 'Michael S.', rating: '4.9', vehicle: 'Black S-Class',
  amenities: ['WiFi', 'Refreshments', 'Leather Interior'],
};

function driverToDisplay(driver: any): TrackingDriver {
  const parts = driver.name.split(' ').filter(Boolean);
  const shortName = parts.length >= 2 ? `${parts[0]} ${parts[1].charAt(0)}.` : driver.name;
  const tags: string[] = [];
  if (driver.amenities?.wifi) tags.push('WiFi');
  if (driver.amenities?.water) tags.push('Refreshments');
  if (driver.amenities?.music) tags.push('AUX');
  tags.push(driver.vehicle?.interior || 'Leather Interior');
  return {
    name: shortName, rating: String(driver.rating),
    vehicle: `${driver.vehicle?.color || ''} ${driver.vehicle?.model || ''}`.trim(),
    amenities: tags.slice(0, 4),
  };
}

export const TrackRideScreen = ({ navigation, route }: any) => {
  const { user, setActiveRide } = useApp();
  const { light, medium, success } = useHaptics();
  const delays = useStaggerAnimation();
  const [step, setStep] = useState<Step>('config');
  const [dropOff, setDropOff] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [hasPremiumAmenities, setHasPremiumAmenities] = useState(user?.isMember === true);
  const [assignedDriver, setAssignedDriver] = useState<TrackingDriver>(DEFAULT_DRIVER);
  const [showPromo, setShowPromo] = useState(false);
  const [showAppPopup, setShowAppPopup] = useState(false);
  const [progressWidth, setProgressWidth] = useState(10);

  const isMember = user?.isMember === true;
  const pickupLocation = user?.hotelName || 'The Grand Majestic Hotel';

  useEffect(() => {
    const params = route.params;
    if (!params) return;
    if (params.fromMembershipPurchase || params.fromMembershipSkip) {
      setPaymentMethod(params.paymentMethod || null);
      setStep('tracking');
      setHasPremiumAmenities(Boolean(params.fromMembershipPurchase));
      setShowPromo(Boolean(params.fromMembershipPurchase));
      if (params.fromMembershipPurchase && params.selectedDriver) {
        setAssignedDriver(driverToDisplay(params.selectedDriver));
      }
    }
  }, [route.params]);

  useEffect(() => {
    if (isMember) return;
    const t = setTimeout(() => setShowAppPopup(true), 5000);
    return () => clearTimeout(t);
  }, [isMember]);

  useEffect(() => {
    if (step === 'tracking') {
      const interval = setInterval(() => {
        setProgressWidth(w => w >= 85 ? 10 : w + 1);
      }, 200);
      return () => clearInterval(interval);
    }
  }, [step]);

  const handleRequestChauffeur = () => {
    setActiveRide((prev: any) => ({ ...(prev || {}), dropOffLocation: dropOff, status: 'tracking' }));
    setStep('payment');
  };

  const handlePaymentSelection = async (method: string) => {
    await medium();
    setPaymentMethod(method);
    setActiveRide((prev: any) => ({ ...(prev || {}), paymentMethod: method, status: 'tracking' }));
    navigation.navigate('Wallet' as any, { screen: 'Membership', params: { fromTrackRide: true, paymentMethod: method } });
  };

  const proceedToTracking = () => {
    setActiveRide((prev: any) => ({ ...(prev || {}), paymentMethod: null, status: 'tracking' }));
    setShowPromo(false);
    setStep('tracking');
  };

  const handleBack = useCallback(() => {
    if (step === 'tracking') { setStep('payment'); return; }
    if (step === 'payment')  { setStep('config');  return; }
    navigation.goBack();
  }, [step, navigation]);

  const headerSubtitle =
    step === 'tracking' ? 'Chauffeur en route' :
    step === 'payment' ? 'Select payment' :
    'Ride configuration';

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      header: () => (
        <AppHeader title="Track ride" subtitle={headerSubtitle} onBack={handleBack} />
      ),
    });
  }, [navigation, headerSubtitle, handleBack]);

  const etaMins = Math.floor(Math.random() * 2) + 2;

  return (
    <>
      <AppScreen keyboardAvoiding noTopPad>

        {step === 'config' && (
          <MotiView
            from={{ opacity: 0, translateY: 16 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 260, delay: delays.content }}
          >
            <GlassCard style={styles.card}>
              <Text style={styles.cardTitle}>Finalize Your Journey</Text>
              <View style={styles.pickupBox}>
                <Text style={styles.pickupLabel}>Pickup Location</Text>
                <Text style={styles.pickupValue}>{pickupLocation}</Text>
                <Text style={styles.pickupNote}>Set by concierge</Text>
              </View>
              <AppInput
                leftSlot={<View style={styles.inputIcon}><MapPin color={GOLD} size={20} /></View>}
                placeholder="Enter Drop-off Location"
                value={dropOff}
                onChangeText={setDropOff}
                containerStyle={styles.inputContainer}
              />
              <AppButton
                label="Continue"
                onPress={handleRequestChauffeur}
                disabled={!dropOff.trim()}
                haptic="medium"
                style={styles.ctaBtn}
              />
            </GlassCard>
          </MotiView>
        )}

        {step === 'payment' && (
          <MotiView
            from={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'timing', duration: 260, delay: delays.content }}
          >
            <GlassCard style={styles.card}>
              <Text style={[styles.cardTitle, { textAlign: 'center' }]}>Select Payment Method</Text>
              <Text style={styles.paySubtitle}>Secure Payment Processing</Text>
              <View style={styles.paymentList}>
                {[
                  { name: 'Apple Pay',    Icon: Apple      },
                  { name: 'PayPal',       Icon: Wallet     },
                  { name: 'Credit Card',  Icon: CreditCard },
                  { name: 'Cash Payment', Icon: DollarSign },
                ].map(({ name, Icon }) => (
                  <TouchableOpacity
                    key={name}
                    onPress={() => handlePaymentSelection(name)}
                    style={[styles.paymentItem, paymentMethod === name && styles.paymentItemActive]}
                    accessibilityRole="radio"
                    accessibilityState={{ selected: paymentMethod === name }}
                  >
                    <Icon color={GOLD} size={20} />
                    <Text style={styles.paymentItemText}>{name}</Text>
                    {paymentMethod === name && <CheckCircle2 color={GOLD} size={18} style={{ marginLeft: 'auto' }} />}
                  </TouchableOpacity>
                ))}
              </View>
              <AppButton label="Proceed to Tracking" onPress={proceedToTracking} haptic="medium" style={styles.ctaBtn} />
              <Text style={styles.payNote}>You can also pay inside the vehicle</Text>
            </GlassCard>
          </MotiView>
        )}

        {step === 'tracking' && (
          <MotiView
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ type: 'timing', duration: 260, delay: delays.content }}
          >
            <GlassCard style={[styles.card, styles.trackingCard]}>
              <CheckCircle2 color="#22c55e" size={56} style={styles.successIcon} />
              <View style={styles.driverRow}>
                <View style={styles.driverAvatar}><User color="#374151" size={36} /></View>
                <View style={styles.carBox}><Car color={GOLD} size={32} style={{ opacity: 0.5 }} /></View>
              </View>
              <Text style={styles.driverName}>{assignedDriver.name}</Text>
              <View style={styles.sparklesRow}>
                {[0,1,2,3,4].map(i => <Sparkles key={i} color={GOLD} size={12} />)}
                <Text style={styles.ratingText}>{assignedDriver.rating} Rating</Text>
              </View>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${progressWidth}%` }]} />
              </View>
              <Text style={styles.etaText}>
                Your chauffeur is ~{etaMins} mins away in a {assignedDriver.vehicle}
              </Text>
              <View style={styles.amenitiesBox}>
                <View style={styles.amenitiesHeader}>
                  <Sparkles color={GOLD} size={14} />
                  <Text style={styles.amenitiesTitle}>Premium Amenities</Text>
                </View>
                {hasPremiumAmenities ? (
                  <View style={styles.amenitiesTags}>
                    {assignedDriver.amenities.map(a => (
                      <View key={a} style={styles.amenityTag}>
                        <Text style={styles.amenityTagText}>{a}</Text>
                      </View>
                    ))}
                  </View>
                ) : (
                  <View style={styles.lockedAmenities}>
                    <Text style={styles.lockedText}>Premium amenities locked</Text>
                    <TouchableOpacity
                      onPress={async () => { await light(); navigation.navigate('Wallet' as any, { screen: 'Membership', params: { fromTrackRide: true, paymentMethod } }); }}
                      style={styles.unlockBtn}
                      accessibilityRole="button"
                    >
                      <Lock color="#4b5563" size={12} />
                      <Text style={styles.unlockText}>Buy Membership</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
              {showPromo && (
                <MotiView from={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={styles.promoBox}>
                  <Gift color={GOLD} size={18} />
                  <Text style={styles.promoText}>20% Off Your Next Journey!</Text>
                </MotiView>
              )}
            </GlassCard>
          </MotiView>
        )}

        <TouchableOpacity
          onPress={async () => { if (!isMember) { await light(); navigation.navigate('Wallet' as any, { screen: 'Membership', params: { fromTrackRide: true, paymentMethod } }); } }}
          activeOpacity={isMember ? 1 : 0.7}
        >
          <GlassCard style={[styles.footerCard, isMember && styles.footerCardMember]}>
            <View style={styles.footerLeft}>
              <View style={[styles.crownWrap, isMember && styles.crownWrapActive]}>
                <Crown color={isMember ? '#000' : '#6b7280'} size={18} />
              </View>
              <View>
                <Text style={styles.footerTitle}>
                  {isMember ? 'Tuxedo Gold Member' : 'Tuxedo Basic Status'}
                </Text>
                <Text style={styles.footerSub}>
                  {isMember ? `${(user?.rideCredit || 0).toFixed(2)} ride credit` : '$100/mo · $100 toward your next ride'}
                </Text>
              </View>
            </View>
            {!isMember ? (
              <View style={styles.arrowBtn}><ArrowRight color="#000" size={16} /></View>
            ) : (
              <View style={styles.activeRow}>
                <CheckCircle2 color={GOLD} size={12} />
                <Text style={styles.activeText}>Active</Text>
              </View>
            )}
          </GlassCard>
        </TouchableOpacity>
      </AppScreen>

      <AppDownloadPopup visible={showAppPopup} user={user} onClose={() => setShowAppPopup(false)} />
    </>
  );
};

const AppDownloadPopup = ({ visible, user, onClose }: { visible: boolean; user: AppUser | null; onClose: () => void; }) => {
  const handleDownloadApp = async () => {
    try {
      await storePendingRideCreditOffer(user);
      await Linking.openURL('https://apps.apple.com');
    } catch {}
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={popup.overlay}>
        <MotiView
          from={{ opacity: 0, scale: 0.9, translateY: 20 }}
          animate={{ opacity: 1, scale: 1, translateY: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
          <GlassCard style={popup.card}>
            <View style={popup.iconWrap}>
              <Sparkles color={GOLD} size={32} />
            </View>
            <Text style={popup.title}>
              Get <Text style={{ color: GOLD, fontWeight: '800' }}>$100</Text>
              {' '}toward your next ride when you download the Tuxedo app.
            </Text>
            <AppButton label="Download App" onPress={handleDownloadApp} haptic="medium" style={popup.btn} />
            <AppButton label="Skip for Now" onPress={onClose} variant="ghost" haptic="light" style={popup.skipBtn} />
          </GlassCard>
        </MotiView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  card: { padding: 24, marginBottom: 16 },
  cardTitle: { fontSize: 20, color: '#fff', fontWeight: '800', textTransform: 'uppercase', fontStyle: 'italic', marginBottom: 20 },
  pickupBox: {
    backgroundColor: 'rgba(212,175,55,0.08)', borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.3)', borderRadius: 12, padding: 14, marginBottom: 16,
  },
  pickupLabel: { color: GOLD, fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 },
  pickupValue: { color: '#fff', fontWeight: '700', fontSize: 15 },
  pickupNote: { color: '#6b7280', fontSize: 10, fontWeight: '500', textTransform: 'uppercase', marginTop: 4 },
  inputIcon: { paddingLeft: 14, paddingRight: 4 },
  inputContainer: { marginBottom: 20 },
  ctaBtn: { width: '100%' },
  paySubtitle: { color: '#6b7280', fontSize: 10, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, textAlign: 'center', marginBottom: 20, marginTop: -12 },
  paymentList: { gap: 10, marginBottom: 24 },
  paymentItem: {
    flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16,
    backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)', borderRadius: 12, minHeight: 56,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15, shadowRadius: 3, elevation: 2,
  },
  paymentItemActive: { borderColor: GOLD, backgroundColor: 'rgba(212,175,55,0.05)' },
  paymentItemText: { color: '#fff', fontWeight: '700', fontSize: 15, flex: 1 },
  payNote: { color: '#6b7280', fontSize: 10, fontWeight: '700', textTransform: 'uppercase', textAlign: 'center', marginTop: 12, letterSpacing: 0.5 },
  trackingCard: { alignItems: 'center' },
  successIcon: { marginBottom: 20 },
  driverRow: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 16 },
  driverAvatar: {
    width: 72, height: 72, borderRadius: 36, borderWidth: 1, borderColor: GOLD,
    backgroundColor: '#111', justifyContent: 'center', alignItems: 'center', overflow: 'hidden',
  },
  carBox: {
    width: 100, height: 56, backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center', alignItems: 'center',
  },
  driverName: { fontSize: 24, color: '#fff', fontWeight: '800', textTransform: 'uppercase', fontStyle: 'italic', marginBottom: 8 },
  sparklesRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 20 },
  ratingText: { color: GOLD, fontSize: 10, fontWeight: '700', textTransform: 'uppercase', marginLeft: 4 },
  progressTrack: {
    width: '100%', height: 8, backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 4, overflow: 'hidden', borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)', marginBottom: 12,
  },
  progressFill: { height: '100%', backgroundColor: GOLD, borderRadius: 4 },
  etaText: { color: '#9ca3af', fontSize: 10, fontWeight: '500', textTransform: 'uppercase', letterSpacing: 0.5, textAlign: 'center', marginBottom: 20 },
  amenitiesBox: {
    width: '100%', backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 12,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', padding: 14, marginBottom: 16,
  },
  amenitiesHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, justifyContent: 'center', marginBottom: 10 },
  amenitiesTitle: { color: '#6b7280', fontSize: 10, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  amenitiesTags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, justifyContent: 'center' },
  amenityTag: {
    backgroundColor: 'rgba(212,175,55,0.08)', borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.2)', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4,
  },
  amenityTagText: { color: GOLD, fontSize: 10, fontWeight: '700' },
  lockedAmenities: { alignItems: 'center', gap: 8 },
  lockedText: { color: '#4b5563', fontSize: 10, fontWeight: '600', textTransform: 'uppercase' },
  unlockBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingVertical: 8, paddingHorizontal: 16,
    backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 8,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)', borderStyle: 'dashed', minHeight: 44,
  },
  unlockText: { color: '#4b5563', fontSize: 10, fontWeight: '600', textTransform: 'uppercase' },
  promoBox: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: 'rgba(212,175,55,0.08)', borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.3)', borderRadius: 12, padding: 14, borderStyle: 'dashed',
  },
  promoText: { color: GOLD, fontWeight: '700', fontSize: 12, textTransform: 'uppercase' },
  footerCard: { padding: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  footerCardMember: { borderColor: 'rgba(212,175,55,0.4)', backgroundColor: 'rgba(212,175,55,0.05)' },
  footerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  crownWrap: { padding: 8, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.05)' },
  crownWrapActive: { backgroundColor: GOLD },
  footerTitle: { color: '#fff', fontSize: 11, fontWeight: '700', textTransform: 'uppercase' },
  footerSub: { color: '#6b7280', fontSize: 10, fontWeight: '500', textTransform: 'uppercase', marginTop: 2 },
  arrowBtn: { backgroundColor: GOLD, padding: 8, borderRadius: 8 },
  activeRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  activeText: { color: GOLD, fontSize: 9, fontWeight: '700', textTransform: 'uppercase' },
});

const popup = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  card: { padding: 32, alignItems: 'center', width: '100%' },
  iconWrap: {
    width: 64, height: 64, backgroundColor: 'rgba(212,175,55,0.12)', borderRadius: 16,
    borderWidth: 1, borderColor: 'rgba(212,175,55,0.3)',
    justifyContent: 'center', alignItems: 'center', marginBottom: 20,
  },
  title: { fontSize: 18, color: '#fff', fontWeight: '700', textAlign: 'center', lineHeight: 26, marginBottom: 24 },
  btn: { width: '100%', marginBottom: 10 },
  skipBtn: { width: '100%' },
});