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
      galleries: {
        Row: {
          author_id: string | null
          created_at: string
          description: string | null
          id: string
          images: Json | null
          organization_id: string | null
          organization_logo_url: string | null
          organization_name: string | null
          title: string
        }
        Insert: {
          author_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          images?: Json | null
          organization_id?: string | null
          organization_logo_url?: string | null
          organization_name?: string | null
          title: string
        }
        Update: {
          author_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          images?: Json | null
          organization_id?: string | null
          organization_logo_url?: string | null
          organization_name?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "galleries_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "galleries_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      heritage_sites: {
        Row: {
          author_id: string | null
          category: string
          cover_image_url: string
          created_at: string
          description: string | null
          gallery_images: Json | null
          id: string
          location: string
          status: string | null
          summary: string
          title: string
        }
        Insert: {
          author_id?: string | null
          category: string
          cover_image_url: string
          created_at?: string
          description?: string | null
          gallery_images?: Json | null
          id?: string
          location: string
          status?: string | null
          summary: string
          title: string
        }
        Update: {
          author_id?: string | null
          category?: string
          cover_image_url?: string
          created_at?: string
          description?: string | null
          gallery_images?: Json | null
          id?: string
          location?: string
          status?: string | null
          summary?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "heritage_sites_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ideas: {
        Row: {
          author_id: string
          category: string | null
          cover_image_url: string | null
          created_at: string
          details: string | null
          expected_impact: string | null
          id: string
          other_images: Json | null
          seeking: string | null
          status: string | null
          summary: string | null
          tags: Json | null
          title: string | null
          visibility: string | null
        }
        Insert: {
          author_id: string
          category?: string | null
          cover_image_url?: string | null
          created_at?: string
          details?: string | null
          expected_impact?: string | null
          id?: string
          other_images?: Json | null
          seeking?: string | null
          status?: string | null
          summary?: string | null
          tags?: Json | null
          title?: string | null
          visibility?: string | null
        }
        Update: {
          author_id?: string
          category?: string | null
          cover_image_url?: string | null
          created_at?: string
          details?: string | null
          expected_impact?: string | null
          id?: string
          other_images?: Json | null
          seeking?: string | null
          status?: string | null
          summary?: string | null
          tags?: Json | null
          title?: string | null
          visibility?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ideas_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      initiatives: {
        Row: {
          application_deadline: string | null
          created_at: string
          description: string | null
          end_date: string | null
          event_datetime: string | null
          funding_amount: string | null
          id: string
          image_url: string | null
          organization_id: string
          organization_logo_url: string | null
          organization_name: string | null
          tags: Json | null
          title: string | null
          type: string | null
          venue: string | null
        }
        Insert: {
          application_deadline?: string | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          event_datetime?: string | null
          funding_amount?: string | null
          id?: string
          image_url?: string | null
          organization_id: string
          organization_logo_url?: string | null
          organization_name?: string | null
          tags?: Json | null
          title?: string | null
          type?: string | null
          venue?: string | null
        }
        Update: {
          application_deadline?: string | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          event_datetime?: string | null
          funding_amount?: string | null
          id?: string
          image_url?: string | null
          organization_id?: string
          organization_logo_url?: string | null
          organization_name?: string | null
          tags?: Json | null
          title?: string | null
          type?: string | null
          venue?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "initiatives_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          applications_count: number | null
          created_at: string
          deadline: string | null
          description: string | null
          external_link: string | null
          featured: boolean | null
          id: string
          image_url: string | null
          industry: string | null
          location: string | null
          organization_id: string
          organization_logo_url: string | null
          organization_name: string | null
          posted_by_email: string | null
          posted_by_name: string | null
          requirements: string | null
          salary_range: string | null
          short_description: string | null
          status: string | null
          tags: Json | null
          title: string
          type: string | null
          updated_at: string
          views_count: number | null
        }
        Insert: {
          applications_count?: number | null
          created_at?: string
          deadline?: string | null
          description?: string | null
          external_link?: string | null
          featured?: boolean | null
          id?: string
          image_url?: string | null
          industry?: string | null
          location?: string | null
          organization_id: string
          organization_logo_url?: string | null
          organization_name?: string | null
          posted_by_email?: string | null
          posted_by_name?: string | null
          requirements?: string | null
          salary_range?: string | null
          short_description?: string | null
          status?: string | null
          tags?: Json | null
          title: string
          type?: string | null
          updated_at?: string
          views_count?: number | null
        }
        Update: {
          applications_count?: number | null
          created_at?: string
          deadline?: string | null
          description?: string | null
          external_link?: string | null
          featured?: boolean | null
          id?: string
          image_url?: string | null
          industry?: string | null
          location?: string | null
          organization_id?: string
          organization_logo_url?: string | null
          organization_name?: string | null
          posted_by_email?: string | null
          posted_by_name?: string | null
          requirements?: string | null
          salary_range?: string | null
          short_description?: string | null
          status?: string | null
          tags?: Json | null
          title?: string
          type?: string | null
          updated_at?: string
          views_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "jobs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      programs: {
        Row: {
          application_deadline: string | null
          created_at: string
          department: string | null
          description: string | null
          eligibility_criteria: string | null
          end_date: string | null
          id: string
          image_url: string | null
          organization_id: string
          organization_logo_url: string | null
          organization_name: string | null
          short_description: string | null
          start_date: string | null
          tags: Json | null
          title: string
        }
        Insert: {
          application_deadline?: string | null
          created_at?: string
          department?: string | null
          description?: string | null
          eligibility_criteria?: string | null
          end_date?: string | null
          id?: string
          image_url?: string | null
          organization_id: string
          organization_logo_url?: string | null
          organization_name?: string | null
          short_description?: string | null
          start_date?: string | null
          tags?: Json | null
          title: string
        }
        Update: {
          application_deadline?: string | null
          created_at?: string
          department?: string | null
          description?: string | null
          eligibility_criteria?: string | null
          end_date?: string | null
          id?: string
          image_url?: string | null
          organization_id?: string
          organization_logo_url?: string | null
          organization_name?: string | null
          short_description?: string | null
          start_date?: string | null
          tags?: Json | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "programs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          accreditation: string | null
          announcements: string | null
          avatar_url: string | null
          awards: Json | null
          bio: string | null
          certifications: Json | null
          community_focus: string | null
          cover_image_url: string | null
          created_at: string
          departments: Json | null
          education: Json | null
          email: string | null
          employee_count: string | null
          experience_level: string | null
          faculties: Json | null
          featured: boolean | null
          full_name: string | null
          github_url: string | null
          id: string
          industry: string | null
          is_admin: boolean | null
          key_contacts: Json | null
          key_services: Json | null
          languages: Json | null
          linkedin_url: string | null
          location: string | null
          logo_url: string | null
          members_count: number | null
          mission_vision: string | null
          notable_alumni: Json | null
          onboarding_complete: boolean
          operating_regions: Json | null
          organization_name: string | null
          organization_subtype: string | null
          organization_type: string | null
          phone: string | null
          portfolio_url: string | null
          products_offerings: Json | null
          professional_title: string | null
          programs: Json | null
          projects: Json | null
          public_services: Json | null
          research_projects: Json | null
          resume_url: string | null
          role: string | null
          skills: Json | null
          slug: string | null
          social_links: Json | null
          tagline: string | null
          tags: Json | null
          visibility: string | null
          website_url: string | null
          work_experience: Json | null
          year_founded: number | null
          years_of_experience: number | null
        }
        Insert: {
          accreditation?: string | null
          announcements?: string | null
          avatar_url?: string | null
          awards?: Json | null
          bio?: string | null
          certifications?: Json | null
          community_focus?: string | null
          cover_image_url?: string | null
          created_at?: string
          departments?: Json | null
          education?: Json | null
          email?: string | null
          employee_count?: string | null
          experience_level?: string | null
          faculties?: Json | null
          featured?: boolean | null
          full_name?: string | null
          github_url?: string | null
          id: string
          industry?: string | null
          is_admin?: boolean | null
          key_contacts?: Json | null
          key_services?: Json | null
          languages?: Json | null
          linkedin_url?: string | null
          location?: string | null
          logo_url?: string | null
          members_count?: number | null
          mission_vision?: string | null
          notable_alumni?: Json | null
          onboarding_complete?: boolean
          operating_regions?: Json | null
          organization_name?: string | null
          organization_subtype?: string | null
          organization_type?: string | null
          phone?: string | null
          portfolio_url?: string | null
          products_offerings?: Json | null
          professional_title?: string | null
          programs?: Json | null
          projects?: Json | null
          public_services?: Json | null
          research_projects?: Json | null
          resume_url?: string | null
          role?: string | null
          skills?: Json | null
          slug?: string | null
          social_links?: Json | null
          tagline?: string | null
          tags?: Json | null
          visibility?: string | null
          website_url?: string | null
          work_experience?: Json | null
          year_founded?: number | null
          years_of_experience?: number | null
        }
        Update: {
          accreditation?: string | null
          announcements?: string | null
          avatar_url?: string | null
          awards?: Json | null
          bio?: string | null
          certifications?: Json | null
          community_focus?: string | null
          cover_image_url?: string | null
          created_at?: string
          departments?: Json | null
          education?: Json | null
          email?: string | null
          employee_count?: string | null
          experience_level?: string | null
          faculties?: Json | null
          featured?: boolean | null
          full_name?: string | null
          github_url?: string | null
          id?: string
          industry?: string | null
          is_admin?: boolean | null
          key_contacts?: Json | null
          key_services?: Json | null
          languages?: Json | null
          linkedin_url?: string | null
          location?: string | null
          logo_url?: string | null
          members_count?: number | null
          mission_vision?: string | null
          notable_alumni?: Json | null
          onboarding_complete?: boolean
          operating_regions?: Json | null
          organization_name?: string | null
          organization_subtype?: string | null
          organization_type?: string | null
          phone?: string | null
          portfolio_url?: string | null
          products_offerings?: Json | null
          professional_title?: string | null
          programs?: Json | null
          projects?: Json | null
          public_services?: Json | null
          research_projects?: Json | null
          resume_url?: string | null
          role?: string | null
          skills?: Json | null
          slug?: string | null
          social_links?: Json | null
          tagline?: string | null
          tags?: Json | null
          visibility?: string | null
          website_url?: string | null
          work_experience?: Json | null
          year_founded?: number | null
          years_of_experience?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          created_at: string
          description: string | null
          gallery_images: Json | null
          id: string
          image_url: string | null
          organization_id: string
          organization_logo_url: string | null
          organization_name: string | null
          short_description: string | null
          tags: Json | null
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          gallery_images?: Json | null
          id?: string
          image_url?: string | null
          organization_id: string
          organization_logo_url?: string | null
          organization_name?: string | null
          short_description?: string | null
          tags?: Json | null
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          gallery_images?: Json | null
          id?: string
          image_url?: string | null
          organization_id?: string
          organization_logo_url?: string | null
          organization_name?: string | null
          short_description?: string | null
          tags?: Json | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "services_organization_id_fkey"
            columns: ["organization_id"]
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
      get_unique_organization_tags: {
        Args: Record<PropertyKey, never>
        Returns: string[]
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

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
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
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
        Database["public"]["Views"])
    ? (Database["public"]["Tables"] &
        Database["public"]["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
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
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
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
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
    ? Database["public"]["Enums"][PublicEnumNameOrOptions]
    : never
