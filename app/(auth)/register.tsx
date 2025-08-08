import { useToast } from '@/contexts/ToastContext';
import { zodResolver } from '@hookform/resolvers/zod';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ActivityIndicator, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { z } from 'zod';

const USERS_STORAGE_KEY = '@FalaPovoApp:users';

const registerSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Senhas não coincidem',
  path: ['confirmPassword'],
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { showToast } = useToast(); 

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  React.useEffect(() => {
    register('name');
    register('email');
    register('password');
    register('confirmPassword');
  }, [register]);

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    try {
      const existingUsersData = await AsyncStorage.getItem(USERS_STORAGE_KEY);
      const existingUsers = existingUsersData ? JSON.parse(existingUsersData) : [];
      const isEmailInUse = existingUsers.some((user: any) => user.email.toLowerCase() === data.email.toLowerCase());
      if (isEmailInUse) {
        throw new Error('Email já está em uso');
      }
      const newUser = { id: `user-${Date.now()}`, name: data.name, email: data.email, password: data.password, isAdmin: false };
      const updatedUsers = [...existingUsers, newUser];
      await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
      showToast('Cadastro realizado com sucesso!', 'success'); 
      router.replace('/login' as any);
    } catch (error: any) {
      showToast(error.message || 'Erro ao cadastrar usuário', 'error'); 
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>FalaPovo - Cadastro</Text>
      <Text style={styles.subtitle}>Crie sua conta para acessar o sistema</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Nome Completo</Text>
        <TextInput
          style={[styles.input, errors.name && styles.inputError]}
          placeholder="Seu nome completo"
          onChangeText={(text) => setValue('name', text)}
        />
        {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}
      </View>

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

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Confirmar Senha</Text>
        <TextInput
          style={[styles.input, errors.confirmPassword && styles.inputError]}
          placeholder="Confirme sua senha"
          secureTextEntry
          onChangeText={(text) => setValue('confirmPassword', text)}
        />
        {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>}
      </View>

      <Button
        title={isLoading ? 'Cadastrando...' : 'Cadastrar'}
        onPress={handleSubmit(onSubmit)}
        disabled={isLoading}
      />
      {isLoading && <ActivityIndicator style={styles.spinner} size="small" color="#0000ff" />}

      <View style={styles.registerContainer}>
        <Text style={styles.registerText}>Já tem conta? </Text>
        <Button
          title="Faça login"
          onPress={() => router.push('/login' as any)} 
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
