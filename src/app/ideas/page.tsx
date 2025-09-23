import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { BrainCircuit, PlusCircle } from 'lucide-react';

export const dynamic = 'force-dynamic'; // THIS IS THE FIX

type Idea = {
  id: string;
  title: string;
  summary: string;
  profiles: { 
    full_name: string; 
  } | null; // Profile can be null if author is deleted
};

async function getIdeas(): Promise<Idea[]> {
    const supabase = createServerComponentClient({ cookies });
    const { data, error } = await supabase
        .from('ideas')
        .select(`id, title, summary, profiles (full_name)`)
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Error fetching ideas:", error);
        return [];
    }
    if (!data) return [];
    
    const transformedData = data.map(idea => ({
      ...idea,
      profiles: Array.isArray(idea.profiles) ? idea.profiles[0] : idea.profiles,
    }));
    return transformedData as Idea[];
}

export default async function IdeasPage() {
  const ideas = await getIdeas();

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <header className="text-center mb-12">
          <div className="inline-block bg-blue-100 text-blue-600 p-4 rounded-xl mb-4">
            <BrainCircuit size={40} />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-slate-900">
            Innovation Hub
          </h1>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            Discover and collaborate on projects and ventures from talented individuals.
          </p>
          <Link href="/dashboard/submit-idea" className="mt-8 inline-flex items-center gap-2 bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:bg-blue-700">
            <PlusCircle size={20} />
            Submit Your Idea
          </Link>
        </header>
        
        <main className="max-w-4xl mx-auto space-y-6">
            {ideas.length > 0 ? (
                ideas.map((idea) => (
                    <Link href={`/ideas/${idea.id}`} key={idea.id} className="block group">
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 transition-all hover:shadow-xl hover:border-blue-500 hover:-translate-y-1">
                            <h2 className="text-2xl font-bold text-slate-900 group-hover:text-blue-600">{idea.title}</h2>
                            <p className="text-slate-600 mt-2 line-clamp-2">{idea.summary}</p>
                            <p className="text-sm text-slate-500 mt-4">Posted by <span className="font-semibold">{idea.profiles?.full_name || 'A Member'}</span></p>
                        </div>
                    </Link>
                ))
            ) : (
                <div className="text-center bg-white p-12 rounded-lg border border-dashed">
                    <h3 className="font-bold text-xl mb-2 text-slate-700">No Ideas Submitted Yet</h3>
                    <p className="text-slate-600">Be the first to share an innovative project or venture.</p>
                </div>
            )}
        </main>
      </div>
    </div>
  );
}
