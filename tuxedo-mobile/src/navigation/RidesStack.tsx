import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RidesStackParamList } from './types';
import { stackScreenOptions } from './stackHeader';

import { OpenRidesListScreen } from '../screens/OpenRidesListScreen';
import { ActiveRideScreen } from '../screens/ActiveRideScreen';
import { RideHistoryScreen } from '../screens/RideHistoryScreen';
import { RideCompletionScreen } from '../screens/RideCompletionScreen';

const Stack = createNativeStackNavigator<RidesStackParamList>();

export function RidesStack() {
  return (
    <Stack.Navigator
      initialRouteName="OpenRidesList"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#000' },
        animation: 'fade',
      }}
    >
      <Stack.Screen name="OpenRidesList" component={OpenRidesListScreen} />
      <Stack.Screen
        name="ActiveRide"
        component={ActiveRideScreen}
        options={({ navigation }) => stackScreenOptions('Active ride', navigation, 'Live trip status')}
      />
      <Stack.Screen
        name="RideHistory"
        component={RideHistoryScreen}
        options={({ navigation }) => stackScreenOptions('Ride history', navigation)}
      />
      <Stack.Screen
        name="RideCompletion"
        component={RideCompletionScreen}
        options={({ navigation }) => stackScreenOptions('Ride complete', navigation)}
      />
    </Stack.Navigator>
  );
}
