import { useToast } from '@/contexts/ToastContext';
import { useAuth } from '@/lib/auth';
import { Redirect } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';


const UnauthorizedRedirect = ({ message }: { message: string }) => {
  const { showToast } = useToast();

  useEffect(() => {
    showToast(message, 'error');
  }, [showToast, message]);

  return <Redirect href="/login" />;
};

type GuardProps = {
  children: React.ReactNode;
  adminOnly?: boolean;
  registeredOnly?: boolean;
};

export default function RouteGuard({ children, adminOnly = false, registeredOnly = false }: GuardProps) {
  const { user, isLoadingAuth } = useAuth();

  if (isLoadingAuth) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  
  if (registeredOnly && user?.isAnonymous) {
    return <UnauthorizedRedirect message="Você precisa de uma conta para aceder a esta página." />;
  }
  
  if (adminOnly && user && !user.isAdmin) {
    return <UnauthorizedRedirect message="Você não tem permissão para aceder a esta página." />;
  }

  
  return <>{children}</>;
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
