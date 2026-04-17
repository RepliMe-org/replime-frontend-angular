export interface PersonaData {
  name: string;
  description: string;
  talkLikeMe: boolean;
  tone: string;
  verbosity: string;
  formality: string;
}
export interface ChatbotConfig {
  personaData: PersonaData;
  welcomeMessage: string;
  category: string;
  systemClassIds: number[];
  customClassNames: string[];
}