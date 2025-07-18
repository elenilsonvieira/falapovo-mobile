import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface AdminReport {
  id: number;
  message: string;
  category: string;
  location: string;
  status: 'Recebido' | 'Em Andamento' | 'Resolvido';
}

export default function AdminDashboard() {
  const [reports, setReports] = useState<AdminReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const fetchReports = async () => {
        try {
          setIsLoading(true);
          const data = await AsyncStorage.getItem('@FalaPovoApp:reports');
          const reportsData = data ? JSON.parse(data) : [];
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

  const handleUpdateStatus = async (id: number, status: AdminReport['status']) => {
    try {
      const data = await AsyncStorage.getItem('@FalaPovoApp:reports');
      let currentReports: AdminReport[] = data ? JSON.parse(data) : [];

      const updatedReports = currentReports.map(report =>
        report.id === id ? { ...report, status } : report
      );

      await AsyncStorage.setItem('@FalaPovoApp:reports', JSON.stringify(updatedReports));
      setReports(updatedReports);
    } catch (error: any) {
      Alert.alert('Erro', `Não foi possível atualizar o status: ${error.message}`);
    }
  };

  const renderReport = ({ item }: { item: AdminReport }) => (
    <View style={styles.reportCard}>
      <Text style={styles.reportCategory}>{item.category}</Text>
      <Text style={styles.reportMessage}>{item.message}</Text>
      <Text style={styles.reportLocation}>{item.location}</Text>
      <View style={styles.statusContainer}>
        <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
          Status: {item.status}
        </Text>
      </View>
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={() => handleUpdateStatus(item.id, 'Em Andamento')}>
          <Text style={styles.actionText}>Em Andamento</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => handleUpdateStatus(item.id, 'Resolvido')}>
          <Text style={styles.actionText}>Resolver</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (isLoading) {
    return <ActivityIndicator size="large" style={styles.loader} />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={reports}
        renderItem={renderReport}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma denúncia encontrada.</Text>}
      />
    </View>
  );
}

const getStatusColor = (status: AdminReport['status']) => {
  if (status === 'Resolvido') return '#28a745';
  if (status === 'Em Andamento') return '#ffc107';
  return '#6c757d';
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5' },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { padding: 16 },
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
  actionsContainer: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 12 },
  actionButton: { backgroundColor: '#e9ecef', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20 },
  actionText: { color: '#495057', fontSize: 12 },
  emptyText: { textAlign: 'center', marginTop: 50, fontSize: 16, color: 'gray' },
});
