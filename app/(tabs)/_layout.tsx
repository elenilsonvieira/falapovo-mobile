import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAuth } from '../../lib/auth';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { user } = useAuth();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#000000',
        tabBarInactiveTintColor: '#4c5050',
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: { position: 'absolute' },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="home" 
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      
      {}
      <Tabs.Screen
        name="reportsList"
        options={{
          title: 'Relatos',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="chevron.right" color={color} />,
          href: user?.isAdmin ? null : '/reportsList',
        }}
      />
      
      <Tabs.Screen
        name="suportScreen"
        options={{
          title: 'Suporte',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="chevron.right" color={color} />,
          href: user?.isAdmin ? null : '/suportScreen',
        }}
      />
      
    </Tabs>
  );
}