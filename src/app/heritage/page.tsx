"use client";

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Landmark, PlusCircle, Eye } from 'lucide-react';

interface HeritageSite {
    id: string;
    title: string;
    category: string;
    location: string;
    summary: string;
    cover_image_url: string;
}

const HeritageCard = ({ site }: { site: HeritageSite }) => {
    // Truncate summary to 10 words
    const shortSummary = site.summary.split(' ').slice(0, 10).join(' ') + (site.summary.split(' ').length > 10 ? '...' : '');

    return (
        <div className="group bg-white rounded-2xl border border-slate-200 flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5">
            <Link href={`/heritage/${site.id}`} className="block">
                <div className="h-48 bg-slate-100 relative rounded-t-2xl overflow-hidden">
                    <img src={site.cover_image_url} alt={site.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <span className="absolute top-3 right-3 text-xs font-semibold px-3 py-1 rounded-full bg-white/90 text-slate-800">{site.category}</span>
                </div>
            </Link>
            <div className="p-5 flex flex-col flex-grow">
                <h2 className="text-xl font-bold text-slate-900">{site.title}</h2>
                <p className="text-slate-500 mt-1 text-sm">{site.location}</p>
                <p className="text-slate-600 mt-3 text-sm flex-grow">{shortSummary}</p>
                <div className="mt-4 pt-4 border-t border-slate-100">
                    <Link href={`/heritage/${site.id}`} className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-sky-600 hover:text-white transition-colors">
                        <Eye size={16} /> View Details
                    </Link>
                </div>
            </div>
        </div>
    );
};

function HeritageClientPage() {
    const [sites, setSites] = useState<HeritageSite[]>([]);
    const [loading, setLoading] = useState(true);
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const activeCategory = searchParams.get('category') || 'All';
    const categories = ['All', 'Archaeological', 'Historical Landmark', 'Natural Wonder', 'Cultural Practice', 'Monument'];

    useEffect(() => {
        const fetchSites = async () => {
            setLoading(true);
            const params = new URLSearchParams({ category: activeCategory });
            try {
                const response = await fetch(`/api/heritage?${params.toString()}`);
                if (!response.ok) throw new Error("Failed to fetch heritage sites.");
                const data = await response.json();
                setSites(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchSites();
    }, [activeCategory]);
    
    const handleFilterChange = (category: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('category', category);
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="bg-slate-50 min-h-screen">
            <div className="container mx-auto px-4 py-24">
                <header className="text-center mb-12">
                    <div className="inline-block bg-amber-100 text-amber-600 p-4 rounded-xl mb-4"><Landmark size={40} /></div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900">Discover Our Heritage</h1>
                    <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">Explore the rich history and cultural landmarks that define our story.</p>
                </header>

                <div className="mb-12 p-4 rounded-xl border bg-white/80 backdrop-blur-lg shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 sticky top-4 z-50">
                     <div className="flex items-center gap-2 flex-wrap">
                        {categories.map(cat => (
                            <button key={cat} onClick={() => handleFilterChange(cat)} className={`px-4 py-2 text-sm font-semibold rounded-full transition-all ${activeCategory === cat ? 'bg-sky-600 text-white shadow' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`}>{cat}</button>
                        ))}
                    </div>
                    <Link href="/heritage/submit" className="w-full sm:w-auto flex-shrink-0 bg-sky-600 text-white font-semibold py-2.5 px-5 rounded-lg flex items-center justify-center gap-2 hover:bg-sky-700 transition-all"><PlusCircle size={20} /> Add Heritage Site</Link>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div key={activeCategory} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {loading ? (
                            Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-96 bg-slate-200 rounded-2xl animate-pulse" />)
                        ) : sites.length > 0 ? (
                            sites.map(site => <HeritageCard key={site.id} site={site} />)
                        ) : (
                            <div className="col-span-full text-center p-12 bg-white rounded-lg border-2 border-dashed">
                                <h3 className="text-xl font-semibold text-slate-700">No Sites Found</h3>
                                <p className="text-slate-500 mt-2">There are no heritage sites matching the category "{activeCategory}".</p>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}

export default function HeritagePage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading Heritage...</div>}>
            <HeritageClientPage />
        </Suspense>
    );
}