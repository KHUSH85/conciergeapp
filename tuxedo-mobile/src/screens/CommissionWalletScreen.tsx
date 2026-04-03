import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { TrendingUp, ArrowLeft } from 'lucide-react-native';
import { GlassCard } from '../components/GlassCard';
import { ScreenShell } from '../components/ScreenShell';

const GOLD = '#D4AF37';

const STATS = [
  { label: 'Today', value: '$142.50' },
  { label: 'Week', value: '$856' },
  { label: 'Month', value: '$3,420' },
];

export const CommissionWalletScreen = ({ navigation }: any) => (
  <ScreenShell>
    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
      <ArrowLeft color={GOLD} size={18} />
      <Text style={styles.backText}>Back</Text>
    </TouchableOpacity>

    <GlassCard style={styles.card}>
      <Text style={styles.title}>Commission Wallet</Text>

      <View style={styles.statsRow}>
        {STATS.map(({ label, value }, i) => (
          <MotiView key={label} from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', duration: 500, delay: 100 + i * 100 }} style={styles.statCard}>
            <Text style={styles.statLabel}>{label}</Text>
            <Text style={styles.statValue}>{value}</Text>
          </MotiView>
        ))}
      </View>

      {/* Chart placeholder */}
      <MotiView from={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'timing', duration: 500, delay: 400 }} style={styles.chartBox}>
        <MotiView from={{ translateY: 0 }} animate={{ translateY: -12 }} transition={{ type: 'timing', duration: 3000, loop: true }}>
          <TrendingUp color="#4b5563" size={56} />
        </MotiView>
        <Text style={styles.chartPlaceholder}>Earnings Chart</Text>
      </MotiView>

      {/* Recent transactions */}
      <Text style={styles.sectionTitle}>Recent Transactions</Text>
      {[
        { ride: '#1042', date: 'Today, 3:15 PM', amount: '+$6.75' },
        { ride: '#1041', date: 'Today, 1:30 PM', amount: '+$8.10' },
        { ride: '#1040', date: 'Yesterday', amount: '+$5.40' },
        { ride: '#1039', date: 'Yesterday', amount: '+$9.00' },
      ].map((tx, i) => (
        <MotiView key={tx.ride} from={{ opacity: 0, translateX: -20 }} animate={{ opacity: 1, translateX: 0 }} transition={{ type: 'timing', duration: 300, delay: 500 + i * 60 }}>
          <View style={styles.txRow}>
            <View>
              <Text style={styles.txRide}>Ride {tx.ride}</Text>
              <Text style={styles.txDate}>{tx.date}</Text>
            </View>
            <Text style={styles.txAmount}>{tx.amount}</Text>
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
  statsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  statCard: { flexGrow: 1, flexBasis: '28%', minWidth: 88, backgroundColor: 'rgba(0,0,0,0.6)', borderWidth: 2, borderColor: 'rgba(212,175,55,0.2)', borderRadius: 12, padding: 14, alignItems: 'center' },
  statLabel: { color: '#9ca3af', fontSize: 11, fontWeight: '500', marginBottom: 6 },
  statValue: { color: GOLD, fontSize: 16, fontWeight: '900' },
  chartBox: { height: 180, backgroundColor: 'rgba(0,0,0,0.6)', borderWidth: 2, borderColor: 'rgba(212,175,55,0.2)', borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  chartPlaceholder: { color: '#4b5563', fontSize: 12, fontWeight: '500', marginTop: 8 },
  sectionTitle: { color: '#fff', fontWeight: '700', fontSize: 15, marginBottom: 12 },
  txRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.6)', borderWidth: 2, borderColor: 'rgba(212,175,55,0.2)', borderRadius: 12, padding: 14, marginBottom: 8 },
  txRide: { color: '#fff', fontWeight: '700', fontSize: 14 },
  txDate: { color: '#9ca3af', fontSize: 12, fontWeight: '500', marginTop: 2 },
  txAmount: { color: '#22c55e', fontWeight: '900', fontSize: 15 },
});
