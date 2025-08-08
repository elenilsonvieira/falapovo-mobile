import Location from "expo-location";
import { IComment } from "./IComment";


export type ReportStatus = 'Em análise' | 'Em andamento' | 'Concluído';

export interface IReport {
    id: number;
    message: string;
    category: string;
    adressLocation: string;
    createdAt: string;
    image: string;
    status: ReportStatus; 
    comments: IComment[];
    mapLocation: Location.LocationObject | null;
    authorEmail?: string; 
    completedAt?: string;
    
    
}
