import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';
import { AppProvider } from './src/context/AppContext';

enableScreens();

// Screens
import { LoginScreen } from './src/screens/LoginScreen';
import { ConciergeHomeScreen } from './src/screens/ConciergeHomeScreen';
import { GuestDetailsScreen } from './src/screens/GuestDetailsScreen';
import { WaitingForPaymentScreen } from './src/screens/WaitingForPaymentScreen';
import { DriverMatchingScreen } from './src/screens/DriverMatchingScreen';
import { DriverETAScreen } from './src/screens/DriverETAScreen';
import { ActiveRideScreen } from './src/screens/ActiveRideScreen';
import { RideCompletionScreen } from './src/screens/RideCompletionScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { CommissionWalletScreen } from './src/screens/CommissionWalletScreen';
import { RideHistoryScreen } from './src/screens/RideHistoryScreen';
import { ScheduleBookingScreen } from './src/screens/ScheduleBookingScreen';
import {
  DriverAssignmentModeScreen,
  DriverListScreen,
  DriverProfileScreen,
  DriverSwipeScreen,
} from './src/screens/DriverSelectionScreens';
import { DriverConfirmationScreen } from './src/screens/DriverConfirmationScreen';
import { MembershipScreen, MembershipPaymentScreen } from './src/screens/MembershipScreens';
import { TrackRideScreen } from './src/screens/TrackRideScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <NavigationContainer>
          <StatusBar style="light" />
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#000000' },
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Home" component={ConciergeHomeScreen} />
          <Stack.Screen name="GuestDetails" component={GuestDetailsScreen} />
          <Stack.Screen name="ScheduleBooking" component={ScheduleBookingScreen} />
          <Stack.Screen name="WaitingForPayment" component={WaitingForPaymentScreen} />
          <Stack.Screen name="DriverMatching" component={DriverMatchingScreen} />
          <Stack.Screen name="DriverETA" component={DriverETAScreen} />
          <Stack.Screen name="ActiveRide" component={ActiveRideScreen} />
          <Stack.Screen name="RideCompletion" component={RideCompletionScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="CommissionWallet" component={CommissionWalletScreen} />
          <Stack.Screen name="RideHistory" component={RideHistoryScreen} />
          <Stack.Screen name="DriverAssignmentMode" component={DriverAssignmentModeScreen} />
          <Stack.Screen name="DriverList" component={DriverListScreen} />
          <Stack.Screen name="DriverProfile" component={DriverProfileScreen} />
          <Stack.Screen name="DriverSwipe" component={DriverSwipeScreen} />
          <Stack.Screen name="DriverConfirmation" component={DriverConfirmationScreen} />
          <Stack.Screen name="Membership" component={MembershipScreen} />
          <Stack.Screen name="MembershipPayment" component={MembershipPaymentScreen} />
          <Stack.Screen name="TrackRide" component={TrackRideScreen} />
        </Stack.Navigator>
        </NavigationContainer>
      </AppProvider>
    </SafeAreaProvider>
  );
}
