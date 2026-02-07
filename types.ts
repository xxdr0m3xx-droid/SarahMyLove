
export type ContentType = 'photo' | 'poem' | 'voice' | 'postcard' | 'video';

export interface ContentItem {
  id: string;
  type: ContentType;
  title: string;
  content: string; // Base64 for images/audio, text for poems, or download URL for video
  timestamp: number;
  metadata?: Record<string, any>;
}

export enum AppState {
  LOCKED = 'LOCKED',
  GIRLFRIEND_DASHBOARD = 'GIRLFRIEND_DASHBOARD',
  OWNER_LOGIN = 'OWNER_LOGIN',
  OWNER_ADMIN = 'OWNER_ADMIN'
}

export const ANNIVERSARY_DATE = {
  month: 5, // June (0-indexed)
  day: 18
};
