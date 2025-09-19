// File Path: app/api/profile/route.ts

import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

// GET function to fetch the current user's profile
export async function GET() {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
        
    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
}

// PUT function to update the current user's profile
export async function PUT(request: Request) {
    const body = await request.json();
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { data, error } = await supabase
        .from('profiles')
        .update({
            full_name: body.full_name,
            title: body.title,
            // Add other fields you want to be updatable here, like 'skills', 'summary' etc.
        })
        .eq('id', session.user.id)
        .select()
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
}