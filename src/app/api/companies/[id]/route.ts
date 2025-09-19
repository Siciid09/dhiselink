import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client with your project URL and anon key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;

    if (!id) {
        return NextResponse.json({ error: 'Company ID is required' }, { status: 400 });
    }

    // Fetch a single company by its ID
    const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('id', id)
        .single(); // .single() is crucial to get one object, not an array

    if (error) {
        console.error("Error fetching company:", error);
        // If the company is not found, Supabase returns an error
        return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    return NextResponse.json(data);
}
