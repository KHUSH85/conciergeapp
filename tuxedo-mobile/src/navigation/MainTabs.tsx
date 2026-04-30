import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Car, Wallet, User } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

import { MainTabsParamList } from './types';
import { HomeStack } from './HomeStack';
import { RidesStack } from './RidesStack';
import { WalletStack } from './WalletStack';
import { ProfileStack } from './ProfileStack';

const GOLD     = '#D4AF37';
const INACTIVE = '#4B5563';
const TAB_BG   = '#0A0A0A';
const BORDER   = 'rgba(255,255,255,0.07)';

const Tab = createBottomTabNavigator<MainTabsParamList>();

function TabIcon({
  Icon,
  focused,
}: {
  Icon: React.ComponentType<{ color: string; size: number; strokeWidth: number }>;
  focused: boolean;
}) {
  return (
    <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
      <Icon
        color={focused ? GOLD : INACTIVE}
        size={22}
        strokeWidth={focused ? 2 : 1.5}
      />
    </View>
  );
}

export function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: GOLD,
        tabBarInactiveTintColor: INACTIVE,
        tabBarLabelStyle: styles.label,
        tabBarItemStyle: styles.tabItem,
        tabBarHideOnKeyboard: true,
      }}
      screenListeners={{
        tabPress: () => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ focused }: { focused: boolean }) => <TabIcon Icon={Home} focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Rides"
        component={RidesStack}
        options={{
          tabBarLabel: 'Rides',
          tabBarIcon: ({ focused }: { focused: boolean }) => <TabIcon Icon={Car} focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Wallet"
        component={WalletStack}
        options={{
          tabBarLabel: 'Wallet',
          tabBarIcon: ({ focused }: { focused: boolean }) => <TabIcon Icon={Wallet} focused={focused} />,
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStack}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ focused }: { focused: boolean }) => <TabIcon Icon={User} focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: TAB_BG,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: BORDER,
    height: Platform.OS === 'ios' ? 82 : 64,
    paddingBottom: Platform.OS === 'ios' ? 24 : 8,
    paddingTop: 8,
    elevation: 0,
    shadowOpacity: 0,
  },
  tabItem: {
    minHeight: 44,
    paddingVertical: 0,
  },
  label: {
    fontSize: 11,
    fontWeight: '500',
  },
  iconWrap: {
    width: 44,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  iconWrapActive: {
    backgroundColor: 'rgba(212,175,55,0.1)',
  },
});
