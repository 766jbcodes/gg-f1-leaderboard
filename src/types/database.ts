/**
 * Supabase database types for 2026 migration.
 * Matches schema in supabase/migrations/.
 */

export type ChampionshipType = 'drivers' | 'constructors';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string | null;
          participant_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          display_name?: string | null;
          participant_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          display_name?: string | null;
          participant_id?: string | null;
          updated_at?: string;
        };
      };
      season_predictions: {
        Row: {
          id: string;
          user_id: string;
          season: number;
          championship_type: ChampionshipType;
          predictions: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          season: number;
          championship_type: ChampionshipType;
          predictions: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          season?: number;
          championship_type?: ChampionshipType;
          predictions?: string[];
          updated_at?: string;
        };
      };
      races: {
        Row: {
          id: string;
          season: number;
          round: number;
          name: string;
          race_start_utc: string;
          qualifying_end_utc: string | null;
          reminder_sent_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          season: number;
          round: number;
          name: string;
          race_start_utc: string;
          qualifying_end_utc?: string | null;
          reminder_sent_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          season?: number;
          round?: number;
          name?: string;
          race_start_utc?: string;
          qualifying_end_utc?: string | null;
          reminder_sent_at?: string | null;
          updated_at?: string;
        };
      };
      weekly_predictions: {
        Row: {
          id: string;
          user_id: string;
          race_id: string;
          top10_driver_names: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          race_id: string;
          top10_driver_names: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          race_id?: string;
          top10_driver_names?: string[];
          updated_at?: string;
        };
      };
      race_results: {
        Row: {
          id: string;
          race_id: string;
          top10_driver_names: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          race_id: string;
          top10_driver_names?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          race_id?: string;
          top10_driver_names?: string[];
          updated_at?: string;
        };
      };
    };
  };
}
