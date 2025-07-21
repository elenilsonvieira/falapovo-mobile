import { IComment } from "./IComment";

export interface IReport {
    id: number,
    message: string,
    category: string,
    location: string,
    createdAt: string,
    image: string,
    status: string,
    comments: IComment[]
}