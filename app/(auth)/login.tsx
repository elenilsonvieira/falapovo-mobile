import { zodResolver } from '@hookform/resolvers/zod';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ActivityIndicator, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { z } from 'zod';

import { useToast } from '@/contexts/ToastContext'; // Nosso hook de toast
import { useAuth } from '../../lib/auth';

const USERS_STORAGE_KEY = '@FalaPovoApp:users';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const { login } = useAuth();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  React.useEffect(() => {
    register('email');
    register('password');
  }, [register]);

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      const existingUsersData = await AsyncStorage.getItem(USERS_STORAGE_KEY);
      const existingUsers = existingUsersData ? JSON.parse(existingUsersData) : [];
      const adminExists = existingUsers.some((user: any) => user.email === 'admin@falapovo.com');
      if (!adminExists) {
        existingUsers.push({ id: 'admin-01', name: 'Administrador', email: 'admin@falapovo.com', password: '123456', isAdmin: true });
        await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(existingUsers));
      }
      const user = existingUsers.find((u: any) => u.email.toLowerCase() === data.email.toLowerCase());
      if (!user || user.password !== data.password) {
        throw new Error('Email ou senha inválidos.');
      }
      login(user);
      showToast('Login realizado com sucesso!', 'success');
    } catch (error: any) {
      showToast(error.message || 'Ocorreu um erro desconhecido.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // NOVO: função para login anônimo
  const onAnonymousLogin = () => {
    const anonymousUser = {
      id: `anonymous-session-${Date.now()}`,
      name: 'Usuário Anônimo',
      email: null,
      isAdmin: false,
      isAnonymous: true, // sinaliza que é anônimo
    };
    login(anonymousUser);
    showToast('Entrou como anônimo!', 'success');

    router.replace('/(tabs)/home' as any); // redireciona pra home
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>FalaPovo - Login</Text>
      <Text style={styles.subtitle}>Sistema de Notificação de Problemas na Cidade</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={[styles.input, errors.email && styles.inputError]}
          placeholder="seu@email.com"
          keyboardType="email-address"
          autoCapitalize="none"
          onChangeText={(text) => setValue('email', text)}
        />
        {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Senha</Text>
        <TextInput
          style={[styles.input, errors.password && styles.inputError]}
          placeholder="Digite sua senha"
          secureTextEntry
          onChangeText={(text) => setValue('password', text)}
        />
        {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}
      </View>

      <Button
        title={isLoading ? 'Entrando...' : 'Entrar'}
        onPress={handleSubmit(onSubmit)}
        disabled={isLoading}
      />
      {isLoading && <ActivityIndicator style={styles.spinner} size="small" color="#0000ff" />}

      <View style={{ marginVertical: 10 }}>
        <Button
          title="Continuar como Anônimo"
          onPress={onAnonymousLogin}
          color="#888"
        />
      </View>

      <View style={styles.registerContainer}>
        <Text style={styles.registerText}>Não tem conta? </Text>
        <Button
          title="Cadastre-se"
          onPress={() => router.push('/register' as any)}
          color="#007bff"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#f5f5f5' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 8, textAlign: 'center', color: '#333' },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 30, textAlign: 'center' },
  inputGroup: { marginBottom: 15 },
  label: { fontSize: 16, marginBottom: 5, color: '#333' },
  input: { height: 45, borderColor: '#ddd', borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, backgroundColor: '#fff', fontSize: 16 },
  inputError: { borderColor: 'red' },
  errorText: { color: 'red', fontSize: 12, marginTop: 5 },
  spinner: { marginTop: 10 },
  registerContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 20 },
  registerText: { fontSize: 14, color: '#666' },
});
