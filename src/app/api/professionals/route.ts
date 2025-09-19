// File Path: app/api/professionals/route.ts

import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET() {
    const supabase = createRouteHandlerClient({ cookies });

    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('id, full_name, title, avatar_url, location, skills')
            .eq('account_type', 'professional') // Fetch only professionals
            .eq('onboarding_complete', true); // Only show completed profiles

        if (error) {
            throw error;
        }

        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
