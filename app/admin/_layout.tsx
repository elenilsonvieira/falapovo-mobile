import { Stack } from 'expo-router';
import React from 'react';

export default function AdminLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="dashboard"
        options={{
          headerTitle: 'Painel Administrativo',
        }}
      />
    </Stack>
  );
}