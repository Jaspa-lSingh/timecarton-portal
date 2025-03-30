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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
