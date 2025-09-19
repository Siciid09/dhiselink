// File Path: app/api/government-ngos/route.ts

import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// API route to fetch all government bodies and NGOs
export async function GET() {
    // Note the table name is 'gov_ngos' as defined in our SQL script
    const { data, error } = await supabase.from('gov_ngos').select('*');

    if (error) {
        console.error("Supabase error fetching gov_ngos:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
}

