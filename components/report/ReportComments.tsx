import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { apiRequest } from '@/lib/apiService';
import { useAuth } from '@/lib/auth';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface Comment {
  id: string;
  text: string;
  author: string;
  createdAt: string;
}

interface ReportCommentsProps {
  reportId: string;
}

const ReportComments: React.FC<ReportCommentsProps> = ({ reportId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchComments() {
      try {
        const response = await apiRequest<Comment[]>('GET', `/api/reports/${reportId}/comments`);
        setComments(response);
      } catch (error) {
        console.error('Erro ao carregar comentários:', error);
      }
    }
    fetchComments();
  }, [reportId]);

  const handleAddComment = async () => {
    if (!newComment.trim() || !user) return;

    setIsLoading(true);
    try {
      const response = await apiRequest<{ comment: Comment }>('POST', `/api/reports/${reportId}/comments`, {
        text: newComment,
        author: user.name || user.email,
      });
      setComments([...comments, response.comment]);
      setNewComment('');
    } catch (error: any) {
      console.error('Erro ao adicionar comentário:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Comentários</ThemedText>
      {comments.length === 0 ? (
        <ThemedText style={styles.noComments}>Nenhum comentário ainda.</ThemedText>
      ) : (
        <FlatList
          data={comments}
          renderItem={({ item }) => (
            <View style={styles.comment}>
              <ThemedText style={styles.commentAuthor}>{item.author}</ThemedText>
              <ThemedText>{item.text}</ThemedText>
              <ThemedText style={styles.commentDate}>
                {new Date(item.createdAt).toLocaleDateString()}
              </ThemedText>
            </View>
          )}
          keyExtractor={(item) => item.id}
        />
      )}
      {user && (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Adicione um comentário..."
            value={newComment}
            onChangeText={setNewComment}
            editable={!isLoading}
          />
          <TouchableOpacity
            style={[styles.submitButton, isLoading && styles.disabledButton]}
            onPress={handleAddComment}
            disabled={isLoading}
          >
            <Text style={styles.submitButtonText}>Enviar</Text>
          </TouchableOpacity>
        </View>
      )}
    </ThemedView>
  );
};

export default ReportComments;

const styles = StyleSheet.create({
  container: { marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#eee' },
  title: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  noComments: { fontStyle: 'italic', color: '#666', textAlign: 'center', marginVertical: 10 },
  comment: { paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#eee' },
  commentAuthor: { fontWeight: 'bold', fontSize: 14, color: '#333' },
  commentDate: { fontSize: 12, color: '#666', marginTop: 4 },
  inputContainer: { flexDirection: 'row', marginTop: 10, alignItems: 'center' },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
  submitButton: { backgroundColor: '#007bff', padding: 10, borderRadius: 5 },
  submitButtonText: { color: '#fff', fontWeight: 'bold' },
  disabledButton: { backgroundColor: '#aaa' },
});