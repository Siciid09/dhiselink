"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function ProfessionalsPage() {
    const [professionals, setProfessionals] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const fetchProfessionals = async () => {
            try {
                const response = await fetch('/api/professionals');
                const data = await response.json();
                setProfessionals(data);
            } catch (error) {
                console.error("Failed to fetch professionals:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfessionals();
    }, []);

    return (
        <section className="py-24 bg-white pt-40">
            <div className="container mx-auto px-6">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-12">Find Professionals</h2>
                
                {loading ? (
                    <p>Loading professionals...</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {professionals.map((pro, index) => (
                            <motion.div 
                                key={pro.id} // This will now work correctly
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-white rounded-lg border border-gray-200/80 shadow-lg p-6 flex flex-col"
                            >
                                <h3 className="text-xl font-bold text-gray-900">{pro.name}</h3>
                                <p className="text-blue-600 font-medium text-sm">{pro.title}</p>
                                <p className="text-sm text-gray-600 my-4 flex-grow">{pro.summary}</p>
                                <div className="mt-auto pt-4 border-t border-gray-100">
                                    <Link href={`/professionals/${pro.id}`} className="flex items-center gap-1 font-bold text-blue-600 hover:gap-2 transition-all">
                                        View Profile <ArrowRight size={16} />
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

