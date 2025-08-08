import { useToast } from '@/contexts/ToastContext';
import { IReport } from '@/interfaces/IReport';
import { useAuth } from '@/lib/auth';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Button, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const { user, logout, updateUser } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();
  const insets = useSafeAreaInsets();
  const [myReports, setMyReports] = useState<IReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const fetchMyReports = async () => {
        if (!user?.email) { setIsLoading(false); return; }
        try {
          setIsLoading(true);
          const data = await AsyncStorage.getItem('@FalaPovoApp:reports');
          const allReports: IReport[] = data ? JSON.parse(data) : [];
          const userReports = allReports.filter(report => report.authorEmail === user.email);
          setMyReports(userReports.reverse());
        } catch (error) {
          console.error("Erro ao buscar os meus relatos:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchMyReports();
    }, [user])
  );

  const handleLogout = () => {
    showToast('Você saiu com sucesso!', 'success');
    setTimeout(() => { logout(); }, 500);
  };

  const handleChoosePhoto = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      showToast('Permissão para aceder à galeria é necessária!', 'error');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });
    
    if (!result.canceled && result.assets && result.assets.length > 0 && result.assets[0].uri) {
      updateUser({ photoUri: result.assets[0].uri });
      showToast('Foto de perfil atualizada!', 'success');
    }
  };

  const handleRemovePhoto = () => {
    updateUser({ photoUri: '' });
    showToast('Foto de perfil removida.', 'success');
  };

  const renderReportItem = ({ item }: { item: IReport }) => (
    <TouchableOpacity 
      style={styles.reportItem} 
      onPress={() => router.push({ pathname: '/screens/showReport', params: { id: item.id.toString() } })}
    >
      <View>
        <Text style={styles.reportCategory}>{item.category}</Text>
        <Text style={styles.reportMessage} numberOfLines={1}>{item.message}</Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color="#ccc" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {}
      <TouchableOpacity 
        onPress={() => router.back()} 
        style={[styles.backButton, { top: insets.top + 15 }]}
        hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
      >
        <Ionicons name="arrow-back" size={28} color="#555" />
      </TouchableOpacity>

      <View style={styles.profileHeader}>
        <TouchableOpacity onPress={handleChoosePhoto} hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}>
          {user?.photoUri ? (
            <Image source={{ uri: user.photoUri }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person-circle-outline" size={80} color="#555" />
              <View style={styles.cameraIcon}>
                <Ionicons name="camera" size={20} color="#fff" />
              </View>
            </View>
          )}
        </TouchableOpacity>

        {user?.photoUri && (
          <TouchableOpacity onPress={handleRemovePhoto}>
            <Text style={styles.removePhotoText}>Remover Foto</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.userName}>{user?.name || 'Utilizador'}</Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
      </View>
      <View style={styles.reportsSection}>
        <Text style={styles.reportsTitle}>Meus Relatos</Text>
        {isLoading ? (
          <ActivityIndicator size="large" color="#007bff" />
        ) : (
          <FlatList
            data={myReports}
            renderItem={renderReportItem}
            keyExtractor={(item) => item.id.toString()}
            ListEmptyComponent={<Text style={styles.noReportsText}>Você ainda não criou nenhum relato.</Text>}
          />
        )}
      </View>
      <View style={styles.logoutButtonContainer}>
        <Button title="Sair (Logout)" onPress={handleLogout} color="#dc3545" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5' },
  profileHeader: { backgroundColor: '#fff', paddingTop: 60, paddingBottom: 20, paddingHorizontal: 20, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#ddd' },
  backButton: { position: 'absolute', left: 20, zIndex: 1 },
  avatarImage: { width: 100, height: 100, borderRadius: 50, marginBottom: 10, borderWidth: 3, borderColor: '#007bff' },
  avatarPlaceholder: { marginBottom: 10, position: 'relative' },
  cameraIcon: { position: 'absolute', bottom: 5, right: 5, backgroundColor: '#007bff', borderRadius: 15, padding: 5 },
  removePhotoText: { color: '#dc3545', fontSize: 12, marginBottom: 10 },
  userName: { fontSize: 22, fontWeight: 'bold', color: '#333' },
  userEmail: { fontSize: 16, color: '#666' },
  reportsSection: { flex: 1, marginTop: 20 },
  reportsTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', paddingHorizontal: 20, marginBottom: 10 },
  reportItem: { backgroundColor: '#fff', paddingHorizontal: 20, paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#eee', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  reportCategory: { fontWeight: 'bold', color: '#007bff' },
  reportMessage: { color: '#555', marginTop: 4 },
  noReportsText: { textAlign: 'center', marginTop: 30, color: '#888', fontSize: 16 },
  logoutButtonContainer: { margin: 20 },
});
