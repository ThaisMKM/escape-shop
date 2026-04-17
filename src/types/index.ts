import type { Database } from './database';

export type EscapeRoom = Database['public']['Tables']['escape_rooms']['Row'];
export type UserPurchase = Database['public']['Tables']['user_purchases']['Row'];

export type Page = 'home' | 'profile' | 'detail';

export interface AppState {
  currentPage: Page;
  selectedRoomId: string | null;
}
