import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { Check, Car, MapPin, User } from 'lucide-react-native';
import { AppCard } from '../components/AppCard';
import { AppButton } from '../components/AppButton';
import { AppScreen } from '../components/AppScreen';
import { useHaptics } from '../hooks/useHaptics';
import { useStaggerAnimation } from '../hooks/useStaggerAnimation';

const GOLD      = '#D4AF37';
const GOLD_FAINT = 'rgba(212,175,55,0.08)';

const TIMELINE = [
  { status: 'Assigned', time: '2:15 PM', done: true  },
  { status: 'Arriving', time: '2:18 PM', done: true  },
  { status: 'Onboard',  time: '2:20 PM', done: true  },
  { status: 'En Route', time: 'Now',     done: false, active: true },
  { status: 'Completed',time: 'Pending', done: false },
];

export const ActiveRideScreen = ({ navigation, route }: any) => {
  const { driver, paymentType, estimatedFare } = route.params || {};
  const { light } = useHaptics();
  const delays = useStaggerAnimation();

  const driverName = driver?.name || 'Michael T.';
  const driverCar  = driver
    ? `${driver.vehicle?.brand || ''} ${driver.vehicle?.model || ''}`.trim()
    : 'Mercedes-Benz S-Class';
  const driverPlate = driver?.vehicle?.plate || 'LUX 2024';

  return (
    <AppScreen noTopPad>
      {/* ── Live status pill ── */}
      <MotiView
        from={{ opacity: 0, translateY: -12 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 220, delay: delays.header }}
        style={styles.livePillWrap}
      >
        <View style={styles.livePill}>
          <MotiView
            from={{ opacity: 0.3 }}
            animate={{ opacity: 1 }}
            transition={{ type: 'timing', duration: 800, loop: true }}
            style={styles.liveDot}
          />
          <Text style={styles.livePillText}>RIDE IN PROGRESS</Text>
        </View>
      </MotiView>

      {/* ── Driver summary card ── */}
      <MotiView
        from={{ opacity: 0, translateY: 16 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 260, delay: delays.content }}
      >
        <AppCard variant="gold" style={styles.driverCard}>
          <View style={styles.driverRow}>
            <View style={styles.driverAvatar}>
              <User color={GOLD} size={28} />
            </View>
            <View style={styles.driverInfo}>
              <Text style={styles.driverName}>{driverName}</Text>
              <Text style={styles.driverCar}>{driverCar}</Text>
            </View>
            <View style={styles.plateBadge}>
              <Text style={styles.plateText}>{driverPlate}</Text>
            </View>
          </View>

          <View style={styles.locationRow}>
            <MapPin color={GOLD} size={14} />
            <Text style={styles.locationText}>En route to destination</Text>
          </View>
        </AppCard>
      </MotiView>

      {/* ── Timeline ── */}
      <MotiView
        from={{ opacity: 0, translateY: 16 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 260, delay: delays.content + 40 }}
      >
        <AppCard style={styles.timelineCard}>
          <Text style={styles.sectionLabel}>Ride Timeline</Text>

          <View style={styles.timeline}>
            {TIMELINE.map(({ status, time, done, active }, i) => (
              <MotiView
                key={status}
                from={{ opacity: 0, translateX: -16 }}
                animate={{ opacity: 1, translateX: 0 }}
                transition={{ type: 'timing', duration: 220, delay: delays.item(i) }}
              >
                <View style={styles.timelineRow}>
                  {/* Connector line */}
                  {i < TIMELINE.length - 1 && (
                    <View style={[styles.connector, done && styles.connectorDone]} />
                  )}

                  {/* Dot */}
                  <View style={[
                    styles.dot,
                    done   && styles.dotDone,
                    active && styles.dotActive,
                  ]}>
                    {done ? (
                      <Check color="#000" size={14} strokeWidth={3} />
                    ) : active ? (
                      <MotiView
                        from={{ scale: 0.6 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'timing', duration: 700, loop: true }}
                        style={styles.activePulse}
                      />
                    ) : null}
                  </View>

                  {/* Label */}
                  <View style={styles.timelineInfo}>
                    <Text style={[
                      styles.timelineStatus,
                      done   && styles.timelineStatusDone,
                      active && styles.timelineStatusActive,
                    ]}>
                      {status}
                    </Text>
                    <Text style={[styles.timelineTime, active && styles.timelineTimeActive]}>
                      {time}
                    </Text>
                  </View>
                </View>
              </MotiView>
            ))}
          </View>
        </AppCard>
      </MotiView>

      {/* ── CTA ── */}
      <MotiView
        from={{ opacity: 0, translateY: 10 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 220, delay: delays.cta }}
        style={styles.ctaWrap}
      >
        <AppButton
          label="Complete Ride"
          onPress={() => navigation.navigate('RideCompletion', { driver, paymentType, estimatedFare })}
          haptic="success"
          style={styles.ctaBtn}
        />
      </MotiView>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  livePillWrap: { alignItems: 'flex-start', marginBottom: 16 },
  livePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: 'rgba(34,197,94,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(34,197,94,0.3)',
    borderRadius: 50,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  liveDot: {
    width: 7, height: 7, borderRadius: 4,
    backgroundColor: '#22c55e',
  },
  livePillText: {
    color: '#22c55e',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  driverCard: { padding: 16, marginBottom: 12 },
  driverRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  driverAvatar: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: GOLD_FAINT,
    borderWidth: 1, borderColor: 'rgba(212,175,55,0.3)',
    alignItems: 'center', justifyContent: 'center',
  },
  driverInfo: { flex: 1 },
  driverName: { color: '#fff', fontWeight: '700', fontSize: 16, marginBottom: 2 },
  driverCar:  { color: '#9ca3af', fontSize: 13, fontWeight: '500' },
  plateBadge: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6,
  },
  plateText: { color: '#d1d5db', fontSize: 12, fontWeight: '700', letterSpacing: 1 },
  locationRow: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.06)',
  },
  locationText: { color: '#9ca3af', fontSize: 13, fontWeight: '500' },
  timelineCard: { padding: 20, marginBottom: 12 },
  sectionLabel: {
    fontSize: 11, color: '#6b7280', fontWeight: '600',
    letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 20,
  },
  timeline: {},
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 0,
    paddingBottom: 24,
    position: 'relative',
  },
  connector: {
    position: 'absolute',
    left: 19,
    top: 40,
    width: 2,
    height: 24,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  connectorDone: { backgroundColor: GOLD },
  dot: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center', justifyContent: 'center',
    zIndex: 1,
  },
  dotDone: {
    backgroundColor: GOLD,
    borderColor: GOLD,
    shadowColor: GOLD,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
  dotActive: {
    borderColor: GOLD,
    borderWidth: 2,
    backgroundColor: 'rgba(212,175,55,0.1)',
  },
  activePulse: {
    width: 10, height: 10, borderRadius: 5,
    backgroundColor: GOLD,
  },
  timelineInfo: { marginLeft: 14, paddingTop: 8 },
  timelineStatus: { color: '#6b7280', fontWeight: '600', fontSize: 14 },
  timelineStatusDone:   { color: '#9ca3af' },
  timelineStatusActive: { color: '#fff', fontWeight: '700' },
  timelineTime: { color: '#4b5563', fontSize: 12, fontWeight: '500', marginTop: 2 },
  timelineTimeActive: { color: GOLD, fontWeight: '600' },
  ctaWrap: { marginTop: 4 },
  ctaBtn: { width: '100%' },
});
