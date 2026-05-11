export interface PublicChatbot {
  id: string;
  influencerUsername: string;
  chatbotName: string;
  chatbotDescription: string;
  categoryName: string;
  greetingMessage: string;
  avatarNumber: number;
  channelHandle: string;
  status: 'CONFIGURING' | 'ACTIVE' | 'INACTIVE';
}
