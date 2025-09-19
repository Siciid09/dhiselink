// File Path: app/companies/page.tsx

"use client";

import { useState, useEffect, FC } from 'react';
import { motion } from 'framer-motion';
import { Building, Briefcase, MapPin, BookOpen, Heart, Flag } from 'lucide-react';

// --- Main Companies Page Component ---
export default function CompaniesPage() {
    // --- State Management ---
    const [organizations, setOrganizations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // --- Data Fetching ---
    useEffect(() => {
        const fetchOrganizations = async () => {
            setLoading(true);
            setError(null);
            try {
                // This API route should fetch all profiles that are of type 'organization'
                const response = await fetch('/api/organizations'); 
                if (!response.ok) {
                    throw new Error('Failed to fetch organizations.');
                }
                const data = await response.json();
                if (Array.isArray(data)) {
                    setOrganizations(data);
                } else {
                     throw new Error('Invalid data format received from server.');
                }
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrganizations();
    }, []);

    // --- UI Render ---
    return (
        <div className="bg-white min-h-screen pt-32 pb-24">
            <div className="container mx-auto px-6">
                {/* --- Page Header --- */}
                <header className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-gray-900">Our Network of Organizations</h1>
                    <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">Discover the companies, NGOs, universities, and government agencies driving development in Somaliland.</p>
                </header>

                {/* --- Loading & Error States --- */}
                {loading && <p className="text-center">Loading organizations...</p>}
                {error && <p className="text-center text-red-600 bg-red-50 p-4 rounded-lg">Error: {error}</p>}

                {/* --- Organizations Grid --- */}
                {!loading && !error && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {organizations.length > 0 ? (
                            organizations.map((org, index) => (
                                <OrganizationCard key={org.id} org={org} index={index} />
                            ))
                        ) : (
                            <p className="col-span-full text-center text-gray-500">No organizations found.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

// --- Individual Organization Card Component ---
const OrganizationCard: FC<{ org: any, index: number }> = ({ org, index }) => {
    // Determine the icon based on account_type
    const getIcon = (type: string) => {
        // This mapping should align with your database values
        switch(type) {
            case 'company': return <Briefcase className="text-blue-500" />;
            case 'university': return <BookOpen className="text-purple-500" />;
            case 'ngo': return <Heart className="text-red-500" />;
            case 'government': return <Flag className="text-gray-700" />;
            default: return <Building className="text-gray-500" />;
        }
    }

    // A simple function to get the correct type name for display
    const getOrgTypeName = (type: string) => {
        if (!type) return 'Organization';
        return type.replace('_', ' ');
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
        >
            <a href={`/organizations/${org.id}`} className="block bg-white rounded-lg border h-full shadow-md hover:shadow-xl hover:border-blue-500 transition-all duration-300 group">
                <div className="p-6 flex flex-col h-full">
                    <div className="flex items-start gap-4 mb-4">
                        <img 
                            src={org.logo_url || `https://placehold.co/80x80/e2e8f0/4a5568?text=${(org.name || 'O').charAt(0)}`} 
                            alt={`${org.name} logo`}
                            className="h-16 w-16 object-contain rounded-md border p-1 bg-white flex-shrink-0"
                        />
                        <div>
                            <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">{org.name}</h3>
                            <p className="text-sm text-gray-500 capitalize flex items-center gap-1.5">
                                {getIcon(org.account_type)}
                                {getOrgTypeName(org.account_type)}
                            </p>
                        </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-4 flex-grow">{org.bio || 'No summary available.'}</p>
                    <div className="mt-auto border-t pt-4 text-xs text-gray-500 space-y-2">
                        {org.industry && <p className="flex items-center gap-2"><Briefcase size={14}/> {org.industry}</p>}
                        {org.location && <p className="flex items-center gap-2"><MapPin size={14}/> {org.location}</p>}
                    </div>
                </div>
            </a>
        </motion.div>
    );
};