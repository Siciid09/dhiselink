/// File Path: app/heritage/[slug]/page.tsx

import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { ArrowLeft, User, Calendar, Tag, MapPin } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function HeritageDetailPage({ params }: { params: { slug: string } }) {
    const supabase = createClient();
    
    // Step 1: Fetch the heritage site. We know this part works.
    const { data: site } = await supabase
        .from('heritage_sites')
        .select('*')
        .eq('slug', params.slug)
        .single();

    if (!site) {
        notFound();
    }

    // Step 2: Separately, fetch the author's profile if an author_id exists.
    let author = null;
    if (site.author_id) {
        const { data: authorData } = await supabase
            .from('profiles')
            .select('full_name, slug')
            .eq('id', site.author_id)
            .single();
        author = authorData;
    }

    const galleryImages = [site.cover_image_url, ...(site.gallery_images || [])].filter(Boolean);

    return (
        <div className="bg-white min-h-screen">
            <div className="container mx-auto max-w-4xl py-24 px-4">
                <Link href="/heritage" className="inline-flex items-center gap-2 text-slate-600 hover:text-amber-600 mb-8 font-semibold transition-colors">
                    <ArrowLeft size={18} />
                    Back to all sites
                </Link>
                
                <div className="w-full h-80 rounded-2xl overflow-hidden shadow-lg mb-8 bg-slate-100">
                  <img src={site.cover_image_url} alt={site.title} className="w-full h-full object-cover" />
                </div>

                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">{site.title}</h1>

                <div className="flex flex-wrap items-center gap-4 mb-10">
                    <span className="flex items-center gap-2 bg-slate-100 px-3 py-2 rounded-lg text-sm text-slate-700 font-semibold"><Tag size={16}/>{site.category}</span>
                    <span className="flex items-center gap-2 bg-slate-100 px-3 py-2 rounded-lg text-sm text-slate-700 font-semibold"><MapPin size={16}/>{site.location}</span>
                    {author && (
                         <Link href={`/professionals/${author.slug || site.author_id}`} className="flex items-center gap-2 bg-slate-100 px-3 py-2 rounded-lg text-sm text-slate-700 font-semibold hover:bg-amber-100 hover:text-amber-800 transition-colors">
                            <User size={16}/>Submitted by {author.full_name}
                         </Link>
                    )}
                </div>

                <div className="prose prose-lg max-w-none text-slate-700">
                    <p className="lead font-semibold text-slate-800">{site.summary}</p>
                    <div dangerouslySetInnerHTML={{ __html: site.description || '' }} />
                </div>
                
                {galleryImages.length > 1 && (
                  <div className="mt-16 pt-8 border-t">
                    <h2 className="text-2xl font-bold text-slate-800 mb-6">Gallery</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {galleryImages.slice(1).map((url, index) => (
                            <div key={index} className="rounded-xl overflow-hidden shadow-md">
                                <img src={url} alt={`${site.title} gallery image ${index + 1}`} className="w-full h-full object-cover" />
                            </div>
                        ))}
                    </div>
                  </div>
                )}
            </div>
        </div>
    );
}

