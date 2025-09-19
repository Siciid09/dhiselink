// File Path: app/api/organizations/route.ts

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function GET() {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('account_type', 'organization'); // Fetch only organization profiles

        if (error) {
            throw error;
        }

        return NextResponse.json(data);

    } catch (error: any) {
        console.error("Error fetching organizations:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
