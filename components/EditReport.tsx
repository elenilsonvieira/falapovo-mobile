import { IReport } from "@/interfaces/IReport";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default async function EditReport(
    asyncKey: string, 
    id: number, 
    reports: IReport[], 
    message: string, 
    selectedCategory: string, 
    photoUri: string | null,
    location: string 
    ) {
        
    const updatedReports = reports.map(report => 
        report.id === id
        ? {
          id,
          message,
          location,
          category: selectedCategory,
          image: photoUri,
          status: report.status,
          createdAt: report.createdAt,
          comments: report.comments
        } 
        : report
    )
    await AsyncStorage.setItem(asyncKey, JSON.stringify(updatedReports));
    return updatedReports;
}