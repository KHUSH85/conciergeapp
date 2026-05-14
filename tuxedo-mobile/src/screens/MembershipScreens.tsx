import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { Crown, CheckCircle2, Zap, CreditCard, ShieldCheck, Apple } from 'lucide-react-native';
import { AppCard } from '../components/AppCard';
import { AppButton } from '../components/AppButton';
import { AppScreen } from '../components/AppScreen';
import { useHaptics } from '../hooks/useHaptics';
import { useStaggerAnimation } from '../hooks/useStaggerAnimation';
import { useApp } from '../context/AppContext';
import { persistMembershipState } from '../utils/appStorage';

const GOLD       = '#D4AF37';
const GOLD_FAINT = 'rgba(212,175,55,0.08)';
const GOLD_DIM   = 'rgba(212,175,55,0.25)';
const GREEN      = '#22c55e';

const BENEFITS = [
  '24-hour on-demand concierge (dedicated line)',
  'Advanced chauffeur filters',
  'Full chauffeur profiles',
  'Priority dispatching',
];

// ─── Membership upsell screen ─────────────────────────────────────────────────
export const MembershipScreen = ({ navigation, route }: any) => {
  const fromTrackRide  = route.params?.fromTrackRide === true;
  const paymentMethod  = route.params?.paymentMethod ?? null;
  const { light } = useHaptics();
  const delays = useStaggerAnimation();

  return (
    <AppScreen noTopPad>
      {/* ── Hero ── */}
      <MotiView
        from={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 18, delay: 60 }}
      >
        <AppCard variant="gold" style={styles.heroCard}>
          <View style={styles.crownWrap}>
            <Crown color={GOLD} size={44} />
          </View>
          <Text style={styles.heroTitle}>Tuxedo Gold</Text>
          <Text style={styles.heroSub}>Premium Concierge Membership</Text>

          {/* Price */}
          <View style={styles.priceBox}>
            <Text style={styles.price}>$100</Text>
            <Text style={styles.pricePer}>/month</Text>
          </View>

          {/* Credit badge */}
          <View style={styles.creditBadge}>
            <Zap color={GREEN} size={13} fill={GREEN} />
            <Text style={styles.creditText}>Get $100 toward your next ride each month · does not roll over</Text>
          </View>
        </AppCard>
      </MotiView>

      {/* ── Benefits ── */}
      <Text style={styles.sectionLabel}>What's included</Text>
      <AppCard style={styles.benefitsCard}>
        {BENEFITS.map((benefit, i) => (
          <MotiView
            key={i}
            from={{ opacity: 0, translateX: -12 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ type: 'timing', duration: 200, delay: delays.item(i) }}
          >
            <React.Fragment>
              <View style={styles.benefitRow}>
                <View style={styles.benefitCheck}>
                  <CheckCircle2 color={GOLD} size={16} />
                </View>
                <Text style={styles.benefitText}>{benefit}</Text>
              </View>
              {i < BENEFITS.length - 1 && <View style={styles.divider} />}
            </React.Fragment>
          </MotiView>
        ))}
      </AppCard>

      {/* ── CTAs ── */}
      <MotiView
        from={{ opacity: 0, translateY: 10 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 220, delay: delays.cta }}
        style={styles.ctaWrap}
      >
        <AppButton
          label="Get Gold Membership"
          onPress={() =>
            navigation.navigate('MembershipPayment', { fromTrackRide, paymentMethod })
          }
          haptic="medium"
          style={styles.primaryBtn}
        />

        {fromTrackRide && (
          <AppButton
            label="Continue Without Membership"
            onPress={() =>
              navigation.getParent()?.navigate('Home', {
                screen: 'TrackRide',
                params: { fromMembershipSkip: true, paymentMethod },
              })
            }
            variant="ghost"
            haptic="light"
            style={styles.skipBtn}
          />
        )}
      </MotiView>
    </AppScreen>
  );
};

// ─── Payment screen ───────────────────────────────────────────────────────────
export const MembershipPaymentScreen = ({ navigation, route }: any) => {
  const { setUser } = useApp();
  const fromTrackRide = route.params?.fromTrackRide === true;
  const paymentMethod = route.params?.paymentMethod ?? null;
  const { medium, success } = useHaptics();
  const delays = useStaggerAnimation();
  const [loading, setLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<'apple' | 'card'>('card');

  const handlePayment = async () => {
    setLoading(true);
    await medium();
    await new Promise(r => setTimeout(r, 800));
    setUser((prev: any) => {
      if (!prev) return null;
      return { ...prev, isMember: true, rideCredit: 100 };
    });
    await persistMembershipState(true, 100);
    await success();
    setLoading(false);
    if (fromTrackRide) {
      navigation.getParent()?.navigate('Home', {
        screen: 'TrackRide',
        params: { fromMembershipPurchase: true, paymentMethod },
      });
    } else {
      navigation.getParent()?.navigate('Home', { screen: 'ConciergeHome' });
    }
  };

  const payMethods: { id: 'apple' | 'card'; label: string; Icon: any }[] = [
    { id: 'apple', label: 'Apple Pay',   Icon: Apple      },
    { id: 'card',  label: 'Credit Card', Icon: CreditCard },
  ];

  return (
    <AppScreen noTopPad>
      {/* ── Order summary ── */}
      <MotiView
        from={{ opacity: 0, translateY: 16 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 260, delay: 60 }}
      >
        <AppCard variant="gold" style={styles.summaryCard}>
          <View style={styles.summaryIcon}>
            <ShieldCheck color={GOLD} size={32} />
          </View>
          <Text style={styles.summaryTitle}>Gold membership (monthly)</Text>

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Due today</Text>
            <Text style={styles.totalValue}>$100.00</Text>
          </View>

          <View style={styles.creditBadge}>
            <Zap color={GREEN} size={13} fill={GREEN} />
            <Text style={styles.creditText}>Includes $100 toward your next ride · monthly credit does not stack</Text>
          </View>
        </AppCard>
      </MotiView>

      {/* ── Payment methods ── */}
      <Text style={styles.sectionLabel}>Payment Method</Text>
      <AppCard style={styles.methodsCard}>
        {payMethods.map(({ id, label, Icon }, i) => (
          <React.Fragment key={id}>
            <TouchableOpacity
              onPress={() => setSelectedMethod(id)}
              style={styles.methodRow}
              accessibilityRole="radio"
              accessibilityState={{ selected: selectedMethod === id }}
              activeOpacity={0.7}
            >
              <View style={styles.methodLeft}>
                <View style={[
                  styles.methodIconWrap,
                  selectedMethod === id && styles.methodIconActive,
                ]}>
                  <Icon color={selectedMethod === id ? GOLD : '#6b7280'} size={20} />
                </View>
                <Text style={[
                  styles.methodLabel,
                  selectedMethod === id && styles.methodLabelActive,
                ]}>
                  {label}
                </Text>
              </View>
              <View style={[
                styles.radio,
                selectedMethod === id && styles.radioSelected,
              ]}>
                {selectedMethod === id && <View style={styles.radioDot} />}
              </View>
            </TouchableOpacity>
            {i < payMethods.length - 1 && <View style={styles.divider} />}
          </React.Fragment>
        ))}
      </AppCard>

      {/* ── CTA ── */}
      <MotiView
        from={{ opacity: 0, translateY: 10 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 220, delay: delays.cta }}
        style={styles.ctaWrap}
      >
        <AppButton
          label="Pay $100.00"
          onPress={handlePayment}
          loading={loading}
          haptic="success"
          style={styles.primaryBtn}
        />
        <Text style={styles.payFooter}>
          Secure payment · Chauffeur choice and full profiles are for members in the passenger app
        </Text>
      </MotiView>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  // Membership screen
  heroCard: { padding: 24, alignItems: 'center', marginBottom: 20 },
  crownWrap: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: GOLD_FAINT,
    borderWidth: 1, borderColor: GOLD_DIM,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 14,
    shadowColor: GOLD,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  heroTitle: {
    fontSize: 28, color: '#fff', fontWeight: '800',
    marginBottom: 4,
  },
  heroSub: { fontSize: 13, color: '#9ca3af', fontWeight: '500', marginBottom: 20 },
  priceBox: {
    flexDirection: 'row', alignItems: 'flex-end', gap: 4, marginBottom: 12,
  },
  price:    { fontSize: 48, color: '#fff', fontWeight: '800', letterSpacing: -1 },
  pricePer: { fontSize: 16, color: '#6b7280', fontWeight: '600', marginBottom: 8 },
  creditBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(34,197,94,0.1)',
    borderWidth: 1, borderColor: 'rgba(34,197,94,0.25)',
    borderRadius: 50, paddingHorizontal: 12, paddingVertical: 6,
  },
  creditText: { color: GREEN, fontSize: 12, fontWeight: '700' },
  sectionLabel: {
    fontSize: 11, color: '#6b7280', fontWeight: '600',
    letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 10,
  },
  benefitsCard: { marginBottom: 20 },
  benefitRow: {
    flexDirection: 'row', alignItems: 'center',
    gap: 14, paddingHorizontal: 16, paddingVertical: 14, minHeight: 52,
  },
  benefitCheck: {
    width: 32, height: 32, borderRadius: 8,
    backgroundColor: GOLD_FAINT,
    alignItems: 'center', justifyContent: 'center',
  },
  benefitText: { color: '#d1d5db', fontSize: 14, fontWeight: '500', flex: 1 },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255,255,255,0.06)',
    marginLeft: 62,
  },
  ctaWrap: { gap: 10 },
  primaryBtn: { width: '100%' },
  skipBtn:    { width: '100%' },

  // Payment screen
  summaryCard: { padding: 24, alignItems: 'center', marginBottom: 20 },
  summaryIcon: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: GOLD_FAINT,
    borderWidth: 1, borderColor: GOLD_DIM,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 14,
  },
  summaryTitle: {
    fontSize: 18, color: '#fff', fontWeight: '700', marginBottom: 16,
  },
  totalRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12,
  },
  totalLabel: { color: '#9ca3af', fontSize: 14, fontWeight: '500' },
  totalValue: { fontSize: 32, color: '#fff', fontWeight: '800' },
  methodsCard: { marginBottom: 20 },
  methodRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 16, minHeight: 60,
  },
  methodLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  methodIconWrap: {
    width: 40, height: 40, borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.04)',
    alignItems: 'center', justifyContent: 'center',
  },
  methodIconActive: { backgroundColor: GOLD_FAINT },
  methodLabel:       { color: '#9ca3af', fontSize: 15, fontWeight: '600' },
  methodLabelActive: { color: '#fff' },
  radio: {
    width: 20, height: 20, borderRadius: 10,
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  radioSelected: { borderColor: GOLD },
  radioDot: {
    width: 10, height: 10, borderRadius: 5, backgroundColor: GOLD,
  },
  payFooter: {
    color: '#4b5563', fontSize: 11, fontWeight: '500',
    textAlign: 'center', lineHeight: 16,
  },
});
