// File Path: app/api/profile/route.ts

import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

// GET function to fetch the current user's complete profile
export async function GET() {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // First, try to fetch from the 'profiles' table (for individuals/professionals)
    let { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

    // If no profile is found, check the 'organizations' table
    if (!profile) {
        let { data: orgData, error: orgError } = await supabase
            .from('organizations')
            .select('*')
            .eq('id', session.user.id)
            .single();

        if (orgData) {
            profile = orgData; // Assign the organization data to the profile variable
        } else {
             return NextResponse.json({ error: "Profile record not found for this user." }, { status: 404 });
        }
    }

    return NextResponse.json(profile);
}


// PUT function to intelligently update the correct profile table
export async function PUT(request: Request) {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    
    // First, determine the user's account type by checking the database
    let { data: existingProfile } = await supabase.from('profiles').select('account_type').eq('id', session.user.id).single();
    if (!existingProfile) {
        existingProfile = (await supabase.from('organizations').select('account_type').eq('id', session.user.id).single()).data;
    }

    if (!existingProfile) {
        return NextResponse.json({ error: "Cannot find a profile or organization for this user to update." }, { status: 404 });
    }

    const isOrganization = existingProfile.account_type === 'organization';
    const tableName = isOrganization ? 'organizations' : 'profiles';
    
    const body = await request.json();
    // Remove fields that should not be updated by the user
    const { id, account_type, email, created_at, updated_at, ...updateData } = body;

    const { data, error } = await supabase
        .from(tableName)
        .update(updateData)
        .eq('id', session.user.id)
        .select()
        .single(); // Using .single() is safe now because we know the record exists.

    if (error) {
        console.error('Supabase Update Error:', error);
        return NextResponse.json({ error: `Database error: ${error.message}` }, { status: 500 });
    }

    return NextResponse.json(data);
}

