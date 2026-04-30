import { useCallback } from 'react';
import * as Haptics from 'expo-haptics';

/**
 * Centralised haptic helpers.
 * light    → selection / navigation
 * medium   → actions / confirmations
 * success  → completion / success states
 */
export function useHaptics() {
  const light = useCallback(() => Haptics.selectionAsync(), []);

  const medium = useCallback(
    () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium),
    [],
  );

  const success = useCallback(
    () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),
    [],
  );

  return { light, medium, success };
}
