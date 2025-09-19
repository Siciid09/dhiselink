"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Briefcase, Landmark } from 'lucide-react';

// Define a type for the institution data
interface Institution {
    id: string;
    name: string;
    type: 'Government' | 'NGO' | 'Government Partner';
    location: string;
    summary: string;
    logo_url: string;
    active_projects: number;
}

export default function GovNgoDetailPage({ params }: { params: { id: string } }) {
    const [institution, setInstitution] = useState<Institution | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!params.id) return;

        const fetchInstitutionDetails = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`/api/government-ngos/${params.id}`);
                if (!response.ok) {
                    throw new Error('Institution not found');
                }
                const data = await response.json();
                setInstitution(data);
            } catch (err) {
                setError((err as Error).message);
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchInstitutionDetails();
    }, [params.id]);

    if (loading) {
        return <div className="pt-40 text-center">Loading institution profile...</div>;
    }

    if (error) {
        return <div className="pt-40 text-center text-red-500">Error: {error}</div>;
    }
    
    if (!institution) {
        return <div className="pt-40 text-center">Institution profile could not be loaded.</div>;
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
                            src={institution.logo_url} 
                            alt={`${institution.name} logo`}
                            className="w-24 h-24 object-contain rounded-md border p-2 bg-white flex-shrink-0"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.onerror = null; // Prevent infinite loop
                                target.src = `https://placehold.co/96x96/e2e8f0/4a5568?text=${institution.name.charAt(0)}`;
                            }}
                        />
                        <div className="flex-1">
                            <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full mb-3 inline-block">{institution.type}</span>
                            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">{institution.name}</h1>
                            <div className="flex items-center gap-4 text-sm text-gray-500 mt-3">
                                <span className="flex items-center gap-1.5"><MapPin size={14} /> {institution.location}</span>
                            </div>
                        </div>
                    </div>

                    {/* --- About Section --- */}
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="md:col-span-2">
                             <h2 className="text-xl font-bold mb-3 text-gray-800">Mandate & Mission</h2>
                             <p className="text-gray-600 leading-relaxed whitespace-pre-line">{institution.summary}</p>
                        </div>
                        <div className="md:col-span-1">
                            <div className="bg-gray-100 p-6 rounded-lg border">
                                <h3 className="font-bold text-lg mb-2">Active Projects</h3>
                                <p className="text-5xl font-bold text-blue-600">{institution.active_projects}</p>
                                <p className="text-sm text-gray-500">Nation-building initiatives</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
