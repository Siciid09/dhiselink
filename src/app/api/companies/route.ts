import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase'; // Make sure this path is correct

export async function GET() {
    // This function securely fetches data on the server
    
    const { data, error } = await supabase.from('companies').select('*');

    if (error) {
        // If there's an error, send it back
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // If successful, send back the list of companies
    return NextResponse.json(data);
}