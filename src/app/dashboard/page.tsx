"use client";

import React, { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { Edit, PlusCircle, FileText, ArrowRight } from 'lucide-react';

// NOTE: Assuming 'supabase' is available globally or injected by the environment,
// as the local import '@lib/supabase' could not be resolved.
declare const supabase: any;

// Define types for our data for better code quality
interface Profile {
    full_name: string;
    title: string | null;
}

interface Idea {
    id: string;
    title: string;
    category: string;
    status: string;
}

export default function DashboardPage() {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [ideas, setIdeas] = useState<Idea[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            // This new structure is more robust and ensures the loading state
            // is always removed, even if there's an error fetching data.
            try {
                const { data: { session } } = await supabase.auth.getSession();
                
                if (!session) {
                    window.location.href = '/login';
                    return;
                }
                setUser(session.user);

                // Fetch both profile and user's ideas in parallel for speed
                const [profileRes, ideasRes] = await Promise.all([
                    fetch('/api/profile'),
                    fetch('/api/ideas/mine') // This is our new protected API route
                ]);

                if (profileRes.ok) {
                    const profileData = await profileRes.json();
                    setProfile(profileData);
                } else {
                    console.error("Failed to fetch profile");
                }

                if (ideasRes.ok) {
                    const ideasData = await ideasRes.json();
                    setIdeas(ideasData);
                } else {
                    console.error("Failed to fetch user's ideas");
                }

            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div className="pt-40 text-center text-gray-600">Loading your dashboard...</div>;
    }

    return (
        <div className="bg-gray-50 min-h-screen pt-32 pb-24">
            <div className="container mx-auto px-6">
                
                {/* --- Header --- */}
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-gray-900">
                        Welcome back, {profile?.full_name || user?.email}!
                    </h1>
                    <p className="text-lg text-gray-600 mt-2">Here’s a summary of your activity on Dhiselink.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* --- Left Column: Profile & Actions --- */}
                    <div className="lg:col-span-1 space-y-8">
                        <div className="bg-white p-6 rounded-lg shadow-lg border">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Your Profile</h2>
                            <div className="space-y-3 text-gray-700">
                                <p><strong>Email:</strong> {user?.email}</p>
                                <p><strong>Name:</strong> {profile?.full_name || 'Not set'}</p>
                                <p><strong>Title:</strong> {profile?.title || <span className="text-yellow-600">Please add your title</span>}</p>
                            </div>
                            <a href="/dashboard/profile" className="mt-6 w-full flex items-center justify-center gap-2 bg-gray-800 text-white font-semibold py-3 px-4 rounded-lg hover:bg-black transition-colors">
                                <Edit size={16} /> Edit Your Profile
                            </a>
                        </div>
                    </div>

                    {/* --- Right Column: My Ideas --- */}
                    <div className="lg:col-span-2">
                        <div className="bg-white p-6 rounded-lg shadow-lg border h-full">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-gray-900">My Ideas ({ideas.length})</h2>
                                <a href="/ideas/submit" className="flex items-center gap-2 bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                                    <PlusCircle size={16} /> Submit New Idea
                                </a>
                            </div>
                            
                            {ideas.length > 0 ? (
                                <ul className="space-y-4">
                                    {ideas.map(idea => (
                                        <li key={idea.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <p className="font-bold text-gray-800">{idea.title}</p>
                                                    <p className="text-sm text-gray-500">
                                                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">{idea.status}</span>
                                                    </p>
                                                </div>
                                                <a href={`/ideas/${idea.id}`} className="text-blue-600 hover:text-blue-800">
                                                    <ArrowRight size={20} />
                                                </a>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="text-center py-12 border-2 border-dashed rounded-lg">
                                    <FileText className="mx-auto h-12 w-12 text-gray-400" />
                                    <h3 className="mt-2 text-lg font-medium text-gray-900">No ideas submitted yet</h3>
                                    <p className="mt-1 text-sm text-gray-500">Ready to innovate? Share your first project.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

