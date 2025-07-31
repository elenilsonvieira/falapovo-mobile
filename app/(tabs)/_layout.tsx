import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';


import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

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
          tabBarIcon: () => <IconSymbol size={28} name="house.fill" color={'black'} />,
        }}
      />
      {}
      <Tabs.Screen
        name="reportsList"
        options={{
          title: 'Relatos',
          
          tabBarIcon: () => <IconSymbol size={28} name="chevron.right" color={'black'} />,
        }}
      />
    </Tabs>
  );
}
