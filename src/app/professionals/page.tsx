"use client";

<<<<<<< HEAD
import { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useDebouncedCallback } from "use-debounce";
import {
  User,
  Search,
  ListFilter,
  MapPin,
  Briefcase,
  ArrowRight,
  Loader2,
} from "lucide-react";

type ProfessionalProfile = {
  id: string;
  full_name: string;
  professional_title: string | null;
  avatar_url: string | null;
  skills: string[] | null;
  location: string | null;
  bio: string | null;
  category: string | null;
  tags: string[] | null;
};

// --- UPDATED Professional Card ---
const ProfessionalCard = ({ profile }: { profile: ProfessionalProfile }) => {
  // CHANGED: Function to truncate the bio to 9 words
  const truncateBio = (text: string | null) => {
    if (!text) return "No description available.";
    const words = text.split(' ');
    if (words.length <= 9) return text;
    return words.slice(0, 9).join(' ') + '...';
  };

  return (
    <Link href={`/professionals/${profile.id}`} className="block group h-full">
      <div className="bg-white rounded-2xl border border-slate-200 h-full p-6 flex flex-col gap-4 transition-all duration-300 hover:shadow-lg hover:border-sky-500 hover:-translate-y-1">
        <div className="flex items-start gap-4">
          <img
            src={
              profile.avatar_url ||
              `https://api.dicebear.com/8.x/initials/svg?seed=${profile.full_name}`
            }
            alt={`${profile.full_name}'s profile`}
            className="w-16 h-16 rounded-full object-cover border-2 border-white ring-2 ring-slate-200 flex-shrink-0"
          />
          <div className="flex-grow">
            <h3 className="text-lg font-semibold text-slate-800 group-hover:text-sky-600 transition-colors">
              {profile.full_name || "Not Provided"}
            </h3>
            <p className="text-sm text-sky-600 font-medium">
              {profile.professional_title || "No Title"}
            </p>
            {/* CHANGED: Location is now always rendered in the card header */}
            <div className="flex items-center gap-1.5 mt-2 text-slate-500 text-xs">
              <MapPin size={14} />
              <span>{profile.location || "Location not specified"}</span>
            </div>
          </div>
        </div>

        {/* CHANGED: Bio is now truncated to 9 words */}
        <p className="text-sm text-slate-600">
          {truncateBio(profile.bio)}
        </p>

        <div className="pt-4 border-t border-slate-100">
          {(profile.skills?.length || profile.tags?.length) ? (
            <div className="flex flex-wrap gap-2">
              {profile.skills?.slice(0, 3).map((skill) => (
                <span
                  key={skill}
                  className="text-xs font-semibold px-2.5 py-1 rounded-full bg-sky-50 text-sky-700"
                >
                  {skill}
                </span>
              ))}
            </div>
          ) : (
             <span className="text-xs text-slate-400 italic">No skills provided.</span>
          )}
        </div>

        <div className="mt-auto pt-4">
            <span className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm bg-slate-100 text-slate-700 transition-all duration-300 group-hover:bg-sky-500 group-hover:text-white">
                View Profile
                <ArrowRight size={16} />
            </span>
=======
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
>>>>>>> 55fe139b3e819ae9c07bcabd58ac72a47b0d801d
        </div>
        
        <Link href={`/professionals/${profile.id}`} className="flex items-center justify-center w-full text-sm font-semibold text-slate-800 bg-slate-100/80 rounded-lg py-2.5 transition-all duration-300 group-hover:bg-blue-600 group-hover:text-white" prefetch={false}>
          View Profile
          <ArrowRight className="w-4 h-4 ml-2 opacity-0 transition-all duration-300 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0" />
        </Link>
      </div>
    </div>
  );
};

<<<<<<< HEAD
// --- Main Page (No changes here) ---
export default function ProfessionalsPage() {
=======
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
>>>>>>> 55fe139b3e819ae9c07bcabd58ac72a47b0d801d
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
<<<<<<< HEAD
        if (!response.ok) throw new Error("Failed to fetch professionals.");
=======
        if (!response.ok) throw new Error('Failed to fetch professionals. Please try again.');
>>>>>>> 55fe139b3e819ae9c07bcabd58ac72a47b0d801d
        const data = await response.json();
        setProfiles(data);
      } catch (err) { setError((err as Error).message); } 
      finally { setLoading(false); }
    };
    fetchProfessionals();
  }, [searchParams]);

<<<<<<< HEAD
  const handleSearch = useDebouncedCallback(
    (term: string, field: "q" | "skills" | "location") => {
      const params = new URLSearchParams(searchParams);
      if (term) params.set(field, term);
      else params.delete(field);
      startTransition(() => replace(`${pathname}?${params.toString()}`));
    },
    300
  );

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-slate-900">
            Discover Exceptional Talent
          </h1>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            Explore our network of skilled professionals across various industries.
          </p>
        </header>

        <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-slate-200 shadow-lg mb-12 grid grid-cols-1 md:grid-cols-3 gap-4 items-center sticky top-4 z-10">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" placeholder="Search by name or title..." defaultValue={searchParams.get("q")?.toString()} onChange={(e) => handleSearch(e.target.value, "q")} className="w-full h-11 pl-10 pr-4 rounded-lg bg-slate-100 border-transparent focus:ring-2 focus:ring-sky-500" />
          </div>
          <div className="relative">
            <ListFilter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" placeholder="Filter by skills or tags" defaultValue={searchParams.get("skills")?.toString()} onChange={(e) => handleSearch(e.target.value, "skills")} className="w-full h-11 pl-10 pr-4 rounded-lg bg-slate-100 border-transparent focus:ring-2 focus:ring-sky-500" />
          </div>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" placeholder="Filter by location" defaultValue={searchParams.get("location")?.toString()} onChange={(e) => handleSearch(e.target.value, "location")} className="w-full h-11 pl-10 pr-4 rounded-lg bg-slate-100 border-transparent focus:ring-2 focus:ring-sky-500" />
          </div>
          {isPending && ( <div className="absolute right-4 top-1/2 -translate-y-1/2"> <Loader2 className="animate-spin text-slate-500" /> </div> )}
        </div>

        <main>
          {loading ? ( <div className="flex justify-center items-center h-40"> <Loader2 className="animate-spin text-sky-500 w-8 h-8" /> <p className="ml-3 text-slate-600">Loading professionals...</p> </div>
          ) : error ? ( <div className="text-center text-red-600 bg-red-50 p-8 rounded-lg border border-red-200"> <h3 className="font-bold text-lg">An Error Occurred</h3> <p>{error}</p> </div>
          ) : (
            <AnimatePresence>
              {profiles.length > 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { staggerChildren: 0.05 } }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" >
                  {profiles.map((profile) => ( <motion.div key={profile.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.2 }} layout > <ProfessionalCard profile={profile} /> </motion.div> ))}
                </motion.div>
              ) : (
                <div className="col-span-full text-center bg-white p-16 rounded-lg border border-dashed border-slate-300"> <User className="w-16 h-16 text-slate-300 mx-auto mb-4" /> <h3 className="font-bold text-xl mb-2 text-slate-700"> No Professionals Found </h3> <p className="text-slate-500">Try adjusting your search filters to find what you're looking for.</p> </div>
              )}
            </AnimatePresence>
          )}
=======
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
>>>>>>> 55fe139b3e819ae9c07bcabd58ac72a47b0d801d
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
