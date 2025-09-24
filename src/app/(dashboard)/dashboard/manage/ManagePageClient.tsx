"use client";

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Eye,
    Edit,
    PlusCircle,
    Briefcase,
    BookOpen,
    Handshake,
    Shield,
    AlertTriangle,
    X,
    CheckCircle
} from 'lucide-react';
import DeleteButton from './DeleteButton';

type TypeConfigEntry = {
    name: string;
    icon: React.ElementType | null;
    className: string;
};

const typeConfig: Record<string, TypeConfigEntry> = {
    job: { name: 'Job', icon: Briefcase, className: 'bg-sky-100 text-sky-800 border border-sky-200' },
    program: { name: 'Program', icon: BookOpen, className: 'bg-purple-100 text-purple-800 border border-purple-200' },
    service: { name: 'Service', icon: Handshake, className: 'bg-emerald-100 text-emerald-800 border border-emerald-200' },
    project: { name: 'Project', icon: Shield, className: 'bg-slate-100 text-slate-800 border border-slate-200' },
    tender: { name: 'Tender', icon: Shield, className: 'bg-amber-100 text-amber-800 border border-amber-200' },
    grant: { name: 'Grant', icon: Shield, className: 'bg-rose-100 text-rose-800 border border-rose-200' },
    default: { name: 'Item', icon: null, className: 'bg-gray-100 text-gray-800 border border-gray-200' }
};

type Opportunity = {
    id: string;
    title: string;
    status: string | null;
    created_at: string;
    type: string;
};

export default function ManagementClientUI({ initialItems }: { initialItems: Opportunity[] }) {
    const [activeFilter, setActiveFilter] = useState('all');
    const searchParams = useSearchParams();
    const [successMessage, setSuccessMessage] = useState(searchParams.get('message'));
    const [errorMessage, setErrorMessage] = useState(searchParams.get('error'));

    const filters = ['all', ...Array.from(new Set(initialItems.map(item => item.type)))];

    const filteredItems = useMemo(() => {
        if (activeFilter === 'all') return initialItems;
        return initialItems.filter(item => item.type === activeFilter);
    }, [activeFilter, initialItems]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setSuccessMessage(null);
            setErrorMessage(null);
        }, 5000);
        return () => clearTimeout(timer);
    }, [successMessage, errorMessage]);

    return (
        <div className="max-w-7xl mx-auto">
            <AnimatePresence>
                {successMessage && (
                    <motion.div initial={{ opacity: 0, y: -20, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }} exit={{ opacity: 0, y: -20, height: 0 }}
                        className="flex items-center justify-between gap-4 bg-emerald-600 text-white p-4 rounded-lg mb-6 shadow-lg">
                        <div className="flex items-center gap-3"><CheckCircle /><span className="font-semibold">{successMessage}</span></div>
                        <button onClick={() => setSuccessMessage(null)} className="p-1 rounded-full hover:bg-emerald-700 transition-colors"><X size={18} /></button>
                    </motion.div>
                )}
                {errorMessage && (
                     <motion.div initial={{ opacity: 0, y: -20, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }} exit={{ opacity: 0, y: -20, height: 0 }}
                        className="flex items-center justify-between gap-4 bg-red-600 text-white p-4 rounded-lg mb-6 shadow-lg">
                        <div className="flex items-center gap-3"><AlertTriangle /><span className="font-semibold">{errorMessage}</span></div>
                        <button onClick={() => setErrorMessage(null)} className="p-1 rounded-full hover:bg-red-700 transition-colors"><X size={18} /></button>
                    </motion.div>
                )}
            </AnimatePresence>
            
            <header className="flex flex-col sm:flex-row justify-between items-start mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Manage Content</h1>
                    <p className="text-slate-600 mt-1">View, filter, edit, or delete all of your postings.</p>
                </div>
                <Link href="/dashboard/create" className="mt-4 sm:mt-0 bg-sky-600 text-white font-semibold py-3 px-5 rounded-lg flex items-center gap-2 shadow-lg shadow-sky-500/30 hover:bg-sky-700 transition-all">
                    <PlusCircle size={20} /> Create New
                </Link>
            </header>

            <main className="bg-white rounded-2xl shadow-sm border border-slate-200/80">
                <div className="p-4 border-b flex items-center gap-2 flex-wrap bg-slate-50/50 rounded-t-2xl">
                    {filters.map(filter => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200 ${activeFilter === filter ? 'bg-sky-600 text-white shadow' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'}`}
                        >
                            {filter.charAt(0).toUpperCase() + filter.slice(1)}
                        </button>
                    ))}
                </div>

                {filteredItems.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="border-b bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                <tr>
                                    <th className="p-4">Title</th>
                                    <th className="p-4">Type</th>
                                    <th className="p-4">Date Created</th>
                                    <th className="p-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredItems.map(op => {
                                    const config = typeConfig[op.type] || typeConfig.default;
                                    const Icon = config.icon;
                                    return (
                                        <tr key={`${op.type}-${op.id}`} className="border-b border-slate-100 hover:bg-slate-50/50">
                                            <td className="p-4 font-bold text-slate-800">{op.title}</td>
                                            <td className="p-4">
                                                <span className={`inline-flex items-center gap-2 text-xs font-bold capitalize px-3 py-1 rounded-full ${config.className}`}>
                                                    {Icon && <Icon size={14} />}
                                                    {config.name}
                                                </span>
                                            </td>
                                            <td className="p-4 text-slate-500">{new Date(op.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                                            <td className="p-4 flex justify-end items-center gap-1">
                                                <Link href={`/opportunities/${op.id}`} title="View Public Page" className="p-2 text-slate-500 hover:bg-slate-200 rounded-md transition-colors"><Eye size={16} /></Link>
                                                <Link href={`/dashboard/create?type=${op.type}&id=${op.id}`} title="Edit" className="p-2 text-slate-500 hover:bg-slate-200 rounded-md transition-colors"><Edit size={16} /></Link>
                                                <DeleteButton item={{ id: op.id, type: op.type }} />
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                ) : (
                     <div className="text-center py-20 px-4">
                       <AlertTriangle className="mx-auto text-slate-400" size={40} />
                       <h3 className="mt-4 text-lg font-semibold text-slate-700">No Content Found</h3>
                       <p className="text-slate-500 text-sm mt-1">There is no content matching the filter "{activeFilter}".</p>
                     </div>
                )}
            </main>
        </div>
    );
}
