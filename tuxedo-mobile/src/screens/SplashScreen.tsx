import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { MotiView, MotiText } from 'moti';
import { Easing } from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const GOLD = '#D4AF37';
const GOLD_LIGHT = '#F0D060';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreenComponent: React.FC<SplashScreenProps> = ({ onFinish }) => {
  useEffect(() => {
    // Navigate after 3.2s — animation completes at ~600ms, rest is intentional hold
    const timer = setTimeout(onFinish, 3200);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <View style={styles.container}>
      {/* Subtle radial glow behind logo */}
      <MotiView
        from={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.12, scale: 1.15 }}
        transition={{ type: 'timing', duration: 1200, easing: Easing.out(Easing.quad) }}
        style={styles.glow}
      />

      {/* Logo mark — diamond / crest shape */}
      <MotiView
        from={{ opacity: 0, scale: 0.75 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'timing', duration: 600, easing: Easing.out(Easing.cubic) }}
        style={styles.logoContainer}
      >
        {/* Outer ring */}
        <View style={styles.outerRing}>
          {/* Inner ring */}
          <View style={styles.innerRing}>
            {/* Monogram */}
            <Text style={styles.monogram}>T</Text>
          </View>
        </View>
      </MotiView>

      {/* Brand name */}
      <MotiView
        from={{ opacity: 0, translateY: 12 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 500, delay: 350, easing: Easing.out(Easing.quad) }}
      >
        <Text style={styles.brandName}>TUXEDO</Text>
      </MotiView>

      {/* Divider line */}
      <MotiView
        from={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ type: 'timing', duration: 400, delay: 550, easing: Easing.out(Easing.quad) }}
        style={styles.divider}
      />

      {/* Tagline */}
      <MotiText
        from={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ type: 'timing', duration: 400, delay: 750 }}
        style={styles.tagline}
      >
        LUXURY CHAUFFEUR SERVICE
      </MotiText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
    width: width * 0.65,
    height: width * 0.65,
    borderRadius: width * 0.325,
    backgroundColor: GOLD,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
  outerRing: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 1.5,
    borderColor: GOLD,
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerRing: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 0.5,
    borderColor: GOLD_LIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(212,175,55,0.06)',
  },
  monogram: {
    fontSize: 52,
    fontWeight: '200',
    color: GOLD,
    letterSpacing: 4,
    lineHeight: 60,
  },
  brandName: {
    fontSize: 32,
    fontWeight: '300',
    color: GOLD,
    letterSpacing: 14,
    textAlign: 'center',
  },
  divider: {
    width: 60,
    height: 0.5,
    backgroundColor: GOLD,
    marginTop: 16,
    marginBottom: 14,
    opacity: 0.8,
  },
  tagline: {
    fontSize: 10,
    fontWeight: '400',
    color: '#FFFFFF',
    letterSpacing: 5,
    textAlign: 'center',
  },
});
