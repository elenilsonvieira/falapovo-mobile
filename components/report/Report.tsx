import React from 'react'
import { StyleSheet, Text, View, Image } from 'react-native'
import { ThemedView } from '../ThemedView'

export type ReportProps = {
  message: string
  location: string
  category: string
  date: string
  image: string
}

export default function Report({ message, category, location, date, image }: ReportProps) {
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
})
  