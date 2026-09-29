export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          phone: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          updated_at?: string;
        };
      };
      stations: {
        Row: {
          id: string;
          name: string;
          location: string;
          lat: number;
          lng: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          location: string;
          lat: number;
          lng: number;
          created_at?: string;
        };
        Update: {
          name?: string;
          location?: string;
          lat?: number;
          lng?: number;
        };
      };
      sensor_readings: {
        Row: {
          id: string;
          station_id: string;
          ec: number;
          tds: number;
          ph: number;
          temperature: number;
          water_level: number;
          recorded_at: string;
        };
        Insert: {
          id?: string;
          station_id: string;
          ec: number;
          tds: number;
          ph: number;
          temperature: number;
          water_level: number;
          recorded_at?: string;
        };
        Update: {
          station_id?: string;
          ec?: number;
          tds?: number;
          ph?: number;
          temperature?: number;
          water_level?: number;
          recorded_at?: string;
        };
      };
      predictions: {
        Row: {
          id: string;
          station_id: string;
          risk_probability: number;
          risk_level: "Low" | "Moderate" | "High" | "Critical";
          prediction_horizon: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          station_id: string;
          risk_probability: number;
          risk_level: "Low" | "Moderate" | "High" | "Critical";
          prediction_horizon: string;
          created_at?: string;
        };
        Update: {
          station_id?: string;
          risk_probability?: number;
          risk_level?: "Low" | "Moderate" | "High" | "Critical";
          prediction_horizon?: string;
        };
      };
      complaints: {
        Row: {
          id: string;
          user_id: string;
          category: string;
          description: string;
          photo_url: string | null;
          location: string;
          status: "Submitted" | "Under Investigation" | "Action Taken" | "Resolved";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          category: string;
          description: string;
          photo_url?: string | null;
          location: string;
          status?: "Submitted" | "Under Investigation" | "Action Taken" | "Resolved";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          category?: string;
          description?: string;
          photo_url?: string | null;
          location?: string;
          status?: "Submitted" | "Under Investigation" | "Action Taken" | "Resolved";
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      complaint_status: "Submitted" | "Under Investigation" | "Action Taken" | "Resolved";
      risk_level: "Low" | "Moderate" | "High" | "Critical";
    };
  };
};
