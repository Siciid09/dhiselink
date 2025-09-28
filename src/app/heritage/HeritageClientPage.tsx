"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusCircle, Eye } from 'lucide-react';

interface HeritageSite {
    id: string;
    slug: string | null;
    title: string;
    category: string;
    location: string;
    summary: string;
    cover_image_url: string;
}

const HeritageCard = ({ site }: { site: HeritageSite }) => {
    const shortSummary = site.summary.split(' ').slice(0, 10).join(' ') + (site.summary.split(' ').length > 10 ? '...' : '');
    return (
        <div className="group bg-white rounded-2xl border border-slate-200/80 flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 hover:border-amber-500/50">
            <Link href={`/heritage/${site.slug || site.id}`} className="block">
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
                    <Link href={`/heritage/${site.slug || site.id}`} className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-800 hover:text-white transition-colors">
                        <Eye size={16} /> View Details
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default function HeritageClientPage({ initialSites, categories }: { initialSites: HeritageSite[], categories: string[] }) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const activeCategory = searchParams.get('category') || 'All';

    const filteredSites = useMemo(() => {
        if (activeCategory === 'All') return initialSites;
        return initialSites.filter(site => site.category === activeCategory);
    }, [activeCategory, initialSites]);
    
    const handleFilterChange = (category: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('category', category);
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <>
            <div className="mb-12 p-4 rounded-xl border bg-white shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 flex-wrap">
                    {categories.map(cat => (
                        <button key={cat} onClick={() => handleFilterChange(cat)} className={`px-4 py-2 text-sm font-semibold rounded-full transition-all ${activeCategory === cat ? 'bg-slate-800 text-white shadow' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`}>{cat}</button>
                    ))}
                </div>
                <Link href="/dashboard/create" className="w-full sm:w-auto flex-shrink-0 bg-amber-500 text-white font-semibold py-2.5 px-5 rounded-lg flex items-center justify-center gap-2 hover:bg-amber-600 transition-all"><PlusCircle size={20} /> Add A Site</Link>
            </div>

            <AnimatePresence mode="wait">
                <motion.div key={activeCategory} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {initialSites.length > 0 ? (
                        filteredSites.map(site => <HeritageCard key={site.id} site={site} />)
                    ) : (
                        <div className="col-span-full text-center p-12 bg-white rounded-lg border-2 border-dashed">
                            <h3 className="text-xl font-semibold text-slate-700">No Sites Found</h3>
                            <p className="text-slate-500 mt-2">There are currently no heritage sites to display.</p>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </>
    );
}