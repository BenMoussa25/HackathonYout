import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          role: 'traveler' | 'hostel_manager';
          phone: string | null;
          country: string | null;
          bio: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      hostels: {
        Row: {
          id: string;
          manager_id: string | null;
          name: string;
          location: string;
          description: string;
          country: string;
          latitude: number;
          longitude: number;
          eco_score: number;
          travel_score: number;
          education_score: number;
          rating: number;
          image_url: string | null;
          created_at: string;
          updated_at: string;
        };
      };
      hostel_activities: {
        Row: {
          id: string;
          hostel_id: string;
          type: 'energy' | 'water' | 'waste' | 'community' | 'education' | 'biodiversity';
          title: string;
          description: string;
          activity_date: string;
          points: number;
          coins: number;
          evidence_url: string | null;
          status: 'pending' | 'verified' | 'rejected';
          created_at: string;
        };
      };
      wishes: {
        Row: {
          id: string;
          traveler_id: string;
          title: string;
          description: string;
          country: string | null;
          votes: number;
          status: 'open' | 'adopted' | 'completed';
          adopted_by_hostel_id: string | null;
          created_at: string;
          updated_at: string;
        };
      };
      badges: {
        Row: {
          id: string;
          name: string;
          description: string;
          icon: string;
          created_at: string;
        };
      };
      coin_transactions: {
        Row: {
          id: string;
          hostel_id: string;
          activity_id: string | null;
          coins: number;
          description: string;
          created_at: string;
        };
      };
      favorites: {
        Row: {
          id: string;
          user_id: string;
          hostel_id: string;
          created_at: string;
        };
      };
    };
  };
};
