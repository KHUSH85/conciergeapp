import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, Easing, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { LOGO_SIZES, TuxedoLogo } from '../components/TuxedoLogo';

const { width: SCREEN_W } = Dimensions.get('window');
const GOLD = '#D4AF37';
interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreenComponent: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const masterFade = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.6)).current;
  const logoRotate = useRef(new Animated.Value(-12)).current;
  const ringScale = useRef(new Animated.Value(1)).current;
  const ringOpacity = useRef(new Animated.Value(0.5)).current;
  const haloScale = useRef(new Animated.Value(0.8)).current;
  const haloOpacity = useRef(new Animated.Value(0)).current;
  const brandY = useRef(new Animated.Value(18)).current;
  const brandOpacity = useRef(new Animated.Value(0)).current;
  const tagY = useRef(new Animated.Value(14)).current;
  const tagOpacity = useRef(new Animated.Value(0)).current;
  const dividerW = useRef(new Animated.Value(0)).current;
  const subOpacity = useRef(new Animated.Value(0)).current;
  const shimmerX = useRef(new Animated.Value(-80)).current;

  useEffect(() => {
    const logoIn = Animated.parallel([
      Animated.timing(masterFade, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        tension: 80,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(logoRotate, {
        toValue: 0,
        duration: 500,
        easing: Easing.out(Easing.back(1.4)),
        useNativeDriver: true,
      }),
    ]);

    const textIn = Animated.stagger(80, [
      Animated.parallel([
        Animated.timing(brandOpacity, { toValue: 1, duration: 380, useNativeDriver: true }),
        Animated.timing(brandY, { toValue: 0, duration: 380, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(tagOpacity, { toValue: 1, duration: 340, useNativeDriver: true }),
        Animated.timing(tagY, { toValue: 0, duration: 340, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      ]),
      Animated.timing(dividerW, { toValue: 1, duration: 420, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(subOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]);

    const shimmer = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerX, {
          toValue: 80,
          duration: 900,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.delay(1400),
        Animated.timing(shimmerX, { toValue: -80, duration: 0, useNativeDriver: true }),
      ])
    );

    const ringPulse = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(ringScale, { toValue: 1.06, duration: 900, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
          Animated.timing(ringOpacity, { toValue: 0.9, duration: 900, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(ringScale, { toValue: 1, duration: 900, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
          Animated.timing(ringOpacity, { toValue: 0.5, duration: 900, useNativeDriver: true }),
        ]),
      ])
    );

    const haloRipple = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(haloScale, { toValue: 1.35, duration: 1400, easing: Easing.out(Easing.quad), useNativeDriver: true }),
          Animated.timing(haloOpacity, { toValue: 0.18, duration: 400, useNativeDriver: true }),
        ]),
        Animated.timing(haloOpacity, { toValue: 0, duration: 1000, useNativeDriver: true }),
        Animated.timing(haloScale, { toValue: 0.8, duration: 0, useNativeDriver: true }),
        Animated.delay(600),
      ])
    );

    Animated.sequence([logoIn, textIn]).start(() => {
      shimmer.start();
      ringPulse.start();
      haloRipple.start();
    });

    const timer = setTimeout(onFinish, 3200);

    return () => {
      clearTimeout(timer);
      shimmer.stop();
      ringPulse.stop();
      haloRipple.stop();
    };
  }, [onFinish]);

  const rotateDeg = logoRotate.interpolate({
    inputRange: [-12, 0],
    outputRange: ['-12deg', '0deg'],
  });

  const dividerScaleX = dividerW.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <View style={styles.container}>
      <View style={styles.bgGlow} pointerEvents="none" />

      <Animated.View style={[styles.center, { opacity: masterFade }]}>
        <Animated.View
          style={[
            styles.halo,
            { opacity: haloOpacity, transform: [{ scale: haloScale }] },
          ]}
          pointerEvents="none"
        />

        <Animated.View
          style={[
            styles.logoWrap,
            { opacity: brandOpacity, transform: [{ scale: logoScale }, { rotate: rotateDeg }, { translateY: brandY }] },
          ]}
        >
          <Animated.View
            style={[
              styles.badgeRing,
              { opacity: ringOpacity, transform: [{ scale: ringScale }] },
            ]}
            pointerEvents="none"
          />
          <TuxedoLogo variant="light" {...LOGO_SIZES.splash} />
        </Animated.View>

        <Animated.View
          style={[
            styles.tagWrap,
            { opacity: tagOpacity, transform: [{ translateY: tagY }] },
          ]}
        >
          <Text style={styles.tagline}>LUXURY CHAUFFEUR SERVICE</Text>
        </Animated.View>

        <Animated.View style={[styles.dividerWrap, { transform: [{ scaleX: dividerScaleX }] }]}>
          <LinearGradient
            colors={['transparent', GOLD, 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.divider}
          />
        </Animated.View>

        <Animated.View style={[styles.dotsRow, { opacity: subOpacity }]}>
          <LoadingDot delay={0} />
          <LoadingDot delay={200} />
          <LoadingDot delay={400} />
        </Animated.View>
      </Animated.View>
    </View>
  );
};

function LoadingDot({ delay }: { delay: number }) {
  const anim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(anim, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0.3, duration: 400, useNativeDriver: true }),
        Animated.delay(600 - delay),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [delay, anim]);

  return <Animated.View style={[styles.dot, { opacity: anim }]} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bgGlow: {
    position: 'absolute',
    width: SCREEN_W * 1.4,
    height: SCREEN_W * 1.4,
    borderRadius: SCREEN_W * 0.7,
    backgroundColor: 'rgba(212,175,55,0.04)',
    top: '50%',
    left: '50%',
    marginTop: -(SCREEN_W * 0.7),
    marginLeft: -(SCREEN_W * 0.7),
  },
  center: {
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  halo: {
    position: 'absolute',
    width: LOGO_SIZES.splash.width + 48,
    height: LOGO_SIZES.splash.height + 48,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: GOLD,
  },
  logoWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    paddingVertical: 8,
  },
  badgeRing: {
    position: 'absolute',
    width: LOGO_SIZES.splash.width + 24,
    height: LOGO_SIZES.splash.height + 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.35)',
  },
  tagWrap: {
    marginTop: 20,
  },
  tagline: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 3,
    textAlign: 'center',
  },
  dividerWrap: {
    marginTop: 28,
    width: 180,
    height: 2,
    overflow: 'hidden',
  },
  divider: {
    flex: 1,
    height: 2,
    borderRadius: 1,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 12,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: GOLD,
  },
});
