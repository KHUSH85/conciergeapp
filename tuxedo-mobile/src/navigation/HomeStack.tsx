import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeStackParamList } from './types';
import { AppHeader } from '../components/AppHeader';

import { ConciergeHomeScreen } from '../screens/ConciergeHomeScreen';
import { GuestDetailsScreen } from '../screens/GuestDetailsScreen';
import { ScheduleBookingScreen } from '../screens/ScheduleBookingScreen';
import { WaitingForPaymentScreen } from '../screens/WaitingForPaymentScreen';
import { DriverMatchingScreen } from '../screens/DriverMatchingScreen';
import {
  DriverAssignmentModeScreen,
  DriverListScreen,
  DriverProfileScreen,
  DriverSwipeScreen,
} from '../screens/DriverSelectionScreens';
import { DriverConfirmationScreen } from '../screens/DriverConfirmationScreen';
import { DriverETAScreen } from '../screens/DriverETAScreen';
import { TrackRideScreen } from '../screens/TrackRideScreen';

const Stack = createNativeStackNavigator<HomeStackParamList>();

const SLIDE = { animation: 'slide_from_right' } as const;

export function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#000' },
        animation: 'fade',
      }}
    >
      {/* Root — no header (has its own inline header) */}
      <Stack.Screen name="ConciergeHome" component={ConciergeHomeScreen} />

      {/* Booking flow — each screen gets AppHeader via its own header option */}
      <Stack.Screen
        name="GuestDetails"
        component={GuestDetailsScreen}
        options={({ navigation }) => ({
          headerShown: true,
          header: () => (
            <AppHeader title="Guest Details" onBack={() => navigation.goBack()} />
          ),
          ...SLIDE,
        })}
      />
      <Stack.Screen
        name="ScheduleBooking"
        component={ScheduleBookingScreen}
        options={({ navigation }) => ({
          headerShown: true,
          header: () => (
            <AppHeader title="Schedule Ride" onBack={() => navigation.goBack()} />
          ),
          ...SLIDE,
        })}
      />
      <Stack.Screen
        name="WaitingForPayment"
        component={WaitingForPaymentScreen}
        options={({ navigation }) => ({
          headerShown: true,
          header: () => (
            <AppHeader title="Payment" onBack={() => navigation.goBack()} />
          ),
          ...SLIDE,
        })}
      />
      <Stack.Screen
        name="DriverMatching"
        component={DriverMatchingScreen}
        options={{ ...SLIDE }}
      />
      <Stack.Screen
        name="DriverAssignmentMode"
        component={DriverAssignmentModeScreen}
        options={({ navigation }) => ({
          headerShown: true,
          header: () => (
            <AppHeader title="Assign Driver" onBack={() => navigation.goBack()} />
          ),
          ...SLIDE,
        })}
      />
      <Stack.Screen
        name="DriverList"
        component={DriverListScreen}
        options={({ navigation }) => ({
          headerShown: true,
          header: () => (
            <AppHeader title="Select Driver" onBack={() => navigation.goBack()} />
          ),
          ...SLIDE,
        })}
      />
      <Stack.Screen
        name="DriverProfile"
        component={DriverProfileScreen}
        options={({ navigation }) => ({
          headerShown: true,
          header: () => (
            <AppHeader title="Driver Profile" onBack={() => navigation.goBack()} />
          ),
          ...SLIDE,
        })}
      />
      <Stack.Screen
        name="DriverSwipe"
        component={DriverSwipeScreen}
        options={({ navigation }) => ({
          headerShown: true,
          header: () => (
            <AppHeader title="Choose Driver" onBack={() => navigation.goBack()} />
          ),
          ...SLIDE,
        })}
      />
      <Stack.Screen
        name="DriverConfirmation"
        component={DriverConfirmationScreen}
        options={({ navigation }) => ({
          headerShown: true,
          header: () => (
            <AppHeader title="Confirm Driver" onBack={() => navigation.goBack()} />
          ),
          ...SLIDE,
        })}
      />
      <Stack.Screen
        name="DriverETA"
        component={DriverETAScreen}
        options={{ ...SLIDE }}
      />
      <Stack.Screen
        name="TrackRide"
        component={TrackRideScreen}
        options={({ navigation }) => ({
          headerShown: true,
          header: () => (
            <AppHeader title="Track Ride" onBack={() => navigation.goBack()} />
          ),
          ...SLIDE,
        })}
      />
    </Stack.Navigator>
  );
}
