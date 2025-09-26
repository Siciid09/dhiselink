import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const supabase = createRouteHandlerClient({ cookies });
    const { id } = params;

    try {
        const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', id)
            .eq('role', 'individual')
            .single();

        if (error) throw new Error('Professional not found.');

        return NextResponse.json(profile);

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 404 });
    }
}