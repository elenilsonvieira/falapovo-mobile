import { useAuth } from '@/lib/auth';
import { Ionicons } from '@expo/vector-icons';
import { Drawer } from 'expo-router/drawer';

export default function AppLayout() {
  const { user } = useAuth();

  return (
    <Drawer
      screenOptions={{
        headerTintColor: '#333',
        drawerActiveTintColor: '#007bff',
        drawerLabelStyle: {
          marginLeft: 20,
        },
      }}
    >
      <Drawer.Screen
        name="(tabs)" 
        options={{
          drawerLabel: 'Início',
          title: 'FalaPovo',
          drawerIcon: ({ size, color }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="reportsList" 
        options={{
          drawerLabel: 'Ver Relatos',
          title: 'Relatos de Problemas',
          drawerIcon: ({ size, color }) => (
            <Ionicons name="list-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="suportScreen"
        options={{
          drawerLabel: 'Suporte',
          title: 'Suporte',
          drawerIcon: ({ size, color }) => (
            <Ionicons name="help-buoy-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="notifications" 
        options={{
          drawerLabel: 'Notificações',
          title: 'Notificações',
          drawerIcon: ({ size, color }) => (
            <Ionicons name="notifications-outline" size={size} color={color} />
          ),
          href: user?.isAnonymous ? null : '/notifications',
        }}
      />
      <Drawer.Screen
        name="profile"
        options={{
          drawerLabel: 'Meu Perfil',
          title: 'Meu Perfil',
          drawerIcon: ({ size, color }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
          href: user?.isAnonymous ? null : '/profile',
        }}
      />
      <Drawer.Screen
        name="admin"
        options={{
          drawerLabel: 'Painel Admin',
          title: 'Painel Administrativo',
          drawerIcon: ({ size, color }) => (
            <Ionicons name="cog-outline" size={size} color={color} />
          ),
          href: (user && !user.isAnonymous && user.isadmin) ? '/admin' : null,
        }}
      />
    </Drawer>
  );
}