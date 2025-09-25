import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { MapPin, Briefcase, Building, Star, User } from 'lucide-react';
import SearchFilter from './search-filter';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

const JobCard = ({ job }: { job: any }) => (
    <Link href={`/opportunities/${job.id}`} className="block group">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 h-full flex flex-col transition-all duration-300 hover:border-sky-500 hover:shadow-2xl hover:-translate-y-1.5 relative">
            {job.featured && <Star size={18} className="absolute top-4 right-4 text-amber-400 fill-current" />}
            <div className="flex items-center gap-4 mb-4">
                <img 
                    src={job.organization_logo_url || `https://api.dicebear.com/8.x/initials/svg?seed=${job.organization_name}`} 
                    alt={`${job.organization_name} logo`} 
                    className="h-14 w-14 object-contain rounded-lg border p-1 bg-white"
                />
                <div>
                    <h3 className="font-bold text-lg text-slate-900 group-hover:text-sky-600 transition-colors">{job.title}</h3>
                    <p className="text-sm text-slate-600 flex items-center gap-1.5"><Building size={14}/> {job.organization_name}</p>
                </div>
            </div>
            <p className="text-sm text-slate-600 mb-4 flex-grow line-clamp-3">{job.short_description || job.description}</p>
            <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                <span className="font-medium flex items-center gap-1.5"><User size={14}/> Posted by {job.posted_by_name || 'Admin'}</span>
            </div>
            <div className="mt-auto pt-4 border-t border-slate-100 flex items-center gap-4 text-sm text-slate-500">
                <span className="flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-md font-medium"><MapPin size={14} /> {job.location}</span>
                <span className="flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-md font-medium capitalize"><Briefcase size={14} /> {job.type}</span>
            </div>
        </div>
    </Link>
);

export default async function OpportunitiesPage({
    searchParams,
}: {
    searchParams?: { q?: string; location?: string; type?: string; };
}) {
    const supabase = createServerComponentClient({ cookies });
    
    // --- THIS IS THE FIX ---
    // The query now selects the 'posted_by_name' and sorts by 'created_at' first.
    let query = supabase
        .from('jobs')
        .select(`
            *,
            posted_by_name
        `);

    if (searchParams?.q) {
        query = query.or(`title.ilike.%${searchParams.q}%,organization_name.ilike.%${searchParams.q}%,tags.cs.{${searchParams.q}}`);
    }
    if (searchParams?.location) {
        query = query.ilike('location', `%${searchParams.location}%`);
    }
    if (searchParams?.type) {
        query = query.eq('type', searchParams.type);
    }

    const { data: jobs, error } = await query
        .order('created_at', { ascending: false }) // Sort by newest first
        .order('featured', { ascending: false }); // Then, show featured jobs at the top

    return (
        <div className="bg-slate-50 min-h-screen">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <header className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-slate-900">Find Your Next Opportunity</h1>
                    <p className="mt-3 text-lg text-slate-600 max-w-2xl mx-auto">Browse roles from leading organizations in the region.</p>
                </header>
                
                <Suspense fallback={<div>Loading filters...</div>}>
                    <SearchFilter />
                </Suspense>

                <main>
                    {error && <p className="text-center text-red-500">Could not fetch jobs. Please try again later.</p>}
                    
                    {!error && jobs && jobs.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {jobs.map(job => <JobCard key={job.id} job={job} />)}
                        </div>
                    ) : (
                        <div className="text-center bg-white p-12 rounded-lg border-2 border-dashed">
                            <h3 className="font-bold text-xl mb-2 text-slate-700">No Matching Opportunities Found</h3>
                            <p className="text-slate-600">Try adjusting your search or filter criteria.</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}