// File Path: app/api/profile/setup/route.ts

import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    
    const body = await request.json();
    const { accountType, ...profileData } = body;
    
    if (!accountType || !profileData) {
        return NextResponse.json({ error: 'Missing account type or profile data.' }, { status: 400 });
    }

    const isOrganization = accountType === 'organization';
    const tableName = isOrganization ? 'organizations' : 'profiles';

    // Set the onboarding_complete flag to true
    const dataToUpdate = {
        ...profileData,
        onboarding_complete: true,
    };
    
    // Use upsert to create or update the profile record.
    // This is safer than just 'insert'.
    const { data, error } = await supabase
        .from(tableName)
        .update(dataToUpdate)
        .eq('id', session.user.id)
        .select()
        .single();

    if (error) {
        console.error('Profile Setup Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
}
