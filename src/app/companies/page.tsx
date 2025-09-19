"use client";

import { useState, useEffect } from 'react';
// import Link from 'next/link'; // This import is removed to fix the error
import { motion } from 'framer-motion';

// This version replaces the Next.js Link component with a standard <a> tag to resolve the error.
export default function CompaniesPage() {
    const [companies, setCompanies] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const response = await fetch('/api/companies');
                const data = await response.json();
                setCompanies(data);
            } catch (error) {
                console.error("Failed to fetch companies:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCompanies();
    }, []);

    return (
        <section className="py-24 bg-white pt-40">
            <div className="container mx-auto px-6">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-12">All Registered Institutions</h2>
                
                {loading ? (
                    <p>Loading companies...</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {companies.map((company, index) => (
                            // 1. The <Link> component is replaced with a standard <a> tag
                            <a key={company.id} href={`/companies/${company.id}`} className="block">
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="bg-white rounded-lg border border-gray-200 shadow-lg overflow-hidden flex flex-col h-full hover:shadow-xl hover:border-blue-500 transition-all duration-300"
                                >
                                    <div className="p-6">
                                        <div className="flex items-center gap-4 mb-4">
                                            <img src={company.logo_url || `https://placehold.co/64x64/e2e8f0/4a5568?text=${company.name.charAt(0)}`} alt={`${company.name} logo`} className="h-12 w-12 object-contain rounded-md border p-1" />
                                            <div>
                                                <h3 className="font-bold text-gray-900">{company.name}</h3>
                                                <p className="text-sm text-gray-500">{company.industry}</p>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-4 flex-grow">{company.summary}</p>
                                    </div>
                                </motion.div>
                            </a>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

