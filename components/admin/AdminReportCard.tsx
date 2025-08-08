import { IReport, ReportStatus } from "@/interfaces/IReport";
import { useRouter } from "expo-router";
import React from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";


const getStatusColor = (status: ReportStatus) => {
  if (status === "Concluído") return "#28a745";
  if (status === "Em andamento") return "#ffc107";
  return "#dc3545";
};

interface AdminReportCardProps {
  report: IReport;
  isArchived?: boolean;
  onUpdateStatus?: (id: number, status: ReportStatus) => void;
  onDelete?: (id: number) => void;
  onArchive?: (report: IReport) => void;
}

export default function AdminReportCard({ report, isArchived = false, onUpdateStatus, onDelete, onArchive }: AdminReportCardProps) {
  const router = useRouter();
  const viewReportDetails = (id: number) => {
    router.push({ pathname: "/screens/showReport", params: { id: id.toString() } });
  };

  return (
     <View style={styles.reportCard}>
      {report.image && <Image source={{ uri: report.image }} style={styles.reportImage} />}
      <View style={styles.cardContent}>
        <Text style={styles.reportCategory}>{report.category}</Text>
        <Text style={styles.reportMessage}>{report.message}</Text>
        <Text style={styles.reportLocation}>{report.adressLocation}</Text>
        <View style={styles.statusContainer}>
          <Text style={[styles.statusText, { color: getStatusColor(report.status) }]}>Status: {report.status}</Text>
        </View>
        
        {!isArchived && (
          <View style={styles.actionsContainer}>
            <View style={styles.rowActions}>
              <TouchableOpacity style={styles.commentsButton} onPress={() => viewReportDetails(report.id)}>
                <Text style={styles.commentsButtonText}>Ver/Responder ({report.comments?.length || 0})</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteButton} onPress={() => onDelete?.(report.id)}>
                <Text style={styles.deleteButtonText}>Excluir</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.statusActionsScrollView}>
              <TouchableOpacity style={styles.actionButton} onPress={() => onUpdateStatus?.(report.id, "Em análise")}>
                <Text style={styles.actionText}>Em Análise</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton} onPress={() => onUpdateStatus?.(report.id, "Em andamento")}>
                <Text style={styles.actionText}>Em Andamento</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton} onPress={() => onUpdateStatus?.(report.id, "Concluído")}>
                <Text style={styles.actionText}>Concluído</Text>
              </TouchableOpacity>
            </ScrollView>
            {report.status === 'Concluído' && onArchive && (
              <TouchableOpacity style={styles.archiveButton} onPress={() => onArchive(report)}>
                <Text style={styles.archiveButtonText}>Arquivar</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
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
  statusContainer: { marginTop: 10, borderTopWidth: 1, borderTopColor: "#eee", paddingTop: 10 },
  statusText: { fontSize: 14, fontWeight: "bold" },
  actionsContainer: { flexDirection: "column", alignItems: "flex-start", marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: "#eee", gap: 12 },
  statusActionsScrollView: { flexDirection: "row", gap: 10 },
  actionButton: { backgroundColor: "#e9ecef", paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20 },
  actionText: { color: "#495057", fontSize: 12 },
  commentsButton: { backgroundColor: "#007bff", paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20, alignSelf: "flex-start" },
  commentsButtonText: { color: "#fff", fontSize: 12, fontWeight: "bold" },
  rowActions: { flexDirection: "row", alignItems: "center", gap: 10 },
  deleteButton: { backgroundColor: "#dc3545", paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20 },
  deleteButtonText: { color: "#fff", fontSize: 12, fontWeight: "bold" },
  archiveButton: { backgroundColor: '#ffc107', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20, marginTop: 10, alignSelf: 'flex-start' },
  archiveButtonText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
});
