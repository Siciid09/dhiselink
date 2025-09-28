import { NextResponse } from 'next/server';
// UPDATED: Import the new, correct helper for creating a server client
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  // UPDATED: Use the new helper to create a Supabase client
  const supabase = createClient();
  const { searchParams } = new URL(request.url);

  // Get filter parameters from the request URL
  const type = searchParams.get('type');
  const tags = searchParams.get('tags')?.split(',');
  const searchQuery = searchParams.get('search');

  try {
    // --- 1. Fetch all organizations based on filters ---
    let query = supabase
      .from('profiles')
      .select('id, slug, organization_name, logo_url, location, bio, organization_type, tags')
      // Ensure we only get profiles that are organizations
      .in('role', ['organization']); 

    if (type && type !== 'All') {
      query = query.eq('organization_type', type);
    }
    if (tags && tags.length > 0) {
      query = query.contains('tags', tags);
    }
    if (searchQuery) {
        query = query.ilike('organization_name', `%${searchQuery}%`);
    }

    const { data: organizations, error: orgsError } = await query.order('created_at', { ascending: false });
    if (orgsError) throw orgsError;

    // --- 2. Fetch a few featured organizations ---
    const { data: featured, error: featuredError } = await supabase
      .from('profiles')
      .select('id, slug, organization_name, logo_url, location, bio, organization_type, tags')
      .in('role', ['organization'])
      .eq('featured', true)
      .limit(4);
    if (featuredError) throw featuredError;

    // --- 3. Fetch all unique tags using the database function for filtering ---
    const { data: uniqueTags, error: tagsError } = await supabase.rpc('get_unique_organization_tags');
    if (tagsError) throw tagsError;

    // Return all the data in a single, successful response
    return NextResponse.json({ 
        organizations: organizations || [],
        featured: featured || [],
        tags: uniqueTags || [],
    });

  } catch (error: any) {
    console.error("API Error fetching organizations:", error.message);
    return NextResponse.json({ error: `Failed to fetch data: ${error.message}` }, { status: 500 });
  }
}

////////////////////////////