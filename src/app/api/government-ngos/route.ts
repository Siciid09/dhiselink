import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies });
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, organization_name, bio, location, employee_count, logo_url')
      // This is the change: .in() fetches from a list of roles
      .in('role', ['ngo_gov', 'other']) 
      .eq('onboarding_complete', true);
      
    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any)
   {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}