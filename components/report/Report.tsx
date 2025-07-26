import { ReportStatus } from '@/interfaces/IReport';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { ThemedView } from '../ThemedView';

export type ReportProps = {
  id: number;
  message: string;
  location: string;
  category: string;
  date: string;
  image: string;
  status: ReportStatus;
};

export const statusColors: Record<ReportStatus, string> = {
  'Em análise': '#dc3545', 
  'Em andamento': '#ffc107',
  'Concluído': '#28a745',
};

export default function Report({ message, category, location, date, image, status }: ReportProps) {
  const color = statusColors[status] || '#6c757d';

  return (
    <ThemedView style={styles.container}>
      <View style={styles.card}>
        {image ? <Image source={{ uri: image }} style={styles.imagePreview} /> : null}
        <View style={styles.content}>
          <View style={styles.header}>
            {}
            <Text style={styles.category}>
              #{category ? category.toUpperCase() : 'SEM CATEGORIA'}
            </Text>
            <Text style={[styles.status, { color, borderColor: color }]}>{status}</Text>
          </View>
          <Text style={styles.message}>{message}</Text>
          <Text style={styles.info}>📍 {location}</Text>
          <Text style={styles.info}>📅 {date}</Text>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%', alignItems: 'center', marginBottom: 24 },
  card: { backgroundColor: '#fff', borderRadius: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 4, width: '100%', maxWidth: 700, overflow: 'hidden' },
  imagePreview: { width: '100%', height: 200, resizeMode: 'cover' },
  content: { padding: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  category: { fontSize: 14, fontWeight: 'bold', color: '#ff9900' },
  status: { fontSize: 12, fontWeight: 'bold', borderWidth: 1, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2 },
  message: { fontSize: 16, color: '#333', marginBottom: 12 },
  info: { fontSize: 13, color: '#666', marginBottom: 4 },
});
