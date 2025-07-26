import { Stack } from 'expo-router';
import React from 'react';

export default function AdminLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="dashboard"
        options={{
          headerShown: true,
          headerTitle: 'Painel Administrativo',
        }}
      />
    </Stack>
  );
}
