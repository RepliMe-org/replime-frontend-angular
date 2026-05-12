export interface AdminChatbot {
  id: string;
  influencerUsername: string;
  chatbotName: string;
  chatbotDescription: string;
  chatbotCategory: string;
  greetingMessage: string;
  avatarNumber: number;
  channelHandle: string;
  isPublic: boolean;
  numberOfIngestedVideos: number;
  status: 'CONFIGURING' | 'TRAINING' | 'ACTIVE' | 'FAILED' | 'INACTIVE';
}
