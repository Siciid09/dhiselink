"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import OrganizationCard from '@/components/organization-card';

export default function GovernmentAndOthersPage() { // Renamed component for clarity
    const [orgs, setOrgs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrgs = async () => {
            try {
                const response = await fetch('/api/government-ngos');
                const data = await response.json();
                setOrgs(data);
            } catch (error) {
                console.error("Failed to fetch organizations:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrgs();
    }, []);

    const containerVariants = {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
    };

    return (
        <div className="bg-slate-50 min-h-screen pt-24 md:pt-32">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-24">
                <header className="text-center mb-12">
                    {/* Updated Title */}
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-slate-900">
                        Government & Others
                    </h1>
                    {/* Updated Description */}
                    <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
                        Discover public sector bodies, non-governmental organizations, and other entities leading key initiatives.
                    </p>
                </header>
                <main>
                    {loading ? <p className="text-center text-slate-500">Loading...</p> : (
                        <motion.div 
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        >
                            {orgs.map(org => (
                                <OrganizationCard key={org.id} profile={org} />
                            ))}
                        </motion.div>
                    )}
                </main>
            </div>
        </div>
    );
}