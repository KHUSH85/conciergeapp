import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform } from 'react-native';
import { MotiView, MotiText } from 'moti';
import { Easing } from 'react-native-reanimated';
import Constants from 'expo-constants';

const { width } = Dimensions.get('window');
const GOLD = '#D4AF37';
const GOLD_LIGHT = '#F0D060';

const APP_VERSION =
  Constants.expoConfig?.version ?? Constants.nativeAppVersion ?? '1.0.0';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreenComponent: React.FC<SplashScreenProps> = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(onFinish, 3200);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <View style={styles.container}>
      <MotiView
        from={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.12, scale: 1.15 }}
        transition={{ type: 'timing', duration: 1200, easing: Easing.out(Easing.quad) }}
        style={styles.glow}
      />

      <MotiView
        from={{ opacity: 0, scale: 0.75 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'timing', duration: 600, easing: Easing.out(Easing.cubic) }}
        style={styles.logoContainer}
      >
        <View style={styles.outerRing}>
          <View style={styles.innerRing}>
            <Text style={styles.monogram}>T</Text>
          </View>
        </View>
      </MotiView>

      <MotiView
        from={{ opacity: 0, translateY: 12 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 500, delay: 350, easing: Easing.out(Easing.quad) }}
      >
        <Text style={styles.brandName}>TUXEDO</Text>
      </MotiView>

      <MotiView
        from={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ type: 'timing', duration: 400, delay: 550, easing: Easing.out(Easing.quad) }}
        style={styles.divider}
      />

      <MotiText
        from={{ opacity: 0 }}
        animate={{ opacity: 0.75 }}
        transition={{ type: 'timing', duration: 400, delay: 750 }}
        style={styles.tagline}
      >
        LUXURY CHAUFFEUR SERVICE
      </MotiText>

      <MotiView
        from={{ opacity: 0, translateY: 6 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 450, delay: 950 }}
      >
        <Text style={styles.version}>Concierge · v{APP_VERSION}</Text>
      </MotiView>
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
    marginBottom: 26,
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
    fontSize: 30,
    fontWeight: '300',
    color: GOLD,
    letterSpacing: 12,
    textAlign: 'center',
  },
  divider: {
    width: 72,
    height: 2,
    backgroundColor: GOLD,
    marginTop: 16,
    marginBottom: 14,
    opacity: 0.85,
    borderRadius: 1,
  },
  tagline: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 3,
    textAlign: 'center',
  },
  version: {
    marginTop: 28,
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.38)',
    letterSpacing: 0.6,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-medium',
  },
});
