import { CustomToast } from '@/components/ui/CustomToast';
import { ToastProvider, useToast } from '@/contexts/ToastContext';
import { Stack, useRouter, useSegments } from 'expo-router';
import React, { useEffect } from 'react';
import { AuthProvider, useAuth } from '../lib/auth';

function RootLayoutNav() {
  const segments = useSegments();
  const router = useRouter();
  const { isAuthenticated, isLoadingAuth } = useAuth();
  const { toastState } = useToast();

  useEffect(() => {
    if (isLoadingAuth) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (isAuthenticated && inAuthGroup) {
      
      router.replace('/home' as any);
    } 
    else if (!isAuthenticated && !inAuthGroup) {
      router.replace('/login');
    }
  }, [isAuthenticated, isLoadingAuth, segments, router]); 

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(app)" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <CustomToast
        isVisible={toastState.isVisible}
        message={toastState.message}
        type={toastState.type}
      />
    </>
  );
}

export default function RootLayout() {
  return (
    <ToastProvider>
      <AuthProvider>
        <RootLayoutNav />
      </AuthProvider>
    </ToastProvider>
  );
}
