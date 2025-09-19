// File Path: app/api/professionals/[id]/route.ts

import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const supabase = createRouteHandlerClient({ cookies });
    const { id } = params;

    try {
        // Fetch professional's profile details
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', id)
            .single();

        if (profileError) {
            throw new Error('Professional not found.');
        }

        // Fetch the ideas authored by this professional
        const { data: ideas, error: ideasError } = await supabase
            .from('ideas')
            .select('id, title, summary, created_at')
            .eq('author_id', id);
        
        if (ideasError) {
           console.error("Error fetching ideas for professional:", ideasError);
        }

        // Combine the data into a single response
        const responseData = {
            ...profile,
            ideas: ideas || [], // Return ideas or an empty array
        };

        return NextResponse.json(responseData);

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 404 });
    }
}
