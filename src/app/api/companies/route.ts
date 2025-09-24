// File: app/api/companies/route.ts

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies });

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        id,
        organization_name,
        logo_url,
        cover_image_url,
        location,
        industry,
        tagline
      `)
      .eq('role', 'company')
      .eq('onboarding_complete', true)
      .order('organization_name');

    if (error) throw error;

    return NextResponse.json(data);

  } catch (error: any) {
    console.error("Supabase error fetching companies:", error);
    return NextResponse.json({ error: "Failed to fetch companies." }, { status: 500 });
  }
}