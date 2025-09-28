/// File Path: app/heritage/page.tsx

import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Landmark } from 'lucide-react';

export const dynamic = 'force-dynamic';

// A card component to display each heritage site
const HeritageCard = ({ site }: { site: any }) => (
    <Link 
      href={`/heritage/${site.slug || site.id}`} // <-- CRITICAL: Uses the slug for the URL!
      className="block group bg-white rounded-2xl border border-slate-200/80 flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 hover:border-amber-500/50"
    >
        <div className="h-48 bg-slate-100 relative rounded-t-2xl overflow-hidden">
            <img src={site.cover_image_url} alt={site.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            <span className="absolute top-3 right-3 text-xs font-semibold px-3 py-1 rounded-full bg-white/90 text-slate-800">{site.category}</span>
        </div>
        <div className="p-5 flex flex-col flex-grow">
            <h2 className="text-xl font-bold text-slate-900 group-hover:text-amber-600 transition-colors">{site.title}</h2>
            <p className="text-slate-500 mt-1 text-sm flex-grow">{site.location}</p>
            <div className="mt-4 pt-4 border-t border-slate-100 text-center text-sm font-semibold text-slate-700 group-hover:text-white group-hover:bg-slate-800 transition-colors py-2.5 rounded-lg bg-slate-100">
                View Details
            </div>
        </div>
    </Link>
);


export default async function HeritagePage() {
    const supabase = createClient();
    
    // Fetches all heritage sites to display them. We will remove the status check for now.
    const { data: sites, error } = await supabase
        .from('heritage_sites')
        .select(`id, slug, title, category, location, summary, cover_image_url`)
        .order('created_at', { ascending: false });

    if (error) console.error("Error fetching heritage sites:", error);

    return (
        <div className="bg-slate-50 min-h-screen">
            <div className="container mx-auto px-4 py-24">
                <header className="text-center mb-12">
                    <div className="inline-block bg-amber-100 text-amber-600 p-4 rounded-xl mb-4"><Landmark size={40} /></div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900">Discover Our Heritage</h1>
                    <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">Explore the rich history and cultural landmarks that define our story.</p>
                </header>

                <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sites && sites.length > 0 ? (
                        sites.map((site) => <HeritageCard key={site.id} site={site} />)
                    ) : (
                        <div className="col-span-full text-center bg-white p-12 rounded-lg border-2 border-dashed">
                            <h3 className="font-bold text-xl text-slate-700">No Heritage Sites Found</h3>
                            <p className="text-slate-600 mt-2">Be the first to add a site and share our culture.</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}