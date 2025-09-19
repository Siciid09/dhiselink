import { createClient } from '@supabase/supabase-js'

// This reads the keys from your .env.local file
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// This creates the client that you'll use to talk to your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey)