export interface PublicChatbot {
  id: string;
  influencerUsername: string;
  chatbotName: string;
  chatbotDescription: string;
  categoryName: string;
  greetingMessage: string;
  avatarUrl: string | null;
  channelHandle: string;
  status: 'CONFIGURING' | 'ACTIVE' | 'INACTIVE';
}
