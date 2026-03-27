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
      announcements: {
        Row: {
          attachment_paths: string[] | null
          class_id: string
          content: string
          created_at: string | null
          created_by: string
          deadline: string | null
          id: string
          pinned: boolean | null
          title: string
          updated_at: string | null
        }
        Insert: {
          attachment_paths?: string[] | null
          class_id: string
          content: string
          created_at?: string | null
          created_by: string
          deadline?: string | null
          id?: string
          pinned?: boolean | null
          title: string
          updated_at?: string | null
        }
        Update: {
          attachment_paths?: string[] | null
          class_id?: string
          content?: string
          created_at?: string | null
          created_by?: string
          deadline?: string | null
          id?: string
          pinned?: boolean | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "announcements_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "announcements_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      assignments: {
        Row: {
          attachment_paths: Json | null
          class_id: string
          created_at: string | null
          created_by: string
          description: string | null
          due_date: string | null
          id: string
          is_group_project: boolean | null
          points: number
          rubric_id: string | null
          submission_type: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          attachment_paths?: Json | null
          class_id: string
          created_at?: string | null
          created_by: string
          description?: string | null
          due_date?: string | null
          id?: string
          is_group_project?: boolean | null
          points?: number
          rubric_id?: string | null
          submission_type?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          attachment_paths?: Json | null
          class_id?: string
          created_at?: string | null
          created_by?: string
          description?: string | null
          due_date?: string | null
          id?: string
          is_group_project?: boolean | null
          points?: number
          rubric_id?: string | null
          submission_type?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assignments_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assignments_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assignments_rubric_id_fkey"
            columns: ["rubric_id"]
            isOneToOne: false
            referencedRelation: "rubrics"
            referencedColumns: ["id"]
          },
        ]
      }
      attendance_records: {
        Row: {
          attendance_id: string
          id: string
          status: string
          submitted_at: string | null
          user_id: string
        }
        Insert: {
          attendance_id: string
          id?: string
          status?: string
          submitted_at?: string | null
          user_id: string
        }
        Update: {
          attendance_id?: string
          id?: string
          status?: string
          submitted_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_records_attendance_id_fkey"
            columns: ["attendance_id"]
            isOneToOne: false
            referencedRelation: "attendances"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_records_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      attendances: {
        Row: {
          class_id: string
          closed_at: string | null
          created_at: string | null
          created_by: string
          date: string
          deadline: string | null
          id: string
          title: string | null
          updated_at: string | null
        }
        Insert: {
          class_id: string
          closed_at?: string | null
          created_at?: string | null
          created_by: string
          date: string
          deadline?: string | null
          id?: string
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          class_id?: string
          closed_at?: string | null
          created_at?: string | null
          created_by?: string
          date?: string
          deadline?: string | null
          id?: string
          title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "attendances_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendances_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      class_members: {
        Row: {
          can_manage_groups: boolean | null
          class_id: string
          id: string
          is_pinned: boolean | null
          joined_at: string | null
          role: string
          user_id: string
        }
        Insert: {
          can_manage_groups?: boolean | null
          class_id: string
          id?: string
          is_pinned?: boolean | null
          joined_at?: string | null
          role: string
          user_id: string
        }
        Update: {
          can_manage_groups?: boolean | null
          class_id?: string
          id?: string
          is_pinned?: boolean | null
          joined_at?: string | null
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "class_members_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "class_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      class_notes: {
        Row: {
          class_id: string
          content: string
          created_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          class_id: string
          content: string
          created_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          class_id?: string
          content?: string
          created_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "class_notes_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
        ]
      }
      classes: {
        Row: {
          code: string
          created_at: string | null
          created_by: string
          description: string | null
          id: string
          name: string
          settings: Json | null
          updated_at: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          created_by: string
          description?: string | null
          id?: string
          name: string
          settings?: Json | null
          updated_at?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          created_by?: string
          description?: string | null
          id?: string
          name?: string
          settings?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "classes_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      group_projects: {
        Row: {
          class_id: string
          created_at: string | null
          created_by: string
          id: string
          is_locked: boolean | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          class_id: string
          created_at?: string | null
          created_by: string
          id?: string
          is_locked?: boolean | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          class_id?: string
          created_at?: string | null
          created_by?: string
          id?: string
          is_locked?: boolean | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "group_projects_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_projects_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      material_chunks: {
        Row: {
          chunk_index: number | null
          class_id: string | null
          content: string
          created_at: string | null
          embedding: string | null
          id: string
          material_id: string | null
        }
        Insert: {
          chunk_index?: number | null
          class_id?: string | null
          content: string
          created_at?: string | null
          embedding?: string | null
          id?: string
          material_id?: string | null
        }
        Update: {
          chunk_index?: number | null
          class_id?: string | null
          content?: string
          created_at?: string | null
          embedding?: string | null
          id?: string
          material_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "material_chunks_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "material_chunks_material_id_fkey"
            columns: ["material_id"]
            isOneToOne: false
            referencedRelation: "materials"
            referencedColumns: ["id"]
          },
        ]
      }
      materials: {
        Row: {
          attachment_paths: string[]
          class_id: string
          created_at: string | null
          created_by: string
          description: string | null
          file_types: string[] | null
          id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          attachment_paths: string[]
          class_id: string
          created_at?: string | null
          created_by: string
          description?: string | null
          file_types?: string[] | null
          id?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          attachment_paths?: string[]
          class_id?: string
          created_at?: string | null
          created_by?: string
          description?: string | null
          file_types?: string[] | null
          id?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "materials_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "materials_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      poll_responses: {
        Row: {
          created_at: string | null
          id: string
          poll_id: string
          selected_option_index: number
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          poll_id: string
          selected_option_index: number
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          poll_id?: string
          selected_option_index?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "poll_responses_poll_id_fkey"
            columns: ["poll_id"]
            isOneToOne: false
            referencedRelation: "polls"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "poll_responses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      polls: {
        Row: {
          class_id: string
          closed_at: string | null
          created_at: string | null
          created_by: string
          deadline: string | null
          id: string
          options: Json
          question: string
          updated_at: string | null
        }
        Insert: {
          class_id: string
          closed_at?: string | null
          created_at?: string | null
          created_by: string
          deadline?: string | null
          id?: string
          options: Json
          question: string
          updated_at?: string | null
        }
        Update: {
          class_id?: string
          closed_at?: string | null
          created_at?: string | null
          created_by?: string
          deadline?: string | null
          id?: string
          options?: Json
          question?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "polls_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "polls_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      project_members: {
        Row: {
          id: string
          joined_at: string | null
          project_id: string
          role: string
          user_id: string
        }
        Insert: {
          id?: string
          joined_at?: string | null
          project_id: string
          role: string
          user_id: string
        }
        Update: {
          id?: string
          joined_at?: string | null
          project_id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_members_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "group_projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_members_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "student_group_status"
            referencedColumns: ["group_id"]
          },
          {
            foreignKeyName: "project_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      rubrics: {
        Row: {
          created_at: string | null
          created_by: string
          criteria: Json
          id: string
          name: string
          total_points: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          criteria: Json
          id?: string
          name: string
          total_points: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          criteria?: Json
          id?: string
          name?: string
          total_points?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rubrics_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      submissions: {
        Row: {
          ai_feedback: string | null
          ai_grade: number | null
          assignment_id: string
          content: string | null
          created_at: string | null
          files: Json | null
          final_grade: number | null
          group_id: string | null
          id: string
          manual_grade: number | null
          status: string
          submitted_at: string | null
          teacher_feedback: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          ai_feedback?: string | null
          ai_grade?: number | null
          assignment_id: string
          content?: string | null
          created_at?: string | null
          files?: Json | null
          final_grade?: number | null
          group_id?: string | null
          id?: string
          manual_grade?: number | null
          status?: string
          submitted_at?: string | null
          teacher_feedback?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          ai_feedback?: string | null
          ai_grade?: number | null
          assignment_id?: string
          content?: string | null
          created_at?: string | null
          files?: Json | null
          final_grade?: number | null
          group_id?: string | null
          id?: string
          manual_grade?: number | null
          status?: string
          submitted_at?: string | null
          teacher_feedback?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "submissions_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "assignments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "submissions_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "group_projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "submissions_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "student_group_status"
            referencedColumns: ["group_id"]
          },
          {
            foreignKeyName: "submissions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      student_group_status: {
        Row: {
          class_id: string | null
          group_id: string | null
          group_name: string | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "group_projects_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      check_is_class_member: { Args: { class_id: string }; Returns: boolean }
      get_student_count: { Args: { class_id: number }; Returns: number }
      get_user_dashboard_data: { Args: { p_user_id: string }; Returns: Json }
      is_member_of_class: { Args: { _class_id: string }; Returns: boolean }
      is_teacher: { Args: { _class_id: string }; Returns: boolean }
      match_material_chunks: {
        Args: {
          class_id: string
          match_count?: number
          query_embedding: string
        }
        Returns: {
          content: string
          id: string
          similarity: number
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
