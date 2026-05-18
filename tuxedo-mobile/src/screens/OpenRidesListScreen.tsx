import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { MotiView } from 'moti';
import { MapPin, Clock, Navigation, ChevronRight, Car } from 'lucide-react-native';
import { AppCard } from '../components/AppCard';
import { AppScreen } from '../components/AppScreen';
import { SectionHeader } from '../components/SectionHeader';
import { useHaptics } from '../hooks/useHaptics';
import { useApp } from '../context/AppContext';
import type { OpenRideRequest } from '../types';

const GOLD = '#D4AF37';

function statusLabel(s: OpenRideRequest['status']) {
  switch (s) {
    case 'awaiting_guest':
      return 'Awaiting guest';
    case 'matching':
      return 'Matching chauffeurs';
    case 'assigned':
      return 'Chauffeur assigned';
    case 'in_progress':
      return 'In progress';
    default:
      return s;
  }
}

const MOCK_DRIVER = {
  name: 'Michael T.',
  rating: 4.9,
  eta: 3,
  vehicle: { brand: 'Mercedes-Benz', model: 'S-Class', plate: 'LUX 2024' },
};

export const OpenRidesListScreen = ({ navigation }: any) => {
  const { openRideRequests } = useApp();
  const { light } = useHaptics();

  return (
    <AppScreen brandHeader>
      <SectionHeader
        title="Active rides"
        subtitle="Open requests you sent — track status and map per guest."
      />

      <TouchableOpacity
        onPress={async () => {
          await light();
          navigation.navigate('RideHistory');
        }}
        style={styles.historyLink}
        accessibilityRole="button"
      >
        <Text style={styles.historyLinkText}>Completed rides</Text>
        <ChevronRight color="#6b7280" size={16} />
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
        {openRideRequests.length === 0 ? (
          <AppCard style={styles.emptyCard}>
            <View style={styles.emptyIconWrap}>
              <Car color={GOLD} size={36} />
            </View>
            <Text style={styles.emptyTitle}>No active rides</Text>
            <Text style={styles.emptySub}>
              When you send a ride request from Call a car or Reserve a ride, it appears here so you can manage many guests at once.
            </Text>
          </AppCard>
        ) : (
          openRideRequests.map((r, i) => (
            <MotiView
              key={r.id}
              from={{ opacity: 0, translateY: 12 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', duration: 220, delay: i * 40 }}
            >
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={async () => {
                  await light();
                  navigation.navigate('ActiveRide', {
                    driver: MOCK_DRIVER,
                    paymentType: 'card',
                    estimatedFare: 45,
                    openRideId: r.id,
                  });
                }}
                style={styles.rowWrap}
              >
                <AppCard variant="gold" style={styles.rideCard}>
                  <View style={styles.rowTop}>
                    <View style={styles.pill}>
                      <Text style={styles.pillText}>{statusLabel(r.status)}</Text>
                    </View>
                    <Text style={styles.typePill}>
                      {r.serviceType === 'transfer' ? 'Transfer' : 'Hourly'}
                    </Text>
                  </View>
                  <Text style={styles.guest}>{r.guestLabel}</Text>
                  <View style={styles.locRow}>
                    <MapPin color={GOLD} size={14} />
                    <Text style={styles.loc} numberOfLines={2}>
                      {r.pickup}
                    </Text>
                  </View>
                  {r.scheduledFor ? (
                    <View style={styles.locRow}>
                      <Clock color="#6b7280" size={14} />
                      <Text style={styles.sched}>{r.scheduledFor}</Text>
                    </View>
                  ) : null}
                  <View style={styles.mapHint}>
                    <Navigation color={GOLD} size={14} />
                    <Text style={styles.mapHintText}>Tap for live status & map</Text>
                    <ChevronRight color="#6b7280" size={16} />
                  </View>
                </AppCard>
              </TouchableOpacity>
            </MotiView>
          ))
        )}
      </ScrollView>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  historyLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
    marginBottom: 16,
    minHeight: 44,
  },
  historyLinkText: { color: GOLD, fontSize: 14, fontWeight: '700' },
  list: { paddingBottom: 32, gap: 12 },
  emptyCard: { padding: 24, alignItems: 'center' },
  emptyIconWrap: { marginBottom: 12 },
  emptyTitle: { color: '#fff', fontSize: 17, fontWeight: '700', marginBottom: 8 },
  emptySub: { color: '#6b7280', fontSize: 13, textAlign: 'center', lineHeight: 20 },
  rowWrap: { marginBottom: 4 },
  rideCard: { padding: 16 },
  rowTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  pill: {
    backgroundColor: 'rgba(212,175,55,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.25)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  pillText: { color: GOLD, fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  typePill: { color: '#9ca3af', fontSize: 11, fontWeight: '700', textTransform: 'uppercase' },
  guest: { color: '#fff', fontSize: 16, fontWeight: '800', marginBottom: 8 },
  locRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 6 },
  loc: { flex: 1, color: '#d1d5db', fontSize: 13, fontWeight: '500', lineHeight: 18 },
  sched: { flex: 1, color: '#9ca3af', fontSize: 12, fontWeight: '600' },
  mapHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.08)',
  },
  mapHintText: { flex: 1, color: '#6b7280', fontSize: 12, fontWeight: '600' },
});
