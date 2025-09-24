"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Landmark, MapPin, BookOpen, Loader2, ArrowRight } from 'lucide-react';

// A specific type for our new university data
type UniversityProfile = {
  id: string;
  organization_name: string;
  logo_url: string | null;
  location: string | null;
  bio: string | null;
  program_count: number;
};

// --- A new, custom card component designed specifically for universities ---
const UniversityCard = ({ university }: { university: UniversityProfile }) => {
  const shortDescription = university.bio ? university.bio.split(' ').slice(0, 15).join(' ') + '...' : 'An esteemed academic institution.';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl shadow-md h-full group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col"
    >
      <div className="p-6 flex-grow">
        <div className="flex items-start gap-4">
          <img
            src={university.logo_url || `https://api.dicebear.com/8.x/initials/svg?seed=${university.organization_name}`}
            alt={`${university.organization_name} logo`}
            className="w-16 h-16 bg-white object-contain rounded-md border p-1 flex-shrink-0"
          />
          <div>
            <h3 className="text-xl font-bold text-slate-900">
              {university.organization_name}
            </h3>
            <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-1">
              <MapPin size={14} />
              {university.location || 'Location not specified'}
            </p>
          </div>
        </div>
        <p className="text-slate-600 text-sm mt-4 flex-grow line-clamp-3">
          {shortDescription}
        </p>
      </div>
      <div className="px-6 pb-6 mt-4">
        <div className="flex items-center justify-between text-sm p-3 bg-slate-50 rounded-lg border">
            <div className="flex items-center gap-2 text-slate-600 font-medium">
                <BookOpen size={16} className="text-sky-600" />
                <span>Programs Offered</span>
            </div>
            <span className="font-bold text-slate-800">{university.program_count}</span>
        </div>
        <Link href={`/organizations/${university.id}`} className="block text-center w-full mt-4 bg-sky-600 text-white font-semibold py-2.5 px-4 rounded-lg hover:bg-sky-700 transition-colors duration-200">
          View Profile
        </Link>
      </div>
    </motion.div>
  );
};

export default function UniversitiesPage() {
  const [universities, setUniversities] = useState<UniversityProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const response = await fetch('/api/universities');
        if (!response.ok) throw new Error('Failed to fetch universities.');
        const data = await response.json();
        setUniversities(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchUniversities();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-slate-50">
        <Loader2 className="w-10 h-10 animate-spin text-sky-500" />
        <p className="mt-4 text-slate-600">Loading academic institutions...</p>
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-40 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <header className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
            Fostering Future Leaders
          </h1>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            Explore the academic institutions training the next generation of professionals.
          </p>
        </header>
        
        <main>
          <AnimatePresence>
            {universities.length > 0 ? (
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                initial="hidden"
                animate="visible"
                variants={{
                  visible: { transition: { staggerChildren: 0.05 } }
                }}
              >
                {universities.map(uni => (
                  <UniversityCard key={uni.id} university={uni} />
                ))}
              </motion.div>
            ) : (
              <div className="text-center bg-white p-12 rounded-lg border border-dashed">
                <Landmark className="mx-auto h-12 w-12 text-slate-300" />
                <h3 className="mt-4 text-lg font-medium text-slate-800">No Universities Found</h3>
                <p className="mt-1 text-sm text-slate-500">
                  No universities have registered yet. Check back soon!
                </p>
              </div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}