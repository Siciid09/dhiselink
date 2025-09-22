"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Building, MapPin } from 'lucide-react';

// Define the shape of a company profile for type safety
type CompanyProfile = {
  id: string;
  organization_name: string;
  bio: string | null;
  location: string | null;
  logo_url: string | null;
};

export default function CompaniesPage() {
    const [companies, setCompanies] = useState<CompanyProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCompanies = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch('/api/companies');
                if (!response.ok) throw new Error('Failed to fetch company data.');
                const data = await response.json();
                setCompanies(data);
            } catch (err) {
                console.error("Failed to fetch companies:", err);
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };
        fetchCompanies();
    }, []);

    const containerVariants = {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
    };

    const itemVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
    };

    return (
        <div className="bg-slate-50 min-h-screen pt-24 md:pt-32">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-24">
                <header className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-slate-900">
                        Our Network of Companies
                    </h1>
                    <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
                        Discover the innovative companies driving growth and creating opportunities.
                    </p>
                </header>
                
                <main>
                    {loading && <p className="text-center text-slate-500">Loading companies...</p>}
                    {error && <p className="text-center text-red-500">{error}</p>}
                    
                    {!loading && !error && (
                        companies.length > 0 ? (
                            <motion.div 
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                            >
                                {companies.map(company => (
                                    <motion.div key={company.id} variants={itemVariants}>
                                        <Link href={`/organizations/${company.id}`} className="block group">
                                            <div className="bg-white rounded-2xl border border-slate-200 h-full flex flex-col p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                                                <div className="flex items-center gap-4 mb-4">
                                                    <img
                                                        src={company.logo_url || `https://api.dicebear.com/8.x/initials/svg?seed=${company.organization_name}`}
                                                        alt={`${company.organization_name} logo`}
                                                        className="h-16 w-16 object-contain rounded-lg border p-1"
                                                    />
                                                    <div>
                                                        <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                                            {company.organization_name}
                                                        </h3>
                                                    </div>
                                                </div>
                                                <p className="text-sm text-slate-600 flex-grow line-clamp-3">
                                                    {company.bio || 'No summary available.'}
                                                </p>
                                                <div className="mt-4 pt-4 border-t border-slate-100 text-sm text-slate-500">
                                                  <span className="inline-flex items-center gap-1.5">
                                                    <MapPin size={14} /> {company.location || 'Not specified'}
                                                  </span>
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </motion.div>
                        ) : (
                            <p className="text-center text-slate-500">No companies have registered yet. Check back soon!</p>
                        )
                    )}
                </main>
            </div>
        </div>
    );
}