import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { Star, Car, Clock } from 'lucide-react-native';
import { AppCard } from '../components/AppCard';
import { AppScreen } from '../components/AppScreen';
import { useStaggerAnimation } from '../hooks/useStaggerAnimation';

const GOLD = '#D4AF37';

const MOCK_RIDES = [
  { id: '#1042', date: 'Today, 3:15 PM',  driver: 'Michael T.', fare: '$45.00', status: 'Completed', rating: 5 },
  { id: '#1041', date: 'Today, 1:30 PM',  driver: 'Sarah M.',   fare: '$54.00', status: 'Completed', rating: 4 },
  { id: '#1040', date: 'Yesterday',        driver: 'James A.',   fare: '$45.00', status: 'Completed', rating: 5 },
  { id: '#1039', date: 'Dec 18, 2025',    driver: 'David C.',   fare: '$45.00', status: 'Completed', rating: 4 },
  { id: '#1038', date: 'Dec 17, 2025',    driver: 'Emily R.',   fare: '$54.00', status: 'Completed', rating: 5 },
];

function StarRow({ rating }: { rating: number }) {
  return (
    <View style={styles.starsRow}>
      {[1, 2, 3, 4, 5].map(s => (
        <Star
          key={s}
          color={GOLD}
          size={11}
          fill={s <= rating ? GOLD : 'transparent'}
        />
      ))}
    </View>
  );
}

export const RideHistoryScreen = () => {
  const delays = useStaggerAnimation();

  return (
    <AppScreen>
      {/* ── Summary strip ── */}
      <MotiView
        from={{ opacity: 0, translateY: 12 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 240, delay: delays.header }}
      >
        <AppCard variant="gold" style={styles.summaryCard}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{MOCK_RIDES.length}</Text>
            <Text style={styles.summaryLabel}>Total Rides</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>4.8</Text>
            <Text style={styles.summaryLabel}>Avg Rating</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>$243</Text>
            <Text style={styles.summaryLabel}>This Week</Text>
          </View>
        </AppCard>
      </MotiView>

      {/* ── Ride list ── */}
      <Text style={styles.sectionLabel}>Recent Rides</Text>

      {MOCK_RIDES.length === 0 ? (
        <MotiView
          from={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'timing', duration: 240 }}
        >
          <AppCard style={styles.emptyCard}>
            <Car color="#374151" size={40} />
            <Text style={styles.emptyTitle}>No rides yet</Text>
            <Text style={styles.emptySub}>Your completed rides will appear here.</Text>
          </AppCard>
        </MotiView>
      ) : (
        MOCK_RIDES.map((ride, i) => (
          <MotiView
            key={ride.id}
            from={{ opacity: 0, translateY: 12 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 220, delay: delays.item(i) }}
            style={styles.rideWrap}
          >
            <AppCard style={styles.rideCard}>
              {/* Top row */}
              <View style={styles.rideTop}>
                <View style={styles.rideIconWrap}>
                  <Car color={GOLD} size={18} />
                </View>
                <View style={styles.rideMain}>
                  <Text style={styles.rideId}>Ride {ride.id}</Text>
                  <Text style={styles.rideDriver}>{ride.driver}</Text>
                </View>
                <Text style={styles.rideFare}>{ride.fare}</Text>
              </View>

              {/* Bottom row */}
              <View style={styles.rideBottom}>
                <View style={styles.rideDateRow}>
                  <Clock color="#4b5563" size={11} />
                  <Text style={styles.rideDate}>{ride.date}</Text>
                </View>
                <View style={styles.rideRightBottom}>
                  <StarRow rating={ride.rating} />
                  <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>{ride.status}</Text>
                  </View>
                </View>
              </View>
            </AppCard>
          </MotiView>
        ))
      )}
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  summaryCard: {
    flexDirection: 'row',
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  summaryItem: { flex: 1, alignItems: 'center' },
  summaryValue: { fontSize: 22, color: '#fff', fontWeight: '800', marginBottom: 3 },
  summaryLabel: { fontSize: 11, color: '#6b7280', fontWeight: '500' },
  summaryDivider: {
    width: StyleSheet.hairlineWidth,
    height: 36,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  sectionLabel: {
    fontSize: 11, color: '#6b7280', fontWeight: '600',
    letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 10,
  },
  emptyCard: {
    padding: 40, alignItems: 'center', gap: 10,
  },
  emptyTitle: { color: '#6b7280', fontSize: 16, fontWeight: '600', marginTop: 4 },
  emptySub:   { color: '#4b5563', fontSize: 13, fontWeight: '500', textAlign: 'center' },
  rideWrap: { marginBottom: 10 },
  rideCard: { padding: 14 },
  rideTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  rideIconWrap: {
    width: 38, height: 38, borderRadius: 10,
    backgroundColor: 'rgba(212,175,55,0.08)',
    alignItems: 'center', justifyContent: 'center',
  },
  rideMain: { flex: 1 },
  rideId:     { color: '#fff', fontWeight: '700', fontSize: 14 },
  rideDriver: { color: '#9ca3af', fontSize: 12, fontWeight: '500', marginTop: 1 },
  rideFare:   { color: GOLD, fontWeight: '800', fontSize: 16 },
  rideBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.06)',
  },
  rideDateRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  rideDate:    { color: '#4b5563', fontSize: 11, fontWeight: '500' },
  rideRightBottom: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  starsRow: { flexDirection: 'row', gap: 2 },
  statusBadge: {
    backgroundColor: 'rgba(34,197,94,0.1)',
    borderWidth: 1, borderColor: 'rgba(34,197,94,0.25)',
    borderRadius: 50, paddingHorizontal: 8, paddingVertical: 3,
  },
  statusText: { color: '#22c55e', fontSize: 10, fontWeight: '700' },
});
