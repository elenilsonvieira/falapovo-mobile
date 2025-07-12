<<<<<<< HEAD

=======
>>>>>>> 5576744b6ff96019d50b556115b6ccc8b28233e5
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useState } from 'react'
import { Alert, Image, KeyboardAvoidingView, PermissionsAndroid, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import DropDownPicker from 'react-native-dropdown-picker'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker'

import { ThemedView } from '@/components/ThemedView'
import { IReport } from '@/interfaces/IReport'

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

      if (!message || !selectedCategory) return

      const newReport: IReport = {
<<<<<<< HEAD
        
=======
>>>>>>> 5576744b6ff96019d50b556115b6ccc8b28233e5
        id: Math.floor(Math.random() * 100000),
        message,
        category: selectedCategory,
        location,
        createdAt: getCurrentDate('/'),
        image: photoUri ?? ''
      }

      const updateReports = [...reports, newReport]
      await AsyncStorage.setItem('@FalaPovoApp:reports', JSON.stringify(updateReports))

      setMessage('')
      setLocation('')
      setSelectedCategory('')
      setPhotoUri(null)
<<<<<<< HEAD
     
      router.replace('/(tabs)/reportsList' as any)
=======
      router.replace('/(tabs)/reportsList')
>>>>>>> 5576744b6ff96019d50b556115b6ccc8b28233e5
    } catch (error) {
      console.error('Erro ao salvar:', error)
    }
  }

  const onCancel = () => {
    setMessage('')
    setLocation('')
    setSelectedCategory('')
    setPhotoUri(null)
<<<<<<< HEAD
    
    router.replace('/(tabs)/reportsList' as any)
  }

  const requestCameraPermission = async (): Promise<boolean> => {
    if (Platform.OS !== 'android') {
        return true;
    }
=======
    router.replace('/(tabs)/reportsList')
  }

  const requestCameraPermission = async (): Promise<boolean> => {
>>>>>>> 5576744b6ff96019d50b556115b6ccc8b28233e5
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Permissão para usar a câmera',
          message: 'Este app precisa acessar sua câmera para tirar fotos.',
          buttonNeutral: 'Perguntar depois',
          buttonNegative: 'Cancelar',
          buttonPositive: 'OK',
        },
      )
      return granted === PermissionsAndroid.RESULTS.GRANTED
    } catch (err) {
      console.warn(err)
      return false
    }
  }
<<<<<<< HEAD
=======
  
>>>>>>> 5576744b6ff96019d50b556115b6ccc8b28233e5

  const selectImage = () => {
    Alert.alert('Selecionar Imagem', 'Escolha uma opção', [
      {
        text: 'Câmera',
        onPress: async () => {
          const hasPermission = await requestCameraPermission()
          if (!hasPermission) {
            Alert.alert('Permissão negada', 'Não é possível abrir a câmera sem permissão.')
            return
          }
        
          launchCamera(
            {
              mediaType: 'photo',
              cameraType: 'back',
              saveToPhotos: true,
            },
            (response) => {
              if (response.didCancel) return
              if (response.errorCode) {
                console.error('Erro ao abrir câmera:', response.errorMessage)
                Alert.alert('Erro', 'Não foi possível abrir a câmera.')
                return
              }
        
              if (response.assets && response.assets.length > 0) {
                setPhotoUri(response.assets[0].uri ?? null)
              }
            }
          )
        }        
      },
      {
        text: 'Galeria',
        onPress: () => {
          launchImageLibrary({ mediaType: 'photo' }, (response) => {
            if (!response.didCancel && !response.errorCode && response.assets?.[0]) {
              setPhotoUri(response.assets[0].uri ?? null)
            }
          })
        }
      },
      {
        text: 'Cancelar',
        style: 'cancel'
      }
    ])
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
