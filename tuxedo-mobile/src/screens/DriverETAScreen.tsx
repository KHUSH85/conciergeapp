import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { Car, MapPin, Star, Shield, X } from 'lucide-react-native';
import { AppCard } from '../components/AppCard';
import { AppButton } from '../components/AppButton';
import { AppScreen } from '../components/AppScreen';
import { useHaptics } from '../hooks/useHaptics';
import { useStaggerAnimation } from '../hooks/useStaggerAnimation';

const GOLD       = '#D4AF37';
const GOLD_FAINT = 'rgba(212,175,55,0.08)';

export const DriverETAScreen = ({ navigation, route }: any) => {
  const driver        = route.params?.driver        || { name: 'Michael T.', rating: 4.9, eta: 3 };
  const paymentType   = route.params?.paymentType   || 'card';
  const estimatedFare = route.params?.estimatedFare || 45.00;
  const { light } = useHaptics();
  const delays = useStaggerAnimation();

  const driverName  = driver.name;
  const driverRating = typeof driver.rating === 'number' ? driver.rating.toFixed(1) : driver.rating;
  const driverCar   = driver.vehicle
    ? `${driver.vehicle.brand} ${driver.vehicle.model}`
    : 'Mercedes-Benz S-Class';
  const driverPlate = driver.vehicle?.plate || driver.plate || 'LUX 2024';
  const driverEta   = driver.eta || 3;

  return (
    <AppScreen noTopPad>
      {/* ── ETA hero ── */}
      <MotiView
        from={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'timing', duration: 260, delay: delays.header }}
      >
        <AppCard variant="gold" style={styles.heroCard}>
          <View style={styles.carCircle}>
            <MotiView
              from={{ translateY: 0 }}
              animate={{ translateY: -6 }}
              transition={{ type: 'timing', duration: 2000, loop: true }}
            >
              <Car color={GOLD} size={40} />
            </MotiView>
          </View>

          <Text style={styles.etaLabel}>Arriving in</Text>
          <Text style={styles.etaValue}>{driverEta} min</Text>
          <Text style={styles.carName}>{driverCar}</Text>

          {/* Pulse ring */}
          <MotiView
            from={{ scale: 1, opacity: 0.4 }}
            animate={{ scale: 1.6, opacity: 0 }}
            transition={{ type: 'timing', duration: 1600, loop: true }}
            style={styles.pulseRing}
          />
        </AppCard>
      </MotiView>

      {/* ── Driver details ── */}
      <MotiView
        from={{ opacity: 0, translateY: 16 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 240, delay: delays.content }}
      >
        <AppCard style={styles.driverCard}>
          <View style={styles.driverRow}>
            <View style={styles.driverAvatar}>
              <Text style={styles.driverInitial}>{driverName.charAt(0)}</Text>
            </View>
            <View style={styles.driverInfo}>
              <Text style={styles.driverName}>{driverName}</Text>
              <View style={styles.ratingRow}>
                <Star color={GOLD} size={13} fill={GOLD} />
                <Text style={styles.ratingText}>{driverRating}</Text>
              </View>
            </View>
            <View style={styles.plateBadge}>
              <Text style={styles.plateText}>{driverPlate}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <MapPin color="#6b7280" size={13} />
              <Text style={styles.infoText}>En route to you</Text>
            </View>
            <View style={styles.infoItem}>
              <Shield color="#6b7280" size={13} />
              <Text style={styles.infoText}>Verified chauffeur</Text>
            </View>
          </View>
        </AppCard>
      </MotiView>

      {/* ── Fare summary ── */}
      <MotiView
        from={{ opacity: 0, translateY: 12 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 220, delay: delays.item(0) }}
      >
        <AppCard style={styles.fareCard}>
          <View style={styles.fareRow}>
            <Text style={styles.fareLabel}>Estimated Fare</Text>
            <Text style={styles.fareValue}>${estimatedFare.toFixed(2)}</Text>
          </View>
          <View style={styles.fareDivider} />
          <View style={styles.fareRow}>
            <Text style={styles.fareLabel}>Payment</Text>
            <Text style={styles.fareMethod}>
              {paymentType === 'cash' ? 'Cash' : 'Card'}
            </Text>
          </View>
        </AppCard>
      </MotiView>

      {/* ── CTAs ── */}
      <MotiView
        from={{ opacity: 0, translateY: 10 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 220, delay: delays.cta }}
        style={styles.ctaWrap}
      >
        <AppButton
          label="Track Ride"
          onPress={() =>
            navigation.navigate('Rides' as any, {
              screen: 'ActiveRide',
              params: { driver, paymentType, estimatedFare },
            })
          }
          haptic="medium"
          style={styles.primaryBtn}
        />

        <TouchableOpacity
          onPress={async () => { await light(); navigation.navigate('ConciergeHome'); }}
          style={styles.cancelBtn}
          accessibilityRole="button"
        >
          <X color="#4b5563" size={14} />
          <Text style={styles.cancelText}>Cancel Ride</Text>
        </TouchableOpacity>
      </MotiView>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  heroCard: {
    padding: 28, alignItems: 'center',
    marginBottom: 12, overflow: 'visible',
  },
  carCircle: {
    width: 88, height: 88, borderRadius: 44,
    backgroundColor: 'rgba(212,175,55,0.1)',
    borderWidth: 1, borderColor: 'rgba(212,175,55,0.3)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 16,
    shadowColor: GOLD,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 6,
  },
  pulseRing: {
    position: 'absolute',
    width: 88, height: 88, borderRadius: 44,
    borderWidth: 1, borderColor: GOLD,
    top: 28,
  },
  etaLabel: {
    fontSize: 11, color: '#6b7280', fontWeight: '600',
    letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 4,
  },
  etaValue: {
    fontSize: 52, color: '#fff', fontWeight: '800',
    letterSpacing: -1, marginBottom: 4,
  },
  carName: { fontSize: 14, color: '#9ca3af', fontWeight: '500' },
  driverCard: { padding: 16, marginBottom: 10 },
  driverRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  driverAvatar: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: 'rgba(212,175,55,0.1)',
    borderWidth: 1, borderColor: 'rgba(212,175,55,0.25)',
    alignItems: 'center', justifyContent: 'center',
  },
  driverInitial: { color: GOLD, fontSize: 20, fontWeight: '700' },
  driverInfo: { flex: 1 },
  driverName: { color: '#fff', fontWeight: '700', fontSize: 16, marginBottom: 4 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  ratingText: { color: GOLD, fontWeight: '700', fontSize: 13 },
  plateBadge: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6,
  },
  plateText: { color: '#d1d5db', fontSize: 12, fontWeight: '700', letterSpacing: 1 },
  infoRow: {
    flexDirection: 'row', gap: 20,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.06)',
  },
  infoItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  infoText: { color: '#6b7280', fontSize: 12, fontWeight: '500' },
  fareCard: { padding: 16, marginBottom: 16 },
  fareRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  fareLabel:  { color: '#9ca3af', fontSize: 13, fontWeight: '500' },
  fareValue:  { color: '#fff', fontSize: 20, fontWeight: '800' },
  fareMethod: { color: '#d1d5db', fontSize: 14, fontWeight: '600' },
  fareDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginVertical: 12,
  },
  ctaWrap: { gap: 10 },
  primaryBtn: { width: '100%' },
  cancelBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, minHeight: 44,
  },
  cancelText: { color: '#4b5563', fontSize: 13, fontWeight: '500' },
});
