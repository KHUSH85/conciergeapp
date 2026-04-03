import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Modal, Linking,
} from 'react-native';
import { MotiView } from 'moti';
import {
  MapPin, Navigation, Car, CheckCircle2, Crown, Wallet,
  ArrowRight, ArrowLeft, Sparkles, Lock, Gift, User,
  CreditCard, DollarSign, Apple,
} from 'lucide-react-native';
import { GlassCard, GoldButton } from '../components/GlassCard';
import { ScreenShell } from '../components/ScreenShell';
import { useApp } from '../context/AppContext';
import { storePendingAppDownloadCoupon } from '../utils/appStorage';
import type { User as AppUser } from '../types';

const GOLD = '#D4AF37';

type Step = 'config' | 'payment' | 'tracking';

type TrackingDriver = {
  name: string;
  rating: string;
  vehicle: string;
  amenities: string[];
};

const DEFAULT_DRIVER: TrackingDriver = {
  name: 'Michael S.',
  rating: '4.9',
  vehicle: 'Black S-Class',
  amenities: ['WiFi', 'Refreshments', 'Leather Interior'],
};

function driverToDisplay(driver: any): TrackingDriver {
  const parts = driver.name.split(' ').filter(Boolean);
  const shortName = parts.length >= 2 ? `${parts[0]} ${parts[1].charAt(0)}.` : driver.name;
  const tags: string[] = [];
  if (driver.amenities?.wifi) tags.push('WiFi');
  if (driver.amenities?.water) tags.push('Refreshments');
  if (driver.amenities?.music) tags.push('Premium Audio');
  tags.push(driver.vehicle?.interior || 'Leather Interior');
  return {
    name: shortName,
    rating: String(driver.rating),
    vehicle: `${driver.vehicle?.color || ''} ${driver.vehicle?.model || ''}`.trim(),
    amenities: tags.slice(0, 4),
  };
}

export const TrackRideScreen = ({ navigation, route }: any) => {
  const { user, setActiveRide } = useApp();
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

  // Handle return from membership/driver-list
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

  // App download popup after 5s
  useEffect(() => {
    const t = setTimeout(() => setShowAppPopup(true), 5000);
    return () => clearTimeout(t);
  }, []);

  // Progress bar animation on tracking step
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

  const handlePaymentSelection = (method: string) => {
    setPaymentMethod(method);
    setActiveRide((prev: any) => ({ ...(prev || {}), paymentMethod: method, status: 'tracking' }));
    navigation.navigate('Membership', { fromTrackRide: true, paymentMethod: method });
  };

  const proceedToTracking = () => {
    setActiveRide((prev: any) => ({ ...(prev || {}), paymentMethod: null, status: 'tracking' }));
    setShowPromo(false);
    setStep('tracking');
  };

  const handleBack = () => {
    if (step === 'tracking') { setStep('payment'); return; }
    if (step === 'payment') { setStep('config'); return; }
    navigation.goBack();
  };

  const etaMins = Math.floor(Math.random() * 2) + 2;

  return (
    <>
    <ScreenShell keyboardAvoiding>
        {/* Header */}
        <View style={styles.headerSection}>
          <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
            <ArrowLeft color={GOLD} size={18} />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.appTitle}>Tuxedo Concierge</Text>
            <View style={styles.statusBadge}>
              <MotiView from={{ opacity: 0.4 }} animate={{ opacity: 1 }} transition={{ type: 'timing', duration: 1000, loop: true }}>
                <Navigation color={GOLD} size={14} />
              </MotiView>
              <Text style={styles.statusText}>
                {step === 'tracking' ? 'CHAUFFEUR EN ROUTE' : 'RIDE CONFIGURATION'}
              </Text>
            </View>
          </View>
        </View>

        {/* STEP 1: CONFIG */}
        {step === 'config' && (
          <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', duration: 400 }}>
            <GlassCard style={styles.card}>
              <Text style={styles.cardTitle}>Finalize Your Journey</Text>

              {/* Pickup */}
              <View style={styles.pickupBox}>
                <Text style={styles.pickupLabel}>Pickup Location</Text>
                <Text style={styles.pickupValue}>{pickupLocation}</Text>
                <Text style={styles.pickupNote}>Set by Concierge</Text>
              </View>

              {/* Drop-off */}
              <View style={styles.inputWrap}>
                <MapPin color={GOLD} size={20} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter Drop-off Location"
                  placeholderTextColor="#6b7280"
                  value={dropOff}
                  onChangeText={setDropOff}
                />
              </View>

              <GoldButton onPress={handleRequestChauffeur} disabled={!dropOff.trim()} style={styles.btn}>
                <Text style={styles.btnText}>Request Chauffeur</Text>
              </GoldButton>
            </GlassCard>
          </MotiView>
        )}

        {/* STEP 2: PAYMENT */}
        {step === 'payment' && (
          <MotiView from={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'timing', duration: 400 }}>
            <GlassCard style={styles.card}>
              <Text style={[styles.cardTitle, { textAlign: 'center' }]}>Select Payment Method</Text>
              <Text style={styles.paySubtitle}>Secure Payment Processing</Text>

              <View style={styles.paymentList}>
                {[
                  { name: 'Apple Pay', Icon: Apple },
                  { name: 'PayPal', Icon: Wallet },
                  { name: 'Credit Card', Icon: CreditCard },
                  { name: 'Cash Payment', Icon: DollarSign },
                ].map(({ name, Icon }) => (
                  <TouchableOpacity
                    key={name}
                    onPress={() => handlePaymentSelection(name)}
                    style={[styles.paymentItem, paymentMethod === name && styles.paymentItemActive]}
                  >
                    <Icon color={GOLD} size={20} />
                    <Text style={styles.paymentItemText}>{name}</Text>
                    {paymentMethod === name && <CheckCircle2 color={GOLD} size={18} style={{ marginLeft: 'auto' }} />}
                  </TouchableOpacity>
                ))}
              </View>

              <GoldButton onPress={proceedToTracking} style={styles.btn}>
                <Text style={styles.btnText}>Proceed to Tracking</Text>
              </GoldButton>
              <Text style={styles.payNote}>You can also pay inside the vehicle</Text>
            </GlassCard>
          </MotiView>
        )}

        {/* STEP 3: TRACKING */}
        {step === 'tracking' && (
          <MotiView from={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ type: 'timing', duration: 500 }}>
            <GlassCard style={[styles.card, styles.trackingCard]}>
              {/* Success icon */}
              <CheckCircle2 color="#22c55e" size={56} style={styles.successIcon} />

              {/* Driver avatar + car */}
              <View style={styles.driverRow}>
                <View style={styles.driverAvatar}>
                  <User color="#374151" size={36} />
                </View>
                <View style={styles.carBox}>
                  <Car color={GOLD} size={32} style={{ opacity: 0.5 }} />
                </View>
              </View>

              <Text style={styles.driverName}>{assignedDriver.name}</Text>
              <View style={styles.sparklesRow}>
                {[0,1,2,3,4].map(i => <Sparkles key={i} color={GOLD} size={12} />)}
                <Text style={styles.ratingText}>{assignedDriver.rating} Rating</Text>
              </View>

              {/* Progress bar */}
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${progressWidth}%` }]} />
              </View>

              <Text style={styles.etaText}>
                Live: Driver is {etaMins} mins away in a {assignedDriver.vehicle}
              </Text>

              {/* Amenities */}
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
                      onPress={() => navigation.navigate('Membership', { fromTrackRide: true, paymentMethod })}
                      style={styles.unlockBtn}
                    >
                      <Lock color="#4b5563" size={12} />
                      <Text style={styles.unlockText}>Buy Membership</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              {/* Promo */}
              {showPromo && (
                <MotiView from={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={styles.promoBox}>
                  <Gift color={GOLD} size={18} />
                  <Text style={styles.promoText}>20% Off Your Next Journey!</Text>
                </MotiView>
              )}
            </GlassCard>
          </MotiView>
        )}

        {/* Footer: Membership status */}
        <TouchableOpacity
          onPress={() => !isMember && navigation.navigate('Membership', { fromTrackRide: true, paymentMethod })}
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
                  {isMember ? `$${(user?.rideCredit || 0).toFixed(2)} Ride Credit` : 'Join for $100 & Get $100 Credit'}
                </Text>
              </View>
            </View>
            {!isMember ? (
              <View style={styles.arrowBtn}>
                <ArrowRight color="#000" size={16} />
              </View>
            ) : (
              <View style={styles.activeRow}>
                <CheckCircle2 color={GOLD} size={12} />
                <Text style={styles.activeText}>Active</Text>
              </View>
            )}
          </GlassCard>
        </TouchableOpacity>
    </ScreenShell>

      <AppDownloadPopup visible={showAppPopup} user={user} onClose={() => setShowAppPopup(false)} />
    </>
  );
};

const AppDownloadPopup = ({
  visible,
  user,
  onClose,
}: {
  visible: boolean;
  user: AppUser | null;
  onClose: () => void;
}) => {
  const handleDownloadApp = async () => {
    try {
      await storePendingAppDownloadCoupon(user);
      await Linking.openURL('https://apps.apple.com');
    } catch {
      // still dismiss; coupon may be stored
    }
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={popup.overlay}>
        <MotiView from={{ opacity: 0, scale: 0.9, translateY: 20 }} animate={{ opacity: 1, scale: 1, translateY: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 25 }}>
          <GlassCard style={popup.card}>
            <View style={popup.iconWrap}>
              <Sparkles color={GOLD} size={32} />
            </View>
            <Text style={popup.title}>
              Download our app and get{' '}
              <Text style={{ color: GOLD }}>$100 coupon free</Text>
              {' '}on your next ride.
            </Text>
            <GoldButton onPress={handleDownloadApp} style={popup.btn}>
              <Text style={popup.btnText}>Download App</Text>
            </GoldButton>
            <TouchableOpacity onPress={onClose} style={popup.skipBtn}>
              <Text style={popup.skipText}>Skip for Now</Text>
            </TouchableOpacity>
          </GlassCard>
        </MotiView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  headerSection: { marginBottom: 24 },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 16 },
  backText: { color: GOLD, fontWeight: '700', fontSize: 14 },
  headerCenter: { alignItems: 'center' },
  appTitle: { fontSize: 22, color: '#fff', fontWeight: '900', textTransform: 'uppercase', fontStyle: 'italic', marginBottom: 8 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 14, paddingVertical: 6, backgroundColor: 'rgba(212,175,55,0.15)', borderWidth: 1, borderColor: 'rgba(212,175,55,0.3)', borderRadius: 50 },
  statusText: { color: GOLD, fontSize: 11, fontWeight: '900', letterSpacing: 1 },
  card: { padding: 24, marginBottom: 16 },
  cardTitle: { fontSize: 20, color: '#fff', fontWeight: '900', textTransform: 'uppercase', fontStyle: 'italic', marginBottom: 20 },
  pickupBox: { backgroundColor: 'rgba(212,175,55,0.1)', borderWidth: 2, borderColor: 'rgba(212,175,55,0.4)', borderRadius: 12, padding: 14, marginBottom: 16 },
  pickupLabel: { color: GOLD, fontSize: 10, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 },
  pickupValue: { color: '#fff', fontWeight: '700', fontSize: 15 },
  pickupNote: { color: '#6b7280', fontSize: 10, fontWeight: '500', textTransform: 'uppercase', marginTop: 4 },
  inputWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)', borderWidth: 2, borderColor: 'rgba(212,175,55,0.3)', borderRadius: 12, paddingHorizontal: 14, marginBottom: 20 },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, color: '#fff', fontSize: 15, paddingVertical: 14, fontWeight: '600' },
  btn: { width: '100%', paddingVertical: 18 },
  btnText: { color: '#000', fontWeight: '900', fontSize: 15, textAlign: 'center', textTransform: 'uppercase' },
  paySubtitle: { color: '#6b7280', fontSize: 10, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 1, textAlign: 'center', marginBottom: 20, marginTop: -12 },
  paymentList: { gap: 10, marginBottom: 24 },
  paymentItem: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16, backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 2, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 12 },
  paymentItemActive: { borderColor: GOLD, backgroundColor: 'rgba(212,175,55,0.05)' },
  paymentItemText: { color: '#fff', fontWeight: '700', fontSize: 15, flex: 1 },
  payNote: { color: '#6b7280', fontSize: 10, fontWeight: '700', textTransform: 'uppercase', textAlign: 'center', marginTop: 12, letterSpacing: 0.5 },
  trackingCard: { alignItems: 'center' },
  successIcon: { marginBottom: 20 },
  driverRow: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 16 },
  driverAvatar: { width: 72, height: 72, borderRadius: 36, borderWidth: 2, borderColor: GOLD, backgroundColor: '#111', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  carBox: { width: 100, height: 56, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center' },
  driverName: { fontSize: 24, color: '#fff', fontWeight: '900', textTransform: 'uppercase', fontStyle: 'italic', marginBottom: 8 },
  sparklesRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 20 },
  ratingText: { color: GOLD, fontSize: 10, fontWeight: '900', textTransform: 'uppercase', marginLeft: 4 },
  progressTrack: { width: '100%', height: 8, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 4, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', marginBottom: 12 },
  progressFill: { height: '100%', backgroundColor: GOLD, borderRadius: 4 },
  etaText: { color: '#9ca3af', fontSize: 10, fontWeight: '500', textTransform: 'uppercase', letterSpacing: 0.5, textAlign: 'center', marginBottom: 20 },
  amenitiesBox: { width: '100%', backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', padding: 14, marginBottom: 16 },
  amenitiesHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, justifyContent: 'center', marginBottom: 10 },
  amenitiesTitle: { color: '#6b7280', fontSize: 10, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 1 },
  amenitiesTags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, justifyContent: 'center' },
  amenityTag: { backgroundColor: 'rgba(212,175,55,0.1)', borderWidth: 1, borderColor: 'rgba(212,175,55,0.2)', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4 },
  amenityTagText: { color: GOLD, fontSize: 10, fontWeight: '700' },
  lockedAmenities: { alignItems: 'center', gap: 8 },
  lockedText: { color: '#4b5563', fontSize: 9, fontWeight: '900', textTransform: 'uppercase' },
  unlockBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 8, paddingHorizontal: 16, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)', borderStyle: 'dashed' },
  unlockText: { color: '#4b5563', fontSize: 9, fontWeight: '900', textTransform: 'uppercase' },
  promoBox: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'rgba(212,175,55,0.1)', borderWidth: 2, borderColor: 'rgba(212,175,55,0.4)', borderRadius: 12, padding: 14, borderStyle: 'dashed' },
  promoText: { color: GOLD, fontWeight: '900', fontSize: 12, textTransform: 'uppercase' },
  footerCard: { padding: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  footerCardMember: { borderColor: 'rgba(212,175,55,0.4)', backgroundColor: 'rgba(212,175,55,0.05)' },
  footerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  crownWrap: { padding: 8, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.05)' },
  crownWrapActive: { backgroundColor: GOLD },
  footerTitle: { color: '#fff', fontSize: 11, fontWeight: '900', textTransform: 'uppercase', fontStyle: 'italic' },
  footerSub: { color: '#6b7280', fontSize: 9, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 2 },
  arrowBtn: { backgroundColor: GOLD, padding: 8, borderRadius: 8 },
  activeRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  activeText: { color: GOLD, fontSize: 8, fontWeight: '900', textTransform: 'uppercase' },
});

const popup = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  card: { padding: 32, alignItems: 'center', width: '100%', maxWidth: 360 },
  iconWrap: { width: 64, height: 64, backgroundColor: 'rgba(212,175,55,0.15)', borderRadius: 16, borderWidth: 1, borderColor: 'rgba(212,175,55,0.3)', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 18, color: '#fff', fontWeight: '700', textAlign: 'center', lineHeight: 26, marginBottom: 24 },
  btn: { width: '100%', paddingVertical: 16, marginBottom: 10 },
  btnText: { color: '#000', fontWeight: '900', fontSize: 14, textAlign: 'center', textTransform: 'uppercase' },
  skipBtn: { paddingVertical: 10 },
  skipText: { color: '#6b7280', fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 },
});
