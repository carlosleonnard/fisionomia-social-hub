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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      comment_likes: {
        Row: {
          comment_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          comment_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          comment_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comment_likes_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comment_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      comments: {
        Row: {
          content: string
          created_at: string
          id: string
          likes_count: number | null
          parent_comment_id: string | null
          profile_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          likes_count?: number | null
          parent_comment_id?: string | null
          profile_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          likes_count?: number | null
          parent_comment_id?: string | null
          profile_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      complete_profiles: {
        Row: {
          ancestry: string
          body_type: string | null
          category: string
          country: string
          created_at: string
          description: string | null
          eye_color: string | null
          face_shape: string | null
          facial_breadth: string | null
          front_image_url: string
          gender: string
          general_phenotype_primary: string | null
          general_phenotype_secondary: string | null
          general_phenotype_tertiary: string | null
          hair_color: string | null
          hair_texture: string | null
          head_breadth: string | null
          height: number
          id: string
          is_anonymous: boolean
          jaw_type: string | null
          name: string
          nasal_breadth: string | null
          profile_id: string
          profile_image_url: string | null
          region: string | null
          skin_tone: string | null
          specific_phenotype_primary: string | null
          specific_phenotype_secondary: string | null
          specific_phenotype_tertiary: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          ancestry: string
          body_type?: string | null
          category: string
          country: string
          created_at?: string
          description?: string | null
          eye_color?: string | null
          face_shape?: string | null
          facial_breadth?: string | null
          front_image_url: string
          gender: string
          general_phenotype_primary?: string | null
          general_phenotype_secondary?: string | null
          general_phenotype_tertiary?: string | null
          hair_color?: string | null
          hair_texture?: string | null
          head_breadth?: string | null
          height: number
          id?: string
          is_anonymous?: boolean
          jaw_type?: string | null
          name: string
          nasal_breadth?: string | null
          profile_id: string
          profile_image_url?: string | null
          region?: string | null
          skin_tone?: string | null
          specific_phenotype_primary?: string | null
          specific_phenotype_secondary?: string | null
          specific_phenotype_tertiary?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          ancestry?: string
          body_type?: string | null
          category?: string
          country?: string
          created_at?: string
          description?: string | null
          eye_color?: string | null
          face_shape?: string | null
          facial_breadth?: string | null
          front_image_url?: string
          gender?: string
          general_phenotype_primary?: string | null
          general_phenotype_secondary?: string | null
          general_phenotype_tertiary?: string | null
          hair_color?: string | null
          hair_texture?: string | null
          head_breadth?: string | null
          height?: number
          id?: string
          is_anonymous?: boolean
          jaw_type?: string | null
          name?: string
          nasal_breadth?: string | null
          profile_id?: string
          profile_image_url?: string | null
          region?: string | null
          skin_tone?: string | null
          specific_phenotype_primary?: string | null
          specific_phenotype_secondary?: string | null
          specific_phenotype_tertiary?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "complete_profiles_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          comment_id: string | null
          created_at: string
          id: string
          is_read: boolean | null
          message: string
          profile_id: string | null
          type: string
          user_id: string
        }
        Insert: {
          comment_id?: string | null
          created_at?: string
          id?: string
          is_read?: boolean | null
          message: string
          profile_id?: string | null
          type: string
          user_id: string
        }
        Update: {
          comment_id?: string | null
          created_at?: string
          id?: string
          is_read?: boolean | null
          message?: string
          profile_id?: string | null
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          id: string
          name: string | null
          nickname: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          id: string
          name?: string | null
          nickname: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string | null
          nickname?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles_data: {
        Row: {
          age: number | null
          category: string | null
          created_at: string
          description: string | null
          front_image: string | null
          gender: string | null
          height: string | null
          id: string
          location: string | null
          name: string
          profile_id: string
          side_image: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          age?: number | null
          category?: string | null
          created_at?: string
          description?: string | null
          front_image?: string | null
          gender?: string | null
          height?: string | null
          id?: string
          location?: string | null
          name: string
          profile_id: string
          side_image?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          age?: number | null
          category?: string | null
          created_at?: string
          description?: string | null
          front_image?: string | null
          gender?: string | null
          height?: string | null
          id?: string
          location?: string | null
          name?: string
          profile_id?: string
          side_image?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_data_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          ancestry: string
          category: string
          country: string
          created_at: string
          front_image_url: string
          gender: string
          height: number
          id: string
          is_anonymous: boolean
          name: string
          profile_image_url: string | null
          slug: string
          updated_at: string
          user_id: string
        }
        Insert: {
          ancestry: string
          category: string
          country: string
          created_at?: string
          front_image_url: string
          gender: string
          height: number
          id?: string
          is_anonymous?: boolean
          name: string
          profile_image_url?: string | null
          slug: string
          updated_at?: string
          user_id: string
        }
        Update: {
          ancestry?: string
          category?: string
          country?: string
          created_at?: string
          front_image_url?: string
          gender?: string
          height?: number
          id?: string
          is_anonymous?: boolean
          name?: string
          profile_image_url?: string | null
          slug?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      votes: {
        Row: {
          characteristic_type: string | null
          classification: string
          created_at: string
          id: string
          profile_id: string
          user_id: string
        }
        Insert: {
          characteristic_type?: string | null
          classification: string
          created_at?: string
          id?: string
          profile_id: string
          user_id: string
        }
        Update: {
          characteristic_type?: string | null
          classification?: string
          created_at?: string
          id?: string
          profile_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "votes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_view_sensitive_profile_data: {
        Args: { target_profile_id: string; target_user_id: string }
        Returns: boolean
      }
      compute_region_from_general: {
        Args: { primary_text: string }
        Returns: string
      }
      create_notification: {
        Args: {
          notification_message: string
          notification_type: string
          target_comment_id?: string
          target_profile_id?: string
          target_user_id: string
        }
        Returns: string
      }
      delete_comment_and_children: {
        Args: { comment_id_param: string }
        Returns: undefined
      }
      generate_random_nickname: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_unique_slug: {
        Args: { profile_id?: string; profile_name: string }
        Returns: string
      }
      get_public_profile_name: {
        Args: { p_user_id: string }
        Returns: {
          id: string
          name: string
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
