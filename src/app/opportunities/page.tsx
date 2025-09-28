import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { MapPin, Briefcase, Building, Star, Clock } from 'lucide-react';
import SearchFilter from './search-filter';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

function timeAgo(dateString: string | null): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) {
        const years = Math.floor(interval);
        return `${years} year${years > 1 ? 's' : ''} ago`;
    }
    interval = seconds / 2592000;
    if (interval > 1) {
        const months = Math.floor(interval);
        return `${months} month${months > 1 ? 's' : ''} ago`;
    }
    interval = seconds / 86400;
    if (interval >= 1) {
        const days = Math.floor(interval);
        return `${days} day${days > 1 ? 's' : ''} ago`;
    }
    interval = seconds / 3600;
    if (interval > 1) {
        const hours = Math.floor(interval);
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    }
    interval = seconds / 60;
    if (interval > 1) {
        const minutes = Math.floor(interval);
        return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    }
    return "Just now";
}

const truncateTitle = (title: string | null, wordLimit: number = 18): string => {
    if (!title) return 'Untitled Job';
    const words = title.split(' ');
    if (words.length > wordLimit) {
        return words.slice(0, wordLimit).join(' ') + '...';
    }
    return title;
};

const JobCard = ({ job }: { job: any }) => (
    <Link href={`/opportunities/jobs/${job.slug || job.id}`} className="block group">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 h-full flex flex-col transition-all duration-300 hover:border-amber-500 hover:shadow-2xl hover:-translate-y-1.5 relative">
            {job.featured && <Star size={18} className="absolute top-4 right-4 text-amber-400 fill-current" />}
            <div className="flex items-center gap-4 mb-4">
                <img 
                    src={job.organization_logo_url || `https://api.dicebear.com/8.x/initials/svg?seed=${job.organization_name}`} 
                    alt={`${job.organization_name} logo`} 
                    className="h-14 w-14 object-contain rounded-lg border p-1 bg-white"
                />
                <div>
                    <h3 className="font-bold text-lg text-slate-900 group-hover:text-amber-600 transition-colors">
                        {truncateTitle(job.title)}
                    </h3>
                    <p className="text-sm text-slate-600 flex items-center gap-1.5"><Building size={14}/> {job.organization_name}</p>
                </div>
            </div>
            <p className="text-sm text-slate-600 mb-4 flex-grow line-clamp-3">{job.short_description || "No description provided."}</p>
            <div className="mt-auto pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-sm text-slate-500">
                <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-md font-medium"><MapPin size={14} /> {job.location}</span>
                    <span className="flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-md font-medium capitalize"><Briefcase size={14} /> {job.type}</span>
                </div>
                <span className="text-xs text-slate-400 flex items-center gap-1.5"><Clock size={12} /> {timeAgo(job.created_at)}</span>
            </div>
        </div>
    </Link>
);

export default async function OpportunitiesPage({ searchParams }: { searchParams?: { q?: string; type?: string; } }) {
    const supabase = createClient();
    let query = supabase.from('jobs').select(`*`).eq('status', 'active');

    if (searchParams?.q) {
        query = query.or(`title.ilike.%${searchParams.q}%,organization_name.ilike.%${searchParams.q}%,tags.cs.{${searchParams.q}}`);
    }
    if (searchParams?.type && searchParams.type.toLowerCase() !== 'all') {
        query = query.eq('type', searchParams.type);
    }

    const { data: jobs, error } = await query
        .order('created_at', { ascending: false });

    return (
        <div className="bg-slate-50 min-h-screen">
            {/* --- CHANGE 1: Removed top padding (py-24 changed to pb-24) --- */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24">
                 {/* --- CHANGE 2: Removed bottom margin (mb-12) --- */}
                <header className="text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-slate-900">Find Your Next Opportunity</h1>
                    <p className="mt-3 text-lg text-slate-600 max-w-2xl mx-auto">Browse roles from leading organizations in the region.</p>
                </header>
                
                <Suspense>
                    <SearchFilter />
                </Suspense>
                
                <main>
                    {error && <p className="text-center text-red-500">Could not fetch jobs.</p>}
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