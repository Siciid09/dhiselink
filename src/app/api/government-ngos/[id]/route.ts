// File Path: app/api/government-ngos/[id]/route.ts
// File Path: app/api/government-ngos/[id]/route.ts

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client with your project URL and anon key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;

    if (!id) {
        return NextResponse.json({ error: 'Institution ID is required' }, { status: 400 });
    }

    // Fetch a single record from the 'gov_ngos' table by its ID
    const { data, error } = await supabase
        .from('gov_ngos')
        .select('*')
        .eq('id', id)
        .single(); // Use .single() to get one object, not an array

    if (error) {
        console.error("Error fetching institution:", error);
        return NextResponse.json({ error: "Institution not found" }, { status: 404 });
    }

    return NextResponse.json(data);
}

