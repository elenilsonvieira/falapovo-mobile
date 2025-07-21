import AsyncStorage from '@react-native-async-storage/async-storage'
import { useEffect, useState } from 'react'
import {
  Image, StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { ThemedView } from '@/components/ThemedView'
import { IComment } from '@/interfaces/IComment'
import { IReport } from '@/interfaces/IReport'

import { statusColors } from '@/components/report/Report'
import { useLocalSearchParams } from 'expo-router'

export default function ReportForm() {
  const { id } = useLocalSearchParams()
  const [message, setMessage] = useState('')
  const [location, setLocation] = useState('')
  const [comment, setComment] = useState('')
  const [comments, setComments] = useState<IComment[]>([])
  const [category, setCategory] = useState('')
  const [image, setImage] = useState('')
  const [createdAt, setCreatedAt] = useState('')
  const [status, setStatus] = useState('')

  const color = statusColors.find(item => item[status])?.[status]

  useEffect(() => {
    if (id) {
      loadReportData(Number(id))
    }
  }, [id])

  const loadReportData = async (id: number) => {
    try {
      const data = await AsyncStorage.getItem('@FalaPovoApp:reports')
      const reports: IReport[] = data ? JSON.parse(data) : []
      const selectedReport = reports.find(report => report.id === id)
      if (selectedReport) {
        setMessage(selectedReport.message)
        setCategory(selectedReport.category)
        setLocation(selectedReport.location)
        setComments(selectedReport.comments || [])
        setImage(selectedReport.image)
        setCreatedAt(selectedReport.createdAt)
        setStatus(selectedReport.status)
      }
    } catch (error) {
      console.error('Erro ao carregar relato:', error)
    }
  }

  const sendComment = async () => {
    if (!comment) return

    try {
      const data = await AsyncStorage.getItem('@FalaPovoApp:reports')
      const reports: IReport[] = data ? JSON.parse(data) : []

      const newComment: IComment = {
        id: Math.floor(Math.random() * 100000),
        message: comment,
      }

      const updatedReports = reports.map(report =>
        report.id === Number(id)
          ? {
              ...report,
              comments: [newComment, ...(report.comments || [])],
            }
          : report
      )

      await AsyncStorage.setItem('@FalaPovoApp:reports', JSON.stringify(updatedReports))
      setComment('')
      loadReportData(Number(id))
    } catch (error) {
      console.error('Erro ao adicionar comentário:', error)
    }
  }

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

          {image ? (
            <View style={styles.imageWrapper}>
              <Image source={{ uri: image }} style={styles.image} />
            </View>
          ) : null}

          <Text style={styles.cardLabel}>Descrição</Text>
          <Text style={styles.cardValue}>{message}</Text>

          <Text style={styles.cardLabel}>Localização</Text>
          <Text style={styles.cardValue}>{location}</Text>

          <Text style={styles.cardLabel}>Categoria</Text>
          <Text style={styles.cardBadge}>#{category.toUpperCase()}</Text>

          <Text style={styles.cardLabel}>Criado em</Text>
          <Text style={styles.cardValue}>{createdAt}</Text>

          <Text style={styles.cardLabel}>Status</Text>
          <Text style={styles.cardValue}>
            <Text style={{ color: color }}>{status}</Text>
          </Text>
        </View>

        <Text style={styles.commentsTitle}>Comentários</Text>

        <View style={styles.commentInputRow}>
          <TextInput
            placeholder="Adicionar comentário..."
            style={styles.inputComment}
            value={comment}
            onChangeText={setComment}
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendComment}>
            <Text style={styles.sendButtonText}>➤</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.commentsBox}>
          {comments.length > 0 ? (
            comments.map((c) => (
              <View key={c.id} style={styles.commentBubble}>
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
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginTop: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  cardLabel: {
    fontSize: 13,
    color: '#888',
    marginTop: 10,
  },
  cardValue: {
    fontSize: 16,
    color: '#444',
    marginTop: 4,
  },
  cardBadge: {
    backgroundColor: '#FFF3E0',
    color: '#E65100',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 6,
    fontSize: 13,
    fontWeight: '600',
  },
  commentsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  commentsBox: {
    flexGrow: 1,
  },
  commentBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#E3F2FD',
    padding: 12,
    borderRadius: 16,
    marginBottom: 10,
    maxWidth: '85%',
  },
  commentText: {
    fontSize: 15,
    color: '#333',
  },
  noComments: {
    fontStyle: 'italic',
    color: '#999',
    fontSize: 16
  },
  commentInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    // paddingHorizontal: 16,
    paddingBottom: 40,
    // borderTopWidth: 1,
    // borderColor: '#eee',
    // backgroundColor: '#fff',
    gap: 10,
  },
  inputComment: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  sendButton: {
    backgroundColor: '#2196F3',
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  imageWrapper: {
    marginBottom: 16,
    overflow: 'hidden',
    borderRadius: 12,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderRadius: 12,
  },
  
})
