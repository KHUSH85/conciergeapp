import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { ArrowLeft, Star, MapPin, Shield, CheckCircle2, Award } from 'lucide-react-native';
import { GlassCard, GoldButton } from '../components/GlassCard';
import { ScreenShell } from '../components/ScreenShell';
import { mockDrivers } from '../data/mockDrivers';
import { calculateFare, calculateCommission } from '../utils/pricing';

const GOLD = '#D4AF37';

export const DriverConfirmationScreen = ({ navigation, route }: any) => {
  const driver = route.params?.driver || mockDrivers[0];
  const paymentType = route.params?.paymentType || 'card';
  const estimatedFare = calculateFare(paymentType);

  return (
    <ScreenShell>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
        <ArrowLeft color={GOLD} size={18} />
        <Text style={styles.backText}>Change Driver</Text>
      </TouchableOpacity>

      <GlassCard style={styles.card}>
        <Text style={styles.title}>Confirm Driver Assignment</Text>

        {/* Driver card */}
        <MotiView from={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'timing', duration: 400, delay: 200 }} style={styles.driverBox}>
          <View style={styles.driverRow}>
            <View style={styles.avatarWrap}>
              <View style={styles.avatar}>
                <Text style={styles.avatarInitial}>{driver.name.charAt(0)}</Text>
              </View>
              {driver.verified && (
                <View style={styles.verifiedBadge}><CheckCircle2 color="#000" size={14} /></View>
              )}
            </View>
            <View style={styles.driverInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.driverName}>{driver.name}</Text>
                {driver.hotelPreferred && <Award color={GOLD} size={18} />}
              </View>
              <View style={styles.ratingRow}>
                <Star color={GOLD} size={16} fill={GOLD} />
                <Text style={styles.ratingText}>{driver.rating.toFixed(1)}</Text>
                <Text style={styles.expText}>• {driver.experience} years</Text>
              </View>
              <Text style={styles.carText}>{driver.vehicle.brand} {driver.vehicle.model}</Text>
            </View>
          </View>

          <View style={styles.etaRow}>
            <View style={styles.etaLeft}>
              <MapPin color={GOLD} size={16} />
              <Text style={styles.etaDistance}>{driver.distance} miles away</Text>
            </View>
            <Text style={styles.etaTime}>{driver.eta} min ETA</Text>
          </View>
        </MotiView>

        {/* Trust badges */}
        <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', duration: 400, delay: 400 }} style={styles.badgesRow}>
          {driver.verified && (
            <View style={styles.badge}><Shield color="#4ade80" size={14} /><Text style={[styles.badgeText, { color: '#4ade80' }]}>Limo Verified</Text></View>
          )}
          {driver.backgroundCheck && (
            <View style={[styles.badge, styles.badgeBlue]}><CheckCircle2 color="#60a5fa" size={14} /><Text style={[styles.badgeText, { color: '#60a5fa' }]}>Background Check</Text></View>
          )}
          {driver.hotelPreferred && (
            <View style={[styles.badge, styles.badgeGold]}><Award color={GOLD} size={14} /><Text style={[styles.badgeText, { color: GOLD }]}>Hotel Preferred</Text></View>
          )}
        </MotiView>

        <GoldButton onPress={() => navigation.navigate('DriverETA', { driver, paymentType, estimatedFare })} style={styles.confirmBtn}>
          <Text style={styles.confirmBtnText}>Confirm Assignment</Text>
        </GoldButton>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.changeBtn}>
          <Text style={styles.changeBtnText}>Choose Different Driver</Text>
        </TouchableOpacity>
      </GlassCard>
    </ScreenShell>
  );
};

const styles = StyleSheet.create({
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 16 },
  backText: { color: GOLD, fontWeight: '700', fontSize: 14 },
  card: { padding: 24 },
  title: { fontSize: 22, color: '#fff', fontWeight: '900', textAlign: 'center', marginBottom: 24 },
  driverBox: { backgroundColor: 'rgba(0,0,0,0.6)', borderWidth: 2, borderColor: 'rgba(212,175,55,0.3)', borderRadius: 16, padding: 18, marginBottom: 20 },
  driverRow: { flexDirection: 'row', gap: 14, marginBottom: 14 },
  avatarWrap: { position: 'relative' },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: 'rgba(212,175,55,0.15)', borderWidth: 2, borderColor: 'rgba(212,175,55,0.3)', justifyContent: 'center', alignItems: 'center' },
  avatarInitial: { fontSize: 28, color: GOLD, fontWeight: '900' },
  verifiedBadge: { position: 'absolute', bottom: -2, right: -2, width: 24, height: 24, backgroundColor: GOLD, borderRadius: 12, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#000' },
  driverInfo: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  driverName: { color: '#fff', fontWeight: '700', fontSize: 18 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  ratingText: { color: GOLD, fontWeight: '700', fontSize: 15 },
  expText: { color: '#6b7280', fontSize: 13, fontWeight: '500' },
  carText: { color: '#9ca3af', fontSize: 14, fontWeight: '500' },
  etaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(212,175,55,0.1)', borderRadius: 10, padding: 12, borderWidth: 1, borderColor: 'rgba(212,175,55,0.3)' },
  etaLeft: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  etaDistance: { color: '#d1d5db', fontSize: 14, fontWeight: '500' },
  etaTime: { color: GOLD, fontWeight: '900', fontSize: 16 },
  badgesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginBottom: 24 },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 6, backgroundColor: 'rgba(74,222,128,0.1)', borderRadius: 50, borderWidth: 1, borderColor: 'rgba(74,222,128,0.4)' },
  badgeBlue: { backgroundColor: 'rgba(96,165,250,0.1)', borderColor: 'rgba(96,165,250,0.4)' },
  badgeGold: { backgroundColor: 'rgba(212,175,55,0.1)', borderColor: 'rgba(212,175,55,0.4)' },
  badgeText: { fontWeight: '700', fontSize: 12 },
  confirmBtn: { width: '100%', paddingVertical: 18, marginBottom: 10 },
  confirmBtnText: { color: '#000', fontWeight: '900', fontSize: 16, textAlign: 'center' },
  changeBtn: { width: '100%', paddingVertical: 14, backgroundColor: 'rgba(0,0,0,0.6)', borderWidth: 2, borderColor: 'rgba(212,175,55,0.3)', borderRadius: 12, alignItems: 'center' },
  changeBtnText: { color: GOLD, fontWeight: '700', fontSize: 14 },
});
