import React, { ReactNode } from 'react';
import { View, TouchableOpacity, Text, ViewStyle, TextStyle, StyleSheet, StyleProp } from 'react-native';
import { MotiView } from 'moti';

const GOLD = '#D4AF37';
const GOLD_DIM = 'rgba(212,175,55,0.2)';

interface GlassCardProps {
  children: ReactNode;
  animate?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const GlassCard = ({ children, animate = true, style }: GlassCardProps) => {
  const base = StyleSheet.flatten([{
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderColor: GOLD_DIM,
    borderWidth: 2,
    borderRadius: 16,
    overflow: 'hidden' as const,
  }, style]) as ViewStyle;

  if (!animate) return <View style={base}>{children}</View>;

  return (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 400 }}
      style={base}
    >
      {children}
    </MotiView>
  );
};

interface GoldButtonProps {
  children: ReactNode;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
  icon?: ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: TextStyle;
}

export const GoldButton = ({ children, onPress, variant = 'primary', disabled = false, icon, style, textStyle }: GoldButtonProps) => {
  const containerStyle = StyleSheet.flatten([{
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    gap: 8,
    opacity: disabled ? 0.5 : 1,
    ...(variant === 'primary' && { backgroundColor: GOLD }),
    ...(variant === 'secondary' && { backgroundColor: 'transparent', borderColor: GOLD, borderWidth: 2 }),
    ...(variant === 'ghost' && { backgroundColor: 'transparent', borderColor: 'rgba(212,175,55,0.3)', borderWidth: 2 }),
  }, style]) as ViewStyle;

  const tStyle: TextStyle = {
    fontWeight: 'bold',
    fontSize: 16,
    ...(variant === 'primary' && { color: '#000' }),
    ...(variant === 'secondary' && { color: GOLD }),
    ...(variant === 'ghost' && { color: GOLD }),
    ...textStyle,
  };

  return (
    <TouchableOpacity onPress={onPress} disabled={disabled} activeOpacity={0.8} style={containerStyle}>
      {icon}
      {typeof children === 'string' ? <Text style={tStyle}>{children}</Text> : children}
    </TouchableOpacity>
  );
};
