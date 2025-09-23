"use client";

import { useState, useEffect, useTransition, Suspense, FC } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useDebouncedCallback } from 'use-debounce';
import { Search, ListFilter, Loader2, ArrowRight } from 'lucide-react';

// --- 1. Final TypeScript Interface (Based on your schema) ---
interface ProfessionalProfile {
  id: string;
  full_name: string;
  professional_title: string;
  bio?: string | null;
  avatar_url?: string | null;
  location?: string | null;
  skills?: string[] | null;
  // Optional fields for future use on detail pages
  languages?: string[] | null;
  certifications?: string[] | null;
  linkedin_url?: string | null;
  github_url?: string | null;
  portfolio_url?: string | null;
}

// --- 2. The Final "Professional & Modern" Card Component ---
const ProfessionalCard: FC<{ profile: ProfessionalProfile }> = ({ profile }) => {
  const shortDescription = profile.bio?.split(' ').slice(0, 8).join(' ') + (profile.bio && profile.bio.split(' ').length > 8 ? '...' : '');

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200 h-full p-6 flex flex-col transition-all duration-300 ease-in-out hover:border-blue-500 hover:shadow-2xl hover:-translate-y-1.5">
      <div className="flex items-start gap-5">
        <Image
          src={profile.avatar_url || `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(profile.full_name)}`}
          alt={`${profile.full_name}'s profile picture`}
          width={64}
          height={64}
          className="w-16 h-16 rounded-full object-cover border-2 border-slate-100 flex-shrink-0"
        />
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold text-slate-900">{profile.full_name}</h3>
          <p className="text-sm text-blue-600 font-medium">{profile.professional_title}</p>
        </div>
      </div>
      
      <p className="text-sm text-slate-600 mt-4 h-10 flex-shrink-0">
          {shortDescription}
      </p>
      
      <div className="mt-auto pt-5">
        <div className="flex flex-wrap gap-2 mb-6 h-6 overflow-hidden">
            {profile.skills?.slice(0, 3).map((skill) => (
              <span key={skill} className="text-xs font-medium px-3 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200/50">
                {skill}
              </span>
            ))}
        </div>
        
        <Link href={`/professionals/${profile.id}`} className="flex items-center justify-center w-full text-sm font-semibold text-slate-800 bg-slate-100/80 rounded-lg py-2.5 transition-all duration-300 group-hover:bg-blue-600 group-hover:text-white" prefetch={false}>
          View Profile
          <ArrowRight className="w-4 h-4 ml-2 opacity-0 transition-all duration-300 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0" />
        </Link>
      </div>
    </div>
  );
};

// --- 3. The Perfectly Matched Skeleton Loader ---
const SkeletonCard: FC = () => (
    <div className="bg-white rounded-2xl border border-slate-200 h-full p-6 flex flex-col animate-pulse">
      <div className="flex items-start gap-5">
        <div className="w-16 h-16 rounded-full bg-slate-200 flex-shrink-0"></div>
        <div className="flex flex-col flex-grow pt-2">
            <div className="h-5 w-4/5 rounded bg-slate-200 mb-2"></div>
            <div className="h-4 w-3/5 rounded bg-slate-200"></div>
        </div>
      </div>
      <div className="mt-4 space-y-2 h-10">
        <div className="h-3 w-full rounded bg-slate-200"></div>
        <div className="h-3 w-3/4 rounded bg-slate-200"></div>
      </div>
      <div className="mt-auto pt-5">
        <div className="flex flex-wrap gap-2 mb-6 h-6">
            <div className="h-6 w-16 rounded-full bg-slate-100"></div>
            <div className="h-6 w-20 rounded-full bg-slate-100"></div>
            <div className="h-6 w-14 rounded-full bg-slate-100"></div>
        </div>
        <div className="h-10 w-full rounded-lg bg-slate-100"></div>
      </div>
    </div>
);

// --- Main Page Component ---
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
      } catch (err) { setError((err as Error).message); } 
      finally { setLoading(false); }
    };
    fetchProfessionals();
  }, [searchParams]);

  const handleSearch = useDebouncedCallback((term: string, field: 'q' | 'skills') => {
    const params = new URLSearchParams(searchParams);
    if (term) { params.set(field, term); } 
    else { params.delete(field); }
    startTransition(() => { replace(`${pathname}?${params.toString()}`); });
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
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {loading ? (
                Array.from({ length: 9 }).map((_, index) => <SkeletonCard key={index} />)
              ) : profiles.length > 0 ? (
                profiles.map((profile) => (
                   <motion.div key={profile.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
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

// --- Default Export with Suspense Wrapper ---
export default function ProfessionalsPage() {
    return (
        <Suspense>
            <ProfessionalsClientPage />
        </Suspense>
    );
}
