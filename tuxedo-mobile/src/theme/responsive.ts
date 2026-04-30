import { useMemo } from 'react';
import { useWindowDimensions, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * Responsive spacing and safe-area aware insets for all screen sizes.
 * No maxWidth centering — full-width native layout only.
 */
export function useResponsiveLayout() {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  return useMemo(() => {
    const horizontalPadding = 20;
    const isTablet    = width >= 768;
    const isSmallPhone = width < 360;
    const bottomPad   = Math.max(
      insets.bottom,
      Platform.select({ ios: 8, android: 12, default: 8 }) ?? 8,
    );

    /** Use on ScrollView `contentContainerStyle`. */
    const scrollContentStyle = {
      paddingHorizontal: horizontalPadding,
      paddingTop: 12,
      paddingBottom: bottomPad + 20,
      width: '100%' as const,
      flexGrow: 1 as const,
    };

    return {
      width,
      height,
      horizontalPadding,
      isTablet,
      isSmallPhone,
      insets,
      scrollContentStyle,
    };
  }, [width, height, insets.top, insets.bottom, insets.left, insets.right]);
}
