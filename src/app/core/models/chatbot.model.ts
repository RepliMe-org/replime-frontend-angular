export interface ChatSession {
  id: number;
  status: 'ACTIVE' | 'CLOSED';
  startedAt: string;
  lastMessageAt: string;
  sessionTopic: string;
}

export interface SessionsResponse {
  data: ChatSession[];
  pagination: {
    nextCursor: string;
    hasMore: boolean;
    limit: number;
  };
}

export interface SessionDetail {
  sessionId: number;
  chatbotId: string;
  chatbotName: string;
  greetingMessage: string;
  startedAt: string;
  messageCount: number;
}

export interface ChatMessage {
  id: number;
  message: string;
  sender: 'USER' | 'BOT';
  sentAt: string;
  messageStatus: 'SENT' | 'DELIVERED' | 'READ';
  messageClass: string;
}

export interface MessageSource {
  videoId: string;
  videoTitle: string;
  youtubeUrl: string;
  thumbnailUrl: string;
}

export interface SendMessageResponse {
  sessionId: number;
  sessionTitle: string;
  userMessage: ChatMessage;
  aiResponse: ChatMessage;
  sources: MessageSource[];
  updatedAt: string;
}

export interface DisplayMessage {
  msg: ChatMessage;
  sources?: MessageSource[];
  isNew?: boolean;
}