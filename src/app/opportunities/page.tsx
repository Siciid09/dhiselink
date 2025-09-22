import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { MapPin, Briefcase, Building } from 'lucide-react';
import SearchFilter from './search-filter'; // Import the new search component

export const dynamic = 'force-dynamic';

// The page now accepts `searchParams` to get the URL query
export default async function OpportunitiesPage({
  searchParams,
}: {
  searchParams?: {
    q?: string;
    location?: string;
    type?: string;
  };
}) {
    const supabase = createServerComponentClient({ cookies });
    
    // Start building the query
    let query = supabase
        .from('jobs')
        .select('*')
        .eq('status', 'active');

    // Add filters to the query based on searchParams
    if (searchParams?.q) {
      query = query.ilike('title', `%${searchParams.q}%`);
    }
    if (searchParams?.location) {
      query = query.ilike('location', `%${searchParams.location}%`);
    }
    if (searchParams?.type) {
      query = query.eq('type', searchParams.type);
    }

    // Execute the final query
    const { data: jobs, error } = await query.order('created_at', { ascending: false });

    return (
        <div className="bg-slate-50 min-h-screen">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <header className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-slate-900">Find Your Next Opportunity</h1>
                    <p className="mt-3 text-lg text-slate-600 max-w-2xl mx-auto">Browse roles from leading organizations in the region.</p>
                </header>
                
                {/* Render the Search & Filter Component */}
                <SearchFilter />

                {/* Job Listings */}
                <main>
                    {error && <p className="text-center text-red-500">Could not fetch jobs. Please try again later.</p>}
                    
                    {!error && jobs && jobs.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {jobs.map(job => (
                                <Link href={`/opportunities/${job.id}`} key={job.id} className="block group">
                                  <div className="bg-white rounded-xl border border-slate-200 p-6 h-full flex flex-col transition-all duration-300 hover:border-blue-500 hover:shadow-lg hover:-translate-y-1">
                                    <div className="flex items-center gap-4 mb-4">
                                      <img 
                                        src={job.organization_logo_url || `https://api.dicebear.com/8.x/initials/svg?seed=${job.organization_name}`} 
                                        alt={`${job.organization_name} logo`} 
                                        className="h-14 w-14 object-contain rounded-lg border p-1"
                                      />
                                      <div>
                                        <p className="font-semibold text-slate-800 text-lg group-hover:text-blue-600 transition-colors">{job.title}</p>
                                        <p className="text-sm text-slate-600 flex items-center gap-1.5"><Building size={14}/> {job.organization_name}</p>
                                      </div>
                                    </div>
                                    <p className="text-sm text-slate-600 mb-4 flex-grow line-clamp-3">{job.short_description || job.description}</p>
                                    <div className="mt-auto pt-4 border-t border-slate-100 flex items-center gap-4 text-sm text-slate-500">
                                      <span className="flex items-center gap-1.5 bg-slate-100 px-2 py-1 rounded-md"><MapPin size={14} /> {job.location}</span>
                                      <span className="flex items-center gap-1.5 bg-slate-100 px-2 py-1 rounded-md capitalize"><Briefcase size={14} /> {job.type}</span>
                                    </div>
                                  </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center bg-white p-12 rounded-lg border border-dashed">
                            <h3 className="font-bold text-xl mb-2 text-slate-700">No Matching Opportunities Found</h3>
                            <p className="text-slate-600">Try adjusting your search or filter criteria.</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}