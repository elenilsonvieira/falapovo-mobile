import * as Location from "expo-location";
import { IComment } from "./IComment";

export type ReportPriority = 'Baixa' | 'Média' | 'Alta' | 'Urgente';
export type ReportStatus = 'Em análise' | 'Em andamento' | 'Concluído';
export type ReportCategory = 'Buraco na Rua' | 'Água e Esgoto' | 'Energia e Iluminação' | 'Limpeza Urbana' | 'Saúde' | 'Segurança' | 'Trânsito e Transporte' | 'Outros';

export interface IReport {
    id: number;
    message: string;
    category: ReportCategory;
    adressLocation: string;
    createdAt: string;
    image: string;
    status: ReportStatus; 
    comments: IComment[];
    mapLocation: Location.LocationObject | null;
    authorEmail?: string | null;

    completedAt?: string;
    
    priority?: ReportPriority;
}