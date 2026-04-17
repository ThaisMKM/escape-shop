export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      escape_rooms: {
        Row: {
          id: string;
          title: string;
          description: string;
          short_description: string;
          price: number;
          difficulty: 'easy' | 'medium' | 'hard' | 'expert';
          duration_minutes: number;
          max_players: number;
          theme: string;
          image_url: string;
          rating: number;
          review_count: number;
          is_featured: boolean;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['escape_rooms']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['escape_rooms']['Insert']>;
      };
      user_purchases: {
        Row: {
          id: string;
          user_id: string;
          room_id: string;
          purchased_at: string;
          price_paid: number;
        };
        Insert: Omit<Database['public']['Tables']['user_purchases']['Row'], 'id' | 'purchased_at'>;
        Update: Partial<Database['public']['Tables']['user_purchases']['Insert']>;
      };
    };
  };
}
