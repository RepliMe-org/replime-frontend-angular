export interface ChatbotCategory {
  id: number;
  name: string;
}

export interface MessageClass {
  id: number;
  name: string;
}

export interface CategoryWithClasses extends ChatbotCategory {
  messageClasses: MessageClass[];
}
