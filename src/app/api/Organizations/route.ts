// File: app/api/organizations/[id]/route.ts

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const supabase = createRouteHandlerClient({ cookies });
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: 'An ID is required.' }, { status: 400 });
  }

  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      // This selects every possible field for any organization type
      .select(`
        *, 
        organization_name, industry, tagline, cover_image_url, 
        contact_email, phone_number, social_linkedin, social_twitter,
        mission_vision, employee_count, key_services,
        accreditation, programs, faculties,
        community_focus, members_count, public_services
      `)
      .eq('id', id)
      .single();

    if (error) {
        // This will happen if the profile ID doesn't exist
        console.error('Supabase fetch error:', error.message);
        throw new Error('Profile not found.');
    }
    
    return NextResponse.json(profile);

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }
}