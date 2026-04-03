import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { Car, ArrowLeft } from 'lucide-react-native';
import { GlassCard, GoldButton } from '../components/GlassCard';
import { ScreenShell } from '../components/ScreenShell';

const GOLD = '#D4AF37';

export const DriverETAScreen = ({ navigation, route }: any) => {
  const driver = route.params?.driver || { name: 'Michael T.', rating: '4.9', car: 'Mercedes-Benz S-Class', plate: 'LUX 2024', eta: '3 min' };
  const paymentType = route.params?.paymentType || 'card';
  const estimatedFare = route.params?.estimatedFare || 45.00;

  const driverName = driver.name;
  const driverRating = driver.rating;
  const driverCar = driver.car || `${driver.vehicle?.brand} ${driver.vehicle?.model}`;
  const driverPlate = driver.plate || driver.vehicle?.plate;
  const driverEta = driver.eta || '3 min';

  return (
    <ScreenShell>
      <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.backBtn}>
        <ArrowLeft color={GOLD} size={18} />
        <Text style={styles.backText}>Cancel Ride</Text>
      </TouchableOpacity>

      <GlassCard style={styles.card}>
        {/* Car animation */}
        <View style={styles.carWrap}>
          <View style={styles.carCircle}>
            <MotiView from={{ translateY: 0 }} animate={{ translateY: -8 }} transition={{ type: 'timing', duration: 2000, loop: true }}>
              <Car color={GOLD} size={44} />
            </MotiView>
          </View>
        </View>

        <Text style={styles.title}>Chauffeur Arriving</Text>
        <Text style={styles.eta}>{driverEta}</Text>
        <Text style={styles.carName}>{driverCar}</Text>

        {/* Driver details */}
        <View style={styles.detailsList}>
          {[
            { label: 'Chauffeur', value: driverName },
            { label: 'Rating', value: `★ ${driverRating}` },
            { label: 'License Plate', value: driverPlate },
          ].map(({ label, value }, i) => (
            <MotiView key={label} from={{ opacity: 0, translateX: -20 }} animate={{ opacity: 1, translateX: 0 }} transition={{ type: 'timing', duration: 300, delay: 400 + i * 100 }}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>{label}</Text>
                <Text style={styles.detailValue}>{value}</Text>
              </View>
            </MotiView>
          ))}
        </View>

        <GoldButton
          onPress={() => navigation.navigate('ActiveRide', { driver, paymentType, estimatedFare })}
          style={styles.btn}
        >
          <Text style={styles.btnText}>TRACK RIDE</Text>
        </GoldButton>
      </GlassCard>
    </ScreenShell>
  );
};

const styles = StyleSheet.create({
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 16 },
  backText: { color: GOLD, fontWeight: '700', fontSize: 14 },
  card: { padding: 28 },
  carWrap: { alignItems: 'center', marginBottom: 20 },
  carCircle: { width: 90, height: 90, borderRadius: 45, backgroundColor: 'rgba(212,175,55,0.15)', borderWidth: 2, borderColor: 'rgba(212,175,55,0.3)', justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, color: '#fff', fontWeight: '900', textTransform: 'uppercase', textAlign: 'center', marginBottom: 8 },
  eta: { fontSize: 56, color: GOLD, fontWeight: '900', textAlign: 'center', marginBottom: 8 },
  carName: { fontSize: 16, color: '#9ca3af', textAlign: 'center', fontWeight: '500', marginBottom: 24 },
  detailsList: { gap: 12, marginBottom: 28 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.6)', borderWidth: 2, borderColor: 'rgba(212,175,55,0.2)', borderRadius: 12, padding: 16 },
  detailLabel: { color: '#9ca3af', fontWeight: '900', fontSize: 10, textTransform: 'uppercase', letterSpacing: 1 },
  detailValue: { color: '#fff', fontWeight: '700', fontSize: 15 },
  btn: { width: '100%', paddingVertical: 18 },
  btnText: { color: '#000', fontWeight: '900', fontSize: 16, textAlign: 'center' },
});
