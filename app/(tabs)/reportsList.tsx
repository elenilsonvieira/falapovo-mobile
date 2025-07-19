import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useRouter } from 'expo-router';

import Report from '@/components/report/Report';
import { IReport } from '@/interfaces/IReport';
import { apiRequest } from '@/lib/apiService';
import { useAuth } from '@/lib/auth';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ReportsList() {
  const router = useRouter();
  const { user } = useAuth();
  const [reports, setReports] = useState<IReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const fetchReports = async () => {
        try {
          setIsLoading(true);
          const localData = await AsyncStorage.getItem('@FalaPovoApp:reports');
          let reportsData: IReport[] = localData ? JSON.parse(localData) : [];

          // Garante que cada relato tenha um array de comments
          reportsData = reportsData.map(report => ({
            ...report,
            comments: report.comments || [],
          }));

          // Tenta buscar da API se usuário for admin
          if (user?.isAdmin) {
            try {
              const apiReports = await apiRequest<IReport[]>('GET', '/api/admin/reports');
              reportsData = apiReports.map(report => ({
                ...report,
                comments: report.comments || [],
              }));
              await AsyncStorage.setItem('@FalaPovoApp:reports', JSON.stringify(reportsData));
            } catch (apiError) {
              console.error('Erro ao buscar da API:', apiError);
            }
          }

          setReports(reportsData);
        } catch (error: any) {
          console.error('Erro ao carregar denúncias:', error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchReports();
    }, [user])
  );

  if (isLoading) {
    return <ActivityIndicator size="large" style={styles.loader} />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={reports}
        renderItem={({ item }) => <Report report={item} />}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma denúncia encontrada.</Text>}
      />
      {/* Use router.push temporariamente até confirmar a rota correta */}
      <TouchableOpacity style={styles.fab} onPress={() => router.push('/reportForm' as any)}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
      {/* Quando confirmar a rota, substitua por:
      <Link href="/reportForm" asChild>
        <TouchableOpacity style={styles.fab}>
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      </Link>
      Substitua '/reportForm' pelo caminho correto, por exemplo, '/(main)/reportForm' se estiver em app/(main)/reportForm.tsx */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5' },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { padding: 16 },
  emptyText: { textAlign: 'center', marginTop: 50, fontSize: 16, color: 'gray' },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#007bff',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
  },
  fabText: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
});