import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { Star, Check } from 'lucide-react-native';
import { GlassCard, GoldButton } from '../components/GlassCard';
import { ScreenShell } from '../components/ScreenShell';
import { useApp } from '../context/AppContext';
import { calculateFare } from '../utils/pricing';

const GOLD = '#D4AF37';

export const RideCompletionScreen = ({ navigation, route }: any) => {
  const { activeRide } = useApp();
  const { paymentType, estimatedFare } = route.params || {};
  const [rating, setRating] = useState(0);

  const fare = activeRide?.fare || estimatedFare || calculateFare(paymentType || 'card');

  return (
    <ScreenShell centerContent>
      <GlassCard style={styles.card}>
        {/* Success icon */}
        <MotiView from={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 15 }} style={styles.successWrap}>
          <View style={styles.successCircle}>
            <Check color="#000" size={40} />
          </View>
        </MotiView>

        <Text style={styles.title}>Ride Complete</Text>

        {/* Fare breakdown */}
        <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', duration: 500, delay: 200 }}>
          <View style={styles.fareBox}>
            <View style={styles.fareRow}>
              <Text style={styles.fareLabel}>Total Fare</Text>
              <Text style={styles.fareValue}>${fare.toFixed(2)}</Text>
            </View>
          </View>
        </MotiView>

        {/* Journey confirmed badge */}
        <View style={styles.confirmedBox}>
          <Text style={styles.confirmedTitle}>Journey Confirmed</Text>
          <Text style={styles.confirmedSub}>Driver payment processed successfully</Text>
        </View>

        {/* Star rating */}
        <MotiView from={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ type: 'timing', duration: 500, delay: 500 }}>
          <Text style={styles.rateLabel}>Rate Driver</Text>
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map(star => (
              <TouchableOpacity key={star} onPress={() => setRating(star)}>
                <Star
                  color={GOLD}
                  size={38}
                  fill={star <= rating ? GOLD : 'transparent'}
                  style={styles.star}
                />
              </TouchableOpacity>
            ))}
          </View>
        </MotiView>

        <GoldButton onPress={() => navigation.navigate('Home')} style={styles.btn}>
          <Text style={styles.btnText}>Done</Text>
        </GoldButton>
      </GlassCard>
    </ScreenShell>
  );
};

const styles = StyleSheet.create({
  card: { padding: 28 },
  successWrap: { alignItems: 'center', marginBottom: 16 },
  successCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: GOLD, justifyContent: 'center', alignItems: 'center', shadowColor: GOLD, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.5, shadowRadius: 20, elevation: 10 },
  title: { fontSize: 26, color: '#fff', fontWeight: '900', textAlign: 'center', marginBottom: 20 },
  fareBox: { backgroundColor: 'rgba(0,0,0,0.6)', borderWidth: 2, borderColor: 'rgba(212,175,55,0.3)', borderRadius: 16, padding: 20, marginBottom: 16 },
  fareRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  fareLabel: { color: '#9ca3af', fontSize: 14, fontWeight: '500' },
  fareValue: { color: '#fff', fontSize: 22, fontWeight: '900' },
  confirmedBox: { backgroundColor: 'rgba(212,175,55,0.1)', borderWidth: 2, borderColor: 'rgba(212,175,55,0.4)', borderRadius: 12, padding: 16, marginBottom: 24 },
  confirmedTitle: { color: GOLD, fontWeight: '900', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 },
  confirmedSub: { color: '#9ca3af', fontSize: 11, fontWeight: '500', marginTop: 4, textTransform: 'uppercase', letterSpacing: 0.5 },
  rateLabel: { color: '#fff', fontWeight: '700', fontSize: 15, textAlign: 'center', marginBottom: 12 },
  starsRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 24 },
  star: { marginHorizontal: 4 },
  btn: { width: '100%', paddingVertical: 16 },
  btnText: { color: '#000', fontWeight: '900', fontSize: 15, textAlign: 'center' },
});
