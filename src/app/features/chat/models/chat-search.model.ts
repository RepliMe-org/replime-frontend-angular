export interface MessageSearchResult {
  sessionId: number;
  sessionTitle: string;
  chatbotId: string;
  messageId: number;
  matchedMessage: string;
  sender: 'USER' | 'BOT';
  sentAt: string;
}

export interface MessageSearchResponse {
  query: string;
  matchCount: number;
  data: MessageSearchResult[];
}