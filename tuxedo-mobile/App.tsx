import React, { useState, useCallback, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppProvider, useApp } from './src/context/AppContext';
import * as SplashScreen from 'expo-splash-screen';

import { SplashScreenComponent } from './src/screens/SplashScreen';
import { AuthNavigator, MainNavigator } from './src/navigation/RootNavigator';

enableScreens();
SplashScreen.preventAutoHideAsync();

// Inner component so it can access AppContext via useApp
function AppNavigator() {
  const { user } = useApp();
  // key forces NavigationContainer to fully remount when auth state changes,
  // preventing the internal REPLACE {name:"Home"} dispatch on the wrong navigator.
  return (
    <NavigationContainer key={user ? 'main' : 'auth'}>
      <StatusBar style="light" />
      {user ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}

export default function App() {
  const [appReady, setAppReady] = useState(false);
  const [showJsSplash, setShowJsSplash] = useState(true);

  const onLayoutRootView = useCallback(async () => {
    if (appReady) await SplashScreen.hideAsync();
  }, [appReady]);

  useEffect(() => {
    setAppReady(true);
  }, []);

  const handleSplashFinish = useCallback(() => {
    setShowJsSplash(false);
  }, []);

  if (!appReady) return null;

  if (showJsSplash) {
    return (
      <SafeAreaProvider onLayout={onLayoutRootView}>
        <StatusBar style="light" />
        <SplashScreenComponent onFinish={handleSplashFinish} />
      </SafeAreaProvider>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AppProvider>
          <AppNavigator />
        </AppProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
