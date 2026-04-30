import React, { useState, forwardRef } from 'react';
import {
  TextInput, TextInputProps, StyleSheet,
  StyleProp, ViewStyle,
} from 'react-native';
import { MotiView } from 'moti';

// ─── Tokens ───────────────────────────────────────────────────────────────────
const GOLD       = '#D4AF37';
const GOLD_DIM   = 'rgba(212,175,55,0.25)';
const GOLD_FAINT = 'rgba(212,175,55,0.08)';
const WHITE      = '#FFFFFF';
const GREY       = '#6B7280';
const SURFACE    = 'rgba(255,255,255,0.04)';
const BORDER     = 'rgba(255,255,255,0.08)';

interface AppInputProps extends TextInputProps {
  containerStyle?: StyleProp<ViewStyle>;
  /** Render something before the text input (e.g. icon or country picker) */
  leftSlot?: React.ReactNode;
}

export const AppInput = forwardRef<TextInput, AppInputProps>(
  ({ containerStyle, leftSlot, style, onFocus, onBlur, ...rest }, ref) => {
    const [focused, setFocused] = useState(false);

    return (
      <MotiView
        animate={{
          borderColor:     focused ? GOLD_DIM  : BORDER,
          backgroundColor: focused ? GOLD_FAINT : SURFACE,
        }}
        transition={{ type: 'timing', duration: 150 }}
        style={[styles.wrap, containerStyle]}
      >
        {leftSlot}
        <TextInput
          ref={ref}
          style={[styles.input, style]}
          placeholderTextColor={GREY}
          selectionColor={GOLD}
          autoCorrect={false}
          onFocus={e => { setFocused(true); onFocus?.(e); }}
          onBlur={e  => { setFocused(false); onBlur?.(e); }}
          {...rest}
        />
      </MotiView>
    );
  },
);

AppInput.displayName = 'AppInput';

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 52,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 12,
    backgroundColor: SURFACE,
    overflow: 'hidden',
  },
  input: {
    flex: 1,
    color: WHITE,
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontWeight: '400',
  },
});
