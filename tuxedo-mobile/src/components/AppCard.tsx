import React, { ReactNode } from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';

/**
 * Standardised surface card.
 * Replaces ad-hoc inline styles for card surfaces across all screens.
 *
 * variant:
 *   default  — subtle dark surface, faint gold border
 *   gold     — stronger gold border, used for hero/featured cards
 *   flat     — no border, just the dark surface (for nested rows)
 */
type CardVariant = 'default' | 'gold' | 'flat';

interface AppCardProps {
  children: ReactNode;
  variant?: CardVariant;
  style?: StyleProp<ViewStyle>;
}

export function AppCard({ children, variant = 'default', style }: AppCardProps) {
  return (
    <View
      style={[
        styles.base,
        variant === 'default' && styles.variantDefault,
        variant === 'gold'    && styles.variantGold,
        variant === 'flat'    && styles.variantFlat,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 16,
    // overflow visible so shadows render on both platforms
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  variantDefault: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.15)',
  },
  variantGold: {
    backgroundColor: 'rgba(212,175,55,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.35)',
  },
  variantFlat: {
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
});
