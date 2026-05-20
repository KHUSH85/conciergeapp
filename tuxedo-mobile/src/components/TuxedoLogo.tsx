import React from 'react';
import { ImageStyle, StyleProp, View, ViewStyle } from 'react-native';
import { Image as ExpoImage } from 'expo-image';

/**
 * Official Tuxedo wordmark.
 * - `light` → white logo for dark backgrounds (default in this app)
 * - `dark`  → black logo for light backgrounds
 */
export type TuxedoLogoVariant = 'light' | 'dark';

const SOURCES = {
  light: require('../../assets/brand/tuxedo-logo-white.png'),
  dark: require('../../assets/brand/tuxedo-logo-black.png'),
} as const;

type Props = {
  variant?: TuxedoLogoVariant;
  width?: number;
  height?: number;
  style?: StyleProp<ImageStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
};

export function TuxedoLogo({
  variant = 'light',
  width = 160,
  height = 48,
  style,
  containerStyle,
  accessibilityLabel = 'Tuxedo Black Car Services',
}: Props) {
  return (
    <View style={[{ width, height, alignItems: 'center', justifyContent: 'center' }, containerStyle]}>
      <ExpoImage
        source={SOURCES[variant]}
        style={[{ width: '100%', height: '100%' }, style]}
        contentFit="contain"
        accessibilityLabel={accessibilityLabel}
      />
    </View>
  );
}

/** Preset sizes used across the app */
export const LOGO_SIZES = {
  /** Tab bar screens (Home, Wallet, Rides, Profile) */
  header: { width: 112, height: 27 },
  /** Stack screens with back button */
  stackHeader: { width: 104, height: 25 },
  auth: { width: 145, height: 36 },
  splash: { width: 180, height: 44 },
  compact: { width: 78, height: 20 },
} as const;
