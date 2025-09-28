import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { ArrowLeft, User, Calendar, Tag, Lightbulb, Share2, MessageCircle, ChevronsRight } from 'lucide-react';
import Link from 'next/link';

// A helper component for the sidebar metadata
const InfoPill = ({ icon: Icon, text, label }: { icon: React.ElementType, text: string | null, label: string }) => {
    if (!text) return null;
    return (
        <div>
            <p className="text-sm font-semibold text-slate-500 flex items-center gap-2 mb-1"><Icon size={14} /> {label}</p>
            <p className="font-bold text-slate-800">{text}</p>
        </div>
    );
};

export default async function IdeaDetailsPage({ params }: { params: { slug: string } }) {
    const supabase = createClient();
    const { data: idea } = await supabase
        .from('ideas')
        .select(`*, profiles (full_name, avatar_url, slug)`) // Fetch the author's slug
        .eq('slug', params.slug)
        .single();

    if (!idea) notFound();
    
    return (
        <div className="bg-white min-h-screen">
            <div className="container mx-auto px-4 py-24 max-w-5xl">
                <Link href="/ideas" className="inline-flex items-center gap-2 text-slate-600 hover:text-amber-600 mb-8 font-semibold"><ArrowLeft size={18} />Back to all ideas</Link>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {idea.cover_image_url && <img src={idea.cover_image_url} alt={idea.title || ''} className="w-full h-80 object-cover rounded-xl mb-8" />}
                        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6">{idea.title}</h1>
                        
                        <div className="mt-8 prose prose-lg max-w-none text-slate-700 prose-headings:font-bold prose-headings:text-slate-800 prose-strong:text-slate-800 prose-ul:list-none prose-ul:p-0 prose-li:flex prose-li:items-start prose-li:mb-2 prose-li:before:content-[''] prose-li:before:w-5 prose-li:before:h-5 prose-li:before:bg-amber-500 prose-li:before:rounded-full prose-li:before:mr-3 prose-li:before:flex-shrink-0 prose-li:before:mt-1.5 prose-ol:list-none prose-ol:p-0 prose-ol:counter-reset_list-item prose-li:counter-increment_list-item prose-li:before:content-[counter(list-item)] prose-li:before:text-white prose-li:before:font-bold prose-li:before:text-xs prose-li:before:flex prose-li:before:items-center prose-li:before:justify-center">
                            <div dangerouslySetInnerHTML={{ __html: idea.details || '' }} />
                        </div>
                    </div>

                    {/* Sidebar */}
                    <aside className="lg:col-span-1">
                        <div className="sticky top-24 space-y-6">
                            <div className="bg-slate-50 rounded-2xl border p-6">
                                <h3 className="font-bold text-lg mb-4 text-slate-800">Submitted By</h3>
                                <Link href={`/professionals/${idea.profiles?.slug || idea.author_id}`} className="flex items-center gap-3 group">
                                    <img src={idea.profiles?.avatar_url || ''} alt={idea.profiles?.full_name || ''} className="w-12 h-12 rounded-full" />
                                    <div>
                                        <p className="font-semibold text-slate-800 group-hover:text-amber-600 transition-colors">{idea.profiles?.full_name}</p>
                                        <p className="text-xs text-slate-500">View Profile</p>
                                    </div>
                                </Link>
                            </div>
                            <div className="bg-slate-50 rounded-2xl border p-6 space-y-4">
                                <InfoPill icon={Calendar} label="Posted on" text={new Date(idea.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} />
                                <InfoPill icon={Tag} label="Category" text={idea.category} />
                                <InfoPill icon={Lightbulb} label="Seeking" text={idea.seeking} />
                            </div>
                            {idea.tags && (
                               <div className="bg-slate-50 rounded-2xl border p-6">
                                    <h3 className="font-bold text-lg mb-4">Tags</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {(idea.tags as string[]).map((tag: string) => <span key={tag} className="bg-amber-100 text-amber-800 text-xs font-semibold px-3 py-1 rounded-full">{tag}</span>)}
                                    </div>
                                </div>
                            )}
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}