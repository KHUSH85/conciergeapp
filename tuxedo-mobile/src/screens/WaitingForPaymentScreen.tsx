import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { Car, ArrowLeft } from 'lucide-react-native';
import { GlassCard, GoldButton } from '../components/GlassCard';
import { ScreenShell } from '../components/ScreenShell';

const GOLD = '#D4AF37';

export const WaitingForPaymentScreen = ({ navigation }: any) => (
  <ScreenShell centerContent>
    <GlassCard style={styles.card}>
      {/* Animated loader */}
      <View style={styles.loaderWrap}>
        <MotiView
          from={{ rotate: '0deg' }} animate={{ rotate: '360deg' }}
          transition={{ type: 'timing', duration: 1200, loop: true }}
          style={styles.spinner}
        />
        <View style={styles.carOverlay}>
          <MotiView from={{ opacity: 0.4 }} animate={{ opacity: 1 }} transition={{ type: 'timing', duration: 2000, loop: true }}>
            <Car color={GOLD} size={22} />
          </MotiView>
        </View>
      </View>

      <Text style={styles.title}>Request Sent</Text>
      <Text style={styles.subtitle}>
        The automated tracking link has been sent to the guest.{'\n'}
        Waiting for destination entry and payment.
      </Text>

      <View style={styles.statusBadge}>
        <Text style={styles.statusText}>Status: Chauffeur Radar Active</Text>
      </View>

      <GoldButton onPress={() => navigation.navigate('Home')} style={styles.btn}>
        <Text style={styles.btnText}>Return to Dashboard</Text>
      </GoldButton>

      <TouchableOpacity style={styles.resendBtn}>
        <Text style={styles.resendText}>Resend Tracking SMS</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backRow}>
        <ArrowLeft color="#6b7280" size={14} />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>
    </GlassCard>

    <Text style={styles.footer}>
      Concierge will be notified once the passenger{'\n'}completes the secure payment flow.
    </Text>
  </ScreenShell>
);

const styles = StyleSheet.create({
  card: { padding: 28, alignItems: 'center', width: '100%', maxWidth: 420, alignSelf: 'center' },
  loaderWrap: { width: 64, height: 64, justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  spinner: { position: 'absolute', width: 64, height: 64, borderRadius: 32, borderWidth: 3, borderColor: GOLD, borderTopColor: 'transparent' },
  carOverlay: { position: 'absolute' },
  title: { fontSize: 22, color: '#fff', fontWeight: '900', textTransform: 'uppercase', fontStyle: 'italic', marginBottom: 12, textAlign: 'center' },
  subtitle: { fontSize: 14, color: '#9ca3af', textAlign: 'center', lineHeight: 22, fontWeight: '500', marginBottom: 20 },
  statusBadge: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 50, backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', marginBottom: 20 },
  statusText: { color: GOLD, fontSize: 10, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 1 },
  btn: { width: '100%', paddingVertical: 16, marginBottom: 12 },
  btnText: { color: '#000', fontWeight: '900', fontSize: 14, textAlign: 'center', textTransform: 'uppercase' },
  resendBtn: { width: '100%', paddingVertical: 14, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 2, borderColor: 'rgba(255,255,255,0.1)', alignItems: 'center', marginBottom: 12 },
  resendText: { color: '#fff', fontSize: 12, fontWeight: '700', textTransform: 'uppercase' },
  backRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  backText: { color: '#6b7280', fontSize: 11, fontWeight: '700', textTransform: 'uppercase' },
  footer: { marginTop: 24, color: '#4b5563', fontSize: 10, fontWeight: '700', textTransform: 'uppercase', textAlign: 'center', letterSpacing: 0.5, lineHeight: 16 },
});
