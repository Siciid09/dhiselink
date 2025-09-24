// File: src/app/api/professionals/route.ts

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  
  const { searchParams } = new URL(request.url);
  const searchQuery = searchParams.get('q') || '';
  const skillsQuery = searchParams.get('skills') || '';
  const locationQuery = searchParams.get('location') || ''; // Also added location to the search logic

  try {
    let query = supabase
      .from('profiles')
      // FIX: Added 'location' and 'bio' to fetch the missing data
      .select('id, full_name, professional_title, avatar_url, skills, location, bio, tags')
      .eq('role', 'individual')
      .eq('onboarding_complete', true);

    if (searchQuery) {
      query = query.or(`full_name.ilike.%${searchQuery}%,professional_title.ilike.%${searchQuery}%`);
    }

    if (skillsQuery) {
      // Handles searching for multiple skills, e.g., "react, node"
      const skillsArray = skillsQuery.split(',').map(s => s.trim());
      query = query.or(
        skillsArray.map(skill => `skills.cs.{"${skill}"}`).join(',')
      );
    }

    if (locationQuery) {
        query = query.ilike('location', `%${locationQuery}%`);
    }

    const { data, error } = await query.order('full_name');

    if (error) throw error;

    return NextResponse.json(data);

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}