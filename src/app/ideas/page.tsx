// File Path: app/ideas/page.tsx

"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { PlusCircle } from 'lucide-react';

export default function IdeaHubPage() {
    const [ideas, setIdeas] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchIdeas = async () => {
            try {
                const response = await fetch('/api/ideas');
                const data = await response.json();
                if (Array.isArray(data)) {
                    setIdeas(data);
                } else {
                    setIdeas([]);
                }
            } catch (error) {
                console.error("Failed to fetch ideas:", error);
                setIdeas([]);
            } finally {
                setLoading(false);
            }
        };
        fetchIdeas();
    }, []);

    return (
        <div className="bg-gray-50 pt-32 min-h-screen">
            {/* Hero Section */}
            <section className="text-center pt-12 pb-16 container mx-auto px-6">
                 <h1 className="text-5xl md:text-6xl font-extrabold tracking-tighter text-gray-900 mb-4">The Idea Hub</h1>
                 <p className="max-w-3xl mx-auto text-lg text-gray-600 mb-8">A launchpad for innovation. Share your projects, find collaborators, and turn ideas into reality.</p>
                 <Link href="/ideas/submit" className="inline-flex items-center gap-2 bg-gray-800 text-white font-bold px-8 py-3.5 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                    <PlusCircle size={20}/> Submit a New Idea
                 </Link>
            </section>

            {/* Ideas Grid */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-6 max-w-7xl">
                    {loading ? <p className="text-center">Loading ideas...</p> : (
                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                             {ideas.length > 0 ? ideas.map(idea => (
                                <Link key={idea.id} href={`/ideas/${idea.id}`} className="block">
                                     <motion.div 
                                        whileHover={{y: -8, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)'}} 
                                        className="bg-white rounded-lg shadow-lg flex flex-col h-full border hover:border-blue-500 transition-all duration-300"
                                     >
                                        <div className="p-6 flex-grow flex flex-col">
                                            <span className="text-xs font-bold py-1 px-3 rounded-full bg-blue-100 text-blue-800 self-start">{idea.category}</span>
                                            <h3 className="text-xl font-bold text-gray-900 mt-3 mb-2">{idea.title}</h3>
                                            <p className="text-sm text-gray-500 mb-4">By {idea.profiles?.full_name || 'Anonymous'}</p>
                                            <p className="text-gray-600 text-sm mb-6 flex-grow">{idea.summary}</p>
                                            <div className="mt-auto border-t pt-4">
                                                <h4 className="text-xs font-semibold text-gray-500 mb-2 uppercase">Seeking</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {idea.seeking?.map((s: string) => <span key={s} className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">{s}</span>)}
                                                </div>
                                            </div>
                                        </div>
                                     </motion.div>
                                </Link>
                             )) : (
                                <p className="col-span-full text-center text-gray-500">No ideas have been submitted yet. Be the first!</p>
                             )}
                         </div>
                    )}
                </div>
            </section>
        </div>
    ); 
}