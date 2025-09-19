// File Path: app/government-ngos/page.tsx

"use client";

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Landmark, Globe2, Users } from 'lucide-react';
import Link from 'next/link';

export default function GovernmentsNgosPage() {
    const [institutions, setInstitutions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeType, setActiveType] = useState('All');

    useEffect(() => {
        const fetchInstitutions = async () => {
            setLoading(true);
            try {
                const response = await fetch('/api/government-ngos');
                const data = await response.json();
                setInstitutions(data);
            } catch (error) {
                console.error("Failed to fetch institutions:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchInstitutions();
    }, []);

    const filteredInstitutions = useMemo(() => {
        if (activeType === 'All') return institutions;
        return institutions.filter(inst => {
            if (activeType === 'Government') return inst.type === 'Government';
            if (activeType === 'NGOs & Others') return inst.type === 'NGO' || inst.type === 'Government Partner';
            return false;
        });
    }, [activeType, institutions]);
    
    const typesData = [
        { name: 'All Bodies', icon: <Users size={16}/>, type: 'All' },
        { name: 'Government', icon: <Landmark size={16}/>, type: 'Government' },
        { name: 'NGOs & Others', icon: <Globe2 size={16}/>, type: 'NGOs & Others' },
    ];

    return (
        <div className="bg-white pt-40 min-h-screen">
            <div className="container mx-auto px-6 pb-24">
                <h1 className="text-4xl font-bold text-center mb-4">Public & Non-Profit Sector</h1>
                <p className="text-lg text-gray-600 text-center max-w-2xl mx-auto mb-12">
                    Discover the government bodies and non-governmental organizations leading the nation&apos;s development initiatives.
                </p>

                {/* Filter Buttons */}
                <div className="flex flex-wrap justify-center gap-4 mb-12">
                    {typesData.map(type => (
                        <button key={type.name} onClick={() => setActiveType(type.type)} className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm transition-all duration-300 ${activeType === type.type ? 'bg-blue-600 text-white shadow' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border'}`}>
                            {type.icon} {type.name}
                        </button>
                    ))}
                </div>

                {/* Grid */}
                {loading ? <p className="text-center">Loading...</p> : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredInstitutions.map(inst => (
                            <Link key={inst.id} href={`/government-ngos/${inst.id}`} className="block">
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="bg-gray-50 border rounded-lg p-6 shadow-md hover:shadow-xl transition-shadow h-full"
                                >
                                    <img src={inst.logo_url} alt={`${inst.name} logo`} className="h-12 mb-4" onError={(e) => { const target = e.target as HTMLImageElement; target.onerror = null; target.src = `https://placehold.co/100x50/e2e8f0/4a5568?text=${inst.name.charAt(0)}`; }}/>
                                    <h3 className="font-bold text-lg text-gray-900">{inst.name}</h3>
                                    <p className="text-sm text-blue-600 font-semibold">{inst.type}</p>
                                    <p className="text-sm text-gray-600 mt-2">{inst.summary}</p>
                                </motion.div>
                            </Link>
                        ))}
                        {filteredInstitutions.length === 0 && <p className="col-span-full text-center">No institutions found for this category.</p>}
                    </div>
                )}
            </div>
        </div>
    );
}