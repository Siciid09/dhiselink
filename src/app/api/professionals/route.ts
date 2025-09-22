import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  
  // Get search params from the request URL
  const { searchParams } = new URL(request.url);
  const searchQuery = searchParams.get('q') || '';
  const skillsQuery = searchParams.get('skills') || '';

  try {
    let query = supabase
      .from('profiles')
      .select('id, full_name, professional_title, avatar_url, skills')
      .eq('role', 'individual')
      .eq('onboarding_complete', true);

    if (searchQuery) {
      query = query.or(`full_name.ilike.%${searchQuery}%,professional_title.ilike.%${searchQuery}%`);
    }

    if (skillsQuery) {
      const skillsArray = `{${skillsQuery.split(',').map(s => s.trim()).join(',')}}`;
      query = query.filter('skills', 'cs', skillsArray);
    }

    const { data, error } = await query.order('full_name');

    if (error) throw error;

    return NextResponse.json(data);

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}