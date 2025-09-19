// File Path: app/api/opportunities/route.ts

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function GET() {
    const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('status', 'active') // Only fetch active jobs
        .order('featured', { ascending: false }) // Show featured jobs first
        .order('created_at', { ascending: false }); // Then sort by newest

    if (error) {
        console.error("Supabase error fetching opportunities:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
}
