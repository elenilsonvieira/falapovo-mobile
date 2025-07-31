import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import Report from '@/components/report/Report';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IReport } from '@/interfaces/IReport';

export default function ReportsList() {
  const [reports, setReports] = useState<IReport[]>([]);

  // Categoria
  const [openCategory, setOpenCategory] = useState(false);
  const [filterCategory, setFilterCategory] = useState('Tudo');
  const [itemsCategory, setItemsCategory] = useState([
    { label: 'Tudo', value: 'Tudo' },
    { label: 'Buraco', value: 'Buraco' },
    { label: 'Obra', value: 'Obra' },
  ]);

  // Status
  const [openStatus, setOpenStatus] = useState(false);
  const [filterStatus, setFilterStatus] = useState('Tudo');
  const [itemsStatus, setItemsStatus] = useState([
    { label: 'Tudo', value: 'Tudo' },
    { label: 'Em análise', value: 'Em análise' },
    { label: 'Em andamento', value: 'Em andamento' },
    { label: 'Concluído', value: 'Concluído' },
  ]);

  useEffect(() => {
    console.log('Filtro categoria:', filterCategory);
  }, [filterCategory]);
  useEffect(() => {
    console.log('Filtro status:', filterStatus);
  }, [filterStatus]);

  useFocusEffect(
    useCallback(() => {
      async function getData() {
        try {
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
        }
      }
      getData();
    }, [filterCategory, filterStatus])
  );

  const openForm = () => {
    router.push('/screens/reportForm' as any);
  };
  const openReport = (id: string) => {
    router.push({ pathname: '/screens/showReport', params: { id } });
  };

  return (
    <ThemedView style={{ flex: 1 }}>
      <View style={styles.filterContainer}>
        <View style={{ zIndex: 2000 }}>
          <ThemedText style={styles.filterLabel}>Categoria:</ThemedText>
          <DropDownPicker
            open={openCategory}
            value={filterCategory}
            items={itemsCategory}
            setOpen={setOpenCategory}
            setValue={setFilterCategory}
            setItems={setItemsCategory}
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownContainer}
          />
        </View>

        <View style={{ zIndex: 1000, marginLeft: 20 }}>
          <ThemedText style={styles.filterLabel}>Status:</ThemedText>
          <DropDownPicker
            open={openStatus}
            value={filterStatus}
            items={itemsStatus}
            setOpen={setOpenStatus}
            setValue={setFilterStatus}
            setItems={setItemsStatus}
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownContainer}
          />
        </View>
      </View>

      <View style={{ flex: 1, zIndex: 0 }}>
        <ParallaxScrollView headerBackgroundColor={{ light: '#ECECEC', dark: '#202020' }}>
          <View style={styles.container}>
            {reports.length > 0 ? (
              reports.map(report => (
                <TouchableOpacity key={report.id} onPress={() => openReport(report.id.toString())}>
                  <Report
                    id={report.id}
                    message={report.message}
                    category={report.category}
                    location={report.location}
                    date={report.createdAt}
                    status={report.status}
                    image={report.image}
                  />
                </TouchableOpacity>
              ))
            ) : (
              <ThemedText style={styles.noReport}>Nenhum registro!</ThemedText>
            )}
          </View>
        </ParallaxScrollView>
      </View>

      <TouchableOpacity style={styles.addButton} onPress={openForm}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 80,
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    paddingHorizontal: 20,
    gap: 8,
    paddingVertical: 8,
    borderRadius: 8,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  dropdown: {
    width: 150,
    height: 42,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  dropdownContainer: {
    width: 150,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#fffd8f',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 100,
  },
  addButtonText: {
    fontSize: 30,
    color: '#333',
  },
  noReport: {
    fontStyle: 'italic',
    fontSize: 25,
    textAlign: 'center',
  },
});
