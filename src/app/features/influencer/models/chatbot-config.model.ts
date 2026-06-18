export interface PersonaData {
  name: string;
  description: string;
  talkLikeMe: boolean;
  fetchChannel: boolean;
  tone: string;
  verbosity: string;
  formality: string;
  fetchYoutubeProfilePicture: true;
}
export interface ChatbotConfig {
  personaData: PersonaData;
  welcomeMessage: string;
  category: string;
  systemClassIds: number[];
  customClassNames: string[];
}
