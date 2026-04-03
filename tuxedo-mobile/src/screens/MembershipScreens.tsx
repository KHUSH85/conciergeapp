import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { ArrowLeft, Crown, CheckCircle2, Zap, CreditCard, ShieldCheck, Apple } from 'lucide-react-native';
import { GlassCard, GoldButton } from '../components/GlassCard';
import { ScreenShell } from '../components/ScreenShell';
import { useApp } from '../context/AppContext';
import { persistMembershipState } from '../utils/appStorage';

const GOLD = '#D4AF37';

const BENEFITS = [
  'Manual Chauffeur Selection',
  'View Full Driver Amenities',
  'Advanced Search Filters',
  'Priority Dispatching',
  'Exclusive Luxury Fleet Access',
];

/** Matches web `/membership` — supports passenger flow from `/track-ride` via `fromTrackRide`. */
export const MembershipScreen = ({ navigation, route }: any) => {
  const fromTrackRide = route.params?.fromTrackRide === true;
  const paymentMethod = route.params?.paymentMethod ?? null;

  return (
    <ScreenShell>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft color={GOLD} size={18} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <GlassCard style={styles.cardGold}>
          <MotiView from={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 15 }} style={styles.headerSection}>
            <Crown color={GOLD} size={56} style={{ marginBottom: 12 }} />
            <Text style={styles.membershipTitle}>Tuxedo Gold</Text>
          </MotiView>

          <View style={styles.priceBox}>
            <Text style={styles.priceLabel}>Membership Price</Text>
            <Text style={styles.price}>$100<Text style={styles.pricePer}>/yr</Text></Text>
            <View style={styles.creditBadge}>
              <Zap color="#22c55e" size={14} fill="#22c55e" />
              <Text style={styles.creditText}>Get $100 Instant Ride Credit</Text>
            </View>
          </View>

          <View style={styles.benefitsList}>
            {BENEFITS.map((benefit, i) => (
              <MotiView key={i} from={{ opacity: 0, translateX: -20 }} animate={{ opacity: 1, translateX: 0 }} transition={{ type: 'timing', duration: 300, delay: i * 80 }}>
                <View style={styles.benefitRow}>
                  <CheckCircle2 color={GOLD} size={18} />
                  <Text style={styles.benefitText}>{benefit}</Text>
                </View>
              </MotiView>
            ))}
          </View>

          <GoldButton
            onPress={() => navigation.navigate('MembershipPayment', { fromTrackRide, paymentMethod })}
            style={styles.btn}
          >
            <Text style={styles.btnText}>Buy Membership</Text>
          </GoldButton>

          {fromTrackRide && (
            <TouchableOpacity
              onPress={() => navigation.navigate('TrackRide', { fromMembershipSkip: true, paymentMethod })}
              style={styles.skipBtn}
            >
              <Text style={styles.skipText}>Continue Without Membership</Text>
            </TouchableOpacity>
          )}
        </GlassCard>
    </ScreenShell>
  );
};

/** Matches web `/membership-payment` — after pay, driver list (passenger flow passes state from track-ride). */
export const MembershipPaymentScreen = ({ navigation, route }: any) => {
  const { setUser } = useApp();
  const fromTrackRide = route.params?.fromTrackRide === true;
  const paymentMethod = route.params?.paymentMethod ?? null;

  const handlePayment = async () => {
    setUser((prev: any) => {
      if (!prev) return null;
      return { ...prev, isMember: true, rideCredit: 100 };
    });
    await persistMembershipState(true, 100);
    if (fromTrackRide) {
      navigation.navigate('DriverList', { fromTrackRide: true, paymentMethod });
    } else {
      navigation.navigate('DriverList');
    }
  };

  return (
    <ScreenShell>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft color={GOLD} size={18} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <GlassCard style={styles.cardGold}>
          <MotiView from={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 15 }} style={styles.headerSection}>
            <ShieldCheck color={GOLD} size={56} style={{ marginBottom: 12 }} />
            <Text style={styles.payTitle}>Complete Payment</Text>
            <Text style={styles.paySubtitle}>Annual Gold Membership</Text>
          </MotiView>

          <View style={styles.totalBox}>
            <Text style={styles.totalLabel}>Total Due</Text>
            <Text style={styles.totalAmount}>$100.00</Text>
            <View style={styles.creditBadge}>
              <Zap color="#22c55e" size={12} fill="#22c55e" />
              <Text style={styles.creditText}>Includes $100 Ride Credit</Text>
            </View>
          </View>

          <View style={styles.payMethods}>
            {[
              { id: 'apple', label: 'Apple Pay', icon: Apple },
              { id: 'card', label: 'Credit Card', icon: CreditCard },
            ].map(({ id, label, icon: Icon }) => (
              <TouchableOpacity key={id} onPress={handlePayment} style={styles.payMethod}>
                <View style={styles.payMethodLeft}>
                  <Icon color={GOLD} size={22} />
                  <Text style={styles.payMethodText}>{label}</Text>
                </View>
                <View style={styles.payMethodRadio} />
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.payFooter}>
            Secure payment processed by Tuxedo Financial.{'\n'}
            Membership unlocks full driver profiles and amenities.
          </Text>
        </GlassCard>
    </ScreenShell>
  );
};

const styles = StyleSheet.create({
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 16 },
  backText: { color: GOLD, fontWeight: '700', fontSize: 14 },
  cardGold: { padding: 24, borderColor: 'rgba(212,175,55,0.3)' },
  headerSection: { alignItems: 'center', marginBottom: 24 },
  membershipTitle: { fontSize: 30, color: '#fff', fontWeight: '900', textTransform: 'uppercase', fontStyle: 'italic' },
  priceBox: { backgroundColor: 'rgba(212,175,55,0.1)', borderWidth: 1, borderColor: 'rgba(212,175,55,0.2)', borderRadius: 16, padding: 20, alignItems: 'center', marginBottom: 24 },
  priceLabel: { color: GOLD, fontSize: 10, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 },
  price: { fontSize: 48, color: '#fff', fontWeight: '900' },
  pricePer: { fontSize: 14, color: '#6b7280', fontWeight: '700' },
  creditBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10 },
  creditText: { color: '#22c55e', fontWeight: '700', fontSize: 12, textTransform: 'uppercase' },
  benefitsList: { gap: 14, marginBottom: 28 },
  benefitRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  benefitText: { color: '#d1d5db', fontSize: 14, fontWeight: '500' },
  btn: { width: '100%', paddingVertical: 18, marginBottom: 10 },
  btnText: { color: '#000', fontWeight: '900', fontSize: 16, textAlign: 'center', textTransform: 'uppercase' },
  skipBtn: { paddingVertical: 12, alignItems: 'center' },
  skipText: { color: '#6b7280', fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  payTitle: { fontSize: 22, color: '#fff', fontWeight: '900', textTransform: 'uppercase', fontStyle: 'italic' },
  paySubtitle: { color: '#6b7280', fontWeight: '900', fontSize: 10, textTransform: 'uppercase', letterSpacing: 1, marginTop: 4 },
  totalBox: { backgroundColor: 'rgba(212,175,55,0.05)', borderWidth: 1, borderColor: 'rgba(212,175,55,0.2)', borderRadius: 16, padding: 20, alignItems: 'center', marginBottom: 24 },
  totalLabel: { color: '#9ca3af', fontSize: 10, fontWeight: '900', textTransform: 'uppercase', marginBottom: 6 },
  totalAmount: { fontSize: 40, color: '#fff', fontWeight: '900' },
  payMethods: { gap: 10, marginBottom: 20 },
  payMethod: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 14, padding: 18 },
  payMethodLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  payMethodText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  payMethodRadio: { width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: 'rgba(212,175,55,0.4)' },
  payFooter: { color: '#4b5563', fontSize: 10, textAlign: 'center', fontWeight: '900', textTransform: 'uppercase', lineHeight: 16, fontStyle: 'italic' },
});
