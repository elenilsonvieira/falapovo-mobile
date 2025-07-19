import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IReport } from '@/interfaces/IReport';
import { apiRequest } from '@/lib/apiService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Dashboard() {
  const [reports, setReports] = useState<IReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const fetchReports = async () => {
        try {
          setIsLoading(true);
          const localData = await AsyncStorage.getItem('@FalaPovoApp:reports');
          let reportsData: IReport[] = localData ? JSON.parse(localData) : [];

          // Garante que cada relato tenha comments
          reportsData = reportsData.map(report => ({
            ...report,
            comments: report.comments || [],
          }));

          // Busca da API para administradores
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

          setReports(reportsData);
        } catch (error: any) {
          Alert.alert('Erro', `Não foi possível carregar as denúncias: ${error.message}`);
        } finally {
          setIsLoading(false);
        }
      };

      fetchReports();
    }, [])
  );

  const handleUpdateStatus = async (id: number, status: IReport['status']) => {
    try {
      await apiRequest('PATCH', `/api/reports/${id}/status`, { status });
      const data = await AsyncStorage.getItem('@FalaPovoApp:reports');
      let currentReports: IReport[] = data ? JSON.parse(data) : [];

      const updatedReports = currentReports.map(report =>
        report.id === id ? { ...report, status } : report
      );

      await AsyncStorage.setItem('@FalaPovoApp:reports', JSON.stringify(updatedReports));
      setReports(updatedReports);
    } catch (error: any) {
      Alert.alert('Erro', `Não foi possível atualizar o status: ${error.message}`);
    }
  };

  const renderReport = ({ item }: { item: IReport }) => (
    <ThemedView style={styles.reportCard}>
      <ThemedText style={styles.reportCategory}>{item.category}</ThemedText>
      <ThemedText style={styles.reportMessage}>{item.message}</ThemedText>
      <ThemedText style={styles.reportLocation}>{item.location}</ThemedText>
      <View style={styles.statusContainer}>
        <ThemedText style={[styles.statusText, { color: getStatusColor(item.status) }]}>
          Status: {item.status}
        </ThemedText>
      </View>
      <View style={styles.commentsContainer}>
        <ThemedText style={styles.commentsTitle}>Comentários</ThemedText>
        {item.comments.length === 0 ? (
          <ThemedText style={styles.noComments}>Nenhum comentário ainda.</ThemedText>
        ) : (
          item.comments.map(comment => (
            <View key={comment.id} style={styles.comment}>
              <ThemedText style={styles.commentAuthor}>{comment.author}</ThemedText>
              <ThemedText>{comment.text}</ThemedText>
              <ThemedText style={styles.commentDate}>
                {new Date(comment.createdAt).toLocaleDateString()}
              </ThemedText>
            </View>
          ))
        )}
      </View>
      <View style={styles.buttonContainer}>
        {item.status !== 'Em Andamento' && (
          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#ffc107' }]}
            onPress={() => handleUpdateStatus(item.id, 'Em Andamento')}
          >
            <Text style={styles.buttonText}>Marcar como Em Andamento</Text>
          </TouchableOpacity>
        )}
        {item.status !== 'Resolvido' && (
          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#28a745' }]}
            onPress={() => handleUpdateStatus(item.id, 'Resolvido')}
          >
            <Text style={styles.buttonText}>Marcar como Resolvido</Text>
          </TouchableOpacity>
        )}
      </View>
    </ThemedView>
  );

  const getStatusColor = (status: string) => {
    if (status === 'Resolvido') return '#28a745';
    if (status === 'Em Andamento') return '#ffc107';
    return '#6c757d';
  };

  if (isLoading) {
    return <ActivityIndicator size="large" style={styles.loader} />;
  }

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={reports}
        renderItem={renderReport}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma denúncia encontrada.</Text>}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5' },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { padding: 16 },
  emptyText: { textAlign: 'center', marginTop: 50, fontSize: 16, color: 'gray' },
  reportCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
  },
  reportCategory: { fontSize: 16, fontWeight: 'bold', color: '#007bff' },
  reportMessage: { fontSize: 14, color: '#333', marginVertical: 8 },
  reportLocation: { fontSize: 12, color: '#666', fontStyle: 'italic' },
  statusContainer: { marginTop: 10, borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 10 },
  statusText: { fontSize: 14, fontWeight: 'bold' },
  commentsContainer: { marginTop: 10, borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 10 },
  commentsTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  noComments: { fontStyle: 'italic', color: '#666', textAlign: 'center', marginVertical: 10 },
  comment: { paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#eee' },
  commentAuthor: { fontWeight: 'bold', fontSize: 14, color: '#333' },
  commentDate: { fontSize: 12, color: '#666', marginTop: 4 },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  button: { padding: 10, borderRadius: 5, flex: 1, marginHorizontal: 5, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});