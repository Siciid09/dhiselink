"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Globe, Briefcase } from 'lucide-react';

// Define a type for the company data for better code consistency
interface Company {
  id: string;
  name: string;
  industry: string;
  summary: string;
  logo_url: string;
  website: string;
  location: string;
  // Add any other fields you have in your 'companies' table
}

export default function CompanyDetailPage({ params }: { params: { id: string } }) {
    const [company, setCompany] = useState<Company | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!params.id) return;

        const fetchCompanyDetails = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`/api/companies/${params.id}`);
                if (!response.ok) {
                    throw new Error('Company not found');
                }
                const data = await response.json();
                setCompany(data);
            } catch (err) {
                setError((err as Error).message);
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCompanyDetails();
    }, [params.id]);

    if (loading) {
        return <div className="pt-40 text-center">Loading company profile...</div>;
    }

    if (error) {
        return <div className="pt-40 text-center text-red-500">Error: {error}</div>;
    }

    if (!company) {
        return <div className="pt-40 text-center">Company profile could not be loaded.</div>;
    }

    return (
        <div className="bg-gray-50 min-h-screen pt-32 pb-12">
            <div className="container mx-auto px-6 max-w-4xl">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="bg-white p-8 rounded-lg shadow-lg border"
                >
                    {/* --- Header Section --- */}
                    <div className="flex flex-col sm:flex-row items-start gap-6 mb-8 pb-8 border-b">
                        <img 
                            src={company.logo_url} 
                            alt={`${company.name} logo`}
                            className="w-24 h-24 object-contain rounded-md border p-2 bg-white flex-shrink-0"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.onerror = null; // Prevent infinite loop
                                target.src = `https://placehold.co/96x96/e2e8f0/4a5568?text=${company.name.charAt(0)}`;
                            }}
                        />
                        <div className="flex-1">
                            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">{company.name}</h1>
                            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-500 mt-3">
                                <span className="flex items-center gap-1.5"><Briefcase size={14} /> {company.industry}</span>
                                {company.location && <span className="flex items-center gap-1.5"><MapPin size={14} /> {company.location}</span>}
                            </div>
                        </div>
                    </div>

                    {/* --- About Section --- */}
                    <div>
                        <h2 className="text-xl font-bold mb-3 text-gray-800">About {company.name}</h2>
                        <p className="text-gray-600 leading-relaxed whitespace-pre-line">{company.summary}</p>
                        
                        {company.website && (
                            <a 
                                href={company.website} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors mt-8"
                            >
                                <Globe size={18} /> Visit Website
                            </a>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
