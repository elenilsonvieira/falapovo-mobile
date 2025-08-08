import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

import Report from "@/components/report/Report";
import { useToast } from '@/contexts/ToastContext';
import { IReport } from "@/interfaces/IReport";

export default function ReportsList() {
  const [reports, setReports] = useState<IReport[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();


  const [openCategory, setOpenCategory] = useState(false);
  const [filterCategory, setFilterCategory] = useState('Tudo');
  const [itemsCategory, setItemsCategory] = useState([
    { label: 'Tudo', value: 'Tudo' },
    { label: 'Buraco', value: 'Buraco' },
    { label: 'Obra', value: 'Obra' },
  ]);
  const [openStatus, setOpenStatus] = useState(false);
  const [filterStatus, setFilterStatus] = useState('Tudo');
  const [itemsStatus, setItemsStatus] = useState([
    { label: 'Tudo', value: 'Tudo' },
    { label: 'Em análise', value: 'Em análise' },
    { label: 'Em andamento', value: 'Em andamento' },
    { label: 'Concluído', value: 'Concluído' },
  ]);

  useFocusEffect(
    useCallback(() => {
      async function getData() {
        try {
          setLoading(true);
          const data = await AsyncStorage.getItem('@FalaPovoApp:reports');
          const reportsData: IReport[] = data ? JSON.parse(data) : [];

          let filteredReports = filterCategory !== 'Tudo' 
            ? reportsData.filter(r => r.category === filterCategory)
            : reportsData;

          filteredReports = filterStatus !== 'Tudo' 
            ? filteredReports.filter(r => r.status === filterStatus)
            : filteredReports;

          setReports(filteredReports.reverse());
        } catch (e) {
          console.error('Erro ao buscar dados:', e);
        } finally {
          setLoading(false);
        }
      }
      getData();
    }, [filterCategory, filterStatus])
  );

  const openForm = (id?: string) => {
    router.push({ pathname: '/screens/reportForm', params: id ? { id } : {} });
  };
  const openReport = (id: string) => {
    router.push({ pathname: "/screens/showReport", params: { id } });
  };

  const onDelete = async (id: number) => {
    try {
      const data = await AsyncStorage.getItem('@FalaPovoApp:reports');
      const currentReports: IReport[] = data ? JSON.parse(data) : [];
      const newReportList = currentReports.filter(report => report.id !== id);
      await AsyncStorage.setItem('@FalaPovoApp:reports', JSON.stringify(newReportList));
      
      showToast("Denúncia removida com sucesso!", 'success');
      setReports(newReportList.reverse());
    } catch (error) {
      showToast("Não foi possível remover a denúncia.", 'error');
    }
  };
  
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.filterContainer}>
        <View style={{ zIndex: 2 }}>
          <Text style={styles.filterLabel}>Categoria:</Text>
          <DropDownPicker open={openCategory} value={filterCategory} items={itemsCategory} setOpen={setOpenCategory} setValue={setFilterCategory} setItems={setItemsCategory} style={styles.dropdown} dropDownContainerStyle={styles.dropdownContainer} />
        </View>
        <View style={{ zIndex: 1 }}>
          <Text style={styles.filterLabel}>Status:</Text>
          <DropDownPicker open={openStatus} value={filterStatus} items={itemsStatus} setOpen={setOpenStatus} setValue={setFilterStatus} setItems={setItemsStatus} style={styles.dropdown} dropDownContainerStyle={styles.dropdownContainer} />
        </View>
      </View>

      <ScrollView contentContainerStyle={{ zIndex: 0 }}>
        <View style={styles.container}>
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
          ) : reports.length > 0 ? (
            reports.map((report) => (
              <TouchableOpacity key={report.id} onPress={() => openReport(report.id.toString())}>
                <Report id={report.id} message={report.message} category={report.category} adressLocation={report.adressLocation} date={report.createdAt} status={report.status} image={report.image} onDelete={onDelete} openForm={openForm} />
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.noReport}>Nenhum registro encontrado.</Text>
          )}
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.addButton} onPress={() => openForm()}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingBottom: 80 },
  filterContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 40, paddingHorizontal: 20, gap: 16, paddingVertical: 15, zIndex: 1 },
  filterLabel: { fontSize: 16, fontWeight: "600", marginBottom: 4 },
  dropdown: { width: 150, height: 42, borderColor: "#ccc", borderRadius: 8 },
  dropdownContainer: { width: 150 },
  addButton: { position: "absolute", bottom: 20, right: 20, backgroundColor: "#fffd8f", width: 60, height: 60, borderRadius: 30, justifyContent: "center", alignItems: "center", elevation: 4, zIndex: 100 },
  addButtonText: { fontSize: 30, color: "#333" },
  noReport: { fontStyle: "italic", fontSize: 18, textAlign: "center", marginTop: 40 },
  loader: { marginTop: 50 },
});
