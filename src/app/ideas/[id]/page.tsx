import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { ArrowLeft, User, Calendar, Tag, MessageCircle } from 'lucide-react';
import Link from 'next/link';

// --- Type Definitions for TypeScript Safety ---
type Idea = {
  id: string;
  created_at: string;
  title: string;
  summary: string;
  details: string | null;
  tags: string[] | null;
  author_name: string;
  // Add any other fields from your 'ideas' table here
};

// This is the correct, secure way to fetch data in a Server Component
async function getIdeaById(id: string): Promise<Idea | null> {
    const supabase = createServerComponentClient({ cookies });

    const { data: idea, error } = await supabase
        .from('ideas')
        .select(`
            *,
            profiles ( full_name )
        `)
        .eq('id', id)
        .single();

    if (error) {
        console.error("Supabase fetch error:", error.message);
        return null;
    }
    
    // Type assertion to help TypeScript understand the nested profile
    const author_name = (idea.profiles as { full_name: string })?.full_name || "A Member";
    
    // Return the idea with the extracted author name
    return { ...idea, author_name };
}


export default async function IdeaDetailsPage({ params }: { params: { id: string } }) {
    const idea = await getIdeaById(params.id);

    // If no idea is found, render the notFound() page from Next.js
    if (!idea) {
        notFound();
    }
    
    return (
        <div className="bg-slate-50 min-h-screen pt-24 md:pt-32">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-24">
                <div className="max-w-4xl mx-auto">
                    <Link href="/ideas" className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors mb-8">
                        <ArrowLeft size={20} />
                        <span>Back to all ideas</span>
                    </Link>
                    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 md:p-12">
                        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-6">
                            {idea.title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-slate-500 border-y border-slate-200 py-4 mb-8">
                            <div className="flex items-center gap-2">
                                <User size={16} />
                                <span className="font-medium">{idea.author_name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar size={16} />
                                <span>{new Date(idea.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                            </div>
                        </div>
                        {idea.tags && idea.tags.length > 0 && (
                            <div className="flex flex-wrap items-center gap-2 mb-8">
                                <Tag size={16} className="text-gray-500" />
                                {/* TypeScript now knows 'tag' is a string, fixing the build error */}
                                {idea.tags.map((tag: string) => (
                                    <span key={tag} className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}
                        <div className="prose prose-lg max-w-none text-slate-600">
                           <p>{idea.summary}</p>
                           <div dangerouslySetInnerHTML={{ __html: idea.details?.replace(/\n/g, '<br />') || '' }} />
                        </div>
                        <div className="mt-12 pt-8 border-t border-slate-200 text-center">
                            <h3 className="text-2xl font-bold text-slate-800 mb-4">Interested in Collaborating?</h3>
                            <p className="text-slate-600 max-w-xl mx-auto mb-6">
                                If you have the skills and passion to bring this idea to life, reach out to the author or join the discussion.
                            </p>
                            <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-bold rounded-xl shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300 flex items-center gap-3 mx-auto">
                                <MessageCircle size={20} />
                                Contact the Author
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
