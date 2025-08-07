import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

import RemoveReport from "@/components/RemoveReport";
import { IReport, ReportStatus } from "@/interfaces/IReport";

export default function AdminDashboard() {
  const [reports, setReports] = useState<IReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      const fetchReports = async () => {
        try {
          setIsLoading(true);
          const data = await AsyncStorage.getItem("@FalaPovoApp:reports");
          const reportsData = data ? JSON.parse(data) : [];
          setReports(reportsData);
        } catch (error: any) {
          Alert.alert(
            "Erro",
            `Não foi possível carregar as denúncias: ${error.message}`
          );
        } finally {
          setIsLoading(false);
        }
      };
      fetchReports();
    }, [])
  );

  const handleUpdateStatus = async (id: number, status: ReportStatus) => {
    try {
      const data = await AsyncStorage.getItem("@FalaPovoApp:reports");
      let currentReports: IReport[] = data ? JSON.parse(data) : [];
      const updatedReports = currentReports.map((report) =>
        report.id === id ? { ...report, status } : report
      );
      await AsyncStorage.setItem(
        "@FalaPovoApp:reports",
        JSON.stringify(updatedReports)
      );
      setReports(updatedReports.slice());
    } catch (error: any) {
      Alert.alert(
        "Erro",
        `Não foi possível atualizar o status: ${error.message}`
      );
    }
  };

  const viewReportDetails = (id: number) => {
    router.push({
      pathname: "/screens/showReport",
      params: { id: id.toString() },
    });
  };

  const onDelete = async (id:number) => {
    const newReportList = await RemoveReport(id, reports, '@FalaPovoApp:reports')
    setReports(newReportList)
  }

  const renderReport = ({ item }: { item: IReport }) => (
    <View style={styles.reportCard}>
      {item.image && (
        <Image source={{ uri: item.image }} style={styles.reportImage} />
      )}
      <View style={styles.cardContent}>
        <Text style={styles.reportCategory}>{item.category}</Text>
        <Text style={styles.reportMessage}>{item.message}</Text>
        <Text style={styles.reportLocation}>{item.adressLocation}</Text>
        <View style={styles.statusContainer}>
          <Text
            style={[styles.statusText, { color: getStatusColor(item.status) }]}
          >
            Status: {item.status}
          </Text>
        </View>
        <View style={styles.actionsContainer}>
          <View style={styles.rowActions}>
            <TouchableOpacity
              style={styles.commentsButton}
              onPress={() => viewReportDetails(item.id)}
            >
              <Text style={styles.commentsButtonText}>
                Ver/Responder ({item.comments?.length || 0})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => {onDelete(item.id)}}
            >
              <Text style={styles.deleteButtonText}>Excluir</Text>
            </TouchableOpacity>
          </View>

          {}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.statusActionsScrollView}
          >
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleUpdateStatus(item.id, "Em análise")}
            >
              <Text style={styles.actionText}>Em Análise</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleUpdateStatus(item.id, "Em andamento")}
            >
              <Text style={styles.actionText}>Em Andamento</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleUpdateStatus(item.id, "Concluído")}
            >
              <Text style={styles.actionText}>Concluído</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
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
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhuma denúncia encontrada.</Text>
        }
      />
    </View>
  );
}

const getStatusColor = (status: ReportStatus) => {
  if (status === "Concluído") return "#28a745";
  if (status === "Em andamento") return "#ffc107";
  return "#dc3545";
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#f0f2f5" 
  },
  loader: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center" 
  },
  list: { 
    padding: 16 
  },
  reportCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    overflow: "hidden",
  },
  reportImage: { 
    width: "100%",
    height: 200 
  },
  cardContent: { 
    padding: 16 
  },
  reportCategory: { 
    fontSize: 16, 
    fontWeight: "bold", 
    color: "#007bff" 
  },
  reportMessage: { 
    fontSize: 14, 
    color: "#333", 
    marginVertical: 8 
  },
  reportLocation: { 
    fontSize: 12, 
    color: "#666", 
    fontStyle: "italic" },
  statusContainer: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 10,
  },
  statusText: { 
    fontSize: 14, 
    fontWeight: "bold"
  },
  actionsContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    gap: 12,
  },
  statusActionsScrollView: {
    flexDirection: "row",
    gap: 10,
  },
  actionButton: {
    backgroundColor: "#e9ecef",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  actionText: { 
    color: "#495057", 
    fontSize: 12 
  },
  commentsButton: {
    backgroundColor: "#007bff",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  commentsButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
    color: "gray",
  },
  rowActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  deleteButton: {
    backgroundColor: "#dc3545",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  editButton: {
    backgroundColor: "orange",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  editButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
});
