export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      shift_change_requests: {
        Row: {
          admin_notes: string | null
          created_at: string
          employee_id: string
          id: string
          my_shift_date: string
          my_shift_id: string
          reason: string
          request_date: string
          status: string
          target_shift_date: string
          target_shift_id: string
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string
          employee_id: string
          id?: string
          my_shift_date: string
          my_shift_id: string
          reason: string
          request_date: string
          status?: string
          target_shift_date: string
          target_shift_id: string
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          created_at?: string
          employee_id?: string
          id?: string
          my_shift_date?: string
          my_shift_id?: string
          reason?: string
          request_date?: string
          status?: string
          target_shift_date?: string
          target_shift_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "shift_change_requests_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shift_change_requests_my_shift_id_fkey"
            columns: ["my_shift_id"]
            isOneToOne: false
            referencedRelation: "shifts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shift_change_requests_target_shift_id_fkey"
            columns: ["target_shift_id"]
            isOneToOne: false
            referencedRelation: "shifts"
            referencedColumns: ["id"]
          },
        ]
      }
      shifts: {
        Row: {
          created_at: string
          department: string | null
          employee_id: string
          end_time: string
          id: string
          location: string | null
          notes: string | null
          position: string | null
          requirements: string | null
          start_time: string
          status: string
        }
        Insert: {
          created_at?: string
          department?: string | null
          employee_id: string
          end_time: string
          id?: string
          location?: string | null
          notes?: string | null
          position?: string | null
          requirements?: string | null
          start_time: string
          status?: string
        }
        Update: {
          created_at?: string
          department?: string | null
          employee_id?: string
          end_time?: string
          id?: string
          location?: string | null
          notes?: string | null
          position?: string | null
          requirements?: string | null
          start_time?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "shifts_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      time_entries: {
        Row: {
          approved: boolean | null
          clock_in: string
          clock_out: string | null
          created_at: string
          employee_id: string
          id: string
          notes: string | null
          punch_in_address: string | null
          punch_in_lat: number | null
          punch_in_lng: number | null
          punch_in_photo: string | null
          punch_out_address: string | null
          punch_out_lat: number | null
          punch_out_lng: number | null
          punch_out_photo: string | null
          shift_id: string | null
          total_hours: number | null
        }
        Insert: {
          approved?: boolean | null
          clock_in: string
          clock_out?: string | null
          created_at?: string
          employee_id: string
          id?: string
          notes?: string | null
          punch_in_address?: string | null
          punch_in_lat?: number | null
          punch_in_lng?: number | null
          punch_in_photo?: string | null
          punch_out_address?: string | null
          punch_out_lat?: number | null
          punch_out_lng?: number | null
          punch_out_photo?: string | null
          shift_id?: string | null
          total_hours?: number | null
        }
        Update: {
          approved?: boolean | null
          clock_in?: string
          clock_out?: string | null
          created_at?: string
          employee_id?: string
          id?: string
          notes?: string | null
          punch_in_address?: string | null
          punch_in_lat?: number | null
          punch_in_lng?: number | null
          punch_in_photo?: string | null
          punch_out_address?: string | null
          punch_out_lat?: number | null
          punch_out_lng?: number | null
          punch_out_photo?: string | null
          shift_id?: string | null
          total_hours?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "time_entries_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "time_entries_shift_id_fkey"
            columns: ["shift_id"]
            isOneToOne: false
            referencedRelation: "shifts"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          city: string | null
          country: string | null
          created_at: string
          department: string | null
          email: string
          employee_id: string | null
          first_name: string | null
          hourly_rate: number | null
          id: string
          last_name: string | null
          phone_number: string | null
          position: string | null
          role: string
          state: string | null
          street: string | null
          zip_code: string | null
        }
        Insert: {
          avatar_url?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          department?: string | null
          email: string
          employee_id?: string | null
          first_name?: string | null
          hourly_rate?: number | null
          id: string
          last_name?: string | null
          phone_number?: string | null
          position?: string | null
          role?: string
          state?: string | null
          street?: string | null
          zip_code?: string | null
        }
        Update: {
          avatar_url?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          department?: string | null
          email?: string
          employee_id?: string | null
          first_name?: string | null
          hourly_rate?: number | null
          id?: string
          last_name?: string | null
          phone_number?: string | null
          position?: string | null
          role?: string
          state?: string | null
          street?: string | null
          zip_code?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
