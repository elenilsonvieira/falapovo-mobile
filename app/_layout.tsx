import { Stack, useRouter, useSegments } from 'expo-router';
import React, { useEffect } from 'react';
import { AuthProvider, useAuth } from '../lib/auth';

import { CustomToast } from '@/components/ui/CustomToast';
import { ToastProvider, useToast } from '@/contexts/ToastContext';

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
    } else if (!isAuthenticated && !inAuthGroup) {
      router.replace('/login' as any);
    }
  }, [isAuthenticated, isLoadingAuth, segments, router]); 

  return (
    <>
      <Stack>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="admin" options={{ headerShown: false }} />
        
        {}
        <Stack.Screen 
          name="profile" 
          options={{ 
            presentation: 'modal', 
            headerShown: false 
          }} 
        />
        
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
