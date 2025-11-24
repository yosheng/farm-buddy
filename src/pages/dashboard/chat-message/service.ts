import type { QsChatMessage, ResChatMessage } from '@/pages/dashboard/chat-message/typings';
import request from "@/utils/request.ts";

export async function fetchChatMessage(params?: QsChatMessage) {
  return request<ResChatMessage>('/api/ChatMessage', { params });
}
