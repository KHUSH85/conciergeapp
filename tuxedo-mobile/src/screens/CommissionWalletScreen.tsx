import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { TrendingUp, ArrowUpRight, Wallet } from 'lucide-react-native';
import { AppCard } from '../components/AppCard';
import { AppScreen } from '../components/AppScreen';
import { SectionHeader } from '../components/SectionHeader';
import { useStaggerAnimation } from '../hooks/useStaggerAnimation';

const GOLD = '#D4AF37';
const GOLD_FAINT = 'rgba(212,175,55,0.08)';
const GOLD_DIM = 'rgba(212,175,55,0.25)';
const GREEN = '#22c55e';
const BORDER = 'rgba(255,255,255,0.08)';
const SURFACE = 'rgba(255,255,255,0.04)';

const TYPE = {
  caption: 10,
  small: 11,
  body: 13,
  title: 15,
  balance: 26,
  metric: 16,
} as const;

const STATS = [
  { label: 'Today', value: '$142.50', delta: '+12%' },
  { label: 'Week', value: '$856', delta: '+8%' },
  { label: 'Month', value: '$3,420', delta: '+15%' },
];

const TRANSACTIONS = [
  { ride: '#1042', date: 'Today, 3:15 PM', amount: '+$6.75', type: 'Commission' },
  { ride: '#1041', date: 'Today, 1:30 PM', amount: '+$8.10', type: 'Commission' },
  { ride: '#1040', date: 'Yesterday', amount: '+$5.40', type: 'Commission' },
  { ride: '#1039', date: 'Yesterday', amount: '+$9.00', type: 'Commission' },
];

export const CommissionWalletScreen = () => {
  const delays = useStaggerAnimation();

  return (
    <AppScreen brandHeader>
      <SectionHeader title="Commission wallet" subtitle="Earnings and payout history" />

      {/* Balance */}
      <MotiView
        from={{ opacity: 0, translateY: 10 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 240, delay: delays.header }}
      >
        <AppCard variant="gold" style={styles.balanceCard}>
          <View style={styles.balanceRow}>
            <View style={styles.balanceAccent} />
            <View style={styles.balanceCopy}>
              <View style={styles.balanceLabelRow}>
                <View style={styles.balanceIconWrap}>
                  <Wallet color={GOLD} size={16} />
                </View>
                <Text style={styles.heroLabel}>Total Earnings</Text>
              </View>
              <Text style={styles.heroValue}>$3,420.00</Text>
              <View style={styles.heroDelta}>
                <ArrowUpRight color={GREEN} size={13} />
                <Text style={styles.heroDeltaText}>+15% this month</Text>
              </View>
            </View>
          </View>
        </AppCard>
      </MotiView>

      {/* Period stats */}
      <View style={styles.statsRow}>
        {STATS.map(({ label, value, delta }, i) => (
          <MotiView
            key={label}
            from={{ opacity: 0, translateY: 10 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 220, delay: delays.item(i) }}
            style={styles.statWrap}
          >
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>{label}</Text>
              <Text style={styles.statValue} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.8}>
                {value}
              </Text>
              <Text style={styles.statDelta}>{delta}</Text>
            </View>
          </MotiView>
        ))}
      </View>

      {/* Chart */}
      <MotiView
        from={{ opacity: 0, translateY: 10 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 240, delay: delays.item(3) }}
      >
        <AppCard style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>Earnings Trend</Text>
            <Text style={styles.chartPeriod}>Last 7 days</Text>
          </View>
          <View style={styles.chartBody}>
            <View style={styles.chartIconWrap}>
              <TrendingUp color={GOLD} size={22} />
            </View>
            <Text style={styles.chartPlaceholder}>Chart coming soon</Text>
          </View>
        </AppCard>
      </MotiView>

      {/* Transactions */}
      <MotiView
        from={{ opacity: 0, translateY: 10 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 240, delay: delays.item(4) }}
      >
        <Text style={styles.sectionLabel}>Recent Transactions</Text>
        <View style={styles.txCard}>
          {TRANSACTIONS.map((tx, i) => (
            <React.Fragment key={tx.ride}>
              <View style={styles.txRow}>
                <View style={styles.txIcon}>
                  <ArrowUpRight color={GREEN} size={15} />
                </View>
                <View style={styles.txInfo}>
                  <Text style={styles.txRide}>Ride {tx.ride}</Text>
                  <Text style={styles.txDate}>{tx.date}</Text>
                </View>
                <View style={styles.txRight}>
                  <Text style={styles.txAmount}>{tx.amount}</Text>
                  <Text style={styles.txType}>{tx.type}</Text>
                </View>
              </View>
              {i < TRANSACTIONS.length - 1 ? <View style={styles.divider} /> : null}
            </React.Fragment>
          ))}
        </View>
      </MotiView>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  balanceCard: {
    padding: 14,
    marginBottom: 12,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 12,
  },
  balanceAccent: {
    width: 3,
    borderRadius: 2,
    backgroundColor: GOLD,
    opacity: 0.9,
  },
  balanceCopy: {
    flex: 1,
    minWidth: 0,
  },
  balanceLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  balanceIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: GOLD_FAINT,
    borderWidth: 1,
    borderColor: GOLD_DIM,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroLabel: {
    fontSize: TYPE.small,
    color: 'rgba(255,255,255,0.45)',
    fontWeight: '600',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  heroValue: {
    fontSize: TYPE.balance,
    color: '#fff',
    fontWeight: '700',
    letterSpacing: -0.5,
    lineHeight: 30,
    marginBottom: 6,
  },
  heroDelta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  heroDeltaText: {
    color: GREEN,
    fontSize: TYPE.body,
    fontWeight: '600',
  },

  statsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  statWrap: {
    flex: 1,
    minWidth: 0,
  },
  statCard: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: SURFACE,
  },
  statLabel: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: TYPE.small,
    fontWeight: '600',
    marginBottom: 4,
  },
  statValue: {
    color: GOLD,
    fontSize: TYPE.metric,
    fontWeight: '700',
    marginBottom: 2,
  },
  statDelta: {
    color: GREEN,
    fontSize: TYPE.caption,
    fontWeight: '600',
  },

  chartCard: {
    padding: 14,
    marginBottom: 14,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  chartTitle: {
    color: '#fff',
    fontWeight: '700',
    fontSize: TYPE.body,
  },
  chartPeriod: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: TYPE.small,
    fontWeight: '500',
  },
  chartBody: {
    height: 88,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.25)',
    borderWidth: 1,
    borderColor: BORDER,
  },
  chartIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: GOLD_FAINT,
    borderWidth: 1,
    borderColor: GOLD_DIM,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartPlaceholder: {
    color: 'rgba(255,255,255,0.35)',
    fontSize: TYPE.small,
    fontWeight: '500',
  },

  sectionLabel: {
    fontSize: TYPE.small,
    color: 'rgba(255,255,255,0.4)',
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  txCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: SURFACE,
    overflow: 'hidden',
    marginBottom: 8,
  },
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    minHeight: 58,
  },
  txIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(34,197,94,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(34,197,94,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  txInfo: {
    flex: 1,
    minWidth: 0,
  },
  txRide: {
    color: '#fff',
    fontWeight: '600',
    fontSize: TYPE.body,
  },
  txDate: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: TYPE.small,
    fontWeight: '500',
    marginTop: 2,
  },
  txRight: {
    alignItems: 'flex-end',
  },
  txAmount: {
    color: GREEN,
    fontWeight: '700',
    fontSize: TYPE.body,
  },
  txType: {
    color: 'rgba(255,255,255,0.35)',
    fontSize: TYPE.caption,
    fontWeight: '500',
    marginTop: 2,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: BORDER,
    marginLeft: 58,
  },
});
