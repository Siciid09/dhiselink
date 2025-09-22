import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies });

  try {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    // If Supabase returns an error, we throw it to the catch block
    if (error) {
      throw error;
    }

    return NextResponse.json(data);

  } catch (error: any) {
    // THIS IS THE MODIFIED PART
    // It logs the full error to your server console
    console.error("Full API Error:", error); 

    // It returns the full error details in the response
    return NextResponse.json(
      { 
        message: "API failed to fetch jobs. See details.",
        details: error.message,
        hint: error.hint,
        code: error.code,
      }, 
      { status: 500 }
    );
  }
}