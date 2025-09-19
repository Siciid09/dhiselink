// File Path: app/professionals/[id]/page.tsx

"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, Mail, Globe, Lightbulb } from 'lucide-react';

export default function ProfessionalDetailPage({ params }: { params: { id: string } }) {
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!params.id) return;
        const fetchProfile = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/professionals/${params.id}`);
                if (!res.ok) throw new Error('Professional not found');
                const data = await res.json();
                setProfile(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [params.id]);

    if (loading) return <div className="pt-40 text-center">Loading profile...</div>;
    if (error) return <div className="pt-40 text-center text-red-600">{error}</div>;
    if (!profile) return <div className="pt-40 text-center">Could not find professional profile.</div>;

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="container mx-auto px-6 py-32">
                <div className="max-w-4xl mx-auto">
                    {/* --- Profile Header --- */}
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white p-8 rounded-lg shadow-lg border flex flex-col md:flex-row items-center gap-8"
                    >
                        <img 
                            src={profile.avatar_url || `https://ui-avatars.com/api/?name=${profile.full_name?.replace(' ', '+')}&size=128&background=EBF4FF&color=3B82F6&bold=true`}
                            alt={profile.full_name}
                            className="w-32 h-32 rounded-full border-4 border-blue-100 shadow-md flex-shrink-0"
                        />
                        <div className="text-center md:text-left">
                            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">{profile.full_name}</h1>
                            <p className="text-xl font-medium text-blue-600 mt-1">{profile.title}</p>
                            <div className="flex items-center justify-center md:justify-start gap-6 text-sm text-gray-500 mt-3">
                                {profile.location && <span className="flex items-center gap-1.5"><MapPin size={14} /> {profile.location}</span>}
                                {profile.email && <span className="flex items-center gap-1.5"><Mail size={14} /> {profile.email}</span>}
                                {profile.website && <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-blue-600"><Globe size={14} /> Website</a>}
                            </div>
                        </div>
                    </motion.div>

                    {/* --- Main Content Grid --- */}
                    <div className="grid lg:grid-cols-3 gap-8 mt-8">
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="lg:col-span-2 bg-white p-8 rounded-lg shadow-lg border"
                        >
                            <h2 className="text-2xl font-bold mb-4 text-gray-800">About Me</h2>
                            <p className="text-gray-600 leading-relaxed whitespace-pre-line">{profile.bio || "No bio provided."}</p>

                            {profile.skills && profile.skills.length > 0 && (
                                <>
                                    <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-800">Skills</h2>
                                    <div className="flex flex-wrap gap-2">
                                        {profile.skills.map((skill: string) => (
                                            <span key={skill} className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">{skill}</span>
                                        ))}
                                    </div>
                                </>
                            )}
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                            className="lg:col-span-1 space-y-6"
                        >
                           <div className="bg-white p-6 rounded-lg shadow-lg border">
                                <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Lightbulb size={18} /> Ideas & Projects</h3>
                                {profile.ideas && profile.ideas.length > 0 ? (
                                    <div className="space-y-4">
                                        {profile.ideas.map((idea: any) => (
                                            <a key={idea.id} href={`/ideas/${idea.id}`} className="block p-3 rounded-md hover:bg-gray-100 border-b last:border-b-0">
                                                <p className="font-semibold text-gray-800">{idea.title}</p>
                                                <p className="text-xs text-gray-500">Posted on {new Date(idea.created_at).toLocaleDateString()}</p>
                                            </a>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500">This professional hasn&apos;t posted any ideas yet.</p>
                                )}
                           </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
