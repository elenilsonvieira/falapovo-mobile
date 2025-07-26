
export interface IComment {
  id: number;
  message: string;
  author: string;
  createdAt: string;
  isReply?: boolean;
}
