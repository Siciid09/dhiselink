import { createClient } from '@/lib/supabase/server';
import { type NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    const supabase = createClient();
    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get('q') || '';

    try {
        let query = supabase
            .from('profiles')
            .select(`id, slug, full_name, professional_title, avatar_url, location, bio, skills, experience_level, years_of_experience`)
            .eq('role', 'individual')
            .eq('onboarding_complete', true);

        if (searchQuery) {
            query = query.or(`full_name.ilike.%${searchQuery}%,professional_title.ilike.%${searchQuery}%`);
        }

        const { data, error } = await query.order('created_at', { ascending: false });
        if (error) throw error;
        return NextResponse.json(data);

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}