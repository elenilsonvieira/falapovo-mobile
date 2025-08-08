import { useToast } from '@/contexts/ToastContext';
import { IReport, ReportStatus } from '@/interfaces/IReport';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

const REPORTS_KEY = '@FalaPovoApp:reports';
const ARCHIVED_KEY = '@FalaPovoApp:archived_reports';
const ARCHIVE_DELAY_DAYS = 30; 

export function useAdminReports() {
  const [activeReports, setActiveReports] = useState<IReport[]>([]);
  const [archivedReports, setArchivedReports] = useState<IReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();

  const archiveOldReports = useCallback(async (reports: IReport[], existingArchived: IReport[]): Promise<{ active: IReport[], archived: IReport[] }> => {
    const now = new Date();
    const reportsToArchive: IReport[] = [];
    const reportsToKeepActive: IReport[] = [];

    reports.forEach(report => {
      if (report.status === 'Concluído' && report.completedAt) {
        const completedDate = new Date(report.completedAt);
        const diffTime = Math.abs(now.getTime() - completedDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays > ARCHIVE_DELAY_DAYS) {
          reportsToArchive.push(report);
        } else {
          reportsToKeepActive.push(report);
        }
      } else {
        reportsToKeepActive.push(report);
      }
    });

    if (reportsToArchive.length > 0) {
      const newArchived = [...existingArchived, ...reportsToArchive];
      await AsyncStorage.setItem(REPORTS_KEY, JSON.stringify(reportsToKeepActive));
      await AsyncStorage.setItem(ARCHIVED_KEY, JSON.stringify(newArchived));
      showToast(`${reportsToArchive.length} denúncia(s) foram arquivadas automaticamente.`, 'success');
      return { active: reportsToKeepActive, archived: newArchived };
    }
    
    return { active: reports, archived: existingArchived };
  }, [showToast]);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          setIsLoading(true);
          const activeData = await AsyncStorage.getItem(REPORTS_KEY);
          const archivedData = await AsyncStorage.getItem(ARCHIVED_KEY);
          
          let active = activeData ? JSON.parse(activeData) : [];
          let archived = archivedData ? JSON.parse(archivedData) : [];

          
          const result = await archiveOldReports(active, archived);

          setActiveReports(result.active.reverse());
          setArchivedReports(result.archived.reverse());
        } catch (error: any) {
          showToast(`Não foi possível carregar as denúncias: ${error.message}`, 'error');
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    }, [showToast, archiveOldReports]) 
  );

  const handleUpdateStatus = async (id: number, status: ReportStatus) => {
    try {
      const data = await AsyncStorage.getItem(REPORTS_KEY);
      let currentReports: IReport[] = data ? JSON.parse(data) : [];
      const updatedReports = currentReports.map(report => {
        if (report.id === id) {
          
          const completedAt = status === 'Concluído' ? new Date().toISOString() : report.completedAt;
          return { ...report, status, completedAt };
        }
        return report;
      });
      await AsyncStorage.setItem(REPORTS_KEY, JSON.stringify(updatedReports));
      setActiveReports(updatedReports.reverse()); 
      showToast("Status atualizado com sucesso!", 'success');
    } catch (error: any) {
      showToast(`Não foi possível atualizar o status: ${error.message}`, 'error');
    }
  };

  const onDelete = async (id: number) => {
    try {
      const data = await AsyncStorage.getItem(REPORTS_KEY);
      const currentReports: IReport[] = data ? JSON.parse(data) : [];
      const newReportList = currentReports.filter(report => report.id !== id);
      await AsyncStorage.setItem(REPORTS_KEY, JSON.stringify(newReportList));
      setActiveReports(newReportList.reverse());
      showToast("Denúncia removida com sucesso!", 'success');
    } catch (error: any) {
      showToast(`Não foi possível remover a denúncia: ${error.message}`, 'error');
    }
  };

  const handleArchive = async (reportToArchive: IReport) => {
    try {
      const activeData = await AsyncStorage.getItem(REPORTS_KEY);
      const archivedData = await AsyncStorage.getItem(ARCHIVED_KEY);
      let active: IReport[] = activeData ? JSON.parse(activeData) : [];
      let archived: IReport[] = archivedData ? JSON.parse(archivedData) : [];

      
      const newActive = active.filter((r: IReport) => r.id !== reportToArchive.id);
      const newArchived = [reportToArchive, ...archived];
      
      await AsyncStorage.setItem(REPORTS_KEY, JSON.stringify(newActive));
      await AsyncStorage.setItem(ARCHIVED_KEY, JSON.stringify(newArchived));

      setActiveReports(newActive.reverse());
      setArchivedReports(newArchived.reverse());
      showToast("Denúncia arquivada com sucesso!", 'success');
    } catch (error: any) {
      showToast(`Erro ao arquivar denúncia: ${error.message}`, 'error');
    }
  };

  return {
    isLoading,
    activeReports,
    archivedReports,
    handleUpdateStatus,
    onDelete,
    handleArchive,
  };
}
