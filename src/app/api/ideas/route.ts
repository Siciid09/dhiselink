// File Path: app/api/ideas/route.ts

import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

// This is the public GET request to fetch all ideas (already works)
export async function GET() {
    const supabase = createRouteHandlerClient({ cookies });
    const { data, error } = await supabase
        .from('ideas')
        .select(`*, profiles(full_name)`);
    
    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data);
}

// This is the PROTECTED POST request to create a new idea
export async function POST(request: Request) {
    const body = await request.json();
    const supabase = createRouteHandlerClient({ cookies });

    // 1. Get the current user's session from the browser's cookies
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        return NextResponse.json({ error: 'You must be logged in to submit an idea.' }, { status: 401 });
    }

    // 2. Insert the new idea, linking it to the user's ID
    const { data, error } = await supabase
        .from('ideas')
        .insert({
            title: body.title,
            category: body.category,
            summary: body.summary,
            details: body.details,
            seeking: body.seeking,
            status: 'Seeking Collaborators',
            author_id: session.user.id // Link to the logged-in user
        })
        .select()
        .single();
    
    if (error) {
        console.error("Supabase error creating idea:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // 3. Return the newly created idea
    return NextResponse.json(data);
}