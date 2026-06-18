export interface AdminChatbot {
  id: string;
  influencerUsername: string;
  chatbotName: string;
  chatbotDescription: string;
  chatbotCategory: string;
  greetingMessage: string;
  avatarUrl: string | null;
  channelHandle: string;
  isPublic: boolean;
  numberOfIngestedVideos: number;
  status: 'CONFIGURING' | 'TRAINING' | 'ACTIVE' | 'FAILED' | 'INACTIVE';
}

export type UserRole = 'USER' | 'CREATOR' | 'ADMIN';
export type UserStatus = 'ACTIVE' | 'PENDING' | 'SUSPENDED' | 'INACTIVE';

export interface AdminUser {
  username: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  chatbotName: string | null;
  conversationsCount: number;
  joinedAt: string;
  avatarUrl?: string | null;
}