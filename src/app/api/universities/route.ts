// File Path: app/api/universities/route.ts

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client with your project URL and anon key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// API route to fetch all universities
export async function GET() {
    const { data, error } = await supabase.from('universities').select('*');

    if (error) {
        console.error("Supabase error fetching universities:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
}