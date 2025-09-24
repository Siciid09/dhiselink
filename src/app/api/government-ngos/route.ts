import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies });
  try {
    // This now calls the single, robust database function
    // which is more reliable and prevents the hanging/infinite load issue.
    const { data, error } = await supabase.rpc('get_government_and_other_orgs');
    
    if (error) {
        console.error("Supabase RPC error fetching government/ngos:", error);
        throw error;
    }
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

