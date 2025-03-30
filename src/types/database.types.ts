
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          created_at: string
          email: string
          first_name: string | null
          last_name: string | null
          role: 'admin' | 'employee'
          employee_id: string | null
          position: string | null
          department: string | null
          hourly_rate: number | null
          phone_number: string | null
          avatar_url: string | null
          street: string | null
          city: string | null
          state: string | null
          country: string | null
          zip_code: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          email: string
          first_name?: string | null
          last_name?: string | null
          role?: 'admin' | 'employee'
          employee_id?: string | null
          position?: string | null
          department?: string | null
          hourly_rate?: number | null
          phone_number?: string | null
          avatar_url?: string | null
          street?: string | null
          city?: string | null
          state?: string | null
          country?: string | null
          zip_code?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          email?: string
          first_name?: string | null
          last_name?: string | null
          role?: 'admin' | 'employee'
          employee_id?: string | null
          position?: string | null
          department?: string | null
          hourly_rate?: number | null
          phone_number?: string | null
          avatar_url?: string | null
          street?: string | null
          city?: string | null
          state?: string | null
          country?: string | null
          zip_code?: string | null
        }
      }
      shifts: {
        Row: {
          id: string
          created_at: string
          employee_id: string
          start_time: string
          end_time: string
          position: string | null
          department: string | null
          notes: string | null
          status: 'scheduled' | 'completed' | 'missed' | 'pending' | 'approved' | 'cancelled'
          location: string | null
          requirements: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          employee_id: string
          start_time: string
          end_time: string
          position?: string | null
          department?: string | null
          notes?: string | null
          status?: 'scheduled' | 'completed' | 'missed' | 'pending' | 'approved' | 'cancelled'
          location?: string | null
          requirements?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          employee_id?: string
          start_time?: string
          end_time?: string
          position?: string | null
          department?: string | null
          notes?: string | null
          status?: 'scheduled' | 'completed' | 'missed' | 'pending' | 'approved' | 'cancelled'
          location?: string | null
          requirements?: string | null
        }
      }
      shift_change_requests: {
        Row: {
          id: string
          created_at: string
          employee_id: string
          my_shift_id: string
          target_shift_id: string
          my_shift_date: string
          target_shift_date: string
          reason: string
          status: 'pending' | 'approved' | 'rejected'
          request_date: string
          updated_at: string
          admin_notes: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          employee_id: string
          my_shift_id: string
          target_shift_id: string
          my_shift_date: string
          target_shift_date: string
          reason: string
          status?: 'pending' | 'approved' | 'rejected'
          request_date?: string
          updated_at?: string
          admin_notes?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          employee_id?: string
          my_shift_id?: string
          target_shift_id?: string
          my_shift_date?: string
          target_shift_date?: string
          reason?: string
          status?: 'pending' | 'approved' | 'rejected'
          request_date?: string
          updated_at?: string
          admin_notes?: string | null
        }
      }
      time_entries: {
        Row: {
          id: string
          created_at: string
          employee_id: string
          shift_id: string | null
          clock_in: string
          clock_out: string | null
          total_hours: number | null
          approved: boolean
          notes: string | null
          punch_in_photo: string | null
          punch_out_photo: string | null
          punch_in_lat: number | null
          punch_in_lng: number | null
          punch_in_address: string | null
          punch_out_lat: number | null
          punch_out_lng: number | null
          punch_out_address: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          employee_id: string
          shift_id?: string | null
          clock_in: string
          clock_out?: string | null
          total_hours?: number | null
          approved?: boolean
          notes?: string | null
          punch_in_photo?: string | null
          punch_out_photo?: string | null
          punch_in_lat?: number | null
          punch_in_lng?: number | null
          punch_in_address?: string | null
          punch_out_lat?: number | null
          punch_out_lng?: number | null
          punch_out_address?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          employee_id?: string
          shift_id?: string | null
          clock_in?: string
          clock_out?: string | null
          total_hours?: number | null
          approved?: boolean
          notes?: string | null
          punch_in_photo?: string | null
          punch_out_photo?: string | null
          punch_in_lat?: number | null
          punch_in_lng?: number | null
          punch_in_address?: string | null
          punch_out_lat?: number | null
          punch_out_lng?: number | null
          punch_out_address?: string | null
        }
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
  }
}
