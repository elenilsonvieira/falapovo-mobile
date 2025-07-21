import * as ImagePicker from 'expo-image-picker'
import { useState } from 'react'
import { Image, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import DropDownPicker from 'react-native-dropdown-picker'

import { ThemedView } from '@/components/ThemedView'
import { IComment } from '@/interfaces/IComment'
import { IReport } from '@/interfaces/IReport'

import AsyncStorage from '@react-native-async-storage/async-storage'
import { router } from 'expo-router'

export default function ReportForm() {
  const [message, setMessage] = useState('')
  const [location, setLocation] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [photoUri, setPhotoUri] = useState<string | null>(null)

  const [open, setOpen] = useState(false)
  const [items, setItems] = useState([
    { label: 'Buraco', value: 'Buraco' },
    { label: 'Obra', value: 'Obra' },
  ])

  const getCurrentDate = (separator = '') => {
    let newDate = new Date()
    let date = newDate.getDate()
    let month = newDate.getMonth() + 1
    let year = newDate.getFullYear()

    return `${date < 10 ? `0${date}` : `${date}`}${separator}${month < 10 ? `0${month}` : `${month}`}${separator}${year}`
  }

  const onAdd = async () => {
    try {
      const data = await AsyncStorage.getItem('@FalaPovoApp:reports')
      const reports: IReport[] = data ? JSON.parse(data) : []
      const commentsField: IComment[] = []

      if (!message || !selectedCategory) return

      const newReport: IReport = {
        id: Math.floor(Math.random() * 100000),
        message,
        category: selectedCategory,
        location,
        createdAt: getCurrentDate('/'),
        image: photoUri ?? '',
        status: 'Em análise',
        comments: commentsField
      }

      const updateReports = [...reports, newReport]
      await AsyncStorage.setItem('@FalaPovoApp:reports', JSON.stringify(updateReports))

      setMessage('')
      setLocation('')
      setSelectedCategory('')
      setPhotoUri(null)

      router.replace('/(tabs)/reportsList' as any)
    } catch (error) {
      console.error('Erro ao salvar:', error)
    }
  }

  const onCancel = () => {
    setMessage('')
    setLocation('')
    setSelectedCategory('')
    setPhotoUri(null)

    router.replace('/(tabs)/reportsList' as any)
  }

  const selectImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync()

    if (permissionResult.granted) {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      })

      if (!result.canceled && result.assets?.[0]) {
        setPhotoUri(result.assets[0].uri ?? null)
      }
    } else {
      alert('Permissão para acessar a galeria é necessária!')
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#f0f2f5' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ThemedView style={styles.wrapper}>
        <View style={styles.card}>
          <Text style={styles.title}>Criar Relato</Text>

          <TextInput
            placeholder="Descreva o problema..."
            style={styles.input}
            value={message}
            onChangeText={setMessage}
            multiline
          />

          <TextInput
            placeholder="Informe o local..."
            style={styles.input}
            value={location}
            onChangeText={setLocation}
          />

          <DropDownPicker
            open={open}
            value={selectedCategory}
            items={items}
            setOpen={setOpen}
            setValue={setSelectedCategory}
            setItems={setItems}
            placeholder="Selecionar categoria"
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownBox}
            zIndex={1000}
          />

          {photoUri && (
            <Image source={{ uri: photoUri }} style={styles.previewImage} />
          )}

          <TouchableOpacity style={styles.buttonPhoto} onPress={selectImage}>
            <Text style={styles.buttonText}>📷 Adicionar Foto</Text>
          </TouchableOpacity>

          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.buttonSave} onPress={onAdd}>
              <Text style={styles.buttonText}>Publicar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonCancel} onPress={onCancel}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ThemedView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    paddingTop: 40,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 22,
    marginBottom: 18,
    textAlign: 'center',
    fontWeight: '700',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fafafa',
    padding: 12,
    marginBottom: 14,
    borderRadius: 12,
    fontSize: 15,
  },
  dropdown: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 14,
  },
  dropdownBox: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderRadius: 12,
    zIndex: 1000,
  },
  buttonPhoto: {
    backgroundColor: '#4267B2',
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  previewImage: {
    width: '100%',
    height: 220,
    borderRadius: 14,
    marginBottom: 12,
    resizeMode: 'cover',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 10,
  },
  buttonSave: {
    backgroundColor: '#28a745',
    paddingVertical: 14,
    borderRadius: 12,
    flex: 1,
  },
  buttonCancel: {
    backgroundColor: '#dc3545',
    paddingVertical: 14,
    borderRadius: 12,
    flex: 1,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
  },
})
