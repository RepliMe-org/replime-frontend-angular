export type AddSourceMode = 'VIDEO' | 'PLAYLIST';

export type SyncStatus = 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'DEAD';

export interface AddSourcePayload {
  sourceValue: string;
  sourceType: AddSourceMode;
}

export interface VideoResponseDTO {
  sourceId: number;
  videoId: number;
  youtubeVideoId: string;
  title: string;
  thumbnail: string;
  syncStatus: SyncStatus;
  duration: string;
  failureReason?: string | null;
}
