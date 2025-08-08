import { IReport } from "@/interfaces/IReport";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

type RegionalSummaryData = {
  [region: string]: number;
};

interface RegionalSummaryProps {
  reports: IReport[];
}

export default function RegionalSummary({ reports }: RegionalSummaryProps) {
  const processSummary = (): RegionalSummaryData => {
    const summaryData: RegionalSummaryData = {};
    reports.forEach(report => {
      if (report.adressLocation) {
        const parts = report.adressLocation.split(' - ');
        const addressParts = parts[0].split(',');
        const region = addressParts.length > 1 ? addressParts[1].trim() : (addressParts[0] || 'Região Desconhecida');
        summaryData[region] = (summaryData[region] || 0) + 1;
      }
    });
    return summaryData;
  };

  const summary = processSummary();

  return (
    <ScrollView contentContainerStyle={styles.summaryContainer}>
      <Text style={styles.summaryTitle}>Denúncias por Região</Text>
      {Object.keys(summary).length > 0 ? (
        Object.entries(summary).map(([region, count]) => (
          <View key={region} style={styles.summaryItem}>
            <Text style={styles.summaryRegion}>{region}</Text>
            <Text style={styles.summaryCount}>{count} {count > 1 ? 'denúncias' : 'denúncia'}</Text>
          </View>
        ))
      ) : (
        <Text style={styles.emptyText}>Nenhuma denúncia para gerar relatório.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  summaryContainer: { padding: 16 },
  summaryTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#333' },
  summaryItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#eee', backgroundColor: '#fff', paddingHorizontal: 16, borderRadius: 8, marginBottom: 8 },
  summaryRegion: { fontSize: 16, color: '#333', fontWeight: '500' },
  summaryCount: { fontSize: 16, fontWeight: 'bold', color: '#007bff' },
  emptyText: { textAlign: "center", marginTop: 50, fontSize: 16, color: "gray" },
});