<<<<<<< HEAD

import AsyncStorage from '@react-native-async-storage/async-storage'
import { useFocusEffect } from '@react-navigation/native'
import { router } from 'expo-router'
=======
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useFocusEffect } from '@react-navigation/native'
>>>>>>> 5576744b6ff96019d50b556115b6ccc8b28233e5
import { useCallback, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import DropDownPicker from 'react-native-dropdown-picker'

import ParallaxScrollView from '@/components/ParallaxScrollView'
import Report from '@/components/report/Report'
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { IReport } from '@/interfaces/IReport'

<<<<<<< HEAD
=======
import { router } from 'expo-router'


>>>>>>> 5576744b6ff96019d50b556115b6ccc8b28233e5
export default function ReportsList() {
  const [reports, setReports] = useState<IReport[]>([])

  const [open, setOpen] = useState(false)
  const [filter, setFilter] = useState('Tudo')
  const [items, setItems] = useState([
    { label: 'Tudo', value: 'Tudo' },
    { label: 'Buraco', value: 'Buraco' },
    { label: 'Obra', value: 'Obra' },
  ])

  useFocusEffect(
    useCallback(() => {
      async function getData() {
        try {
          const data = await AsyncStorage.getItem('@FalaPovoApp:reports')
          const reportsData = data != null ? JSON.parse(data) : []

          if (filter && filter !== 'Tudo') {
            const filteredReports = reportsData.filter(
              (report: { category: string }) => report.category === filter
            )
            setReports(filteredReports.reverse())
          } else {
            setReports(reportsData.reverse())
          }
        } catch (e) {
          console.error('Error fetching data: ', e)
        }
      }
      getData()
    }, [filter])
  )

  const openForm = () => {
<<<<<<< HEAD
    router.push('/screens/reportForm' as any)
=======
    router.push('/screens/reportForm')
>>>>>>> 5576744b6ff96019d50b556115b6ccc8b28233e5
  }

  return (
    <ThemedView style={{ flex: 1 }}>
      <View style={styles.filterContainer}>
        <ThemedText style={styles.filterLabel}>Filtrar:</ThemedText>
        <DropDownPicker
<<<<<<< HEAD
          open={open}
          value={filter}
          items={items}
          setOpen={setOpen}
          setValue={setFilter}
          setItems={setItems}
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownContainer}
          zIndex={1000}
=======
            open={open}
            value={filter}
            items={items}
            setOpen={setOpen}
            setValue={setFilter}
            setItems={setItems}
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownContainer}
            zIndex={1000}
>>>>>>> 5576744b6ff96019d50b556115b6ccc8b28233e5
        />
      </View>

      <View style={{ flex: 1, zIndex: 0 }}>
        <ParallaxScrollView headerBackgroundColor={{ light: '#ECECEC', dark: '#202020' }}>
          <View style={styles.container}>
            {reports.length > 0 ? reports.map(report => (
<<<<<<< HEAD
              <Report
                key={report.id}
                message={report.message}
                category={report.category}
                location={report.location}
                date={report.createdAt}
                image={report.image}
              />
            )) : <ThemedText style={styles.noReport}>Nenhum registro!</ThemedText>
            }
=======
                <Report
                  key={report.id}
                  message={report.message}
                  category={report.category}
                  location={report.location}
                  date={report.createdAt}
                  image={report.image}
                />
            )) : <ThemedText style={styles.noReport}>Nenhum registro!</ThemedText>
        }
>>>>>>> 5576744b6ff96019d50b556115b6ccc8b28233e5
          </View>
        </ParallaxScrollView>
      </View>

      <TouchableOpacity style={styles.addButton} onPress={() => openForm()}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 80,
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
<<<<<<< HEAD
    justifyContent: 'center',
    marginTop: 40,
    paddingHorizontal: 20,
=======
    marginTop: 40,
    paddingHorizontal: 150,
>>>>>>> 5576744b6ff96019d50b556115b6ccc8b28233e5
    zIndex: 1000,
    gap: 8,
    paddingVertical: 8,
    borderRadius: 8,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '600'
<<<<<<< HEAD
  },
=======
  },  
>>>>>>> 5576744b6ff96019d50b556115b6ccc8b28233e5
  dropdown: {
    width: 150,
    height: 42,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  dropdownContainer: {
    width: 150,
    zIndex: 1000
<<<<<<< HEAD
  },
=======
  },  
>>>>>>> 5576744b6ff96019d50b556115b6ccc8b28233e5
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
    textAlign: 'center'
  }
})
