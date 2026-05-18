import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { Star, MapPin, Shield, CheckCircle2, Award, Clock } from 'lucide-react-native';
import { AppCard } from '../components/AppCard';
import { AppButton } from '../components/AppButton';
import { AppScreen } from '../components/AppScreen';
import { useStaggerAnimation } from '../hooks/useStaggerAnimation';
import { mockDrivers } from '../data/mockDrivers';
import { calculateFare } from '../utils/pricing';

const GOLD = '#D4AF37';

export const DriverConfirmationScreen = ({ navigation, route }: any) => {
  const driver        = route.params?.driver || mockDrivers[0];
  const paymentType   = route.params?.paymentType || 'card';
  const estimatedFare = calculateFare(paymentType);
  const delays = useStaggerAnimation();

  const badges = [
    driver.verified       && { label: 'Limo Verified',     color: '#4ade80', bg: 'rgba(74,222,128,0.1)',  border: 'rgba(74,222,128,0.3)',  Icon: Shield       },
    driver.backgroundCheck && { label: 'Background Check', color: '#60a5fa', bg: 'rgba(96,165,250,0.1)',  border: 'rgba(96,165,250,0.3)',  Icon: CheckCircle2 },
    driver.hotelPreferred  && { label: 'Hotel Preferred',  color: GOLD,      bg: 'rgba(212,175,55,0.1)', border: 'rgba(212,175,55,0.3)', Icon: Award        },
  ].filter(Boolean) as { label: string; color: string; bg: string; border: string; Icon: any }[];

  return (
    <AppScreen noTopPad>
      {/* ── Driver card ── */}
      <MotiView
        from={{ opacity: 0, translateY: 16 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 260, delay: 60 }}
      >
        <AppCard variant="gold" style={styles.driverCard}>
          {/* Avatar + info */}
          <View style={styles.driverRow}>
            <View style={styles.avatarWrap}>
              <View style={styles.avatar}>
                <Text style={styles.avatarInitial}>{driver.name.charAt(0)}</Text>
              </View>
              {driver.verified && (
                <View style={styles.verifiedBadge}>
                  <CheckCircle2 color="#000" size={12} />
                </View>
              )}
            </View>

            <View style={styles.driverInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.driverName}>{driver.name}</Text>
                {driver.hotelPreferred && <Award color={GOLD} size={16} />}
              </View>
              <View style={styles.ratingRow}>
                <Star color={GOLD} size={13} fill={GOLD} />
                <Text style={styles.ratingText}>{driver.rating.toFixed(1)}</Text>
                <Text style={styles.expText}>· {driver.experience} yrs exp</Text>
              </View>
              <Text style={styles.carText}>
                {driver.vehicle.brand} {driver.vehicle.model}
              </Text>
            </View>
          </View>

          {/* ETA row */}
          <View style={styles.etaRow}>
            <View style={styles.etaItem}>
              <MapPin color={GOLD} size={14} />
              <Text style={styles.etaText}>{driver.distance} mi away</Text>
            </View>
            <View style={styles.etaDivider} />
            <View style={styles.etaItem}>
              <Clock color={GOLD} size={14} />
              <Text style={styles.etaText}>{driver.eta} min ETA</Text>
            </View>
          </View>
        </AppCard>
      </MotiView>

      {/* ── Trust badges ── */}
      {badges.length > 0 && (
        <MotiView
          from={{ opacity: 0, translateY: 10 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 220, delay: 120 }}
          style={styles.badgesRow}
        >
          {badges.map(({ label, color, bg, border, Icon }) => (
            <View key={label} style={[styles.badge, { backgroundColor: bg, borderColor: border }]}>
              <Icon color={color} size={13} />
              <Text style={[styles.badgeText, { color }]}>{label}</Text>
            </View>
          ))}
        </MotiView>
      )}

      {/* ── Fare summary ── */}
      <MotiView
        from={{ opacity: 0, translateY: 10 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 220, delay: 160 }}
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
          label="Confirm Assignment"
          onPress={() =>
            navigation.navigate('DriverETA', { driver, paymentType, estimatedFare })
          }
          haptic="medium"
          style={styles.confirmBtn}
        />
        <AppButton
          label="Choose Different Chauffeur"
          onPress={() => navigation.goBack()}
          variant="secondary"
          haptic="light"
          style={styles.changeBtn}
        />
      </MotiView>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  driverCard: { padding: 20, marginBottom: 12 },
  driverRow: { flexDirection: 'row', gap: 14, marginBottom: 16 },
  avatarWrap: { position: 'relative' },
  avatar: {
    width: 68, height: 68, borderRadius: 34,
    backgroundColor: 'rgba(212,175,55,0.1)',
    borderWidth: 1, borderColor: 'rgba(212,175,55,0.3)',
    alignItems: 'center', justifyContent: 'center',
  },
  avatarInitial: { fontSize: 26, color: GOLD, fontWeight: '800' },
  verifiedBadge: {
    position: 'absolute', bottom: -2, right: -2,
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: GOLD,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: '#000',
  },
  driverInfo: { flex: 1, justifyContent: 'center' },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 5 },
  driverName: { color: '#fff', fontWeight: '700', fontSize: 18 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 4 },
  ratingText: { color: GOLD, fontWeight: '700', fontSize: 14 },
  expText:    { color: '#6b7280', fontSize: 12, fontWeight: '500' },
  carText:    { color: '#9ca3af', fontSize: 13, fontWeight: '500' },
  etaRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(212,175,55,0.06)',
    borderWidth: 1, borderColor: 'rgba(212,175,55,0.15)',
    borderRadius: 10, padding: 12,
  },
  etaItem: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6, justifyContent: 'center' },
  etaText: { color: '#d1d5db', fontSize: 13, fontWeight: '600' },
  etaDivider: {
    width: StyleSheet.hairlineWidth, height: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  badgesRow: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 8,
    marginBottom: 12,
  },
  badge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: 50, borderWidth: 1,
  },
  badgeText: { fontSize: 11, fontWeight: '700' },
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
  confirmBtn: { width: '100%' },
  changeBtn:  { width: '100%' },
});
