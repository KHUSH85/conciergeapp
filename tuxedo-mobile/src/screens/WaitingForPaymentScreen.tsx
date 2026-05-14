import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { Car, Send, RefreshCw, ArrowLeft } from 'lucide-react-native';
import { AppCard } from '../components/AppCard';
import { AppButton } from '../components/AppButton';
import { AppScreen } from '../components/AppScreen';
import { useHaptics } from '../hooks/useHaptics';
import { useStaggerAnimation } from '../hooks/useStaggerAnimation';

const GOLD = '#D4AF37';

export const WaitingForPaymentScreen = ({ navigation, route }: any) => {
  const { light } = useHaptics();
  const delays = useStaggerAnimation();
  const [resent, setResent] = useState(false);

  const serviceType = route?.params?.serviceType as 'transfer' | 'hourly' | undefined;
  const pickup = route?.params?.pickupLocation as string | undefined;
  const scheduledDate = route?.params?.scheduledDate as string | undefined;
  const scheduledTime = route?.params?.scheduledTime as string | undefined;

  const handleResend = async () => {
    await light();
    setResent(true);
    setTimeout(() => setResent(false), 3000);
  };

  return (
    <AppScreen centerContent noTopPad>
      {/* ── Spinner card ── */}
      <MotiView
        from={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'timing', duration: 260, delay: delays.header }}
        style={{ width: '100%' }}
      >
        <AppCard variant="gold" style={styles.heroCard}>
          {/* Animated spinner + car */}
          <View style={styles.spinnerWrap}>
            <MotiView
              from={{ rotate: '0deg' }}
              animate={{ rotate: '360deg' }}
              transition={{ type: 'timing', duration: 1400, loop: true }}
              style={styles.spinner}
            />
            <View style={styles.carOverlay}>
              <MotiView
                from={{ opacity: 0.5 }}
                animate={{ opacity: 1 }}
                transition={{ type: 'timing', duration: 1800, loop: true }}
              >
                <Car color={GOLD} size={24} />
              </MotiView>
            </View>
          </View>

          <Text style={styles.title}>Request Sent</Text>
          <Text style={styles.subtitle}>
            Tracking link delivered to guest.{'\n'}
            Waiting for destination and payment.
          </Text>

          {(serviceType || scheduledDate || pickup) && (
            <View style={styles.metaBox}>
              {serviceType ? (
                <Text style={styles.metaLine}>
                  Service: <Text style={styles.metaStrong}>{serviceType === 'transfer' ? 'Transfer (A → B)' : 'Hourly'}</Text>
                </Text>
              ) : null}
              {pickup ? (
                <Text style={styles.metaLine} numberOfLines={2}>
                  Pickup: <Text style={styles.metaStrong}>{pickup}</Text>
                </Text>
              ) : null}
              {scheduledDate ? (
                <Text style={styles.metaLine}>
                  Scheduled: <Text style={styles.metaStrong}>{scheduledDate}{scheduledTime ? ` · ${scheduledTime}` : ''}</Text>
                </Text>
              ) : null}
            </View>
          )}

          {/* Status pill */}
          <View style={styles.statusPill}>
            <MotiView
              from={{ opacity: 0.3 }}
              animate={{ opacity: 1 }}
              transition={{ type: 'timing', duration: 900, loop: true }}
              style={styles.statusDot}
            />
            <Text style={styles.statusText}>Chauffeur Radar Active</Text>
          </View>
        </AppCard>
      </MotiView>

      {/* ── Actions ── */}
      <MotiView
        from={{ opacity: 0, translateY: 12 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 240, delay: delays.content }}
        style={styles.actionsWrap}
      >
        <AppButton
          label="Return to Dashboard"
          onPress={() => navigation.navigate('ConciergeHome')}
          style={styles.primaryBtn}
        />

        <TouchableOpacity
          onPress={handleResend}
          style={styles.resendBtn}
          accessibilityRole="button"
          activeOpacity={0.7}
        >
          <RefreshCw color={resent ? '#22c55e' : GOLD} size={15} />
          <Text style={[styles.resendText, resent && styles.resendTextSent]}>
            {resent ? 'Link Resent!' : 'Resend Tracking Link'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={async () => { await light(); navigation.goBack(); }}
          style={styles.backRow}
          accessibilityRole="button"
        >
          <ArrowLeft color="#4b5563" size={14} />
          <Text style={styles.backText}>Back to Guest Details</Text>
        </TouchableOpacity>
      </MotiView>

      {/* ── Footer note ── */}
      <MotiView
        from={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ type: 'timing', duration: 260, delay: delays.cta }}
      >
        <Text style={styles.footer}>
          You will be notified when the guest completes payment. Future jobs can broadcast to chauffeurs — first to accept wins; cancel and penalty rules are set on the back end.
        </Text>
      </MotiView>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  heroCard: { padding: 28, alignItems: 'center', marginBottom: 20 },
  spinnerWrap: {
    width: 72, height: 72,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 24,
  },
  spinner: {
    position: 'absolute',
    width: 72, height: 72, borderRadius: 36,
    borderWidth: 2.5,
    borderColor: GOLD,
    borderTopColor: 'transparent',
  },
  carOverlay: { position: 'absolute' },
  title: {
    fontSize: 22, color: '#fff', fontWeight: '800',
    marginBottom: 10, textAlign: 'center',
  },
  subtitle: {
    fontSize: 14, color: '#9ca3af', fontWeight: '500',
    textAlign: 'center', lineHeight: 22, marginBottom: 20,
  },
  statusPill: {
    flexDirection: 'row', alignItems: 'center', gap: 7,
    backgroundColor: 'rgba(212,175,55,0.08)',
    borderWidth: 1, borderColor: 'rgba(212,175,55,0.2)',
    borderRadius: 50, paddingHorizontal: 14, paddingVertical: 7,
  },
  statusDot: {
    width: 7, height: 7, borderRadius: 4, backgroundColor: GOLD,
  },
  statusText: { color: GOLD, fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  metaBox: {
    alignSelf: 'stretch',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  metaLine: { color: '#9ca3af', fontSize: 12, fontWeight: '500', marginBottom: 4 },
  metaStrong: { color: '#e5e7eb', fontWeight: '700' },
  actionsWrap: { width: '100%', gap: 10, marginBottom: 20 },
  primaryBtn: { width: '100%' },
  resendBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, minHeight: 48, borderRadius: 12,
    borderWidth: 1, borderColor: 'rgba(212,175,55,0.2)',
    backgroundColor: 'rgba(212,175,55,0.05)',
  },
  resendText:     { color: GOLD, fontSize: 14, fontWeight: '600' },
  resendTextSent: { color: '#22c55e' },
  backRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, minHeight: 44,
  },
  backText: { color: '#4b5563', fontSize: 13, fontWeight: '500' },
  footer: {
    color: '#374151', fontSize: 11, fontWeight: '500',
    textAlign: 'center', lineHeight: 18,
  },
});
