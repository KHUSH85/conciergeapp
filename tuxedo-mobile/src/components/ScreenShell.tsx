import React, { ReactNode } from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ViewStyle,
  StyleProp,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useResponsiveLayout } from '../theme/responsive';

type Props = {
  children: ReactNode;
  /** Wrap with KeyboardAvoidingView (forms / login). */
  keyboardAvoiding?: boolean;
  /** Vertically center content (e.g. login card on tall phones). */
  centerContent?: boolean;
  /** Extra style merged into ScrollView contentContainerStyle. */
  contentContainerStyle?: StyleProp<ViewStyle>;
};

/**
 * Full-screen black background, safe areas on all edges, responsive horizontal padding
 * and max content width for large devices. ScrollView tuned for smooth scrolling on iOS/Android.
 */
export function ScreenShell({
  children,
  keyboardAvoiding = false,
  centerContent = false,
  contentContainerStyle,
}: Props) {
  const { scrollContentStyle } = useResponsiveLayout();
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const centerStyle = centerContent
    ? {
        flexGrow: 1 as const,
        justifyContent: 'center' as const,
        minHeight: Math.max(0, height - insets.top - insets.bottom - 24),
      }
    : {};

  const scrollView = (
    <ScrollView
      style={styles.flex}
      contentContainerStyle={[scrollContentStyle, centerStyle, contentContainerStyle]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      bounces={Platform.OS === 'ios'}
      overScrollMode={Platform.OS === 'android' ? 'never' : undefined}
    >
      {children}
    </ScrollView>
  );

  const inner = keyboardAvoiding ? (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {scrollView}
    </KeyboardAvoidingView>
  ) : (
    scrollView
  );

  return (
    <View
      style={[
        styles.safe,
        {
          paddingTop: insets.top,
          paddingLeft: insets.left,
          paddingRight: insets.right,
          paddingBottom: insets.bottom,
        },
      ]}
    >
      {inner}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#000' },
  flex: { flex: 1 },
});
