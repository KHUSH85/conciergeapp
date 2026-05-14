import React, { ReactNode } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import { useHaptics } from '../hooks/useHaptics';

const GOLD = '#D4AF37';

interface AppHeaderProps {
  title: string;
  onBack?: () => void;
  rightAction?: ReactNode;
}

/**
 * Shared header used across all stack screens.
 * Pass `onBack` to show the back chevron with haptic feedback.
 * Pass `rightAction` for optional trailing icon/button.
 */
export function AppHeader({ title, onBack, rightAction }: AppHeaderProps) {
  const insets = useSafeAreaInsets();
  const { light } = useHaptics();

  const handleBack = async () => {
    await light();
    onBack?.();
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
      <View style={styles.row}>
        {/* Left: back button or spacer */}
        <View style={styles.side}>
          {onBack ? (
            <TouchableOpacity
              onPress={handleBack}
              style={styles.backBtn}
              accessibilityLabel="Go back"
              accessibilityRole="button"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <ChevronLeft color={GOLD} size={22} strokeWidth={2} />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Center: title */}
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>

        {/* Right: optional action or spacer */}
        <View style={styles.side}>
          {rightAction ?? null}
        </View>
      </View>

      <View style={styles.divider} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    paddingHorizontal: 16,
    paddingBottom: 0,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 48,
    paddingBottom: 10,
  },
  side: {
    width: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    backgroundColor: 'rgba(212,175,55,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.2)',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
});
