// File Path: app/professionals/page.tsx

"use client";

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Briefcase } from 'lucide-react';

export default function ProfessionalsPage() {
    const [professionals, setProfessionals] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchProfessionals = async () => {
            setLoading(true);
            try {
                const res = await fetch('/api/professionals');
                if (!res.ok) throw new Error('Failed to fetch professionals');
                const data = await res.json();
                setProfessionals(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProfessionals();
    }, []);

    const filteredProfessionals = useMemo(() => {
        return professionals.filter(p => 
            p.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.title?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [professionals, searchTerm]);

    return (
        <div className="bg-white min-h-screen pt-32 pb-24">
            <div className="container mx-auto px-6">
                <header className="text-center mb-12 max-w-3xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-gray-900">Discover Professional Talent</h1>
                    <p className="mt-4 text-lg text-gray-600">Explore the network of skilled professionals driving development in Somaliland. Find the experts you need for your next project.</p>
                    <div className="mt-8 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name or title (e.g., 'Civil Engineer')"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full max-w-lg mx-auto h-14 pl-12 pr-4 rounded-full bg-gray-100 border-2 border-transparent focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                    </div>
                </header>

                {loading && <div className="text-center">Loading professionals...</div>}
                {error && <div className="text-center text-red-600 p-4 bg-red-50 rounded-lg">{error}</div>}

                {!loading && !error && (
                    <motion.div 
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                        initial="hidden"
                        animate="visible"
                        variants={{
                            visible: { transition: { staggerChildren: 0.05 } }
                        }}
                    >
                        {filteredProfessionals.length > 0 ? (
                            filteredProfessionals.map((pro) => (
                                <ProfessionalCard key={pro.id} pro={pro} />
                            ))
                        ) : (
                            <p className="col-span-full text-center text-gray-500">No professionals found matching your search.</p>
                        )}
                    </motion.div>
                )}
            </div>
        </div>
    );
}

const ProfessionalCard = ({ pro }: { pro: any }) => (
    <motion.div
        variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
    >
        <a href={`/professionals/${pro.id}`} className="block bg-white rounded-lg border h-full shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            <div className="p-6 flex flex-col items-center text-center">
                <img
                    src={pro.avatar_url || `https://ui-avatars.com/api/?name=${pro.full_name?.replace(' ', '+')}&background=EBF4FF&color=3B82F6&bold=true`}
                    alt={pro.full_name}
                    className="w-24 h-24 rounded-full border-4 border-white shadow-lg mb-4"
                />
                <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600">{pro.full_name}</h3>
                <p className="text-sm text-blue-600 font-medium">{pro.title}</p>
                {pro.location && <p className="text-xs text-gray-500 mt-2 flex items-center gap-1"><MapPin size={12}/> {pro.location}</p>}
            </div>
        </a>
    </motion.div>
);
