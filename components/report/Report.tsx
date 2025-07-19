import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IReport } from '@/interfaces/IReport';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import ReportComments from './ReportComments';

interface ReportProps {
  report: IReport;
}

export default function Report({ report }: ReportProps) {
  return (
    <ThemedView style={styles.reportCard}>
      <ThemedText style={styles.reportCategory}>{report.category}</ThemedText>
      <ThemedText style={styles.reportMessage}>{report.message}</ThemedText>
      <ThemedText style={styles.reportLocation}>{report.location}</ThemedText>
      <View style={styles.statusContainer}>
        <ThemedText style={[styles.statusText, { color: getStatusColor(report.status) }]}>
          Status: {report.status}
        </ThemedText>
      </View>
      <ReportComments reportId={report.id.toString()} />
    </ThemedView>
  );
}

const getStatusColor = (status: string) => {
  if (status === 'Resolvido') return '#28a745';
  if (status === 'Em Andamento') return '#ffc107';
  return '#6c757d';
};

const styles = StyleSheet.create({
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
});