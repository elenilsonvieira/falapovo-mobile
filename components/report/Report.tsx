import React from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'
import { ThemedView } from '../ThemedView'

export type ReportProps = {
  message: string
  location: string
  category: string
  date: string
  image: string
  status: string
}

export type StatusColorProps = {
  [key: string]: string;
}

export const statusColors: StatusColorProps[] = [
  {'Em análise': '#ff0000'}, 
  {'Em andamento': '#0037f1'}, 
  {'Concluído': '#0ff100'}
]

export default function Report({ message, category, location, date, image, status }: ReportProps) {
  const color = statusColors.find(item => item[status])?.[status]
  
  return (
    <ThemedView style={styles.container}>
      <View style={styles.card}>
        {image ? (
          <Image source={{ uri: image }} style={styles.imagePreview} />
        ) : null}

        <View style={styles.content}>
          <Text style={styles.category}>#{category.toUpperCase()}</Text>

          <Text style={styles.message}>{message}</Text>

          <Text style={styles.info}>📍 {location}</Text>
          <Text style={styles.info}>📅 {date}</Text>
          <Text style={styles.status}>Status: <Text style={{color: `${color}`, fontWeight: 'bold'}}>{status}</Text></Text>
        </View>
      </View>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 24,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
        width: '100%',
        maxWidth: 700,
        overflow: 'hidden',
    },
    imagePreview: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
    },
    content: {
        padding: 16,
    },
    category: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#ff9900',
        marginBottom: 6,
    },
    message: {
        fontSize: 16,
        color: '#333',
        marginBottom: 12,
    },
    info: {
        fontSize: 13,
        color: '#666',
        marginBottom: 4,
    },
    status: {
      fontSize: 14,
      color: '#333'
  }
})