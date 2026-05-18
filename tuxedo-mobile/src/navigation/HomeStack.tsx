import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeStackParamList } from './types';
import { stackScreenOptions } from './stackHeader';

import { ConciergeHomeScreen } from '../screens/ConciergeHomeScreen';
import { GuestDetailsScreen } from '../screens/GuestDetailsScreen';
import { ScheduleBookingScreen } from '../screens/ScheduleBookingScreen';
import { WaitingForPaymentScreen } from '../screens/WaitingForPaymentScreen';
import { TrackRideScreen } from '../screens/TrackRideScreen';

const Stack = createNativeStackNavigator<HomeStackParamList>();

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
        options={({ navigation }) => stackScreenOptions('Guest details', navigation, 'Book for your guest')}
      />
      <Stack.Screen
        name="ScheduleBooking"
        component={ScheduleBookingScreen}
        options={({ navigation }) => stackScreenOptions('Schedule ride', navigation)}
      />
      <Stack.Screen
        name="WaitingForPayment"
        component={WaitingForPaymentScreen}
        options={({ navigation }) => stackScreenOptions('Awaiting payment', navigation)}
      />
      <Stack.Screen
        name="TrackRide"
        component={TrackRideScreen}
        options={({ navigation }) => stackScreenOptions('Track ride', navigation)}
      />
    </Stack.Navigator>
  );
}
