import { IReport, ReportPriority, ReportStatus } from "@/interfaces/IReport";
import { useAuth } from '@/lib/auth';
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ConfirmModal from "../ui/ConfirmModal";

const getStatusColor = (status: ReportStatus) => {
  if (status === "Concluído") return "#28a745";
  if (status === "Em andamento") return "#ffc107";
  return "#dc3545";
};

const getPriorityColor = (priority?: ReportPriority) => {
  switch (priority) {
    case 'Baixa':
      return '#6c757d';
    case 'Média':
      return '#17a2b8';
    case 'Alta':
      return '#ff9800';
    case 'Urgente':
      return '#dc3545';
    default:
      return '#e9ecef';
  }
};

interface AdminReportCardProps {
  report: IReport;
  isArchived?: boolean;
  onUpdateStatus: (id: number, status: ReportStatus) => void;
  onUpdatePriority: (id: number, priority: ReportPriority) => void;
  onDelete: (id: number) => any;
  onArchive: (report: IReport) => any;
}

export default function AdminReportCard({ report, isArchived = false, onUpdateStatus, onUpdatePriority, onDelete, onArchive }: AdminReportCardProps) {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [onConfirmAction, setOnConfirmAction] = useState<() => any>(() => () => {});
  const { user } = useAuth();
  const isAdmin = user && !user.isAnonymous && user.isadmin;

  const viewReportDetails = (id: number) => {
    router.push({ pathname: "/screens/showReport", params: { id: id.toString() } });
  };

  const openModal = (message: string, action: () => any) => {
    setModalMessage(message);
    setOnConfirmAction(() => action);
    setModalVisible(true);
  };

  return (
    <View style={styles.reportCard}>
      {report.image && <Image source={{ uri: report.image }} style={styles.reportImage} />}
      <View style={styles.cardContent}>
        <Text style={styles.reportCategory}>{report.category}</Text>
        <Text style={styles.reportMessage}>{report.message}</Text>
        <Text style={styles.reportLocation}>{report.adressLocation}</Text>
        <Text style={styles.reportDate}>Criado em: {report.createdAt}</Text>
        
        <View style={styles.statusAndPriorityContainer}>
          <Text style={[styles.statusText, { color: getStatusColor(report.status) }]}>Status: {report.status}</Text>
          {report.priority && (
            <Text style={[styles.priorityText, { color: getPriorityColor(report.priority) }]}>
              Prioridade: {report.priority}
            </Text>
          )}
        </View>

        {!isArchived && isAdmin && (
          <View style={styles.actionsContainer}>

            {/* A seção de prioridade agora usa uma coluna para o label */}
            <View style={styles.priorityActionsContainer}>
              <Text style={styles.priorityLabel}>Classificar como:</Text>
              <View style={styles.priorityButtonRow}>
                {['Urgente', 'Alta', 'Média', 'Baixa'].map(priority => (
                  <TouchableOpacity
                    key={priority}
                    style={[
                      styles.priorityActionButton,
                      { backgroundColor: getPriorityColor(priority as ReportPriority) },
                      report.priority === priority && styles.activePriorityButton,
                    ]}
                    onPress={() => onUpdatePriority(report.id, priority as ReportPriority)}
                  >
                    <Text style={styles.priorityActionText}>{priority}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.rowActions}>
              <TouchableOpacity style={styles.commentsButton} onPress={() => viewReportDetails(report.id)}>
                <Text style={styles.commentsButtonText}>Ver/Responder ({report.comments?.length || 0})</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteButton} onPress={() => openModal("Deseja excluir esta denúncia?", () => onDelete(report.id))}>
                <Text style={styles.deleteButtonText}>Excluir</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.statusActionsScrollView}>
              <TouchableOpacity style={styles.actionButton} onPress={() => onUpdateStatus(report.id, "Em análise")}>
                <Text style={styles.actionText}>Em Análise</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton} onPress={() => onUpdateStatus(report.id, "Em andamento")}>
                <Text style={styles.actionText}>Em Andamento</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton} onPress={() => onUpdateStatus(report.id, "Concluído")}>
                <Text style={styles.actionText}>Concluído</Text>
              </TouchableOpacity>
            </ScrollView>
            {report.status === 'Concluído' && onArchive && (
              <TouchableOpacity style={styles.archiveButton} onPress={() => openModal("Deseja arquivar esta denúncia?", () => onArchive(report))}>
                <Text style={styles.archiveButtonText}>Arquivar</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>

      <ConfirmModal
        visible={modalVisible}
        message={modalMessage}
        onConfirm={() => {
          onConfirmAction();
          setModalVisible(false);
        }}
        onCancel={() => setModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  reportCard: { backgroundColor: "#fff", borderRadius: 12, marginBottom: 16, elevation: 3, shadowColor: "#000", shadowOpacity: 0.1, shadowOffset: { width: 0, height: 2 }, shadowRadius: 5, overflow: "hidden" },
  reportImage: { width: "100%", height: 200 },
  cardContent: { padding: 16 },
  reportCategory: { fontSize: 16, fontWeight: "bold", color: "#007bff" },
  reportMessage: { fontSize: 14, color: "#333", marginVertical: 8 },
  reportLocation: { fontSize: 12, color: "#666", fontStyle: "italic" },
  reportDate: { fontSize: 12, color: "#666", fontStyle: "italic", marginTop: 4 },
  statusAndPriorityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    marginBottom: 12,
  },
  statusText: { fontSize: 14, fontWeight: "bold" },
  priorityText: { fontSize: 14, fontWeight: 'bold' },
  priorityActionsContainer: {
    marginBottom: 12,
  },
  priorityButtonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginTop: 8,
  },
  priorityLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 8,
  },
  priorityActionButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    marginRight: 5,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: 'transparent',
    backgroundColor: '#e9ecef',
    alignItems: 'center',
  },
  activePriorityButton: {
    borderColor: '#333',
    borderWidth: 2,
    opacity: 1,
  },
  priorityActionText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  actionsContainer: { flexDirection: "column", alignItems: "flex-start", marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: "#eee", gap: 12 },
  statusActionsScrollView: { flexDirection: "row", gap: 10 },
  actionButton: { backgroundColor: "#e9ecef", paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20 },
  actionText: { color: "#495057", fontSize: 12 },
  commentsButton: { backgroundColor: "#007bff", paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20, alignSelf: "flex-start" },
  commentsButtonText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  rowActions: { flexDirection: "row", alignItems: "center", gap: 10 },
  deleteButton: { backgroundColor: "#dc3545", paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20 },
  deleteButtonText: { color: "#fff", fontSize: 12, fontWeight: "bold" },
  archiveButton: { backgroundColor: '#ffc107', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20, marginTop: 10, alignSelf: 'flex-start' },
  archiveButtonText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
});