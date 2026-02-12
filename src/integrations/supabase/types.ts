export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      loveos_analytics: {
        Row: {
          created_at: string
          icon: string
          id: string
          max_value: number | null
          project_id: string
          sort_order: number
          subtitle: string
          title: string
          type: string
          value: string
        }
        Insert: {
          created_at?: string
          icon?: string
          id?: string
          max_value?: number | null
          project_id: string
          sort_order?: number
          subtitle?: string
          title?: string
          type?: string
          value?: string
        }
        Update: {
          created_at?: string
          icon?: string
          id?: string
          max_value?: number | null
          project_id?: string
          sort_order?: number
          subtitle?: string
          title?: string
          type?: string
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "loveos_analytics_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "loveos_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      loveos_projects: {
        Row: {
          created_at: string
          id: string
          initial_1: string
          initial_2: string
          partner_name: string
          songs_meta: Json
          updated_at: string
          user_id: string
          voice_word: string
        }
        Insert: {
          created_at?: string
          id?: string
          initial_1?: string
          initial_2?: string
          partner_name?: string
          songs_meta?: Json
          updated_at?: string
          user_id: string
          voice_word?: string
        }
        Update: {
          created_at?: string
          id?: string
          initial_1?: string
          initial_2?: string
          partner_name?: string
          songs_meta?: Json
          updated_at?: string
          user_id?: string
          voice_word?: string
        }
        Relationships: []
      }
      loveos_quiz: {
        Row: {
          correct_option: number
          created_at: string
          id: string
          option_1: string
          option_2: string
          option_3: string
          option_4: string
          project_id: string
          question: string
          question_number: number
        }
        Insert: {
          correct_option?: number
          created_at?: string
          id?: string
          option_1?: string
          option_2?: string
          option_3?: string
          option_4?: string
          project_id: string
          question?: string
          question_number: number
        }
        Update: {
          correct_option?: number
          created_at?: string
          id?: string
          option_1?: string
          option_2?: string
          option_3?: string
          option_4?: string
          project_id?: string
          question?: string
          question_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "loveos_quiz_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "loveos_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      loveos_shares: {
        Row: {
          access_code_hash: string
          created_at: string
          id: string
          project_id: string
        }
        Insert: {
          access_code_hash: string
          created_at?: string
          id?: string
          project_id: string
        }
        Update: {
          access_code_hash?: string
          created_at?: string
          id?: string
          project_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "loveos_shares_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "loveos_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      loveos_terminal: {
        Row: {
          command: string
          created_at: string
          id: string
          output: string
          project_id: string
          sort_order: number
        }
        Insert: {
          command?: string
          created_at?: string
          id?: string
          output?: string
          project_id: string
          sort_order?: number
        }
        Update: {
          command?: string
          created_at?: string
          id?: string
          output?: string
          project_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "loveos_terminal_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "loveos_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      users_meta: {
        Row: {
          created_at: string
          id: string
          user_id: string
          username: string
        }
        Insert: {
          created_at?: string
          id?: string
          user_id: string
          username: string
        }
        Update: {
          created_at?: string
          id?: string
          user_id?: string
          username?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_project_owner: { Args: { p_project_id: string }; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
