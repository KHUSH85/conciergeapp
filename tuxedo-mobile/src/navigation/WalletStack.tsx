import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { WalletStackParamList } from './types';
import { stackScreenOptions } from './stackHeader';

import { CommissionWalletScreen } from '../screens/CommissionWalletScreen';
import { MembershipScreen, MembershipPaymentScreen } from '../screens/MembershipScreens';

const Stack = createNativeStackNavigator<WalletStackParamList>();

export function WalletStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#000' },
        animation: 'fade',
      }}
    >
      <Stack.Screen name="CommissionWallet" component={CommissionWalletScreen} />
      <Stack.Screen
        name="Membership"
        component={MembershipScreen}
        options={({ navigation }) => stackScreenOptions('Membership', navigation)}
      />
      <Stack.Screen
        name="MembershipPayment"
        component={MembershipPaymentScreen}
        options={({ navigation }) => stackScreenOptions('Membership payment', navigation)}
      />
    </Stack.Navigator>
  );
}
