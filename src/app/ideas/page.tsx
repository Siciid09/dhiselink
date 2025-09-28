import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { BrainCircuit, PlusCircle } from 'lucide-react';

export const dynamic = 'force-dynamic';

const IdeaCard = ({ idea }: { idea: any }) => (
    <Link href={`/ideas/${idea.slug || idea.id}`} className="block group bg-white rounded-xl border border-slate-200/80 transition-all duration-300 hover:shadow-xl hover:border-amber-500/50 hover:-translate-y-1 overflow-hidden flex flex-col">
        <div className="h-48 bg-slate-100">
            {idea.cover_image_url && <img src={idea.cover_image_url} alt={idea.title} className="w-full h-full object-cover" />}
        </div>
        <div className="p-5 flex flex-col flex-grow">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-100 text-amber-800 self-start">{idea.category}</span>
            <h2 className="text-lg font-bold text-slate-900 mt-3 group-hover:text-amber-600 transition-colors line-clamp-2 flex-grow">{idea.title}</h2>
            <div className="flex items-center gap-3 mt-4 pt-4 border-t border-slate-100">
                <img src={idea.profiles?.avatar_url || `https://api.dicebear.com/8.x/initials/svg?seed=${idea.profiles?.full_name}`} alt={idea.profiles?.full_name || 'Author'} className="w-8 h-8 rounded-full" />
                <span className="text-sm font-semibold text-slate-700">{idea.profiles?.full_name || 'A Member'}</span>
            </div>
        </div>
    </Link>
);

export default async function IdeasPage() {
    const supabase = createClient();
    const { data: ideas, error } = await supabase
        .from('ideas')
        .select(`*, profiles (full_name, avatar_url)`)
        .order('created_at', { ascending: false });

    if (error) console.error("Error fetching ideas:", error);

    return (
        <div className="bg-slate-50 min-h-screen">
            <div className="container mx-auto px-4 py-24">
                <header className="text-center mb-12">
                    <div className="inline-block bg-amber-100 text-amber-600 p-4 rounded-xl mb-4"><BrainCircuit size={40} /></div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900">Innovation Hub</h1>
                    <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">Discover and collaborate on projects and ventures from talented individuals.</p>
                </header>
                
                <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {ideas && ideas.length > 0 ? (
                        ideas.map((idea) => <IdeaCard key={idea.id} idea={idea} />)
                    ) : (
                        <div className="col-span-full text-center bg-white p-12 rounded-lg border-dashed"><h3 className="font-bold text-xl text-slate-700">No Ideas Submitted Yet</h3><p className="text-slate-600">Be the first to share an innovative project or venture.</p></div>
                    )}
                </main>
            </div>
        </div>
    );
}