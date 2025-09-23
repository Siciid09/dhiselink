"use client";

import { useState, useEffect, useTransition, Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useDebouncedCallback } from 'use-debounce';
import { User, Search, ListFilter, MapPin, Loader2 } from 'lucide-react';

// --- This component contains all your original page logic ---
function ProfessionalsClientPage() {
  const [profiles, setProfiles] = useState<any[]>([]);
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

  const ProfessionalCard = ({ profile }: { profile: any }) => (
    <Link href={`/professionals/${profile.id}`} className="block group">
      <div className="bg-white rounded-2xl border border-slate-200 h-full p-6 flex flex-col text-center items-center transition-all duration-300 hover:shadow-2xl hover:border-blue-500 hover:-translate-y-2">
        <img
          src={profile.avatar_url || `https://api.dicebear.com/8.x/initials/svg?seed=${profile.full_name}`}
          alt={`${profile.full_name}'s profile`}
          className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-slate-100 group-hover:border-blue-200 transition-colors"
        />
        <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{profile.full_name}</h3>
        <p className="text-sm text-blue-600 font-medium mb-4">{profile.professional_title || 'Professional'}</p>
        <div className="flex flex-wrap justify-center gap-2 mt-auto">
          {profile.skills?.slice(0, 3).map((skill: string) => (
            <span key={skill} className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-700">{skill}</span>
          ))}
          {profile.skills && profile.skills.length > 3 && (
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-200 text-slate-800">+{profile.skills.length - 3} more</span>
          )}
        </div>
      </div>
    </Link>
  );

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-slate-900">Discover Talent</h1>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">Browse our network of skilled professionals ready to make an impact.</p>
        </header>

        <div className="bg-white/80 backdrop-blur-lg p-4 rounded-xl border border-slate-200 shadow-lg mb-12 grid grid-cols-1 md:grid-cols-2 gap-4 items-center sticky top-24 z-40">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" placeholder="Search by name or title..." defaultValue={searchParams.get('q')?.toString()} onChange={(e) => handleSearch(e.target.value, 'q')} className="w-full h-12 pl-12 pr-4 rounded-lg bg-slate-100 border-transparent focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="relative">
            <ListFilter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" placeholder="Filter by skill (e.g., React, Engineering)" defaultValue={searchParams.get('skills')?.toString()} onChange={(e) => handleSearch(e.target.value, 'skills')} className="w-full h-12 pl-12 pr-4 rounded-lg bg-slate-100 border-transparent focus:ring-2 focus:ring-blue-500" />
          </div>
          {isPending && <Loader2 className="animate-spin absolute right-4 top-4 text-slate-500" />}
        </div>

        <main>
          {loading ? (<div className="text-center text-slate-500">Loading professionals...</div>) 
          : error ? (<div className="text-center text-red-500">{error}</div>) 
          : (
            <AnimatePresence>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { staggerChildren: 0.07 } }} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {profiles.length > 0 ? (
                  profiles.map(profile => (
                    <motion.div key={profile.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                      <ProfessionalCard profile={profile} />
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full text-center bg-white p-12 rounded-lg border border-dashed">
                    <h3 className="font-bold text-xl mb-2 text-slate-700">No Professionals Found</h3>
                    <p className="text-slate-600">Try adjusting your search or check back later.</p>
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

// --- This is the main page export that wraps the component in Suspense ---
export default function ProfessionalsPage() {
    return (
        <Suspense>
            <ProfessionalsClientPage />
        </Suspense>
    );
}
