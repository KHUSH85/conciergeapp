import React from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppHeader } from '../components/AppHeader';

type Nav = NativeStackNavigationProp<Record<string, object | undefined>>;

export function stackScreenOptions(
  title: string,
  navigation: Nav,
  subtitle?: string
) {
  return {
    headerShown: true as const,
    header: () => (
      <AppHeader
        title={title}
        subtitle={subtitle}
        onBack={() => navigation.goBack()}
      />
    ),
    animation: 'slide_from_right' as const,
  };
}
