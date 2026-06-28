export type WsMessageType = 'VIDEO_UPDATE' | 'SOURCE_COMPLETE';

export type SyncStatus = 'PROCESSING' | 'COMPLETED' | 'FAILED';

export interface WsSyncMessage {
  type: 'VIDEO_UPDATE' | 'SOURCE_COMPLETE';
  sourceId: number;
  videoId: number | null;
  status: SyncStatus;
  errorMessage?: string | null;
}
