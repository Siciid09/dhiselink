"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import OrganizationCard from '@/components/organization-card'; // Import the reusable card

export default function UniversitiesPage() {
    const [universities, setUniversities] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUniversities = async () => {
            try {
                const response = await fetch('/api/universities');
                const data = await response.json();
                setUniversities(data);
            } catch (error) {
                console.error("Failed to fetch universities:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUniversities();
    }, []);

    const containerVariants = {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
    };

    return (
        <div className="bg-slate-50 min-h-screen pt-24 md:pt-32">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-24">
                <header className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-slate-900">
                        Fostering Future Leaders
                    </h1>
                    <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
                        Explore the academic institutions training the next generation of professionals.
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
                            {universities.map(uni => (
                                <OrganizationCard key={uni.id} profile={uni} />
                            ))}
                        </motion.div>
                    )}
                </main>
            </div>
        </div>
    );
}