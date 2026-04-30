import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { TrendingUp, ArrowUpRight } from 'lucide-react-native';
import { AppCard } from '../components/AppCard';
import { AppScreen } from '../components/AppScreen';
import { useStaggerAnimation } from '../hooks/useStaggerAnimation';

const GOLD  = '#D4AF37';
const GREEN = '#22c55e';

const STATS = [
  { label: 'Today',  value: '$142.50', delta: '+12%' },
  { label: 'Week',   value: '$856',    delta: '+8%'  },
  { label: 'Month',  value: '$3,420',  delta: '+15%' },
];

const TRANSACTIONS = [
  { ride: '#1042', date: 'Today, 3:15 PM',  amount: '+$6.75', type: 'Commission' },
  { ride: '#1041', date: 'Today, 1:30 PM',  amount: '+$8.10', type: 'Commission' },
  { ride: '#1040', date: 'Yesterday',        amount: '+$5.40', type: 'Commission' },
  { ride: '#1039', date: 'Yesterday',        amount: '+$9.00', type: 'Commission' },
];

export const CommissionWalletScreen = () => {
  const delays = useStaggerAnimation();

  return (
    <AppScreen>
      {/* ── Balance hero ── */}
      <MotiView
        from={{ opacity: 0, translateY: 16 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 260, delay: delays.header }}
      >
        <AppCard variant="gold" style={styles.heroCard}>
          <Text style={styles.heroLabel}>Total Earnings</Text>
          <Text style={styles.heroValue}>$3,420.00</Text>
          <View style={styles.heroDelta}>
            <ArrowUpRight color={GREEN} size={14} />
            <Text style={styles.heroDeltaText}>+15% this month</Text>
          </View>
        </AppCard>
      </MotiView>

      {/* ── Period stats ── */}
      <View style={styles.statsRow}>
        {STATS.map(({ label, value, delta }, i) => (
          <MotiView
            key={label}
            from={{ opacity: 0, translateY: 12 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 220, delay: delays.item(i) }}
            style={styles.statWrap}
          >
            <AppCard style={styles.statCard}>
              <Text style={styles.statLabel}>{label}</Text>
              <Text style={styles.statValue}>{value}</Text>
              <Text style={styles.statDelta}>{delta}</Text>
            </AppCard>
          </MotiView>
        ))}
      </View>

      {/* ── Chart placeholder ── */}
      <MotiView
        from={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'timing', duration: 240, delay: delays.item(3) }}
      >
        <AppCard style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>Earnings Trend</Text>
            <Text style={styles.chartPeriod}>Last 7 days</Text>
          </View>
          <View style={styles.chartBody}>
            <MotiView
              from={{ translateY: 0 }}
              animate={{ translateY: -10 }}
              transition={{ type: 'timing', duration: 2800, loop: true }}
            >
              <TrendingUp color="rgba(212,175,55,0.3)" size={52} />
            </MotiView>
            <Text style={styles.chartPlaceholder}>Chart coming soon</Text>
          </View>
        </AppCard>
      </MotiView>

      {/* ── Transactions ── */}
      <MotiView
        from={{ opacity: 0, translateY: 12 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 240, delay: delays.item(4) }}
      >
        <Text style={styles.sectionLabel}>Recent Transactions</Text>
        <AppCard>
          {TRANSACTIONS.map((tx, i) => (
            <React.Fragment key={tx.ride}>
              <View style={styles.txRow}>
                <View style={styles.txIcon}>
                  <ArrowUpRight color={GREEN} size={16} />
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
              {i < TRANSACTIONS.length - 1 && <View style={styles.divider} />}
            </React.Fragment>
          ))}
        </AppCard>
      </MotiView>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  heroCard: { padding: 24, alignItems: 'center', marginBottom: 16 },
  heroLabel: {
    fontSize: 11, color: '#6b7280', fontWeight: '600',
    letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 8,
  },
  heroValue: { fontSize: 44, color: '#fff', fontWeight: '800', letterSpacing: -1, marginBottom: 8 },
  heroDelta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  heroDeltaText: { color: '#22c55e', fontSize: 13, fontWeight: '600' },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  statWrap: { flex: 1 },
  statCard: { padding: 14, alignItems: 'center' },
  statLabel: { color: '#6b7280', fontSize: 11, fontWeight: '500', marginBottom: 6 },
  statValue: { color: GOLD, fontSize: 17, fontWeight: '800', marginBottom: 2 },
  statDelta: { color: '#22c55e', fontSize: 10, fontWeight: '600' },
  chartCard: { padding: 16, marginBottom: 20 },
  chartHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 16,
  },
  chartTitle:  { color: '#fff', fontWeight: '700', fontSize: 14 },
  chartPeriod: { color: '#6b7280', fontSize: 12, fontWeight: '500' },
  chartBody: {
    height: 120, alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  chartPlaceholder: { color: '#4b5563', fontSize: 12, fontWeight: '500' },
  sectionLabel: {
    fontSize: 11, color: '#6b7280', fontWeight: '600',
    letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 10,
  },
  txRow: {
    flexDirection: 'row', alignItems: 'center',
    gap: 12, paddingHorizontal: 16, paddingVertical: 14, minHeight: 56,
  },
  txIcon: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: 'rgba(34,197,94,0.1)',
    alignItems: 'center', justifyContent: 'center',
  },
  txInfo: { flex: 1 },
  txRide: { color: '#fff', fontWeight: '600', fontSize: 14 },
  txDate: { color: '#6b7280', fontSize: 12, fontWeight: '500', marginTop: 1 },
  txRight: { alignItems: 'flex-end' },
  txAmount: { color: '#22c55e', fontWeight: '800', fontSize: 15 },
  txType:   { color: '#4b5563', fontSize: 10, fontWeight: '500', marginTop: 2 },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255,255,255,0.06)',
    marginLeft: 64,
  },
});
