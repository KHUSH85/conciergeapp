import React, { ReactNode } from 'react';
import {
  View,
  ScrollView, KeyboardAvoidingView,
  Platform, StyleSheet, ViewStyle, StyleProp,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
  children: ReactNode;
  keyboardAvoiding?: boolean;
  centerContent?: boolean;
  /** Set true on stack screens that already have an AppHeader above */
  noTopPad?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
};

/**
 * Full-screen black shell with safe areas, consistent padding, no web-style
 * maxWidth centering. Replaces ScreenShell for all screens.
 */
export function AppScreen({
  children,
  keyboardAvoiding = false,
  centerContent = false,
  noTopPad = false,
  contentStyle,
}: Props) {
  const insets = useSafeAreaInsets();
  const scrollView = (
    <ScrollView
      style={styles.flex}
      contentContainerStyle={[
        styles.content,
        noTopPad && styles.noTopPad,
        centerContent && styles.centered,
        contentStyle,
      ]}
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
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 24}
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
  safe:    { flex: 1, backgroundColor: '#000' },
  flex:    { flex: 1 },
  content: {
    flexGrow: 1,
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 36,
  },
  noTopPad: {
    paddingTop: 8,
  },
  centered: {
    justifyContent: 'center',
  },
});
