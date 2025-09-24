"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Building, MapPin, Briefcase, Loader2 } from 'lucide-react';

type CompanyProfile = {
  id: string;
  organization_name: string;
  logo_url: string | null;
  cover_image_url: string | null;
  location: string | null;
  industry: string | null;
  tagline: string | null;
};

const CompanyCard = ({ company }: { company: CompanyProfile }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl shadow-md overflow-hidden h-full group transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
    >
      <Link href={`/organizations/${company.id}`} className="block h-full">
        <div className="relative h-32 bg-slate-200">
          {company.cover_image_url ? (
            <img
              src={company.cover_image_url}
              alt={`${company.organization_name} cover image`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200"></div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          <img
            src={company.logo_url || `https://api.dicebear.com/8.x/initials/svg?seed=${company.organization_name}`}
            alt={`${company.organization_name} logo`}
            className="absolute -bottom-8 left-6 w-16 h-16 bg-white object-contain rounded-md border-4 border-white shadow-lg"
          />
        </div>
        <div className="p-6 pt-10 flex flex-col h-[calc(100%-8rem)]">
          <h3 className="text-xl font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
            {company.organization_name}
          </h3>
          <p className="text-sm text-sky-700 font-medium mt-1">
            <Briefcase size={14} className="inline-block mr-1.5 align-middle" />
            {company.industry || 'Industry not specified'}
          </p>
          <p className="text-slate-600 text-sm mt-3 flex-grow line-clamp-2">
            {company.tagline || 'Pioneering the future of its industry.'}
          </p>
          <div className="mt-4 pt-4 border-t border-slate-100 text-sm text-slate-500 flex items-center gap-2">
            <MapPin size={14} />
            <span>{company.location || 'Global'}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<CompanyProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await fetch('/api/companies');
        if (!response.ok) throw new Error('Failed to fetch companies.');
        const data = await response.json();
        setCompanies(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-slate-50">
        <Loader2 className="w-10 h-10 animate-spin text-sky-500" />
        <p className="mt-4 text-slate-600">Loading companies from Hargeisa and beyond...</p>
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
            Our Network of Companies
          </h1>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            Discover the innovative companies driving growth and creating opportunities.
          </p>
        </header>
        
        <main>
          <AnimatePresence>
            {companies.length > 0 ? (
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                initial="hidden"
                animate="visible"
                variants={{
                  visible: { transition: { staggerChildren: 0.05 } }
                }}
              >
                {companies.map(company => (
                  <CompanyCard key={company.id} company={company} />
                ))}
              </motion.div>
            ) : (
              <div className="text-center bg-white p-12 rounded-lg border border-dashed">
                <Building className="mx-auto h-12 w-12 text-slate-300" />
                <h3 className="mt-4 text-lg font-medium text-slate-800">No Companies Found</h3>
                <p className="mt-1 text-sm text-slate-500">
                  No companies have registered yet. Check back soon!
                </p>
              </div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}