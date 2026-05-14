import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RidesStackParamList } from './types';
import { AppHeader } from '../components/AppHeader';

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
      <Stack.Screen name="ActiveRide" component={ActiveRideScreen} />
      <Stack.Screen
        name="RideHistory"
        component={RideHistoryScreen}
        options={({ navigation }) => ({
          headerShown: true,
          header: () => (
            <AppHeader title="Ride History" onBack={() => navigation.goBack()} />
          ),
          animation: 'slide_from_right',
        })}
      />
      <Stack.Screen
        name="RideCompletion"
        component={RideCompletionScreen}
        options={({ navigation }) => ({
          headerShown: true,
          header: () => (
            <AppHeader title="Ride Complete" onBack={() => navigation.goBack()} />
          ),
          animation: 'slide_from_right',
        })}
      />
    </Stack.Navigator>
  );
}
