import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Keyboard, StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppProvider, useApp } from './src/context/AppContext';
import { SplashProvider } from './src/context/SplashContext';
import * as ExpoSplashScreen from 'expo-splash-screen';

import { SplashScreenComponent } from './src/screens/SplashScreen';
import { AuthNavigator, MainNavigator } from './src/navigation/RootNavigator';

enableScreens();
ExpoSplashScreen.preventAutoHideAsync();

function AppNavigator() {
  const { user } = useApp();
  return (
    <NavigationContainer key={user ? 'main' : 'auth'}>
      <StatusBar style="light" />
      {user ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}

export default function App() {
  const [showJsSplash, setShowJsSplash] = useState(true);
  const nativeSplashHidden = useRef(false);

  const onRootLayout = useCallback(async () => {
    if (nativeSplashHidden.current) return;
    nativeSplashHidden.current = true;
    await ExpoSplashScreen.hideAsync();
  }, []);

  const handleSplashFinish = useCallback(() => {
    setShowJsSplash(false);
  }, []);

  useEffect(() => {
    if (showJsSplash) Keyboard.dismiss();
  }, [showJsSplash]);

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider onLayout={onRootLayout}>
        <StatusBar style="light" />
        <SplashProvider visible={showJsSplash}>
          <AppProvider>
            <AppNavigator />
            {showJsSplash ? (
              <View style={styles.splashOverlay}>
                <SplashScreenComponent onFinish={handleSplashFinish} />
              </View>
            ) : null}
          </AppProvider>
        </SplashProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000000',
  },
  splashOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
    elevation: 1000,
    backgroundColor: '#000000',
  },
});
