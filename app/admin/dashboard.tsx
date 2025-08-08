import AdminReportCard from "@/components/admin/AdminReportCard";
import RegionalSummary from "@/components/admin/RegionalSummary";
import { useAdminReports } from "@/hooks/useAdminReports";
import React, { useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type ViewMode = 'list' | 'summary' | 'archived';

export default function AdminDashboard() {
  
  const { isLoading, activeReports, archivedReports, handleUpdateStatus, onDelete, handleArchive } = useAdminReports();
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  if (isLoading) {
    return <ActivityIndicator size="large" style={styles.loader} />;
  }

  return (
    <View style={styles.container}>
      {}
      <View style={styles.toggleContainer}>
        <TouchableOpacity style={[styles.toggleButton, viewMode === 'list' && styles.toggleButtonActive]} onPress={() => setViewMode('list')}>
          <Text style={[styles.toggleText, viewMode === 'list' && styles.toggleTextActive]}>Ativas ({activeReports.length})</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.toggleButton, viewMode === 'summary' && styles.toggleButtonActive]} onPress={() => setViewMode('summary')}>
          <Text style={[styles.toggleText, viewMode === 'summary' && styles.toggleTextActive]}>Relatório</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.toggleButton, viewMode === 'archived' && styles.toggleButtonActive]} onPress={() => setViewMode('archived')}>
          <Text style={[styles.toggleText, viewMode === 'archived' && styles.toggleTextActive]}>Arquivadas ({archivedReports.length})</Text>
        </TouchableOpacity>
      </View>

      {}
      {viewMode === 'list' && (
        <FlatList
          data={activeReports}
          renderItem={({ item }) => <AdminReportCard report={item} onUpdateStatus={handleUpdateStatus} onDelete={onDelete} onArchive={handleArchive} />}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma denúncia ativa encontrada.</Text>}
        />
      )}
      {viewMode === 'summary' && <RegionalSummary reports={activeReports} />}
      {viewMode === 'archived' && (
        <FlatList
          data={archivedReports}
          renderItem={({ item }) => <AdminReportCard report={item} isArchived />}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma denúncia arquivada.</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0f2f5" },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  list: { padding: 16 },
  emptyText: { textAlign: "center", marginTop: 50, fontSize: 16, color: "gray" },
  toggleContainer: { flexDirection: 'row', justifyContent: 'space-around', padding: 10, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
  toggleButton: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, borderWidth: 1, borderColor: '#007bff' },
  toggleButtonActive: { backgroundColor: '#007bff' },
  toggleText: { color: '#007bff', fontWeight: '600', fontSize: 12 },
  toggleTextActive: { color: '#fff' },
});
