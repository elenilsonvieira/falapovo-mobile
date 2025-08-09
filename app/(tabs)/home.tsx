import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../lib/auth';

export default function HomeScreen() {
  const { user, } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      {}
      <TouchableOpacity
        style={[styles.profileIconContainer, { top: insets.top + 30 }]}
        onPress={() => router.push('/profile')}
        hitSlop={{ top: 30, bottom: 30, left: 30, right: 30 }}
      >
        {user?.photoUri ? (
          <Image source={{ uri: user.photoUri }} style={styles.profileImage} />
        ) : (
          <Ionicons name="person-circle" size={40} color="#555" />
        )}
      </TouchableOpacity>

      <Text style={styles.title}>Bem-vindo, {user?.name || 'Usuário'}!</Text>
      <Text style={styles.email}>{user?.email}</Text>

      {}
      {!user?.isAdmin && (
        <Pressable style={styles.button} onPress={() => router.push('/reportsList' as any)}>
          <Text style={styles.buttonText} numberOfLines={1} ellipsizeMode="tail">
            Ver Relatos de Problemas
          </Text>
        </Pressable>
      )}

      {}
      {user?.isAdmin && (
        <Pressable
          style={[styles.button, styles.adminButton]}
          onPress={() => router.push('/admin/dashboard' as any)}
        >
          <Text style={styles.buttonText} numberOfLines={1} ellipsizeMode="tail">
            Painel Administrativo
          </Text>
        </Pressable>
      )}

      <View style={styles.spacer} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#f5f5f5' },
  profileIconContainer: {
    position: 'absolute',
    right: 20,
    zIndex: 10,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' },
  email: { fontSize: 18, color: '#666', marginBottom: 40 },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    elevation: 3,
    marginTop: 10,
    minWidth: 280, 
    alignItems: 'center',
  },
  adminButton: { backgroundColor: '#6f42c1' },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  spacer: { height: 20 },
});
