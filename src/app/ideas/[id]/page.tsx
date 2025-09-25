import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { ArrowLeft, User, Calendar, Tag, Lightbulb, Share2, MessageCircle } from 'lucide-react';
import Link from 'next/link';

const InfoPill = ({ icon: Icon, text }: { icon: React.ElementType, text: string }) => (
    <div className="flex items-center gap-2 bg-slate-100 px-3 py-2 rounded-lg text-sm text-slate-700">
        <Icon size={16} className="text-slate-500" />
        <span className="font-medium">{text}</span>
    </div>
);

export default async function IdeaDetailsPage({ params }: { params: { id: string } }) {
    const supabase = createServerComponentClient({ cookies });
    const { data: idea } = await supabase
        .from('ideas')
        .select(`*, profiles (full_name, avatar_url)`)
        .eq('id', params.id)
        .single();

    if (!idea) notFound();
    
    return (
        <div className="bg-slate-50 min-h-screen">
            <div className="container mx-auto px-4 py-24 max-w-5xl">
                <Link href="/ideas" className="inline-flex items-center gap-2 text-slate-600 hover:text-sky-600 mb-8"><ArrowLeft size={20} />Back to all ideas</Link>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border p-8">
                        {idea.cover_image_url && <img src={idea.cover_image_url} alt={idea.title} className="w-full h-64 object-cover rounded-xl mb-8" />}
                        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6">{idea.title}</h1>
                        <div className="prose prose-lg max-w-none text-slate-600">
                            <div dangerouslySetInnerHTML={{ __html: idea.details?.replace(/\n/g, '<br />') || '' }} />
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white rounded-2xl shadow-lg border p-6">
                            <h3 className="font-bold text-lg mb-4">Submitted By</h3>
                            <Link href={`/professionals/${idea.author_id}`} className="flex items-center gap-3 group">
                                <img src={idea.profiles?.avatar_url || ''} alt={idea.profiles?.full_name} className="w-12 h-12 rounded-full" />
                                <div>
                                    <p className="font-semibold text-slate-800 group-hover:text-sky-600">{idea.profiles?.full_name}</p>
                                    <p className="text-xs text-slate-500">View Profile</p>
                                </div>
                            </Link>
                        </div>
                        <div className="bg-white rounded-2xl shadow-lg border p-6 space-y-3">
                            <InfoPill icon={Calendar} text={new Date(idea.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} />
                            <InfoPill icon={Tag} text={idea.category} />
                            <InfoPill icon={Lightbulb} text={idea.status} />
                        </div>
                         <div className="bg-white rounded-2xl shadow-lg border p-6">
                            <h3 className="font-bold text-lg mb-4">Tags</h3>
                            <div className="flex flex-wrap gap-2">
                                {idea.tags?.map((tag: string) => <span key={tag} className="bg-slate-100 text-xs font-semibold px-3 py-1 rounded-full">{tag}</span>)}
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl shadow-lg border p-6 text-center">
                            <h3 className="font-bold text-lg mb-2">Interested?</h3>
                            <p className="text-sm text-slate-500 mb-4">Contact the author or share this idea.</p>
                             <button className="w-full mb-2 flex items-center justify-center gap-2 py-2.5 bg-sky-600 text-white font-semibold rounded-lg"><MessageCircle size={18} /> Contact Author</button>
                             <button className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-200 text-slate-800 font-semibold rounded-lg"><Share2 size={18} /> Share</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}