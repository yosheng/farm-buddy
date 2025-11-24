export type ChatMessageItem = {
  id: number
  userId: string
  role: number
  content: string
  createTime: string
};

export type ResChatMessage = API.ResPagination<ChatMessageItem>;

export type QsChatMessage = API.QuePaging & { userId?: string; role?: number };
