import React, { ReactNode } from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { LOGO_SIZES, TuxedoLogo } from './TuxedoLogo';

const GOLD = '#D4AF37';

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  rightAction?: ReactNode;
  showLogo?: boolean;
}

/**
 * Stack screens — back button fixed top-left; logo + title in the center column.
 */
export function AppHeader({ title, subtitle, onBack, rightAction, showLogo = true }: AppHeaderProps) {
  const insets = useSafeAreaInsets();
  const extraTop = Platform.OS === 'ios' ? 4 : 8;

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onBack?.();
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + extraTop }]}>
      <View style={styles.row}>
        <View style={styles.leftSlot}>
          {onBack ? (
            <Pressable
              onPress={handleBack}
              style={({ pressed }) => [styles.backBtn, pressed && styles.backBtnPressed]}
              accessibilityLabel="Go back"
              accessibilityRole="button"
            >
              <ChevronLeft color="#000000" size={26} strokeWidth={2.5} />
            </Pressable>
          ) : (
            <View style={styles.backPlaceholder} />
          )}
        </View>

        <View style={styles.centerCol}>
          {showLogo ? (
            <TuxedoLogo variant="light" {...LOGO_SIZES.stackHeader} containerStyle={styles.headerLogo} />
          ) : null}
          <Text style={[styles.title, showLogo && styles.titleWithLogo]} numberOfLines={1}>
            {title}
          </Text>
          {!!subtitle && (
            <Text style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          )}
        </View>

        <View style={styles.rightSlot}>
          {rightAction ?? <View style={styles.backPlaceholder} />}
        </View>
      </View>
      <View style={styles.divider} />
    </View>
  );
}

const SLOT = 48;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    paddingHorizontal: 10,
    paddingBottom: 0,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    minHeight: 62,
    paddingBottom: 10,
  },
  leftSlot: {
    width: SLOT,
    paddingTop: 4,
    flexShrink: 0,
  },
  rightSlot: {
    width: SLOT,
    paddingTop: 4,
    alignItems: 'flex-end',
    flexShrink: 0,
  },
  backBtn: {
    width: SLOT,
    height: SLOT,
    borderRadius: 14,
    backgroundColor: GOLD,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: GOLD,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 8,
  },
  backBtnPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.94 }],
  },
  backPlaceholder: {
    width: SLOT,
    height: SLOT,
  },
  centerCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 2,
    paddingHorizontal: 4,
    minWidth: 0,
  },
  headerLogo: {
    marginBottom: 4,
  },
  titleWithLogo: {
    fontSize: 13,
    fontWeight: '600',
  },
  title: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 17,
    lineHeight: 22,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 2,
    color: 'rgba(255,255,255,0.55)',
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'center',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
});
