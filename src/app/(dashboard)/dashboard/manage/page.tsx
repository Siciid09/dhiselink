import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import ManagementClientUI from './ManagePageClient';

// Helper function to create the correct public URL for any content type
const getViewUrl = (item: any) => {
    const slugOrId = item.slug || item.id;
    switch (item.type) {
        case 'job': return `/opportunities/jobs/${slugOrId}`;
        case 'idea': return `/ideas/${slugOrId}`;
        case 'service': return `/services/${slugOrId}`;
        case 'program': return `/programs/${slugOrId}`;
        case 'gallery': return `/galleries/${slugOrId}`;
        case 'heritage_site': return `/heritage/${slugOrId}`; // Corrected: Added heritage site case
        default: return `/`;
    }
};

export default async function ManageContentPage() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    // Fetch all types of content, making sure to select the 'slug'
    const jobsPromise = supabase.from('jobs').select('id, slug, title, status, created_at').eq('organization_id', user.id);
    const ideasPromise = supabase.from('ideas').select('id, slug, title, status, created_at').eq('author_id', user.id);
    const servicesPromise = supabase.from('services').select('id, slug, title, status, created_at').eq('organization_id', user.id);
    const programsPromise = supabase.from('programs').select('id, slug, title, status, created_at').eq('organization_id', user.id);
    const initiativesPromise = supabase.from('initiatives').select('id, slug, title, type, status, created_at').eq('organization_id', user.id);
    const galleriesPromise = supabase.from('galleries').select('id, slug, title, created_at').eq('organization_id', user.id);
    const heritageSitesPromise = supabase.from('heritage_sites').select('id, slug, title, status, created_at').eq('author_id', user.id); // Corrected: Added promise for heritage sites

    const results = await Promise.all([
        jobsPromise,
        ideasPromise,
        servicesPromise,
        programsPromise,
        initiativesPromise,
        galleriesPromise,
        heritageSitesPromise // Corrected: Added promise to the array
    ]);

    const allItems = results.flatMap((result, index) => {
        const typeMap = ['job', 'idea', 'service', 'program', 'initiative', 'gallery', 'heritage_site']; // Corrected: Added heritage_site type
        if (!result.data) return [];
        return result.data.map((item: any) => ({
            ...item,
            // Standardize the 'type' and construct the final view URL here
            type: item.type ? item.type.toLowerCase() : typeMap[index],
            viewHref: getViewUrl({ ...item, type: item.type ? item.type.toLowerCase() : typeMap[index] })
        }));
    }).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <ManagementClientUI initialItems={allItems} />
        </div>
    );
}