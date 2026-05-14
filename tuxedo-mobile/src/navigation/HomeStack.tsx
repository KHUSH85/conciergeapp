import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeStackParamList } from './types';
import { AppHeader } from '../components/AppHeader';

import { ConciergeHomeScreen } from '../screens/ConciergeHomeScreen';
import { GuestDetailsScreen } from '../screens/GuestDetailsScreen';
import { ScheduleBookingScreen } from '../screens/ScheduleBookingScreen';
import { WaitingForPaymentScreen } from '../screens/WaitingForPaymentScreen';
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
      <Stack.Screen name="ConciergeHome" component={ConciergeHomeScreen} />

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
