"use client";

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, Search, Clock, Building, Tag, X } from 'lucide-react';

// Helper function to format dates nicely (e.g., "Posted 3 days ago")
function timeAgo(dateString: string | null) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return "Just now";
}

// The modern Job Card component with safety checks
const JobCard = ({ job }: { job: any }) => (
    <motion.div 
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-white rounded-xl border border-slate-200/80 p-6 flex flex-col group transition-all duration-300 hover:shadow-lg hover:border-amber-500/50"
    >
        <div className="flex items-start gap-4">
            <img src={job.organization_logo_url || `https://api.dicebear.com/8.x/initials/svg?seed=${job.organization_name || '?'}`} alt="logo" className="w-12 h-12 rounded-lg object-contain border p-1" />
            <div>
                <p className="text-sm font-medium text-slate-500">{job.organization_name || 'An Organization'}</p>
                <h3 className="text-lg font-bold text-slate-800 group-hover:text-amber-600 transition-colors">{job.title || 'Untitled Job'}</h3>
            </div>
        </div>
        <div className="my-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-600">
            <span className="flex items-center gap-1.5"><MapPin size={14} />{job.location || 'Remote'}</span>
            <span className="flex items-center gap-1.5"><Briefcase size={14} />{job.type || 'N/A'}</span>
            {job.industry && <span className="flex items-center gap-1.5"><Tag size={14} />{job.industry}</span>}
        </div>
        <p className="text-sm text-slate-500 flex-grow line-clamp-2">{job.description || 'No description provided.'}</p>
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
            <p className="text-xs text-slate-400 flex items-center gap-1.5"><Clock size={12} /> {timeAgo(job.created_at)}</p>
            <a href={`/opportunities/jobs/${job.slug || job.id}`} className="px-4 py-2 text-sm font-semibold bg-slate-800 text-white rounded-lg hover:bg-amber-500 transition-colors">
                Apply Now
            </a>
        </div>
    </motion.div>
);

// The main UI component
export default function JobListings({ initialJobs }: { initialJobs: any[] }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeType, setActiveType] = useState('All');
    
    // Safety check to ensure initialJobs is always an array
    const jobs = Array.isArray(initialJobs) ? initialJobs : [];

    const jobTypes = ['All', 'full-time', 'part-time', 'contract', 'internship'];

    const filteredJobs = useMemo(() => {
        return jobs.filter(job => {
            const matchesType = activeType === 'All' || job.type === activeType;
            // Safety checks for search: `?? ''` provides a fallback empty string if data is null
            const matchesSearch = (job.title ?? '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                                  (job.organization_name ?? '').toLowerCase().includes(searchQuery.toLowerCase());
            return matchesType && matchesSearch;
        });
    }, [jobs, searchQuery, activeType]);

    return (
        <div>
            <header className="text-center mb-12">
                <h1 className="text-5xl font-extrabold tracking-tighter text-slate-900">Find Your Next Opportunity</h1>
                <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">Browse roles from leading organizations in the region.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* --- Filters & Search Sidebar --- */}
                <aside className="md:col-span-1">
                    <div className="sticky top-24 p-6 bg-white rounded-2xl shadow-sm border border-slate-200/80">
                        <div className="relative mb-6">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search jobs..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full h-12 pl-10 pr-4 rounded-lg bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-amber-500 outline-none"
                            />
                        </div>
                        <div>
                            <h4 className="font-semibold text-slate-800 mb-3">Job Type</h4>
                            <div className="flex flex-col items-start gap-1">
                                {jobTypes.map(type => (
                                    <button
                                        key={type}
                                        onClick={() => setActiveType(type)}
                                        className={`w-full text-left px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeType === type ? 'bg-amber-100 text-amber-800' : 'text-slate-600 hover:bg-slate-100'}`}
                                    >
                                        {type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </aside>

                {/* --- Job Listings --- */}
                <main className="md:col-span-3">
                    {filteredJobs.length > 0 ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {filteredJobs.map(job => <JobCard key={job.id} job={job} />)}
                        </div>
                    ) : (
                        <div className="text-center bg-white p-12 rounded-lg border-2 border-dashed">
                            <Briefcase className="mx-auto h-12 w-12 text-slate-300" />
                            <h3 className="mt-4 text-lg font-medium text-slate-800">No Jobs Found</h3>
                            <p className="mt-1 text-sm text-slate-500">No opportunities match your current search and filters.</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}