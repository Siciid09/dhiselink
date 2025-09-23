"use client";

import { useState, useEffect, useTransition, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image'; // <-- Switched to next/image
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useDebouncedCallback } from 'use-debounce';
import { Search, ListFilter, MapPin, Loader2 } from 'lucide-react';

// --- 1. Define a strict type for your profile data ---
// This improves code quality and prevents bugs.
interface ProfessionalProfile {
  id: string;
  full_name: string;
  professional_title: string;
  avatar_url?: string | null;
  location?: string | null;
  skills?: string[];
  // You can add other fields from your settings page here if needed
  // short_bio?: string;
  // languages?: string[];
}

// --- 2. A "Super Modern" Professional Card Component ---
const ProfessionalCard = ({ profile }: { profile: ProfessionalProfile }) => (
  <Link href={`/professionals/${profile.id}`} className="block group" prefetch={false}>
    <div className="relative bg-white/60 backdrop-blur-md rounded-2xl border border-slate-200/80 h-full p-6 flex flex-col text-center items-center transition-all duration-300 ease-in-out hover:shadow-2xl hover:border-blue-500 hover:scale-[1.03]">
      <div className="relative mb-4">
        <Image
          src={profile.avatar_url || `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(profile.full_name)}`}
          alt={`${profile.full_name}'s profile picture`}
          width={96}
          height={96}
          className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md group-hover:border-blue-200 transition-colors duration-300"
        />
      </div>
      
      <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors duration-300">{profile.full_name}</h3>
      <p className="text-sm text-blue-600 font-medium mb-3">{profile.professional_title}</p>
      
      {profile.location && (
        <div className="flex items-center text-slate-500 text-xs mb-4">
          <MapPin className="w-3.5 h-3.5 mr-1.5" />
          <span>{profile.location}</span>
        </div>
      )}

      <div className="flex flex-wrap justify-center gap-2 mt-auto pt-4 border-t border-slate-200/60 w-full">
        {profile.skills?.slice(0, 2).map((skill) => (
          <span key={skill} className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-700 group-hover:bg-blue-100 group-hover:text-blue-800 transition-all">
            {skill}
          </span>
        ))}
        {profile.skills && profile.skills.length > 2 && (
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-200 text-slate-800">
            +{profile.skills.length - 2}
          </span>
        )}
      </div>
    </div>
  </Link>
);


// --- 3. The Skeleton Loading Card ---
// It mimics the structure of ProfessionalCard for a smooth transition.
const SkeletonCard = () => (
    <div className="bg-white/50 rounded-2xl border border-slate-200/50 h-full p-6 flex flex-col items-center animate-pulse">
        <div className="w-24 h-24 rounded-full bg-slate-200 mb-4"></div>
        <div className="h-6 w-3/4 rounded bg-slate-200 mb-2"></div>
        <div className="h-4 w-1/2 rounded bg-slate-200 mb-3"></div>
        <div className="h-3 w-1/3 rounded bg-slate-200 mb-4"></div>
        <div className="flex flex-wrap justify-center gap-2 mt-auto pt-4 border-t border-slate-200/60 w-full">
            <div className="h-6 w-16 rounded-full bg-slate-100"></div>
            <div className="h-6 w-20 rounded-full bg-slate-100"></div>
        </div>
    </div>
);


// --- This is your main page component with all logic integrated ---
function ProfessionalsClientPage() {
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
        if (!response.ok) throw new Error('Failed to fetch professionals. Please try again.');
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

  const handleSearch = useDebouncedCallback((term: string, field: 'q' | 'skills') => {
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
    <div className="bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-slate-900">Discover Talent</h1>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">Browse our network of skilled professionals ready to make an impact.</p>
        </header>

        <div className="bg-white/80 backdrop-blur-lg p-4 rounded-xl border border-slate-200 shadow-lg mb-12 grid grid-cols-1 md:grid-cols-2 gap-4 items-center sticky top-24 z-40">
          <div className="relative">
            <label htmlFor="name-search" className="sr-only">Search by name or title</label>
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input id="name-search" type="text" placeholder="Search by name or title..." defaultValue={searchParams.get('q')?.toString()} onChange={(e) => handleSearch(e.target.value, 'q')} className="w-full h-12 pl-12 pr-4 rounded-lg bg-slate-100 border-transparent focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="relative">
            <label htmlFor="skill-filter" className="sr-only">Filter by skill</label>
            <ListFilter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input id="skill-filter" type="text" placeholder="Filter by skill (e.g., React, Engineering)" defaultValue={searchParams.get('skills')?.toString()} onChange={(e) => handleSearch(e.target.value, 'skills')} className="w-full h-12 pl-12 pr-4 rounded-lg bg-slate-100 border-transparent focus:ring-2 focus:ring-blue-500" />
          </div>
          {isPending && <Loader2 className="animate-spin absolute right-4 top-1/2 -translate-y-1/2 text-slate-500" />}
        </div>

        <main>
          {error && <div className="text-center text-red-500">{error}</div>}
          
          <AnimatePresence mode="wait">
            <motion.div
              key={loading ? 'loading' : 'loaded'}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            >
              {loading ? (
                Array.from({ length: 8 }).map((_, index) => <SkeletonCard key={index} />)
              ) : profiles.length > 0 ? (
                profiles.map((profile) => (
                   <motion.div 
                     key={profile.id} 
                     initial={{ opacity: 0, y: 20 }} 
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ duration: 0.3 }}
                   >
                     <ProfessionalCard profile={profile} />
                   </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center bg-white p-12 rounded-lg border border-dashed">
                  <h3 className="font-bold text-xl mb-2 text-slate-700">No Professionals Found</h3>
                  <p className="text-slate-600">Try adjusting your search criteria or check back later.</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

// --- Main Page Export ---
export default function ProfessionalsPage() {
    return (
        <Suspense fallback={<div>Loading Page...</div>}> {/* Added a fallback to Suspense */}
            <ProfessionalsClientPage />
        </Suspense>
    );
}
