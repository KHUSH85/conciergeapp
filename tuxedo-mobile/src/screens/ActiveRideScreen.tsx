import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { Check, ArrowLeft } from 'lucide-react-native';
import { GlassCard, GoldButton } from '../components/GlassCard';
import { ScreenShell } from '../components/ScreenShell';

const GOLD = '#D4AF37';

const TIMELINE = [
  { status: 'Assigned', time: '2:15 PM', done: true },
  { status: 'Arriving', time: '2:18 PM', done: true },
  { status: 'Onboard', time: '2:20 PM', done: true },
  { status: 'En Route', time: 'Now', done: false },
  { status: 'Completed', time: 'Pending', done: false },
];

export const ActiveRideScreen = ({ navigation, route }: any) => {
  const { driver, paymentType, estimatedFare } = route.params || {};

  return (
    <ScreenShell>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
        <ArrowLeft color={GOLD} size={18} />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <GlassCard style={styles.card}>
        <Text style={styles.title}>Active Ride Timeline</Text>

        <View style={styles.timeline}>
          {TIMELINE.map(({ status, time, done }, i) => (
            <MotiView key={status} from={{ opacity: 0, translateX: -20 }} animate={{ opacity: 1, translateX: 0 }} transition={{ type: 'timing', duration: 300, delay: 100 + i * 100 }}>
              <View style={styles.timelineRow}>
                <View style={[styles.dot, done && styles.dotDone]}>
                  {done && <Check color="#000" size={16} />}
                </View>
                {i < TIMELINE.length - 1 && <View style={[styles.line, done && styles.lineDone]} />}
                <View style={styles.timelineInfo}>
                  <Text style={styles.timelineStatus}>{status}</Text>
                  <Text style={styles.timelineTime}>{time}</Text>
                </View>
              </View>
            </MotiView>
          ))}
        </View>

        <GoldButton
          onPress={() => navigation.navigate('RideCompletion', { driver, paymentType, estimatedFare })}
          style={styles.btn}
        >
          <Text style={styles.btnText}>Complete Ride</Text>
        </GoldButton>
      </GlassCard>
    </ScreenShell>
  );
};

const styles = StyleSheet.create({
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 16 },
  backText: { color: GOLD, fontWeight: '700', fontSize: 14 },
  card: { padding: 24 },
  title: { fontSize: 22, color: '#fff', fontWeight: '900', marginBottom: 28 },
  timeline: { marginBottom: 28 },
  timelineRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 4 },
  dot: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.6)', borderWidth: 2, borderColor: '#4b5563', justifyContent: 'center', alignItems: 'center', zIndex: 1 },
  dotDone: { backgroundColor: GOLD, borderColor: GOLD, shadowColor: GOLD, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.5, shadowRadius: 8, elevation: 5 },
  line: { position: 'absolute', left: 19, top: 40, width: 2, height: 28, backgroundColor: '#374151' },
  lineDone: { backgroundColor: GOLD },
  timelineInfo: { marginLeft: 16, paddingTop: 8, paddingBottom: 20 },
  timelineStatus: { color: '#fff', fontWeight: '700', fontSize: 15 },
  timelineTime: { color: '#9ca3af', fontSize: 13, fontWeight: '500', marginTop: 2 },
  btn: { width: '100%', paddingVertical: 16 },
  btnText: { color: '#000', fontWeight: '900', fontSize: 15, textAlign: 'center' },
});
