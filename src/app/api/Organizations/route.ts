import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
    const { data, error } = await supabase.from('gov_ngos').select('*');

    if (error) {
        console.error("Supabase error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
}
