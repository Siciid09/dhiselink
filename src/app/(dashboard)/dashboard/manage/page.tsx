import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import ManagementClientUI from './ManagePageClient'; // NOTE: You may need to fix the filename here if yours is different

export const dynamic = 'force-dynamic';

export default async function ManageOpportunitiesPage() {
    const supabase = createServerComponentClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/login');

    const [jobsRes, programsRes, initiativesRes] = await Promise.all([
        supabase.from('jobs').select('id, title, status, created_at').eq('organization_id', user.id),
        supabase.from('programs').select('id, title, status, created_at').eq('organization_id', user.id),
        supabase.from('initiatives').select('id, title, type, status, created_at').eq('organization_id', user.id)
    ]);

    // This block of code is now corrected
    const allOpportunities = [
        ...(jobsRes.data || []).map(item => ({ ...item, type: 'job' })),
        // --- THIS IS THE FIX ---
        ...(programsRes.data || []).map(item => ({ ...item, type: 'program' })),
        ...(initiativesRes.data || []).map(item => ({ ...item, type: item.type?.toLowerCase() || 'project' }))
    ]
    .sort((a, b) => {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return dateB - dateA;
    });

    return (
        <div className="bg-slate-50 min-h-screen p-4 sm:p-6 lg:p-8">
            <Suspense fallback={<div className="text-center p-20 font-semibold text-slate-600">Loading your content...</div>}>
                <ManagementClientUI initialItems={allOpportunities} />
            </Suspense>
        </div>
    );
}