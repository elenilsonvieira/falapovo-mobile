import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { statusColors } from '@/components/report/Report';
import { ThemedView } from '@/components/ThemedView';
import { IComment } from '@/interfaces/IComment';
import { IReport } from '@/interfaces/IReport';
import { useAuth } from '@/lib/auth';


export default function ShowReportScreen() {
  const { id } = useLocalSearchParams();
  const { user } = useAuth();
  const [report, setReport] = useState<IReport | null>(null);
  const [comment, setComment] = useState('');

  const loadReportData = async (reportId: number) => {
    try {
      const data = await AsyncStorage.getItem('@FalaPovoApp:reports');
      const reports: IReport[] = data ? JSON.parse(data) : [];
      const selectedReport = reports.find(r => r.id === reportId);
      if (selectedReport) {
        setReport(selectedReport);
      }
    } catch (error) {
      console.error('Erro ao carregar relato:', error);
    }
  };

  useEffect(() => {
    if (id) {
      loadReportData(Number(id));
    }
  }, [id]);

  const sendComment = async () => {
    if (!comment.trim() || !report || !user) return;

    try {
      const data = await AsyncStorage.getItem('@FalaPovoApp:reports');
      const reports: IReport[] = data ? JSON.parse(data) : [];

      const newComment: IComment = {
        id: Date.now(),
        message: comment,
        author: user.name || user.email || 'Anónimo',
        createdAt: new Date().toLocaleDateString('pt-BR'),
        isReply: user.isAdmin,
      };

      const updatedReports = reports.map(r =>
        r.id === report.id
          ? { ...r, comments: [newComment, ...(r.comments || [])] }
          : r
      );

      await AsyncStorage.setItem('@FalaPovoApp:reports', JSON.stringify(updatedReports));
      setComment('');
      loadReportData(report.id);
    } catch (error) {
      console.error('Erro ao adicionar comentário:', error);
    }
  };
  
  if (!report) {
    return <View style={styles.container}><Text>A carregar relato...</Text></View>;
  }
  
  
  const color = statusColors[report.status as keyof typeof statusColors] || '#6c757d';

  return (
    <ThemedView style={styles.container}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollContent}
        enableOnAndroid
        extraScrollHeight={200}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Detalhes do Relato</Text>

          {report.image ? (
            <View style={styles.imageWrapper}>
              <Image source={{ uri: report.image }} style={styles.image} />
            </View>
          ) : null}

          <Text style={styles.cardLabel}>Descrição</Text>
          <Text style={styles.cardValue}>{report.message}</Text>

          <Text style={styles.cardLabel}>Localização</Text>
          <Text style={styles.cardValue}>{report.adressLocation}</Text>

          <Text style={styles.cardLabel}>Categoria</Text>
          <Text style={styles.cardBadge}>#{report.category.toUpperCase()}</Text>

          <Text style={styles.cardLabel}>Criado em</Text>
          <Text style={styles.cardValue}>{report.createdAt}</Text>

          <Text style={styles.cardLabel}>Status</Text>
          <Text style={[styles.cardValue, { color: color, fontWeight: 'bold' }]}>
            {report.status}
          </Text>
        </View>

        <Text style={styles.commentsTitle}>Discussão</Text>

        <View style={styles.commentInputRow}>
          <TextInput
            placeholder={user?.isAdmin ? "Responder como administrador..." : "Adicionar comentário..."}
            style={styles.inputComment}
            value={comment}
            onChangeText={setComment}
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendComment}>
            <Text style={styles.sendButtonText}>➤</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.commentsBox}>
          {report.comments && report.comments.length > 0 ? (
            report.comments.map((c) => (
              <View key={c.id} style={[styles.commentBubble, c.isReply && styles.replyBubble]}>
                <Text style={styles.commentAuthor}>{c.author} {c.isReply && '(Admin)'}</Text>
                <Text style={styles.commentText}>{c.message}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.noComments}>Nenhum comentário ainda.</Text>
          )}
        </View>
      </KeyboardAwareScrollView>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA', paddingHorizontal: 16, paddingBottom: 20 },
  scrollContent: { paddingBottom: 32 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 20, marginTop: 24, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 3 },
  cardTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 16, color: '#333' },
  cardLabel: { fontSize: 13, color: '#888', marginTop: 10 },
  cardValue: { fontSize: 16, color: '#444', marginTop: 4 },
  cardBadge: { backgroundColor: '#FFF3E0', color: '#E65100', alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, marginTop: 6, fontSize: 13, fontWeight: '600' },
  commentsTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 12 },
  commentsBox: { flexGrow: 1 },
  commentBubble: { alignSelf: 'flex-start', backgroundColor: '#E3F2FD', padding: 12, borderRadius: 16, marginBottom: 10, maxWidth: '85%' },
  replyBubble: { alignSelf: 'flex-end', backgroundColor: '#E8F5E9' },
  commentAuthor: { fontWeight: 'bold', marginBottom: 4, color: '#0d47a1'},
  commentText: { fontSize: 15, color: '#333' },
  noComments: { fontStyle: 'italic', color: '#999', fontSize: 16 },
  commentInputRow: { flexDirection: 'row', alignItems: 'center', paddingBottom: 20, gap: 10 },
  inputComment: { flex: 1, backgroundColor: '#fff', borderRadius: 20, paddingVertical: 10, paddingHorizontal: 16, fontSize: 15, borderWidth: 1, borderColor: '#ddd' },
  sendButton: { backgroundColor: '#2196F3', width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', elevation: 2 },
  sendButtonText: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  imageWrapper: { marginBottom: 16, overflow: 'hidden', borderRadius: 12 },
  image: { width: '100%', height: 200, resizeMode: 'cover', borderRadius: 12 },
});
