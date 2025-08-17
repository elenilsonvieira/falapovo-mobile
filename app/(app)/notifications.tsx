import RouteGuard from '@/components/auth/RouteGuard';
import { INotification } from '@/interfaces/INotification';
import { useAuth } from '@/lib/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const NOTIFICATIONS_KEY = '@FalaPovoApp:notifications';

function NotificationsContent() {
  const { user } = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const loadAndReadNotifications = async () => {
        if (!user?.email) {
          setIsLoading(false);
          return;
        }
        try {
          setIsLoading(true);
          const data = await AsyncStorage.getItem(NOTIFICATIONS_KEY);
          const allNotifications: INotification[] = data ? JSON.parse(data) : [];
          
          const userNotifications = allNotifications.filter(n => n.userEmail === user.email);
          setNotifications(userNotifications);

          const updatedNotifications = allNotifications.map(n => 
            n.userEmail === user.email ? { ...n, read: true } : n
          );
          await AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updatedNotifications));

        } catch (error) {
          console.error("Erro ao carregar notificações:", error);
        } finally {
          setIsLoading(false);
        }
      };
      loadAndReadNotifications();
    }, [user])
  );

  const renderItem = ({ item }: { item: INotification }) => (
    <TouchableOpacity 
      style={styles.notificationItem}
      onPress={() => router.push({ pathname: '/screens/showReport', params: { id: item.reportId.toString() }})}
    >
      <View style={!item.read ? styles.unreadIndicator : null} />
      <View style={styles.notificationContent}>
        <Text style={styles.notificationMessage}>{item.message}</Text>
        <Text style={styles.notificationDate}>{new Date(item.createdAt).toLocaleString('pt-BR')}</Text>
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;
  }

  return (
    <FlatList
      data={notifications}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      ListEmptyComponent={<Text style={styles.emptyText}>Você não tem nenhuma notificação.</Text>}
      contentContainerStyle={styles.container}
    />
  );
}


export default function NotificationsScreen() {
  return (
    <RouteGuard registeredOnly={true}>
      <NotificationsContent />
    </RouteGuard>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5', paddingTop: 20 },
  notificationItem: { flexDirection: 'row', backgroundColor: '#fff', padding: 15, borderBottomWidth: 1, borderBottomColor: '#eee', alignItems: 'center' },
  unreadIndicator: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#007bff', marginRight: 10 },
  notificationContent: { flex: 1 },
  notificationMessage: { fontSize: 16, color: '#333' },
  notificationDate: { fontSize: 12, color: '#888', marginTop: 4 },
  emptyText: { textAlign: 'center', marginTop: 50, fontSize: 16, color: 'gray' },
});
