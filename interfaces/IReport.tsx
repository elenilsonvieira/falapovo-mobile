import { IComment } from "./IComment";


export type ReportStatus = 'Em análise' | 'Em andamento' | 'Concluído';

export interface IReport {
    id: number;
    message: string;
    category: string;
    location: string;
    createdAt: string;
    image: string;
    status: ReportStatus; 
    comments: IComment[];
}
