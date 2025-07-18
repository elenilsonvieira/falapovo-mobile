import { useRouter } from 'expo-router';
import React from 'react';
import { Button, Pressable, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../../lib/auth';

export default function HomeScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo, {user?.name || 'Usuário'}!</Text>
      <Text style={styles.email}>{user?.email}</Text>
      
      <Pressable style={styles.button} onPress={() => router.push('/reportsList' as any)}>
        <Text style={styles.buttonText}>Ver Relatos de Problemas</Text>
      </Pressable>

      {}
      {}
      {user?.isAdmin && (
        <Pressable 
          style={[styles.button, styles.adminButton]} 
          onPress={() => router.push('/admin/dashboard' as any)}
        >
          <Text style={styles.buttonText}>Painel Administrativo</Text>
        </Pressable>
      )}

      <View style={styles.spacer} />

      <Button title="Sair (Logout)" onPress={logout} color="#f44336" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  email: {
    fontSize: 18,
    color: '#666',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    elevation: 3,
    marginTop: 10, 
    width: '80%',
    alignItems: 'center',
  },
 
  adminButton: {
    backgroundColor: '#6f42c1', 
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  spacer: {
    height: 20,
  }
});
