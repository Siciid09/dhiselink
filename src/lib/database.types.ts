export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          organization_name: string | null;
          email: string | null;
          role: string | null;
          is_banned: boolean | null;
        };
        Insert: {
          full_name?: string | null;
          organization_name?: string | null;
          email?: string | null;
          role?: string | null;
          is_banned?: boolean | null;
        };
        Update: {
          full_name?: string | null;
          organization_name?: string | null;
          email?: string | null;
          role?: string | null;
          is_banned?: boolean | null;
        };
      };
      jobs: {
        Row: {
          id: string;
          title: string | null;
          profiles?: {
            organization_name?: string | null;
          };
          created_at: string | null;
          status: string | null;
        };
        Insert: {
          title?: string | null;
          profiles?: {
            organization_name?: string | null;
          };
          created_at?: string | null;
          status?: string | null;
        };
        Update: {
          title?: string | null;
          profiles?: {
            organization_name?: string | null;
          };
          created_at?: string | null;
          status?: string | null;
        };
      };
    };
    Views: {};
    Functions: {};
  };
};
