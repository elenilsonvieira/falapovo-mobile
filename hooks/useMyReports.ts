import { IReport } from '@/interfaces/IReport';
import { useAuth } from '@/lib/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';


export function useMyReports() {
  const { user } = useAuth();
  const [myReports, setMyReports] = useState<IReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  
  const fetchMyReports = useCallback(async () => {
    if (!user?.email) {
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      const data = await AsyncStorage.getItem('@FalaPovoApp:reports');
      const allReports: IReport[] = data ? JSON.parse(data) : [];
      const userReports = allReports.filter(
        report => report.authorEmail === user.email
      );
      setMyReports(userReports.reverse());
    } catch (error) {
      console.error("Erro ao buscar os meus relatos:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  
  useFocusEffect(
    useCallback(() => {
      fetchMyReports();
    }, [fetchMyReports])
  );

  
  return { isLoading, myReports, refetchMyReports: fetchMyReports };
}
