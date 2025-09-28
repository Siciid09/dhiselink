"use client";

import React, { useState, useEffect, Suspense, FC } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useDebouncedCallback } from 'use-debounce';
import { Search, MapPin, Briefcase, ArrowRight, User } from 'lucide-react';

interface ProfessionalProfile {
    id: string;
    slug: string | null;
    full_name: string;
    professional_title: string;
    avatar_url?: string | null;
    location?: string | null;
    bio?: string | null;
    skills?: string[] | null;
    experience_level?: string | null;
    years_of_experience?: number | null;
}

const ProfessionalCard: FC<{ profile: ProfessionalProfile }> = ({ profile }) => {
    const shortBio = profile.bio?.split(' ').slice(0, 7).join(' ') + (profile.bio && profile.bio.split(' ').length > 7 ? '...' : '');
    const experienceText = profile.years_of_experience ? `${profile.years_of_experience} years` : profile.experience_level;

    return (
        <div className="group relative bg-white rounded-2xl border border-slate-200/80 h-full p-6 flex flex-col transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1 hover:border-amber-500/50">
            <div className="flex items-center gap-4 mb-4">
                <img
                    src={profile.avatar_url || `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(profile.full_name)}`}
                    alt={`${profile.full_name}'s profile picture`}
                    className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm flex-shrink-0"
                />
                <div>
                    <h3 className="text-lg font-bold text-slate-900">{profile.full_name}</h3>
                    <p className="text-sm text-amber-600 font-medium">{profile.professional_title}</p>
                </div>
            </div>
            
            <p className="text-sm text-slate-500 flex items-center gap-2 mb-3"><MapPin size={14} />{profile.location || 'Location not specified'}</p>
            <p className="text-sm text-slate-600 mb-4 h-10">{shortBio}</p>
            
            <div className="mt-auto pt-4 border-t border-slate-100">
                <div className="flex flex-wrap gap-2 mb-5 min-h-[28px]">
                    {profile.skills?.slice(0, 3).map((skill) => (
                        <span key={skill} className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-700">{skill}</span>
                    ))}
                </div>
                <div className="flex justify-between items-center text-sm text-slate-500 mb-5">
                    {experienceText && <span className="font-medium flex items-center gap-1.5"><Briefcase size={14}/> {experienceText}</span>}
                </div>
                <a href={`/professionals/${profile.slug || profile.id}`} className="flex items-center justify-center w-full text-sm font-semibold text-slate-800 bg-slate-100 rounded-lg py-2.5 transition-all duration-300 group-hover:bg-amber-500 group-hover:text-white">
                    View Profile <ArrowRight className="w-4 h-4 ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </a>
            </div>
        </div>
    );
};

const SkeletonCard: FC = () => (
    <div className="bg-white rounded-2xl border border-slate-200/80 h-full p-6 flex flex-col animate-pulse">
        <div className="flex items-center gap-4 mb-4"><div className="w-16 h-16 rounded-full bg-slate-200"></div><div className="flex-grow space-y-2"><div className="h-5 w-4/5 rounded bg-slate-200"></div><div className="h-4 w-3/5 rounded bg-slate-200"></div></div></div>
        <div className="h-4 w-1/2 rounded bg-slate-200 mb-3"></div><div className="space-y-2 h-10"><div className="h-3 w-full rounded bg-slate-200"></div><div className="h-3 w-3/4 rounded bg-slate-200"></div></div>
        <div className="mt-auto pt-4 border-t border-slate-100"><div className="flex gap-2 mb-5 min-h-[28px]"><div className="h-6 w-16 rounded-full bg-slate-100"></div><div className="h-6 w-20 rounded-full bg-slate-100"></div></div><div className="h-5 w-1/3 rounded bg-slate-200 mb-5"></div><div className="h-10 w-full rounded-lg bg-slate-100"></div></div>
    </div>
);

function ProfessionalsClientPage() {
    const [profiles, setProfiles] = useState<ProfessionalProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    useEffect(() => {
        const fetchProfessionals = async () => {
            setLoading(true);
            const params = new URLSearchParams(searchParams.toString());
            try {
                const response = await fetch(`/api/professionals?${params.toString()}`);
                if (!response.ok) throw new Error('Failed to fetch professionals.');
                const data = await response.json();
                setProfiles(data);
            } catch (err) { console.error(err); } 
            finally { setLoading(false); }
        };
        fetchProfessionals();
    }, [searchParams]);

    const handleSearch = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(searchParams);
        if (term) { params.set('q', term); } 
        else { params.delete('q'); }
        replace(`${pathname}?${params.toString()}`);
    }, 300);

    return (
        <div className="bg-slate-50 min-h-screen">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <header className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-slate-900">Discover Professionals</h1>
                    <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">Browse our network of skilled individuals ready to make an impact.</p>
                </header>

                <div className="mb-12 relative max-w-lg mx-auto">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type="text" placeholder="Search by name, title, or skill..." defaultValue={searchParams.get('q')?.toString()} onChange={(e) => handleSearch(e.target.value)} className="w-full h-14 pl-12 pr-4 rounded-xl bg-white border border-slate-200 focus:ring-2 focus:ring-amber-500" />
                </div>

                <main>
                    <AnimatePresence mode="wait">
                        <motion.div key={searchParams.toString()} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {loading ? (
                                Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)
                            ) : profiles.length > 0 ? (
                                profiles.map((p) => <ProfessionalCard key={p.id} profile={p} />)
                            ) : (
                                <div className="col-span-full text-center bg-white p-12 rounded-lg border-dashed"><User className="w-12 h-12 text-slate-400 mx-auto mb-4" /><h3 className="font-bold text-xl text-slate-700">No Professionals Found</h3><p className="text-slate-600">Try adjusting your search criteria.</p></div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
}

export default function ProfessionalsPage() {
    return <Suspense><ProfessionalsClientPage /></Suspense>;
}