// File Path: app/api/opportunities/[id]/route.ts

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;

    if (!id) {
        return NextResponse.json({ error: 'Job ID is required' }, { status: 400 });
    }

    const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error("Error fetching single opportunity:", error);
        return NextResponse.json({ error: "Opportunity not found" }, { status: 404 });
    }

    return NextResponse.json(data);
}
