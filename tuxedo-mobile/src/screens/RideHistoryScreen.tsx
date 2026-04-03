import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { ArrowLeft, Star } from 'lucide-react-native';
import { GlassCard } from '../components/GlassCard';
import { ScreenShell } from '../components/ScreenShell';

const GOLD = '#D4AF37';

const MOCK_RIDES = [
  { id: '#1042', date: 'Today, 3:15 PM', driver: 'Michael T.', fare: '$45.00', status: 'Completed', rating: 5 },
  { id: '#1041', date: 'Today, 1:30 PM', driver: 'Sarah M.', fare: '$54.00', status: 'Completed', rating: 4 },
  { id: '#1040', date: 'Yesterday', driver: 'James A.', fare: '$45.00', status: 'Completed', rating: 5 },
  { id: '#1039', date: 'Dec 18, 2025', driver: 'David C.', fare: '$45.00', status: 'Completed', rating: 4 },
  { id: '#1038', date: 'Dec 17, 2025', driver: 'Emily R.', fare: '$54.00', status: 'Completed', rating: 5 },
];

export const RideHistoryScreen = ({ navigation }: any) => (
  <ScreenShell>
    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
      <ArrowLeft color={GOLD} size={18} />
      <Text style={styles.backText}>Back</Text>
    </TouchableOpacity>

    <GlassCard style={styles.card}>
      <Text style={styles.title}>Ride History</Text>

      {MOCK_RIDES.map((ride, i) => (
        <MotiView key={ride.id} from={{ opacity: 0, translateX: -20 }} animate={{ opacity: 1, translateX: 0 }} transition={{ type: 'timing', duration: 300, delay: 100 + i * 60 }}>
          <View style={styles.rideCard}>
            <View style={styles.rideHeader}>
              <Text style={styles.rideId}>Ride {ride.id}</Text>
              <Text style={styles.rideFare}>{ride.fare}</Text>
            </View>
            <View style={styles.rideDetails}>
              <Text style={styles.rideDate}>{ride.date}</Text>
              <Text style={styles.rideDriver}>{ride.driver}</Text>
            </View>
            <View style={styles.rideFooter}>
              <View style={styles.starsRow}>
                {[1,2,3,4,5].map(s => (
                  <Star key={s} color={GOLD} size={12} fill={s <= ride.rating ? GOLD : 'transparent'} />
                ))}
              </View>
              <Text style={styles.rideStatus}>{ride.status}</Text>
            </View>
          </View>
        </MotiView>
      ))}
    </GlassCard>
  </ScreenShell>
);

const styles = StyleSheet.create({
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 16 },
  backText: { color: GOLD, fontWeight: '700', fontSize: 14 },
  card: { padding: 24 },
  title: { fontSize: 22, color: '#fff', fontWeight: '900', marginBottom: 20 },
  rideCard: { backgroundColor: 'rgba(0,0,0,0.6)', borderWidth: 2, borderColor: 'rgba(212,175,55,0.2)', borderRadius: 14, padding: 16, marginBottom: 10 },
  rideHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  rideId: { color: '#fff', fontWeight: '700', fontSize: 15 },
  rideFare: { color: GOLD, fontWeight: '900', fontSize: 15 },
  rideDetails: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  rideDate: { color: '#9ca3af', fontSize: 12, fontWeight: '500' },
  rideDriver: { color: '#9ca3af', fontSize: 12, fontWeight: '500' },
  rideFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  starsRow: { flexDirection: 'row', gap: 2 },
  rideStatus: { color: '#22c55e', fontWeight: '700', fontSize: 12 },
});
