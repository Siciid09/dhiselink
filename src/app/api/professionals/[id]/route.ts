// File Path: app/api/professionals/[id]/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;

    const { data, error } = await supabase
        .from('professionals')
        .select('*')
        .eq('id', id)
        .single(); // Use .single() to get one object, not an array

    if (error) {
        console.error("Error fetching professional:", error);
        return NextResponse.json({ error: error.message }, { status: 404 });
    }

    return NextResponse.json(data);
}
