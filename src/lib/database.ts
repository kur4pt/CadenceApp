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
      profiles: {
        Row: {
          id: string
          display_name: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          display_name?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          display_name?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      semesters: {
        Row: {
          id: string
          user_id: string
          name: string
          starts_on: string | null
          ends_on: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          starts_on?: string | null
          ends_on?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          starts_on?: string | null
          ends_on?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      courses: {
        Row: {
          id: string
          user_id: string
          semester_id: string | null
          code: string | null
          name: string
          instructor: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          semester_id?: string | null
          code?: string | null
          name: string
          instructor?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          semester_id?: string | null
          code?: string | null
          name?: string
          instructor?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      calendar_events: {
        Row: {
          id: string
          user_id: string
          course_id: string | null
          kind: 'class' | 'exam' | 'assignment' | 'office_hours' | 'study' | 'personal'
          title: string
          description: string | null
          location: string | null
          starts_at: string
          ends_at: string | null
          status: 'draft' | 'needs_review' | 'confirmed' | 'ignored'
          source_upload_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          course_id?: string | null
          kind: 'class' | 'exam' | 'assignment' | 'office_hours' | 'study' | 'personal'
          title: string
          description?: string | null
          location?: string | null
          starts_at: string
          ends_at?: string | null
          status?: 'draft' | 'needs_review' | 'confirmed' | 'ignored'
          source_upload_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          semester_id?: string | null
          course_id?: string | null
          kind?: 'class' | 'exam' | 'assignment' | 'office_hours' | 'study' | 'personal'
          title?: string
          description?: string | null
          location?: string | null
          starts_at?: string
          ends_at?: string | null
          status?: 'draft' | 'needs_review' | 'confirmed' | 'ignored'
          source_upload_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}