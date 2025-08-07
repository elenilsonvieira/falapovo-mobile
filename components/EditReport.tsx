import { IReport } from "@/interfaces/IReport";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Location from "expo-location";

export default async function EditReport(
    asyncKey: string, 
    id: number, 
    reports: IReport[], 
    message: string, 
    selectedCategory: string, 
    photoUri: string | null,
    adressLocation: string,
    mapLocation: Location.LocationObject | null
    ) {
        
    const updatedReports = reports.map(report => 
        report.id === id
        ? {
          id,
          message,
          adressLocation,
          category: selectedCategory,
          image: photoUri,
          status: report.status,
          createdAt: report.createdAt,
          comments: report.comments,
          mapLocation
        } 
        : report
    )
    await AsyncStorage.setItem(asyncKey, JSON.stringify(updatedReports));
    return updatedReports;
}