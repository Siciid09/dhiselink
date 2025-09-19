// File Path: app/ideas/[id]/page.tsx

"use client";

import { useState, useEffect } from 'react';
import { User, Calendar, Tag, ArrowRight } from 'lucide-react';

export default function IdeaDetailPage({ params }: { params: { id: string } }) {
    const [idea, setIdea] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!params.id) return;
        
        const fetchIdeaDetails = async () => {
            try {
                const response = await fetch(`/api/ideas/${params.id}`);
                if (!response.ok) throw new Error('Idea not found');
                const data = await response.json();
                setIdea(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchIdeaDetails();
    }, [params.id]);

    if (loading) {
        return <div className="pt-40 text-center">Loading idea...</div>;
    }

    if (!idea) {
        return <div className="pt-40 text-center">Idea not found.</div>;
    }

    // Format the date for display
    const formattedDate = new Date(idea.created_at).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
    });

    return (
        <section className="bg-white py-32">
            <div className="container mx-auto px-6 max-w-6xl">
                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <div className="prose max-w-none">
                            <span className="text-sm font-bold uppercase text-blue-600">{idea.category}</span>
                            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mt-2 mb-4">{idea.title}</h1>
                            <p className="text-lg text-gray-600 leading-relaxed">{idea.details || idea.summary}</p>
                        </div>
                    </div>
                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-28 space-y-6">
                            <div className="bg-gray-50 p-6 rounded-lg border">
                                <h3 className="text-lg font-bold mb-4">Key Information</h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex items-center gap-3"><User size={16} className="text-gray-500"/> <span className="font-semibold">{idea.profiles?.full_name || "Anonymous"}</span></div>
                                    <div className="flex items-center gap-3"><Calendar size={16} className="text-gray-500"/> <span>Posted on {formattedDate}</span></div>
                                    <div className="flex items-center gap-3"><Tag size={16} className="text-gray-500"/> <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">{idea.status}</span></div>
                                </div>
                            </div>
                            <div className="bg-gray-50 p-6 rounded-lg border">
                                <h3 className="text-lg font-bold mb-4">Seeking Collaborators & Support</h3>
                                <div className="flex flex-wrap gap-2">
                                    {idea.seeking?.map((s: string) => <span key={s} className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">{s}</span>)}
                                </div>
                            </div>
                            <button className="w-full flex items-center justify-center gap-2 bg-gray-800 text-white font-bold py-4 px-6 rounded-lg hover:bg-black transition-colors">
                                Collaborate on this Idea <ArrowRight size={18}/>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}