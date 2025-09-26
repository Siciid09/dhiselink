import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const tags = searchParams.get('tags')?.split(',');
  const searchQuery = searchParams.get('search');

  try {
    // --- UPDATED: Added 'slug' to the select statement ---
    let query = supabase
      .from('profiles')
      .select('id, slug, organization_name, logo_url, location, bio, organization_type, tags')
      .in('role', ['organization', 'company', 'university', 'ngo']);

    if (type && type !== 'All') {
      query = query.eq('organization_type', type);
    }
    if (tags && tags.length > 0) {
      query = query.contains('tags', tags);
    }
    if (searchQuery) {
        query = query.ilike('organization_name', `%${searchQuery}%`);
    }

    const { data: organizations, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;

    // --- UPDATED: Added 'slug' to the select statement for featured orgs ---
    const { data: featured, error: featuredError } = await supabase
      .from('profiles')
      .select('id, slug, organization_name, logo_url, location, bio, organization_type, tags')
      .in('role', ['organization', 'company', 'university', 'ngo'])
      .eq('featured', true)
      .limit(4);
    if (featuredError) throw featuredError;

    const { data: uniqueTags, error: tagsError } = await supabase.rpc('get_unique_organization_tags');
    if (tagsError) throw tagsError;

    return NextResponse.json({ 
        organizations: organizations || [],
        featured: featured || [],
        tags: uniqueTags || [],
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}