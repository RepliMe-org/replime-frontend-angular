export interface ChatbotCategory {
  id: number;
  name: string;
  chatbotCount: number;
}

export interface MessageClass {
  id: number;
  name: string;
}

export interface CategoryWithClasses extends ChatbotCategory {
  messageClasses: MessageClass[];
}
