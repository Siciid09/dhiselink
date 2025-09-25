import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { ArrowLeft, MapPin, Tag } from 'lucide-react';
import Link from 'next/link';

export default async function HeritageDetailPage({ params }: { params: { id: string } }) {
    const supabase = createServerComponentClient({ cookies });
    const { data: site } = await supabase
        .from('heritage_sites')
        .select('*, profiles(full_name)')
        .eq('id', params.id)
        .single();

    if (!site) notFound();

    const galleryImages = [site.cover_image_url, ...(site.gallery_images || [])];

    return (
        <div className="bg-white min-h-screen">
            <div className="container mx-auto max-w-4xl py-24 px-4">
                <Link href="/heritage" className="inline-flex items-center gap-2 text-slate-600 hover:text-sky-600 mb-8 font-semibold"><ArrowLeft size={20} />Back to all sites</Link>
                
                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">{site.title}</h1>

                <div className="flex flex-wrap items-center gap-4 mb-8">
                    <span className="flex items-center gap-2 bg-slate-100 px-3 py-2 rounded-lg text-sm text-slate-700 font-semibold"><Tag size={16}/>{site.category}</span>
                    <span className="flex items-center gap-2 bg-slate-100 px-3 py-2 rounded-lg text-sm text-slate-700 font-semibold"><MapPin size={16}/>{site.location}</span>
                </div>

                {/* --- Image Gallery --- */}
                {galleryImages.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                        {galleryImages.map((url, index) => (
                            <div 
                                key={index} 
                                className={`rounded-2xl overflow-hidden shadow-lg ${index === 0 ? 'col-span-2 md:col-span-3 h-80' : 'h-40'}`}
                            >
                                <img src={url} alt={`${site.title} gallery image ${index + 1}`} className="w-full h-full object-cover" />
                            </div>
                        ))}
                    </div>
                )}

                <div className="prose prose-lg max-w-none text-slate-600">
                    <p className="font-semibold text-slate-800">{site.summary}</p>
                    <div dangerouslySetInnerHTML={{ __html: site.description?.replace(/\n/g, '<br />') || '' }} />
                </div>
            </div>
        </div>
    );
}