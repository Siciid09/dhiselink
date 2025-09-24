import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import ManagementClientUI from './ManagePageClient'; // The client component you provided

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
        // If for some reason there's no profile, send to onboarding
        redirect('/select-role');
    }

    let allOpportunities: any[] = [];

    // 2. Fetch data based on the user's role
    switch (profile.role) {
        case 'company':
            const [jobsRes, servicesRes] = await Promise.all([
                supabase.from('jobs').select('id, title, status, created_at').eq('organization_id', user.id),
                supabase.from('services').select('id, title, created_at').eq('organization_id', user.id)
            ]);
            allOpportunities = [
                ...(jobsRes.data || []).map(item => ({ ...item, type: 'job' })),
                ...(servicesRes.data || []).map(item => ({ ...item, status: 'active', type: 'service' })) // Add status for consistency
            ];
            break;

        case 'university':
            const { data: programsData } = await supabase.from('programs').select('id, title, created_at').eq('organization_id', user.id);
            allOpportunities = (programsData || []).map(item => ({ ...item, status: 'active', type: 'program' }));
            break;

        case 'ngo_gov':
        case 'other':
            const { data: initiativesData } = await supabase.from('initiatives').select('id, title, type, status, created_at').eq('organization_id', user.id);
            // The 'initiatives' table already has a 'type' column (Project, Event, etc.)
            allOpportunities = (initiativesData || []).map(item => ({ ...item, type: item.type?.toLowerCase() || 'project' }));
            break;
        
        default:
            // Default case can be empty or handle other roles as needed
            allOpportunities = [];
            break;
    }

    // 3. Sort all fetched items by creation date
    allOpportunities.sort((a, b) => {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return dateB - dateA;
    });

    return (
        <div className="bg-slate-50 min-h-screen p-4 sm:p-6 lg:p-8">
            <Suspense fallback={<div className="text-center p-20 font-semibold text-slate-600">Loading your content...</div>}>
                {/* 4. Pass the role-specific data to the client component */}
                <ManagementClientUI initialItems={allOpportunities} />
            </Suspense>
        </div>
    );
}
