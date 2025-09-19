// File Path: app/universities/page.tsx

"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function UniversitiesPage() {
    const [universities, setUniversities] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUniversities = async () => {
            setLoading(true);
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

    return (
        <div className="bg-white pt-40 min-h-screen">
            <div className="container mx-auto px-6 pb-24">
                <h1 className="text-4xl font-bold text-center mb-4">Fostering Somaliland&apos;s Future Leaders</h1>
                <p className="text-lg text-gray-600 text-center max-w-2xl mx-auto mb-12">
                    Explore the academic institutions training the next generation of professionals to build the nation.
                </p>

                {loading ? <p className="text-center">Loading...</p> : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {universities.map(uni => (
                            <Link key={uni.id} href={`/universities/${uni.id}`} className="block">
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="bg-white border rounded-2xl shadow-lg overflow-hidden group h-full hover:shadow-xl hover:border-blue-500 transition-all"
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
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}