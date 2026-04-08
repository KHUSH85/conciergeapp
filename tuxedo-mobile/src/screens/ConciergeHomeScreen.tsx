import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { Car, Wallet, TrendingUp, History, User, Calendar } from 'lucide-react-native';
import { GlassCard, GoldButton } from '../components/GlassCard';
import { ScreenShell } from '../components/ScreenShell';
import { useApp } from '../context/AppContext';

const GOLD = '#D4AF37';

export const ConciergeHomeScreen = ({ navigation }: any) => {
  const { user } = useApp();

  const stats = [
    { icon: Wallet, label: "Today's Earnings", value: '$142.50' },
    { icon: Car, label: 'Rides Today', value: '12' },
    { icon: TrendingUp, label: 'Weekly Growth', value: '+15%' },
    { icon: History, label: 'Recent Payout', value: '$856' },
  ];

  return (
    <ScreenShell>
      {/* Header */}
      <MotiView from={{ opacity: 0, translateY: -20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', duration: 500 }} style={styles.header}>
        <View>
          <Text style={styles.userName}>{user?.name || 'Concierge'}</Text>
          <Text style={styles.hotelName}>{user?.hotelName || 'Luxury Concierge'}</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={styles.profileBtn}>
          <User color={GOLD} size={22} />
        </TouchableOpacity>
      </MotiView>

      {/* Primary CTA */}
      <MotiView from={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'timing', duration: 500, delay: 100 }}>
        <GlassCard style={styles.ctaCard}>
          <MotiView
            from={{ translateY: 0 }}
            animate={{ translateY: -8 }}
            transition={{ type: 'timing', duration: 2000, loop: true }}
          >
            <Car color={GOLD} size={64} style={styles.ctaIcon} />
          </MotiView>
          <Text style={styles.ctaTitle}>Request Guest Transport</Text>
          <GoldButton
            onPress={() => navigation.navigate('GuestDetails', { bookingMode: 'instant', pickupLocation: user?.hotelName || 'The Grand Majestic Hotel' })}
            style={styles.ctaBtn}
          >
            <View style={styles.btnInner}>
              <Car color="#000" size={18} />
              <Text style={styles.ctaBtnText}>Call a Car</Text>
            </View>
          </GoldButton>
          <GoldButton
            onPress={() => navigation.navigate('ScheduleBooking')}
            variant="secondary"
            style={[styles.ctaBtn, { marginTop: 10 }]}
          >
            <View style={styles.btnInner}>
              <Calendar color={GOLD} size={18} />
              <View>
                <Text style={[styles.ctaBtnText, { color: GOLD }]}>Reserve a Ride</Text>
                <Text style={styles.scheduleSubtext}>Schedule Reservation</Text>
              </View>
            </View>
          </GoldButton>
          <Text style={styles.trackingNote}>Tracking link will be sent automatically to the guest</Text>
        </GlassCard>
      </MotiView>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        {stats.map(({ icon: Icon, label, value }, i) => (
          <MotiView key={label} from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', duration: 500, delay: 300 + i * 50 }} style={styles.statWrap}>
            <GlassCard style={styles.statCard}>
              <Icon color={GOLD} size={28} />
              <Text style={styles.statLabel}>{label}</Text>
              <Text style={styles.statValue}>{value}</Text>
            </GlassCard>
          </MotiView>
        ))}
      </View>

      {/* Secondary Actions */}
      <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', duration: 500, delay: 500 }}>
        <GoldButton onPress={() => navigation.navigate('RideHistory')} variant="ghost" style={styles.ghostBtn}>
          <View style={styles.btnInner}>
            <History color={GOLD} size={22} />
            <Text style={styles.ghostBtnText}>Ride History</Text>
          </View>
        </GoldButton>
        <GoldButton onPress={() => navigation.navigate('CommissionWallet')} variant="ghost" style={[styles.ghostBtn, { marginTop: 10 }]}>
          <View style={styles.btnInner}>
            <Wallet color={GOLD} size={22} />
            <Text style={styles.ghostBtnText}>Commission Wallet</Text>
          </View>
        </GoldButton>
        <GoldButton onPress={() => navigation.navigate('TrackRide')} variant="ghost" style={[styles.ghostBtn, { marginTop: 10, borderColor: 'rgba(212,175,55,0.4)' }]}>
          <View style={styles.btnInner}>
            <Car color={GOLD} size={22} />
            <Text style={styles.ghostBtnText}>Passenger Track Ride</Text>
          </View>
        </GoldButton>
      </MotiView>
    </ScreenShell>
  );
};

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  userName: { fontSize: 22, color: '#fff', fontWeight: '900' },
  hotelName: { fontSize: 14, color: '#9ca3af', fontWeight: '500', marginTop: 2 },
  profileBtn: { padding: 12, borderRadius: 50, backgroundColor: 'rgba(0,0,0,0.6)', borderWidth: 2, borderColor: 'rgba(212,175,55,0.3)' },
  ctaCard: { padding: 28, alignItems: 'center', marginBottom: 20, borderColor: 'rgba(212,175,55,0.4)' },
  ctaIcon: { marginBottom: 16 },
  ctaTitle: { fontSize: 20, color: '#fff', fontWeight: '900', marginBottom: 20, textAlign: 'center' },
  ctaBtn: { width: '100%', paddingVertical: 16 },
  btnInner: { flexDirection: 'row', alignItems: 'center', gap: 10, justifyContent: 'center' },
  ctaBtnText: { color: '#000', fontWeight: '900', fontSize: 16 },
  scheduleSubtext: { color: '#6b7280', fontSize: 9, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 1 },
  trackingNote: { color: '#6b7280', fontSize: 12, fontStyle: 'italic', marginTop: 14, textAlign: 'center' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 20, justifyContent: 'space-between' },
  statWrap: { flexGrow: 1, flexBasis: '47%', minWidth: 148, maxWidth: '48%' },
  statCard: { padding: 16 },
  statLabel: { color: '#9ca3af', fontSize: 12, fontWeight: '500', marginTop: 10, marginBottom: 4 },
  statValue: { color: '#fff', fontSize: 20, fontWeight: '900' },
  ghostBtn: { width: '100%', paddingVertical: 16, borderColor: 'rgba(212,175,55,0.2)' },
  ghostBtnText: { color: GOLD, fontWeight: '700', fontSize: 16 },
});
