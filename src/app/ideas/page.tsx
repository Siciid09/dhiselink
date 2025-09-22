"use client"; // This directive marks the component for client-side rendering

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { ArrowRight, BrainCircuit, Rocket, User, Zap } from 'lucide-react';

// --- ROBUST DATA FETCHING WITH TYPES ---
// This backend logic is kept exactly as it was.

type Idea = {
  id: string;
  title: string;
  summary: string;
  profiles: {
    full_name: string;
  } | null;
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!; // Use the public anon key for client-side
const supabase = createClient(supabaseUrl, supabaseKey);

async function getAllIdeas(): Promise<Idea[]> {
  const { data, error } = await supabase
    .from('ideas')
    .select('id, title, summary, profiles(full_name)')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Supabase fetch error for all ideas:", error.message);
    return [];
  }

  return data as Idea[];
}

// --- A helper function to generate a unique gradient for each card ---
const generateCardGradient = (id: string) => {
  const hash = id.split('').reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0);
  const h = hash % 360;
  const s = 70 + (hash % 10); // Saturation
  const l = 45 + (hash % 10); // Lightness
  return `hsl(${h}, ${s}%, ${l}%)`;
};


// --- REDESIGNED PAGE COMPONENT (VIBRANT DARK THEME, CLIENT-SIDE) ---

export default function IdeasPage() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIdeas = async () => {
      setLoading(true);
      const fetchedIdeas = await getAllIdeas();
      setIdeas(fetchedIdeas);
      setLoading(false);
    };

    fetchIdeas();
  }, []);

  if (loading) {
    return (
      <div className="bg-slate-900 text-white min-h-screen flex justify-center items-center">
        <div className="text-center space-y-4">
          <BrainCircuit className="h-12 w-12 text-purple-400 mx-auto animate-pulse" />
          <p className="text-lg text-slate-400">Loading Innovations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 text-white min-h-screen pt-24 sm:pt-32">
      <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      <div className="absolute top-0 left-0 z-0 w-1/3 h-2/3 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 z-0 w-1/3 h-2/3 bg-blue-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Page Header with Gradient Text */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center justify-center bg-slate-800 p-4 rounded-full shadow-lg mb-6 border border-slate-700">
            <BrainCircuit className="h-10 w-10 text-purple-400" />
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter">
            <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-orange-400 bg-clip-text text-transparent drop-shadow-sm">
              Innovation Hub
            </span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-slate-400">
            Discover, discuss, and collaborate on groundbreaking projects from talented individuals.
          </p>
        </div>

        {/* Card Grid Layout */}
        <div className="max-w-7xl mx-auto">
          {ideas && ideas.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {ideas.map(idea => (
                <Link href={`/ideas/${idea.id}`} key={idea.id} className="block group relative">
                  {/* Vibrant, interactive Card */}
                  <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-700 transition-all duration-300 h-full flex flex-col overflow-hidden
                                   group-hover:shadow-purple-500/20 group-hover:border-purple-500/80 group-hover:-translate-y-2">
                    
                    {/* Dynamic Gradient Bar */}
                    <div 
                      className="h-2 w-full"
                      style={{ backgroundColor: generateCardGradient(idea.id) }}
                    ></div>

                    <div className="p-6 flex flex-col flex-grow">
                      <h2 className="text-2xl font-bold text-slate-100 tracking-tight group-hover:text-purple-300 transition-colors">
                        {idea.title}
                      </h2>
                      <p className="text-slate-400 mt-3 mb-6 flex-grow line-clamp-3">
                        {idea.summary}
                      </p>
                      
                      {/* Author Section */}
                      <div className="border-t border-slate-700 pt-4 flex justify-between items-center text-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center border border-slate-600">
                              <User className="w-4 h-4 text-slate-400" />
                            </div>
                            <p className="text-slate-400">
                              By <span className="font-medium text-slate-200">{idea.profiles?.full_name || "A Member"}</span>
                            </p>
                        </div>
                        
                        {/* Animated "View Idea" Arrow */}
                        <div className="flex items-center gap-1 font-semibold text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            View Idea <ArrowRight size={16} />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            /* Empty State for Dark Theme */
            <div className="text-center py-20 px-6 bg-slate-800/60 backdrop-blur-sm rounded-2xl border border-dashed border-slate-700 shadow-lg">
              <div className="inline-block bg-slate-700 p-5 rounded-full">
                <Rocket className="w-12 h-12 text-purple-400"/>
              </div>
              <h3 className="text-3xl font-bold text-slate-100 mt-6">The Hub is Ready for Liftoff!</h3>
              <p className="text-slate-400 mt-3 max-w-md mx-auto">Be the first to spark a new idea and launch the next great conversation.</p>
              <Link href="/submit-idea" className="mt-8 inline-flex items-center gap-2 px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-lg text-white bg-purple-600 hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 focus:ring-offset-slate-900">
                <Zap size={20} />
                Submit Your Idea
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}