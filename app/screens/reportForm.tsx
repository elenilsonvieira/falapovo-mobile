import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
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

import { IComment } from "@/interfaces/IComment";
import { IReport } from "@/interfaces/IReport";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";

import EditReport from "@/components/EditReport";
import * as Location from "expo-location";
import MapView, { Marker } from 'react-native-maps';

export default function ReportForm() {
  const { id } = useLocalSearchParams()
  
  const [message, setMessage] = useState("");
  const [adressLocation, setAdressLocation] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [mapLocation, setMapLocation] = useState<Location.LocationObject | null>(null);

  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: "Buraco", value: "Buraco" },
    { label: "Obra", value: "Obra" },
  ]);
  
  useEffect(() => {
    if (id) {
        loadReportData(Number(id))
    }
  }, [id])

const loadReportData = async (id: number) => {
  try {
      const data = await AsyncStorage.getItem('@FalaPovoApp:reports')
      const reports: IReport[] = data ? JSON.parse(data) : []
      const selectedReport = reports.find(report => report.id === id)
      if (selectedReport) {
          setMessage(selectedReport.message)
          setAdressLocation(selectedReport.adressLocation)
          setSelectedCategory(selectedReport.category)
          setPhotoUri(selectedReport.image)
          setMapLocation(selectedReport.mapLocation)
      }
  } catch (error) {
    }
  }

  const getCurrentDate = (separator = "") => {
    let newDate = new Date();
    let date = newDate.getDate();
    let month = newDate.getMonth() + 1;
    let year = newDate.getFullYear();

    return `${date < 10 ? `0${date}` : `${date}`}${separator}${
      month < 10 ? `0${month}` : `${month}`
    }${separator}${year}`;
  };

  const onAdd = async () => {
    try {
      const data = await AsyncStorage.getItem("@FalaPovoApp:reports");
      const reports: IReport[] = data ? JSON.parse(data) : [];
      const commentsField: IComment[] = [];

      if (!message || !selectedCategory) return;

      if (id) {
        EditReport(
          '@FalaPovoApp:reports', 
          Number(id), 
          reports, 
          message, 
          selectedCategory, 
          photoUri, 
          adressLocation,
          mapLocation
        )
      } else {
        const newReport: IReport = {
          id: Math.floor(Math.random() * 100000),
          message,
          category: selectedCategory,
          adressLocation,
          createdAt: getCurrentDate("/"),
          image: photoUri ?? "",
          status: "Em análise",
          comments: commentsField,
          mapLocation
        };

        const updateReports = [newReport, ...reports];
        await AsyncStorage.setItem("@FalaPovoApp:reports", JSON.stringify(updateReports));
      }

      setMessage("");
      setAdressLocation("");
      setSelectedCategory("");
      setPhotoUri(null);

      router.replace("/(tabs)/reportsList" as any);
    } catch (error) {
      console.error("Erro ao salvar:", error);
    }
  };

  const onCancel = () => {
    setMessage("");
    setAdressLocation("");
    setSelectedCategory("");
    setPhotoUri(null);
    setMapLocation(null)

    router.replace("/(tabs)/reportsList" as any);
  };

  const selectImage = async () => {
    if (Platform.OS === "web") {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets?.[0]) {
        setPhotoUri(result.assets[0].uri ?? null);
      }
    } else {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      const cameraPermissionResult = await ImagePicker.requestCameraPermissionsAsync();

      if (permissionResult.granted && cameraPermissionResult.granted) {
        const action = await new Promise((resolve) => {
          Alert.alert(
            "Escolha uma opção",
            "Você deseja acessar a galeria ou usar a câmera?",
            [
              {
                text: "Galeria",
                onPress: () => resolve("gallery"),
              },
              {
                text: "Câmera",
                onPress: () => resolve("camera"),
              },
              {
                text: "Cancelar",
                onPress: () => resolve(null),
                style: "cancel",
              },
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
      } else {
        alert("Permissão para acessar a galeria e/ou a câmera é necessária!");
      }
    }
  };

  useEffect(() => {
    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted" || mapLocation) {
        setLoadingLocation(false);
        return;
      }
  
      try {
        let actualLocation = await Location.getCurrentPositionAsync({accuracy: Location.Accuracy.High,});
        setMapLocation(actualLocation)
        let readableData = await Location.reverseGeocodeAsync(actualLocation.coords);
        let locationStructured = `${readableData[0].street}${
          readableData[0].district ? `, ${readableData[0].district}` : ""
        } - ${
          readableData[0].city ? readableData[0].city : readableData[0].subregion
        }`;
    
        setAdressLocation(locationStructured);
        setLoadingLocation(false);
      } catch (error) {
        setLoadingLocation(false);
      }
    };
    getLocation();
  }, [])

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#f0f2f5" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.wrapper}>
        <ScrollView style={styles.card}>
          <Text style={styles.title}>Criar Relato</Text>

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
            <Text style={styles.buttonText}>📷 Adicionar Foto</Text>
          </TouchableOpacity>

          <View style={styles.locationContainer}>
            {loadingLocation ? (
              <ActivityIndicator size="large" color="#0000ff"/>
            ) : mapLocation ? (
              <>
                <MapView style={styles.map} initialRegion={{ latitude: mapLocation.coords.latitude, longitude: mapLocation.coords.longitude, latitudeDelta: 0.005, longitudeDelta: 0.005, }} showsUserLocation >
                  <Marker coordinate={mapLocation.coords} title="Local do Problema" />
                </MapView>
                <Text style={styles.addressText}>{adressLocation}</Text>
              </>
            ) : (
              <Text>Não foi possível obter a localização. Verifique suas permissões.</Text>
            )}
          </View>

          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.buttonSave} onPress={onAdd}>
              <Text style={styles.buttonText}>{id ? 'Salvar' : 'Publicar'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonCancel} onPress={onCancel}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: "center",
    padding: 16,
    paddingTop: 40,
  },
  card: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 22,
    marginBottom: 18,
    textAlign: "center",
    fontWeight: "700",
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fafafa",
    padding: 12,
    marginBottom: 14,
    borderRadius: 12,
    fontSize: 15,
  },
  dropdown: {
    backgroundColor: "#fff",
    borderColor: "#ccc",
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 14,
  },
  dropdownBox: {
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderRadius: 12,
    zIndex: 1000,
  },
  buttonPhoto: {
    backgroundColor: "#4267B2",
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  previewImage: {
    width: "100%",
    height: 220,
    borderRadius: 14,
    marginBottom: 12,
    resizeMode: "cover",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 10,
    marginBottom: 40,
  },
  buttonSave: {
    backgroundColor: "#28a745",
    paddingVertical: 14,
    borderRadius: 12,
    flex: 1,
  },
  buttonCancel: {
    backgroundColor: "#dc3545",
    paddingVertical: 14,
    borderRadius: 12,
    flex: 1,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
    fontSize: 16,
  },
  buttonLocation: {
    backgroundColor: "#17a2b8",
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 14,
  },
  locationContainer: {
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  map: { ...StyleSheet.absoluteFillObject, },
  addressText: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    color: '#fff',
    padding: 8,
    textAlign: 'center',
    fontSize: 12,
  },
});
