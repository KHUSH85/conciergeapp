import React from 'react';
import { View, Text, Pressable, StyleSheet, Linking } from 'react-native';
import { MotiView } from 'moti';
import {
  Car, Wallet, TrendingUp, History,
  ChevronRight, Zap, MessageCircle,
} from 'lucide-react-native';
import { AppCard } from '../components/AppCard';
import { AppButton } from '../components/AppButton';
import { AppScreen } from '../components/AppScreen';
import { useHaptics } from '../hooks/useHaptics';
import { useStaggerAnimation } from '../hooks/useStaggerAnimation';
import { useApp } from '../context/AppContext';
import { PASSENGER_WEB_BASE_URL } from '../config/passengerWeb';

const GOLD        = '#D4AF37';
const GOLD_FAINT  = 'rgba(212,175,55,0.08)';
const GOLD_DIM    = 'rgba(212,175,55,0.22)';
const GREEN       = '#22c55e';
const SURFACE     = 'rgba(255,255,255,0.04)';
const BORDER      = 'rgba(255,255,255,0.08)';

/** Mobile type scale — keeps long names (e.g. James Anderson) readable without dominating */
const TYPE = {
  caption: 10,
  small: 11,
  body: 13,
  title: 16,
  name: 18,
  metric: 17,
} as const;

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
      icon: Car,
      label: 'Active rides',
      sub: 'Open requests & maps',
      onPress: () => navigation.navigate('Rides' as any),
    },
    {
      icon: History,
      label: 'Completed rides',
      sub: 'Past trips & payouts',
      onPress: () => navigation.navigate('Rides' as any, { screen: 'RideHistory' }),
    },
    {
      icon: Wallet,
      label: 'Commission Wallet',
      sub: '$142.50 today',
      onPress: () => navigation.navigate('Wallet' as any, { screen: 'CommissionWallet' }),
    },
    {
      icon: MessageCircle,
      label: 'SMS Preview Lab',
      sub: 'App + membership SMS demo',
      onPress: () => navigation.navigate('SmsPreviewLab'),
    },
    {
      icon: Car,
      label: 'Track Passenger Ride',
      sub: 'Share live link',
      onPress: () => Linking.openURL(`${PASSENGER_WEB_BASE_URL}/track-ride?token=MB1HCPUS&pickup=The+Grand+Majestic+Hotel`),
    },
  ];

  const pickupLocation = user?.hotelName || 'The Grand Majestic Hotel';

  return (
    <AppScreen brandHeader>
      {/* Greeting */}
      <MotiView
        from={{ opacity: 0, translateY: 8 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 220, delay: delays.header }}
        style={styles.greetingRow}
      >
        <View style={styles.greetingCol}>
          <Text style={styles.greeting}>{greeting}</Text>
          <Text style={styles.userName} numberOfLines={1}>
            {user?.name || 'Concierge'}
          </Text>
        </View>
        <View style={styles.hotelChip}>
          <Text style={styles.hotelName} numberOfLines={2}>
            {user?.hotelName || 'Luxury Concierge'}
          </Text>
        </View>
      </MotiView>

      {user?.isMember && (
        <MotiView
          from={{ opacity: 0, translateY: 6 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 200, delay: delays.header + 30 }}
          style={styles.creditPill}
        >
          <Zap color={GREEN} size={13} fill={GREEN} />
          <Text style={styles.creditPillText}>
            ${(user.rideCredit || 0).toFixed(2)} ride credit available
          </Text>
        </MotiView>
      )}

      {/* Guest Transport */}
      <MotiView
        from={{ opacity: 0, translateY: 12 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 260, delay: delays.content }}
        style={styles.dispatchWrap}
      >
        <AppCard variant="gold" style={styles.dispatchCard}>
          <View style={styles.dispatchHead}>
            <View style={styles.dispatchAccent} />
            <View style={styles.dispatchCopy}>
              <Text style={styles.heroTitle}>Guest Transport</Text>
              <Text style={styles.heroSub}>Dispatch a premium chauffeur</Text>
            </View>
          </View>

          <View style={styles.dispatchDivider} />

          <View style={styles.dispatchActions}>
            <AppButton
              label="Call a Car  →"
              onPress={() =>
                navigation.navigate('GuestDetails', {
                  bookingMode: 'instant',
                  pickupLocation,
                })
              }
              style={styles.dispatchBtn}
            />
            <AppButton
              label="Reserve a Ride"
              variant="secondary"
              onPress={() => navigation.navigate('ScheduleBooking')}
              style={styles.dispatchBtn}
            />
          </View>

          <Text style={styles.trackingNoteText}>
            Tracking link sent automatically to guest
          </Text>
        </AppCard>
      </MotiView>

      {/* Stats */}
      <View style={styles.statsSection}>
        <View style={styles.statsGrid}>
          {stats.map(({ icon: Icon, label, value, sub }, i) => (
            <MotiView
              key={label}
              from={{ opacity: 0, translateY: 12 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', duration: 220, delay: delays.item(i) }}
              style={styles.statWrap}
            >
              <View style={styles.statCard}>
                <View style={styles.statIconWrap}>
                  <Icon color={GOLD} size={16} />
                </View>
                <Text style={styles.statValue}>{value}</Text>
                <Text style={styles.statLabel}>{label}</Text>
                <Text style={styles.statSub} numberOfLines={1}>{sub}</Text>
              </View>
            </MotiView>
          ))}
        </View>
      </View>

      {/* Quick Access */}
      <MotiView
        from={{ opacity: 0, translateY: 12 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 240, delay: delays.cta }}
        style={styles.quickSection}
      >
        <Text style={styles.sectionLabel}>Quick Access</Text>
        <View style={styles.quickLinksCard}>
          {quickLinks.map(({ icon: Icon, label, sub, onPress }, i) => (
            <Pressable
              key={label}
              onPress={async () => {
                await light();
                onPress();
              }}
              style={({ pressed }) => [
                styles.quickLinkRow,
                i < quickLinks.length - 1 && styles.quickLinkRowBorder,
                pressed && styles.quickLinkRowPressed,
              ]}
              accessibilityRole="button"
            >
              <View style={styles.quickLinkIcon}>
                <Icon color={GOLD} size={16} />
              </View>
              <View style={styles.quickLinkText}>
                <Text style={styles.quickLinkLabel}>{label}</Text>
                <Text style={styles.quickLinkSub}>{sub}</Text>
              </View>
              <ChevronRight color="rgba(255,255,255,0.28)" size={18} />
            </Pressable>
          ))}
        </View>
      </MotiView>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 12,
  },
  greetingCol: {
    flex: 1,
    minWidth: 0,
    paddingRight: 4,
  },
  greeting: {
    fontSize: TYPE.small,
    color: 'rgba(255,255,255,0.45)',
    fontWeight: '600',
    letterSpacing: 0.35,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  userName: {
    fontSize: TYPE.name,
    color: '#fff',
    fontWeight: '700',
    letterSpacing: -0.2,
    lineHeight: 22,
  },
  hotelChip: {
    maxWidth: '46%',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: BORDER,
  },
  hotelName: {
    fontSize: TYPE.small,
    color: 'rgba(255,255,255,0.6)',
    fontWeight: '500',
    lineHeight: 15,
    textAlign: 'right',
  },
  creditPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(34,197,94,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(34,197,94,0.28)',
    borderRadius: 50,
    paddingHorizontal: 12,
    paddingVertical: 7,
    marginBottom: 14,
  },
  creditPillText: { color: GREEN, fontSize: TYPE.small, fontWeight: '700' },

  dispatchWrap: {
    marginBottom: 16,
  },
  dispatchCard: {
    padding: 14,
    paddingTop: 16,
  },
  dispatchHead: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 14,
  },
  dispatchAccent: {
    width: 3,
    borderRadius: 2,
    backgroundColor: GOLD,
    opacity: 0.9,
  },
  dispatchCopy: {
    flex: 1,
    minWidth: 0,
    paddingBottom: 2,
  },
  heroTitle: {
    fontSize: TYPE.title,
    color: '#FFFFFF',
    fontWeight: '700',
    letterSpacing: -0.2,
    lineHeight: 21,
    marginBottom: 4,
  },
  heroSub: {
    fontSize: TYPE.body,
    color: 'rgba(255,255,255,0.55)',
    fontWeight: '500',
    lineHeight: 18,
  },
  dispatchDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginVertical: 14,
  },
  dispatchActions: {
    gap: 10,
  },
  dispatchBtn: {
    width: '100%',
  },
  trackingNoteText: {
    marginTop: 12,
    color: 'rgba(255,255,255,0.38)',
    fontSize: TYPE.small,
    fontWeight: '500',
    lineHeight: 15,
    textAlign: 'center',
  },

  statsSection: {
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: TYPE.small,
    color: 'rgba(255,255,255,0.4)',
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  statWrap: {
    width: '47.5%',
  },
  statCard: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: SURFACE,
  },
  statIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: GOLD_FAINT,
    borderWidth: 1,
    borderColor: GOLD_DIM,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    marginTop: 8,
    fontSize: TYPE.metric,
    color: '#fff',
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  statLabel: {
    marginTop: 3,
    fontSize: TYPE.small,
    color: 'rgba(255,255,255,0.5)',
    fontWeight: '600',
    textAlign: 'center',
  },
  statSub: {
    marginTop: 1,
    fontSize: TYPE.caption,
    color: 'rgba(255,255,255,0.32)',
    fontWeight: '500',
    textAlign: 'center',
  },

  quickSection: {
    marginBottom: 8,
  },
  quickLinksCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: SURFACE,
    overflow: 'hidden',
  },
  quickLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    minHeight: 56,
  },
  quickLinkRowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: BORDER,
  },
  quickLinkRowPressed: {
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  quickLinkIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: GOLD_FAINT,
    borderWidth: 1,
    borderColor: GOLD_DIM,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickLinkText: {
    flex: 1,
    minWidth: 0,
  },
  quickLinkLabel: {
    color: '#fff',
    fontSize: TYPE.body,
    fontWeight: '600',
  },
  quickLinkSub: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: TYPE.small,
    fontWeight: '500',
    marginTop: 1,
  },
});
