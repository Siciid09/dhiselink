import { Database } from './database.types';

// This creates simple shortcuts for your most used table types.
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Job = Database['public']['Tables']['jobs']['Row'];
export type Gallery = Database['public']['Tables']['galleries']['Row'];
export type Initiative = Database['public']['Tables']['initiatives']['Row'];
export type Program = Database['public']['Tables']['programs']['Row'];
export type Service = Database['public']['Tables']['services']['Row'];
export type Idea = Database['public']['Tables']['ideas']['Row'];
export type HeritageSite = Database['public']['Tables']['heritage_sites']['Row'];
