import * as ImagePicker from "expo-image-picker";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

import { IReport } from "@/interfaces/IReport";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";

import EditReport from "@/components/EditReport";
import { useToast } from "@/contexts/ToastContext";
import { useAuth } from "@/lib/auth";
import * as Location from "expo-location";
import MapView, { Marker } from 'react-native-maps';

export default function ReportForm() {
  const { id } = useLocalSearchParams();
  const { showToast } = useToast();
  const { user } = useAuth();
  
  const [message, setMessage] = useState("");
  const [adressLocation, setAdressLocation] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>("");
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [mapLocation, setMapLocation] = useState<Location.LocationObject | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: "Buraco", value: "Buraco" },
    { label: "Obra", value: "Obra" },
  ]);
  
  const loadReportData = useCallback(async (reportId: number) => {
    try {
        const data = await AsyncStorage.getItem('@FalaPovoApp:reports');
        const reports: IReport[] = data ? JSON.parse(data) : [];
        const selectedReport = reports.find(report => report.id === reportId);
        if (selectedReport) {
            setMessage(selectedReport.message);
            setAdressLocation(selectedReport.adressLocation);
            setSelectedCategory(selectedReport.category);
            setPhotoUri(selectedReport.image);
            setMapLocation(selectedReport.mapLocation);
        }
    } catch (error: any) {
      showToast(`Erro ao carregar os dados: ${error.message}`, 'error');
    } finally {
      setLoadingLocation(false);
    }
  }, [showToast]);

  const getLocation = useCallback(async () => {
    setLoadingLocation(true);
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      showToast('A permissão de localização foi negada.', 'error');
      setLoadingLocation(false);
      return;
    }
    try {
      let actualLocation = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      setMapLocation(actualLocation);
      let readableData = await Location.reverseGeocodeAsync(actualLocation.coords);
      if (readableData[0]) {
        const { street, district, city, subregion } = readableData[0];
        setAdressLocation(`${street || ''}${district ? `, ${district}` : ""} - ${city || subregion || ''}`);
      }
    } catch (error: any) {
      showToast(`Não foi possível obter a localização: ${error.message}`, 'error');
    } finally {
      setLoadingLocation(false);
    }
  }, [showToast]);

  useEffect(() => {
    if (id) {
      setIsEditing(true);
      loadReportData(Number(id));
    } else {
      getLocation();
    }
  }, [id, loadReportData, getLocation]);

  const onAdd = async () => {
    if (!message || !selectedCategory) {
      showToast("A descrição e a categoria são obrigatórias.", 'error');
      return;
    }

    try {
      const data = await AsyncStorage.getItem("@FalaPovoApp:reports");
      const reports: IReport[] = data ? JSON.parse(data) : [];
      
      if (isEditing && id) {
        await EditReport(
          '@FalaPovoApp:reports', 
          Number(id), 
          reports, 
          message, 
          selectedCategory ?? '', 
          photoUri, 
          adressLocation,
          mapLocation
        );
        showToast("Denúncia atualizada com sucesso!", 'success');
      } else {
        const newReport: IReport = {
          id: Date.now(),
          message,
          category: selectedCategory ?? '',
          adressLocation,
          createdAt: new Date().toLocaleDateString('pt-BR'),
          image: photoUri ?? "",
          status: "Em análise",
          comments: [],
          mapLocation,
          authorEmail: user?.email
        };
        const updateReports = [newReport, ...reports];
        await AsyncStorage.setItem("@FalaPovoApp:reports", JSON.stringify(updateReports));
        showToast("Denúncia criada com sucesso!", 'success');
      }
      router.replace("/(tabs)/reportsList" as any);
    } catch (error: any) {
      console.error("Erro ao salvar:", error);
      showToast(`Não foi possível salvar a denúncia: ${error.message}`, 'error');
    }
  };

  const onCancel = () => {
    router.back();
  };

  const selectImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      showToast('Permissão para aceder à galeria é necessária!', 'error');
      return;
    }
    
    const action = await new Promise((resolve) => {
      Alert.alert(
        "Escolha uma opção",
        "Você deseja aceder à galeria ou usar a câmera?",
        [
          { text: "Galeria", onPress: () => resolve("gallery") },
          { text: "Câmera", onPress: () => resolve("camera") },
          { text: "Cancelar", onPress: () => resolve(null), style: "cancel" },
        ]
      );
    });

    if (action === "gallery") {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.canceled && result.assets?.[0]) {
        setPhotoUri(result.assets[0].uri ?? null);
      }
    } else if (action === "camera") {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.canceled && result.assets?.[0]) {
        setPhotoUri(result.assets[0].uri ?? null);
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#f0f2f5" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.wrapper}>
        <View style={styles.card}>
          <Text style={styles.title}>{isEditing ? 'Editar Relato' : 'Criar Relato'}</Text>

          <TextInput
            placeholder="Descreva o problema..."
            style={styles.input}
            value={message}
            onChangeText={setMessage}
            multiline
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
            listMode="SCROLLVIEW"
          />

          {photoUri && (
            <Image source={{ uri: photoUri }} style={styles.previewImage} />
          )}

          <TouchableOpacity style={styles.buttonPhoto} onPress={selectImage}>
            <Text style={styles.buttonText}>📷 {photoUri ? 'Trocar Foto' : 'Adicionar Foto'}</Text>
          </TouchableOpacity>

          <View style={styles.locationContainer}>
            {loadingLocation ? (
              <ActivityIndicator size="large" color="#0000ff"/>
            ) : mapLocation ? (
              <>
                <MapView style={styles.map} region={{ latitude: mapLocation.coords.latitude, longitude: mapLocation.coords.longitude, latitudeDelta: 0.005, longitudeDelta: 0.005 }} showsUserLocation >
                  <Marker coordinate={mapLocation.coords} title="Local do Problema" />
                </MapView>
                <Text style={styles.addressText}>{adressLocation}</Text>
              </>
            ) : (
              <TouchableOpacity onPress={getLocation}><Text>Não foi possível obter a localização. Toque para tentar novamente.</Text></TouchableOpacity>
            )}
          </View>

          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.buttonSave} onPress={onAdd}>
              <Text style={styles.buttonText}>{isEditing ? 'Salvar Alterações' : 'Publicar'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonCancel} onPress={onCancel}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrapper: { flexGrow: 1, justifyContent: 'center', alignItems: "center", padding: 16 },
  card: { width: "100%", backgroundColor: "#fff", padding: 20, borderRadius: 16, elevation: 4 },
  title: { fontSize: 22, marginBottom: 18, textAlign: "center", fontWeight: "700", color: "#333" },
  input: { borderWidth: 1, borderColor: "#ddd", backgroundColor: "#fafafa", padding: 12, marginBottom: 14, borderRadius: 12, fontSize: 15 },
  dropdown: { backgroundColor: "#fff", borderColor: "#ccc", height: 48, borderRadius: 12, paddingHorizontal: 12, marginBottom: 14 },
  dropdownBox: { backgroundColor: "#fff", borderColor: "#ccc", borderRadius: 12 },
  buttonPhoto: { backgroundColor: "#4267B2", paddingVertical: 12, borderRadius: 12, marginBottom: 16, alignItems: 'center' },
  previewImage: { width: "100%", height: 220, borderRadius: 14, marginBottom: 12, resizeMode: "cover" },
  buttonsContainer: { flexDirection: "row", justifyContent: "space-between", gap: 12, marginTop: 10 },
  buttonSave: { backgroundColor: "#28a745", paddingVertical: 14, borderRadius: 12, flex: 1, alignItems: 'center' },
  buttonCancel: { backgroundColor: "#dc3545", paddingVertical: 14, borderRadius: 12, flex: 1, alignItems: 'center' },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  locationContainer: { height: 250, justifyContent: 'center', alignItems: 'center', marginBottom: 20, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, overflow: 'hidden' },
  map: { ...StyleSheet.absoluteFillObject },
  addressText: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.6)', color: '#fff', padding: 8, textAlign: 'center', fontSize: 12 },
});
