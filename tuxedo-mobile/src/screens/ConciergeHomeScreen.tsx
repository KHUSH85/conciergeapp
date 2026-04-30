import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { MotiView } from 'moti';
import {
  Car, Wallet, TrendingUp, History,
  User, Calendar, ChevronRight, Zap,
} from 'lucide-react-native';
import { AppCard } from '../components/AppCard';
import { AppButton } from '../components/AppButton';
import { AppScreen } from '../components/AppScreen';
import { useHaptics } from '../hooks/useHaptics';
import { useStaggerAnimation } from '../hooks/useStaggerAnimation';
import { useApp } from '../context/AppContext';

const GOLD       = '#D4AF37';
const GOLD_FAINT = 'rgba(212,175,55,0.08)';
const GOLD_DIM   = 'rgba(212,175,55,0.25)';
const GREEN      = '#22c55e';

export const ConciergeHomeScreen = ({ navigation }: any) => {
  const { user } = useApp();
  const { light } = useHaptics();
  const delays = useStaggerAnimation();

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  })();

  const stats = [
    { icon: Wallet,     label: "Today's Earnings", value: '$142.50', sub: '+$18 vs yesterday' },
    { icon: Car,        label: 'Rides Today',       value: '12',      sub: '3 active now'      },
    { icon: TrendingUp, label: 'Weekly Growth',     value: '+15%',    sub: 'vs last week'      },
    { icon: History,    label: 'Recent Payout',     value: '$856',    sub: 'Dec 18'            },
  ];

  const quickLinks = [
    {
      icon: History,
      label: 'Ride History',
      sub: '5 rides this week',
      onPress: () => navigation.navigate('Rides' as any, { screen: 'RideHistory' }),
    },
    {
      icon: Wallet,
      label: 'Commission Wallet',
      sub: '$142.50 today',
      onPress: () => navigation.navigate('Wallet' as any, { screen: 'CommissionWallet' }),
    },
    {
      icon: Car,
      label: 'Track Passenger Ride',
      sub: 'Share live link',
      onPress: () => Linking.openURL('https://conciergeapptuxedo.vercel.app/track-ride?token=MB1HCPUS&pickup=The+Grand+Majestic+Hotel'),
    },
  ];

  return (
    <AppScreen>
      {/* ── Header ── */}
      <MotiView
        from={{ opacity: 0, translateY: -16 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 240, delay: delays.header }}
        style={styles.header}
      >
        <View style={styles.headerLeft}>
          <Text style={styles.greeting}>{greeting}</Text>
          <Text style={styles.userName}>{user?.name || 'Concierge'}</Text>
          <Text style={styles.hotelName}>{user?.hotelName || 'Luxury Concierge'}</Text>
        </View>
        <TouchableOpacity
          onPress={async () => {
            await light();
            navigation.navigate('ProfileTab' as any, { screen: 'Profile' });
          }}
          style={styles.profileBtn}
          accessibilityLabel="Profile"
          accessibilityRole="button"
        >
          <User color={GOLD} size={20} />
        </TouchableOpacity>
      </MotiView>

      {/* ── Membership credit pill (if member) ── */}
      {user?.isMember && (
        <MotiView
          from={{ opacity: 0, translateY: -8 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 220, delay: delays.header + 40 }}
          style={styles.creditPill}
        >
          <Zap color={GREEN} size={13} fill={GREEN} />
          <Text style={styles.creditPillText}>
            ${(user.rideCredit || 0).toFixed(2)} ride credit available
          </Text>
        </MotiView>
      )}

      {/* ── Primary Actions ── */}
      <MotiView
        from={{ opacity: 0, translateY: 16 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 260, delay: delays.content }}
      >
        <AppCard variant="gold" style={styles.heroCard}>
          <View style={styles.heroTop}>
            <MotiView
              from={{ translateY: 0 }}
              animate={{ translateY: -6 }}
              transition={{ type: 'timing', duration: 2200, loop: true }}
            >
              <Car color={GOLD} size={48} />
            </MotiView>
            <View style={styles.heroText}>
              <Text style={styles.heroTitle}>Guest Transport</Text>
              <Text style={styles.heroSub}>Dispatch a premium chauffeur</Text>
            </View>
          </View>

          <AppButton
            label="Call a Car  →"
            onPress={() =>
              navigation.navigate('GuestDetails', {
                bookingMode: 'instant',
                pickupLocation: user?.hotelName || 'The Grand Majestic Hotel',
              })
            }
            style={styles.primaryBtn}
          />

          <AppButton
            label="Reserve a Ride"
            onPress={() => navigation.navigate('ScheduleBooking')}
            variant="secondary"
            style={styles.secondaryBtn}
          />

          <View style={styles.trackingNote}>
            <Text style={styles.trackingNoteText}>
              Tracking link sent automatically to guest
            </Text>
          </View>
        </AppCard>
      </MotiView>

      {/* ── Stats Grid ── */}
      <View style={styles.statsGrid}>
        {stats.map(({ icon: Icon, label, value, sub }, i) => (
          <MotiView
            key={label}
            from={{ opacity: 0, translateY: 16 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 240, delay: delays.item(i) }}
            style={styles.statWrap}
          >
            <AppCard style={styles.statCard}>
              <View style={styles.statIconWrap}>
                <Icon color={GOLD} size={18} />
              </View>
              <Text style={styles.statValue}>{value}</Text>
              <Text style={styles.statLabel}>{label}</Text>
              <Text style={styles.statSub}>{sub}</Text>
            </AppCard>
          </MotiView>
        ))}
      </View>

      {/* ── Quick Links ── */}
      <MotiView
        from={{ opacity: 0, translateY: 16 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 240, delay: delays.cta }}
      >
        <Text style={styles.sectionLabel}>Quick Access</Text>
        <AppCard style={styles.quickLinksCard}>
          {quickLinks.map(({ icon: Icon, label, sub, onPress }, i) => (
            <React.Fragment key={label}>
              <TouchableOpacity
                onPress={async () => { await light(); onPress(); }}
                style={styles.quickLinkRow}
                accessibilityRole="button"
                activeOpacity={0.7}
              >
                <View style={styles.quickLinkIcon}>
                  <Icon color={GOLD} size={18} />
                </View>
                <View style={styles.quickLinkText}>
                  <Text style={styles.quickLinkLabel}>{label}</Text>
                  <Text style={styles.quickLinkSub}>{sub}</Text>
                </View>
                <ChevronRight color="#4b5563" size={16} />
              </TouchableOpacity>
              {i < quickLinks.length - 1 && <View style={styles.divider} />}
            </React.Fragment>
          ))}
        </AppCard>
      </MotiView>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  headerLeft: { flex: 1 },
  greeting: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  userName:  { fontSize: 24, color: '#fff', fontWeight: '800', letterSpacing: -0.3 },
  hotelName: { fontSize: 13, color: '#6b7280', fontWeight: '500', marginTop: 2 },
  profileBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: GOLD_FAINT,
    borderWidth: 1, borderColor: GOLD_DIM,
    alignItems: 'center', justifyContent: 'center',
    marginTop: 4,
  },
  creditPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(34,197,94,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(34,197,94,0.3)',
    borderRadius: 50,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 16,
  },
  creditPillText: { color: '#22c55e', fontSize: 12, fontWeight: '700' },
  heroCard: {
    padding: 20,
    marginBottom: 16,
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 20,
  },
  heroText: { flex: 1 },
  heroTitle: { fontSize: 18, color: '#fff', fontWeight: '800', marginBottom: 3 },
  heroSub:   { fontSize: 13, color: '#9ca3af', fontWeight: '500' },
  primaryBtn:   { width: '100%', marginBottom: 10 },
  secondaryBtn: { width: '100%' },
  trackingNote: {
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
  },
  trackingNoteText: { color: '#4b5563', fontSize: 11, fontWeight: '500' },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  statWrap: { flexGrow: 1, flexBasis: '47%' },
  statCard: { padding: 14 },
  statIconWrap: {
    width: 32, height: 32, borderRadius: 8,
    backgroundColor: GOLD_FAINT,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 10,
  },
  statValue: { fontSize: 22, color: '#fff', fontWeight: '800', marginBottom: 2 },
  statLabel: { fontSize: 11, color: '#9ca3af', fontWeight: '500', marginBottom: 2 },
  statSub:   { fontSize: 10, color: '#4b5563', fontWeight: '500' },
  sectionLabel: {
    fontSize: 11,
    color: '#6b7280',
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  quickLinksCard: { marginBottom: 8 },
  quickLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    minHeight: 56,
  },
  quickLinkIcon: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: GOLD_FAINT,
    alignItems: 'center', justifyContent: 'center',
  },
  quickLinkText: { flex: 1 },
  quickLinkLabel: { color: '#fff', fontSize: 14, fontWeight: '600' },
  quickLinkSub:   { color: '#6b7280', fontSize: 12, fontWeight: '500', marginTop: 1 },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255,255,255,0.06)',
    marginLeft: 66,
  },
});
