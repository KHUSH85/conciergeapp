import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootParamList } from './types';
import { AuthStack } from './AuthStack';
import { MainTabs } from './MainTabs';

const Root = createNativeStackNavigator<RootParamList>();

// RootNavigator always registers both screens.
// The correct initial route is controlled by App.tsx via the key prop,
// which remounts NavigationContainer cleanly when auth state changes.
export function AuthNavigator() {
  return (
    <Root.Navigator screenOptions={{ headerShown: false, animation: 'none' }}>
      <Root.Screen name="Auth" component={AuthStack} />
    </Root.Navigator>
  );
}

export function MainNavigator() {
  return (
    <Root.Navigator screenOptions={{ headerShown: false, animation: 'none' }}>
      <Root.Screen name="Main" component={MainTabs} />
    </Root.Navigator>
  );
}
