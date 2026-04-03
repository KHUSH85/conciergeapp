import { useMemo } from 'react';
import { useWindowDimensions, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/** Max width for content on large phones / small tablets (readable line length). */
const MAX_CONTENT_WIDTH = 560;

/**
 * Responsive spacing and safe-area aware insets for all screen sizes (iOS + Android).
 */
export function useResponsiveLayout() {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  return useMemo(() => {
    const horizontalPadding = Math.max(12, Math.min(28, Math.round(width * 0.045)));
    const maxContentWidth = Math.min(width, MAX_CONTENT_WIDTH);
    const isTablet = width >= 768;
    const isSmallPhone = width < 360;
    const bottomPad = Math.max(insets.bottom, Platform.select({ ios: 8, android: 12, default: 8 }) ?? 8);

    /** Use on ScrollView `contentContainerStyle` for centered, padded column. */
    const scrollContentStyle = {
      paddingHorizontal: horizontalPadding,
      paddingTop: 8,
      paddingBottom: bottomPad + 20,
      width: '100%' as const,
      maxWidth: maxContentWidth,
      alignSelf: 'center' as const,
      flexGrow: 1 as const,
    };

    return {
      width,
      height,
      horizontalPadding,
      maxContentWidth,
      isTablet,
      isSmallPhone,
      insets,
      scrollContentStyle,
    };
  }, [width, height, insets.top, insets.bottom, insets.left, insets.right]);
}
