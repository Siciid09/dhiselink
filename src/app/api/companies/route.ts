import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies });

  try {
    // We query the main 'profiles' table and filter for companies
    const { data, error } = await supabase
      .from('profiles')
      .select('id, organization_name, bio, location, logo_url')
      .eq('role', 'company') // Filter by role
      .eq('onboarding_complete', true); // Only show finished profiles

    if (error) {
      throw error;
    }

    return NextResponse.json(data);

  } catch (error: any) {
    console.error("Supabase error fetching companies:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}