import React, { useCallback } from 'react';
import {
  Pressable, Text, ActivityIndicator,
  StyleSheet, StyleProp, ViewStyle, TextStyle,
} from 'react-native';
import { MotiView } from 'moti';
import { Easing } from 'react-native-reanimated';
import { useHaptics } from '../hooks/useHaptics';

// ─── Tokens ───────────────────────────────────────────────────────────────────
const GOLD      = '#D4AF37';
const GOLD_DIM  = 'rgba(212,175,55,0.25)';
const GOLD_FAINT = 'rgba(212,175,55,0.08)';
const BLACK     = '#000000';

export type AppButtonVariant = 'primary' | 'secondary' | 'ghost';

interface AppButtonProps {
  label: string;
  onPress: () => void;
  variant?: AppButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  /** Show a ✓ success state */
  success?: boolean;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  /** Override haptic: 'light' | 'medium' | 'success'. Defaults to 'medium'. */
  haptic?: 'light' | 'medium' | 'success';
}

export const AppButton: React.FC<AppButtonProps> = ({
  label,
  onPress,
  variant = 'primary',
  disabled,
  loading,
  success,
  style,
  labelStyle,
  haptic = 'medium',
}) => {
  const [pressed, setPressed] = React.useState(false);
  const haptics = useHaptics();

  const handlePress = useCallback(async () => {
    if (disabled || loading || success) return;
    await haptics[haptic]();
    onPress();
  }, [disabled, loading, success, haptic, haptics, onPress]);

  const isDisabled = disabled || loading || success;

  return (
    <Pressable
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      onPress={handlePress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!isDisabled, busy: !!loading }}
      accessibilityLabel={label}
    >
      <MotiView
        animate={{
          scale:         pressed ? 0.97 : 1,
          opacity:       disabled && !loading && !success ? 0.45 : 1,
          shadowOpacity: pressed ? 0.06 : variant === 'primary' ? 0.22 : 0,
          shadowRadius:  pressed ? 3    : 10,
        }}
        transition={{
          scale:         { type: 'timing', duration: pressed ? 100 : 180, easing: Easing.out(Easing.quad) },
          opacity:       { type: 'timing', duration: 150 },
          shadowOpacity: { type: 'timing', duration: pressed ? 100 : 200 },
          shadowRadius:  { type: 'timing', duration: pressed ? 100 : 200 },
        }}
        style={[
          styles.base,
          variant === 'primary'   && styles.primary,
          variant === 'secondary' && styles.secondary,
          variant === 'ghost'     && styles.ghost,
          style,
        ]}
      >
        {loading ? (
          <ActivityIndicator color={variant === 'primary' ? BLACK : GOLD} size="small" />
        ) : success ? (
          <Text style={[styles.label, variant === 'primary' ? styles.labelPrimary : styles.labelAlt, labelStyle]}>✓</Text>
        ) : (
          <Text style={[styles.label, variant === 'primary' ? styles.labelPrimary : styles.labelAlt, labelStyle]}>
            {label}
          </Text>
        )}
      </MotiView>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    minHeight: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    shadowColor: GOLD,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  primary: {
    backgroundColor: GOLD,
  },
  secondary: {
    borderWidth: 1,
    borderColor: GOLD_DIM,
    backgroundColor: GOLD_FAINT,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.2)',
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
  },
  labelPrimary: {
    color: BLACK,
  },
  labelAlt: {
    color: GOLD,
  },
});
