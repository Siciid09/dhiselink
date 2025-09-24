import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import ManagementClientUI from './ManagePageClient';

export const dynamic = 'force-dynamic';

export default async function ManageOpportunitiesPage() {
    const supabase = createServerComponentClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/login');

    // 1. Fetch the user's profile to determine their role
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    if (!profile) {
        redirect('/select-role');
    }

    let fetchedItems: any[] = [];

    // 2. Conditionally and efficiently fetch data based on the user's role
    switch (profile.role) {
        case 'company':
            const { data: companyJobs } = await supabase.from('jobs').select('*').eq('organization_id', user.id);
            const { data: companyServices } = await supabase.from('services').select('*').eq('organization_id', user.id);
            fetchedItems = [
                ...(companyJobs || []).map(item => ({ ...item, type: 'job' })),
                ...(companyServices || []).map(item => ({ ...item, type: 'service' }))
            ];
            break;

        case 'university':
            const { data: uniJobs } = await supabase.from('jobs').select('*').eq('organization_id', user.id);
            const { data: uniPrograms } = await supabase.from('programs').select('*').eq('organization_id', user.id);
            fetchedItems = [
                ...(uniJobs || []).map(item => ({ ...item, type: 'job' })),
                ...(uniPrograms || []).map(item => ({ ...item, type: 'program' }))
            ];
            break;
            
        case 'ngo_gov':
        case 'other':
            const { data: orgJobs } = await supabase.from('jobs').select('*').eq('organization_id', user.id);
            const { data: orgInitiatives } = await supabase.from('initiatives').select('*').eq('organization_id', user.id);
            fetchedItems = [
                ...(orgJobs || []).map(item => ({ ...item, type: 'job' })),
                ...(orgInitiatives || []).map(item => ({ ...item, type: item.type?.toLowerCase() || 'project' }))
            ];
            break;
            
        case 'individual':
            const { data: ideas } = await supabase.from('ideas').select('*').eq('author_id', user.id);
            fetchedItems = (ideas || []).map(item => ({ ...item, type: 'idea' }));
            break;

        default:
            fetchedItems = [];
            break;
    }

    // 3. Sort all fetched items by their creation date
    fetchedItems.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return (
        <div className="bg-slate-50 min-h-screen p-4 sm:p-6 lg:p-8">
            <Suspense fallback={<div className="text-center p-20 font-semibold text-slate-600">Loading your content...</div>}>
                {/* 4. Pass the final, correct data to the UI component */}
                <ManagementClientUI initialItems={fetchedItems} />
            </Suspense>
        </div>
    );
}