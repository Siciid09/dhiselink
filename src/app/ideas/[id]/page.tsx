import { ArrowLeft, User, Calendar, Tag, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

// --- REAL DATA FETCHING LOGIC ---
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function getIdeaById(id: string) {
    const { data: idea, error } = await supabase
        .from('ideas')
        .select(`*, profiles (full_name)`)
        .eq('id', id)
        .single();

    if (error) {
        console.error("Supabase fetch error:", error.message);
        return null;
    }
    
    const author_name = (idea.profiles as any)?.full_name || "A Member";
    const tags = ["Project", "Concept", "Seeking-Collaborators"];

    return { ...idea, author_name, tags };
}

export default async function IdeaDetailsPage({ params }: { params: { id: string } }) {
    const idea = await getIdeaById(params.id);

    if (!idea) {
        return (
            <div className="text-center py-20">
                <h1 className="text-2xl font-bold">Idea not found.</h1>
                <p className="text-gray-600">This might be because the link is incorrect or the idea has been removed.</p>
                <Link href="/ideas" className="mt-4 inline-block text-blue-600 hover:underline">
                    &larr; Go back to all ideas
                </Link>
            </div>
        );
    }
    
    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="container mx-auto px-6 py-12">
                <div className="max-w-4xl mx-auto">
                    <Link href="/ideas" className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors mb-8">
                        <ArrowLeft size={20} />
                        <span>Back to all ideas</span>
                    </Link>
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 md:p-12">
                        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-6">
                            {idea.title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-gray-500 border-y border-gray-200 py-4 mb-8">
                            <div className="flex items-center gap-2">
                                <User size={16} />
                                <span className="font-medium">{idea.author_name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar size={16} />
                                <span>{new Date(idea.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 mb-8">
                            <Tag size={16} className="text-gray-500" />
                            {idea.tags.map(tag => (
                                <span key={tag} className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                                    {tag}
                                </span>
                            ))}
                        </div>
                        <div className="prose prose-lg max-w-none">
                           <p>{idea.summary}</p>
                        </div>
                        <div className="mt-12 pt-8 border-t border-gray-200 text-center">
                            <h3 className="text-2xl font-bold text-gray-800 mb-4">Interested in Collaborating?</h3>
                            <p className="text-gray-600 max-w-xl mx-auto mb-6">
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