import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { Star, Check, ThumbsUp } from 'lucide-react-native';
import { AppCard } from '../components/AppCard';
import { AppButton } from '../components/AppButton';
import { AppScreen } from '../components/AppScreen';
import { useHaptics } from '../hooks/useHaptics';
import { useStaggerAnimation } from '../hooks/useStaggerAnimation';
import { useApp } from '../context/AppContext';
import { calculateFare } from '../utils/pricing';

const GOLD = '#D4AF37';

export const RideCompletionScreen = ({ navigation, route }: any) => {
  const { activeRide } = useApp();
  const { paymentType, estimatedFare, driver } = route.params || {};
  const [rating, setRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const { light, success } = useHaptics();
  const delays = useStaggerAnimation();

  const fare = activeRide?.fare || estimatedFare || calculateFare(paymentType || 'card');
  const driverName = driver?.name || 'Your Chauffeur';

  const handleRate = async (star: number) => {
    await light();
    setRating(star);
  };

  const handleDone = async () => {
    await success();
    setSubmitted(true);
    setTimeout(() => navigation.navigate('ConciergeHome'), 300);
  };

  return (
    <AppScreen centerContent noTopPad>
      {/* ── Success badge ── */}
      <MotiView
        from={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 220, damping: 16, delay: 60 }}
        style={styles.successWrap}
      >
        <View style={styles.successCircle}>
          <Check color="#000" size={36} strokeWidth={3} />
        </View>
      </MotiView>

      <MotiView
        from={{ opacity: 0, translateY: 10 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 240, delay: delays.header }}
        style={styles.titleWrap}
      >
        <Text style={styles.title}>Ride Complete</Text>
        <Text style={styles.subtitle}>Thank you, {driverName} delivered safely.</Text>
      </MotiView>

      {/* ── Fare summary ── */}
      <MotiView
        from={{ opacity: 0, translateY: 16 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 240, delay: delays.content }}
        style={styles.cardWrap}
      >
        <AppCard variant="gold" style={styles.fareCard}>
          <View style={styles.fareRow}>
            <Text style={styles.fareLabel}>Total Fare</Text>
            <Text style={styles.fareValue}>${fare.toFixed(2)}</Text>
          </View>
          <View style={styles.fareDivider} />
          <View style={styles.fareRow}>
            <Text style={styles.fareLabel}>Payment</Text>
            <Text style={styles.fareMethod}>
              {paymentType === 'cash' ? 'Cash' : 'Card'}
            </Text>
          </View>
        </AppCard>
      </MotiView>

      {/* ── Rating ── */}
      <MotiView
        from={{ opacity: 0, translateY: 12 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 240, delay: delays.item(0) }}
        style={styles.cardWrap}
      >
        <AppCard style={styles.ratingCard}>
          <View style={styles.ratingHeader}>
            <ThumbsUp color={GOLD} size={16} />
            <Text style={styles.ratingTitle}>Rate your chauffeur</Text>
          </View>
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map(star => (
              <TouchableOpacity
                key={star}
                onPress={() => handleRate(star)}
                style={styles.starBtn}
                accessibilityRole="button"
                accessibilityLabel={`Rate ${star} stars`}
              >
                <MotiView
                  animate={{ scale: star <= rating ? 1.15 : 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 14 }}
                >
                  <Star
                    color={GOLD}
                    size={36}
                    fill={star <= rating ? GOLD : 'transparent'}
                  />
                </MotiView>
              </TouchableOpacity>
            ))}
          </View>
          {rating > 0 && (
            <MotiView
              from={{ opacity: 0, translateY: 4 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', duration: 200 }}
            >
              <Text style={styles.ratingFeedback}>
                {rating === 5 ? 'Excellent!' : rating >= 3 ? 'Good ride' : 'Thanks for the feedback'}
              </Text>
            </MotiView>
          )}
        </AppCard>
      </MotiView>

      {/* ── CTA ── */}
      <MotiView
        from={{ opacity: 0, translateY: 10 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 220, delay: delays.cta }}
        style={styles.ctaWrap}
      >
        <AppButton
          label="Back to Dashboard"
          onPress={handleDone}
          haptic="success"
          success={submitted}
          style={styles.ctaBtn}
        />
      </MotiView>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  successWrap: { alignItems: 'center', marginBottom: 16 },
  successCircle: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: GOLD,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: GOLD,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  titleWrap: { alignItems: 'center', marginBottom: 24 },
  title:    { fontSize: 26, color: '#fff', fontWeight: '800', marginBottom: 6 },
  subtitle: { fontSize: 14, color: '#9ca3af', fontWeight: '500', textAlign: 'center' },
  cardWrap: { width: '100%', marginBottom: 12 },
  fareCard: { padding: 20 },
  fareRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  fareLabel:  { color: '#9ca3af', fontSize: 13, fontWeight: '500' },
  fareValue:  { color: '#fff', fontSize: 24, fontWeight: '800' },
  fareMethod: { color: '#d1d5db', fontSize: 14, fontWeight: '600' },
  fareDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginVertical: 14,
  },
  ratingCard: { padding: 20 },
  ratingHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16,
  },
  ratingTitle: { color: '#fff', fontSize: 14, fontWeight: '600' },
  starsRow: {
    flexDirection: 'row', justifyContent: 'center', gap: 6, marginBottom: 8,
  },
  starBtn: {
    padding: 4, minWidth: 44, minHeight: 44,
    alignItems: 'center', justifyContent: 'center',
  },
  ratingFeedback: {
    textAlign: 'center', color: GOLD,
    fontSize: 13, fontWeight: '600',
  },
  ctaWrap: { width: '100%', marginTop: 8 },
  ctaBtn: { width: '100%' },
});
