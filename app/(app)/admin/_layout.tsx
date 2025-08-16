import RouteGuard from '@/components/auth/RouteGuard';
import { Stack } from 'expo-router';
import React from 'react';

export default function AdminLayout() {
  return (

    <RouteGuard adminOnly={true}>
      <Stack>
        <Stack.Screen
          name="dashboard"
          options={{
            headerTitle: 'Painel Administrativo',
          }}
        />
      </Stack>
    </RouteGuard>
  );
}