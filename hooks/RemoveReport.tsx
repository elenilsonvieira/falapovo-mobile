import AsyncStorage from '@react-native-async-storage/async-storage';

import { IReport } from '@/interfaces/IReport';

export default async function RemoveReport(id: number, reports: IReport[], asyncKey: string) {
    const newList = reports.filter((rep) => rep.id !== id);
    await AsyncStorage.setItem(asyncKey, JSON.stringify(newList));
    return newList;
}