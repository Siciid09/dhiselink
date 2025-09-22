"use client";

import { useState, useEffect, useTransition } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useDebouncedCallback } from 'use-debounce';
import { User, Search, ListFilter, MapPin, Tag, Briefcase, ChevronRight, Loader2 } from 'lucide-react';

// Define the shape of a professional's profile with new fields
type ProfessionalProfile = {
  id: string;
  full_name: string;
  professional_title: string | null;
  avatar_url: string | null;
  skills: string[] | null;
  location: string | null;
  bio: string | null;
  category: string | null; // New field
  tags: string[] | null; // New field (assuming text[] type in DB)
};

// --- Professional Card Component ---
const ProfessionalCard = ({ profile }: { profile: ProfessionalProfile }) => {
  return (
    <Link href={`/professionals/${profile.id}`} className="block group">
      <div className="bg-white rounded-3xl border border-slate-200 h-full p-8 flex flex-col items-start transition-all duration-300 hover:shadow-xl hover:border-blue-500 hover:-translate-y-1">
        
        <div className="flex items-center gap-4 mb-4 w-full">
          <img
            src={profile.avatar_url || `https://api.dicebear.com/8.x/initials/svg?seed=${profile.full_name}`}
            alt={`${profile.full_name}'s profile`}
            className="w-20 h-20 rounded-full object-cover border-4 border-blue-100 group-hover:border-blue-300 transition-colors flex-shrink-0"
          />
          <div className="flex-grow">
            <h3 className="text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-tight">
              {profile.full_name || 'Not Provided'}
            </h3>
            <p className="text-md text-blue-600 font-medium mt-1">
              {profile.professional_title || 'No Title Specified'}
            </p>
          </div>
        </div>

        <p className="text-sm text-slate-600 mb-4 flex-grow line-clamp-3">
          {profile.bio || 'No short description available.'}
        </p>

        <div className="w-full space-y-2 text-sm text-slate-700 mb-4">
            <div className="flex items-center gap-2">
                <MapPin size={16} className="text-slate-400" />
                <span>{profile.location || 'Location not specified'}</span>
            </div>
            {profile.category && (
                <div className="flex items-center gap-2">
                    <Briefcase size={16} className="text-slate-400" />
                    <span>{profile.category}</span>
                </div>
            )}
        </div>

        {/* Tags/Skills Section */}
        {(profile.skills && profile.skills.length > 0) || (profile.tags && profile.tags.length > 0) ? (
          <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-slate-100 w-full">
            {profile.skills?.map((skill) => (
              <span key={skill} className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 text-blue-700">
                {skill}
              </span>
            ))}
            {profile.tags?.map((tag) => (
              <span key={tag} className="text-xs font-semibold px-3 py-1 rounded-full bg-green-50 text-green-700">
                {tag}
              </span>
            ))}
          </div>
        ) : (
          <div className="mt-auto pt-4 border-t border-slate-100 w-full">
            <span className="text-xs text-slate-500">No skills or tags provided.</span>
          </div>
        )}

        <div className="mt-6 w-full text-right">
          <span className="inline-flex items-center gap-1.5 text-blue-600 font-semibold group-hover:text-blue-800 transition-colors">
            View Profile <ChevronRight size={16} />
          </span>
        </div>
      </div>
    </Link>
  );
};

// --- Main Page Component ---
export default function ProfessionalsPage() {
  const [profiles, setProfiles] = useState<ProfessionalProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const fetchProfessionals = async () => {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams(searchParams.toString());
      try {
        const response = await fetch(`/api/professionals?${params.toString()}`);
        if (!response.ok) throw new Error('Failed to fetch professionals.');
        const data = await response.json();
        setProfiles(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchProfessionals();
  }, [searchParams]);

  const handleSearch = useDebouncedCallback((term: string, field: 'q' | 'skills' | 'location') => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set(field, term);
    } else {
      params.delete(field);
    }
    startTransition(() => {
      replace(`${pathname}?${params.toString()}`);
    });
  }, 300);

  return (
    <div className="bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-slate-900">
            Discover Exceptional Talent
          </h1>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            Explore a diverse network of skilled professionals across various industries and specializations.
          </p>
        </header>

        {/* --- Search Filter UI (Now scrollable) --- */}
        <div className="bg-white/90 p-6 rounded-2xl border border-slate-200 shadow-xl mb-12 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or title..."
              defaultValue={searchParams.get('q')?.toString()}
              onChange={(e) => handleSearch(e.target.value, 'q')}
              className="w-full h-12 pl-12 pr-4 rounded-xl bg-slate-100 border-transparent focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="relative">
            <ListFilter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Filter by skills or tags (e.g., React, Structural)"
              defaultValue={searchParams.get('skills')?.toString()}
              onChange={(e) => handleSearch(e.target.value, 'skills')}
              className="w-full h-12 pl-12 pr-4 rounded-xl bg-slate-100 border-transparent focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Filter by location (e.g., Hargeisa)"
              defaultValue={searchParams.get('location')?.toString()}
              onChange={(e) => handleSearch(e.target.value, 'location')}
              className="w-full h-12 pl-12 pr-4 rounded-xl bg-slate-100 border-transparent focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {isPending && <Loader2 className="animate-spin absolute right-4 top-4 text-slate-500" />}
        </div>

        {/* --- Main Content Area --- */}
        <main>
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="animate-spin text-blue-500 w-8 h-8" />
              <p className="ml-3 text-slate-600">Loading professionals...</p>
            </div>
          ) : error ? (
            <div className="text-center text-red-500 bg-white p-8 rounded-lg border border-red-200">{error}</div>
          ) : (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { staggerChildren: 0.07 } }}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
              >
                {profiles.length > 0 ? (
                  profiles.map(profile => (
                    <motion.div
                      key={profile.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <ProfessionalCard profile={profile} />
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full text-center bg-white p-16 rounded-2xl border border-dashed border-slate-300">
                    <User className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="font-bold text-2xl mb-2 text-slate-700">No Professionals Found</h3>
                    <p className="text-slate-600">Try adjusting your search filters or check back later.</p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </main>
      </div>
    </div>
  );
}