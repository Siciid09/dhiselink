// File Path: app/opportunities/page.tsx

"use client";

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Building, Search, Briefcase, Star, ChevronDown } from 'lucide-react';

export default function OpportunitiesPage() {
    const [jobs, setJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // State for filters
    const [searchTerm, setSearchTerm] = useState('');
    const [jobType, setJobType] = useState('all');

    useEffect(() => {
        async function fetchJobs() {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch('/api/opportunities');
                if (!response.ok) throw new Error('Failed to fetch jobs.');
                const data = await response.json();
                if (Array.isArray(data)) {
                    setJobs(data);
                } else {
                    throw new Error('Invalid data format received.');
                }
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        }
        fetchJobs();
    }, []);

    const filteredJobs = useMemo(() => {
        return jobs.filter(job => {
            const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || job.organization_name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesType = jobType === 'all' || job.type === jobType;
            return matchesSearch && matchesType;
        });
    }, [jobs, searchTerm, jobType]);

    const JobCard = ({ job }: { job: any }) => (
        <a href={`/opportunities/${job.id}`} className="block group">
            <motion.div 
                whileHover={{ y: -5, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                className="bg-white rounded-lg border p-6 h-full flex flex-col transition-shadow duration-300 relative overflow-hidden"
            >
                {job.featured && <Star size={16} className="absolute top-4 right-4 text-yellow-400 fill-current" />}
                <div className="flex items-start gap-4">
                    <img src={job.organization_logo_url || `https://placehold.co/64x64/e2e8f0/4a5568?text=${job.organization_name.charAt(0)}`} alt={`${job.organization_name} logo`} className="h-12 w-12 object-contain rounded-md border p-1 flex-shrink-0 bg-white" />
                    <div>
                        <p className="text-sm font-semibold text-blue-600">{job.organization_name}</p>
                        <h3 className="font-bold text-lg text-gray-900">{job.title}</h3>
                    </div>
                </div>
                <p className="text-sm text-gray-600 my-3 flex-grow">{job.short_description}</p>
                <div className="flex flex-wrap gap-2 my-3">
                    {job.tags?.map((tag: string) => <span key={tag} className="bg-gray-100 text-gray-700 text-xs font-medium px-2 py-1 rounded-full">{tag}</span>)}
                </div>
                <div className="text-sm text-gray-500 mt-auto pt-3 border-t flex items-center justify-between">
                    <span className="flex items-center gap-1.5"><MapPin size={14} /> {job.location}</span>
                    <span className="flex items-center gap-1.5 capitalize"><Briefcase size={14} /> {job.type}</span>
                </div>
            </motion.div>
        </a>
    );

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="container mx-auto px-6 pt-32 pb-24">
                <header className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-gray-900">Find Your Next Opportunity</h1>
                    <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">Browse roles from leading organizations dedicated to building a brighter future for Somaliland.</p>
                </header>
                
                <div className="grid lg:grid-cols-4 gap-8">
                    {/* --- Filter Sidebar --- */}
                    <aside className="lg:col-span-1 bg-white p-6 rounded-lg border shadow-sm h-fit sticky top-28">
                        <h3 className="font-bold text-lg mb-4">Filter Opportunities</h3>
                        <div className="space-y-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input 
                                    type="text" 
                                    placeholder="Search by title or company..." 
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    className="w-full h-12 pl-10 pr-4 rounded-lg bg-gray-100 border-transparent focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">Job Type</label>
                                <select 
                                    value={jobType}
                                    onChange={e => setJobType(e.target.value)}
                                    className="w-full mt-1 h-12 px-3 rounded-lg bg-gray-100 border-transparent focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="all">All Types</option>
                                    <option value="full-time">Full-time</option>
                                    <option value="part-time">Part-time</option>
                                    <option value="contract">Contract</option>
                                    <option value="internship">Internship</option>
                                </select>
                            </div>
                        </div>
                    </aside>

                    {/* --- Job Listings --- */}
                    <main className="lg:col-span-3">
                        {loading && <p className="text-center">Loading opportunities...</p>}
                        {error && <p className="text-center text-red-500 p-4 bg-red-50 rounded-lg">{error}</p>}
                        {!loading && !error && (
                             filteredJobs.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {filteredJobs.map(job => <JobCard key={job.id} job={job} />)}
                                </div>
                            ) : (
                                <div className="text-center bg-white p-12 rounded-lg border">
                                    <h3 className="font-bold text-xl mb-2">No Matching Opportunities Found</h3>
                                    <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
                                </div>
                            )
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}
