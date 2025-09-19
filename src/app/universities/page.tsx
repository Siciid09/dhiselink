// File Path: app/universities/page.tsx

"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function UniversitiesPage() {
    const [universities, setUniversities] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUniversities = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch('/api/universities');
                if (!response.ok) {
                    throw new Error('Failed to fetch data from the server.');
                }
                const data = await response.json();
                
                if (Array.isArray(data)) {
                    setUniversities(data);
                } else {
                    throw new Error('Received invalid data format.');
                }

            } catch (err) {
                console.error("Failed to fetch universities:", err);
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };
        fetchUniversities();
    }, []);

    return (
        <div className="bg-white pt-40 min-h-screen">
            <div className="container mx-auto px-6 pb-24">
                <h1 className="text-4xl font-bold text-center mb-4">Fostering Somaliland's Future Leaders</h1>
                <p className="text-lg text-gray-600 text-center max-w-2xl mx-auto mb-12">
                    Explore the academic institutions training the next generation of professionals to build the nation.
                </p>

                {loading && <p className="text-center">Loading universities...</p>}

                {error && <p className="text-center text-red-500 bg-red-50 p-6 rounded-lg border border-red-200">Could not load universities: {error}</p>}
                
                {!loading && !error && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {universities.map(uni => (
                            <a key={uni.id} href={`/universities/${uni.id}`} className="block group">
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="bg-white border rounded-2xl shadow-lg overflow-hidden h-full hover:shadow-xl hover:border-blue-500 transition-all"
                                >
                                    <div className="h-48 overflow-hidden relative">
                                        <img src={uni.image_url} alt={`${uni.name} campus`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>
                                    </div>
                                    <div className="p-6">
                                        <img src={uni.logo_url} alt={`${uni.name} logo`} className="h-16 w-16 mb-4 rounded-md border-4 border-white p-1 bg-white shadow-md -mt-16 z-10 relative"/>
                                        <h3 className="text-xl font-bold text-gray-900">{uni.name}</h3>
                                        <p className="text-gray-500 text-sm mb-4">{uni.location}</p>
                                        <p className="text-gray-600 text-sm flex-grow">{uni.summary}</p>
                                    </div>
                                </motion.div>
                            </a>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}