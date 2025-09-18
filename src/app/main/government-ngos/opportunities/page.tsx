"use client";

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Star, Search, MapPin, Building, Clock, Filter
} from 'lucide-react';

// --- 1. MOCK DATA FOR JOBS PAGE ---

const opportunitiesData = [
    { 
        title: "Senior Project Manager (Infrastructure)", 
        company: "Ministry of Public Works", 
        location: "Mogadishu", 
        type: "Full-time", 
        industry: "Government", 
        featured: true, 
        logo: "https://i.imgur.com/sH8l9l8.png",
        posted: "5d ago"
    },
    { 
        title: "Lead Frontend Developer", 
        company: "Hormuud Telecom", 
        location: "Mogadishu", 
        type: "Full-time", 
        industry: "Technology", 
        featured: true, 
        logo: "https://logo.clearbit.com/hormuud.com",
        posted: "2d ago"
    },
    { 
        title: "WASH Specialist (Water & Sanitation)", 
        company: "Mercy Corps", 
        location: "Baidoa", 
        type: "Contract", 
        industry: "NGO & Development", 
        featured: false, 
        logo: "https://logo.clearbit.com/mercycorps.org",
        posted: "1w ago"
    },
    { 
        title: "Civil Engineer", 
        company: "BECO Group", 
        location: "Hargeisa", 
        type: "Full-time", 
        industry: "Construction", 
        featured: false, 
        logo: "https://logo.clearbit.com/beco.so",
        posted: "3d ago"
    },
    { 
        title: "Graduate Internship (Finance)", 
        company: "Premier Bank", 
        location: "Mogadishu", 
        type: "Internship", 
        industry: "Finance", 
        featured: false, 
        logo: "https://logo.clearbit.com/premierbank.so",
        posted: "1d ago"
    },
    { 
        title: "Urban Planning Consultant", 
        company: "City of Hargeisa", 
        location: "Hargeisa", 
        type: "Part-time", 
        industry: "Government", 
        featured: false, 
        logo: "https://i.imgur.com/9dLLg5g.png",
        posted: "6d ago"
    },
     { 
        title: "Solar Energy Technician", 
        company: "Saafi Solar", 
        location: "Garowe", 
        type: "Full-time", 
        industry: "Renewable Energy", 
        featured: false, 
        logo: "https://logo.clearbit.com/saafisolar.com",
        posted: "2w ago"
    },
];

// --- 2. REUSABLE UI & ANIMATION COMPONENTS ---

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
};

// --- 3. PAGE SECTIONS for JOBS PAGE ---

const JobsHero = ({ onSearch, onLocationChange, searchTerm, locationTerm }) => (
    <section className="bg-gray-50 pt-40 pb-20 md:pt-48 md:pb-24">
        <div className="container mx-auto px-6 text-center">
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-4xl md:text-6xl font-extrabold tracking-tighter text-gray-900 mb-4">Find Your Next Job</motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="max-w-2xl mx-auto text-lg text-gray-600 mb-8">Search for jobs, projects, and tenders from top institutions across Somalia.</motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="max-w-2xl mx-auto bg-white p-4 rounded-xl shadow-lg border border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative"><Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input type="text" placeholder="Job title or keyword..." value={searchTerm} onChange={(e) => onSearch(e.target.value)} className="w-full h-12 pl-12 pr-4 rounded-lg bg-gray-100 border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"/></div>
                <div className="relative"><MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input type="text" placeholder="City or region..." value={locationTerm} onChange={(e) => onLocationChange(e.target.value)} className="w-full h-12 pl-12 pr-4 rounded-lg bg-gray-100 border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"/></div>
            </motion.div>
        </div>
    </section>
);

const FilterBar = ({ activeFilters, onFilterChange }) => {
    const jobTypes = ["Full-time", "Part-time", "Contract", "Internship"];
    const industries = ["Technology", "Construction", "NGO & Development", "Government", "Finance", "Renewable Energy"];

    return (
        <div className="bg-white py-6 border-y border-gray-200 sticky top-[72px] z-20">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex items-center gap-2">
                        <Filter size={16} className="text-gray-500"/>
                        <span className="font-semibold text-sm">Filter by:</span>
                    </div>
                     <div className="flex flex-wrap gap-2">
                         <select onChange={(e) => onFilterChange('type', e.target.value)} value={activeFilters.type || ''} className="bg-gray-100 border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                             <option value="">Job Type (All)</option>
                             {jobTypes.map(type => <option key={type} value={type}>{type}</option>)}
                        </select>
                        <select onChange={(e) => onFilterChange('industry', e.target.value)} value={activeFilters.industry || ''} className="bg-gray-100 border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                             <option value="">Industry (All)</option>
                            {industries.map(industry => <option key={industry} value={industry}>{industry}</option>)}
                        </select>
                     </div>
                </div>
            </div>
        </div>
    );
};

const JobCard = ({ job, isFeatured = false }) => (
    <motion.div variants={itemVariants} whileHover={{y: -5, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'}} className={`bg-white rounded-xl border transition-all duration-300 ${isFeatured ? 'border-yellow-400 shadow-lg' : 'border-gray-200 shadow-md'}`}>
        <div className="p-6 flex flex-col md:flex-row items-start md:items-center gap-6">
            <img src={job.logo} alt={`${job.company} logo`} className="h-16 w-16 object-contain rounded-md border p-2 bg-white flex-shrink-0" onError={(e) => e.currentTarget.src = `https://placehold.co/64x64/e2e8f0/4a5568?text=${job.company.charAt(0)}`} />
            <div className="flex-grow">
                <div className="flex items-center gap-4 mb-1">
                    <h3 className="font-bold text-lg text-gray-900">{job.title}</h3>
                    {isFeatured && <div className="text-xs font-bold bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full flex items-center gap-1"><Star size={12}/> Featured</div>}
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
                    <div className="flex items-center gap-2"><Building size={14}/> {job.company}</div>
                    <div className="flex items-center gap-2"><MapPin size={14}/> {job.location}</div>
                    <div className="flex items-center gap-2"><Clock size={14}/> {job.type}</div>
                </div>
            </div>
            <div className="w-full md:w-auto flex flex-col md:text-right ml-auto flex-shrink-0">
                <a href="#" className="w-full md:w-auto bg-blue-600 text-white font-semibold py-2 px-5 rounded-lg hover:bg-blue-700 transition-colors duration-300 text-center">Apply Now</a>
                <p className="text-xs text-gray-400 mt-2">Posted {job.posted}</p>
            </div>
        </div>
    </motion.div>
);

const JobListing = ({ jobs }) => {
    const featuredJobs = jobs.filter(j => j.featured);
    const standardJobs = jobs.filter(j => !j.featured);

    return (
        <motion.section initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }} className="py-24 bg-gray-50">
            <div className="container mx-auto px-6">
                {/* Featured Jobs */}
                {featuredJobs.length > 0 && (
                    <div className="mb-16">
                        <div className="flex items-center mb-8"><Star className="w-6 h-6 text-yellow-500 mr-3"/><h2 className="text-2xl font-bold tracking-tight text-gray-900">Featured Jobs</h2></div>
                        <div className="grid grid-cols-1 gap-6">
                            {featuredJobs.map(job => <JobCard key={job.title} job={job} isFeatured={true} />)}
                        </div>
                    </div>
                )}

                {/* Standard Jobs */}
                <div>
                   <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-8">All Jobs</h2>
                   {standardJobs.length > 0 ? (
                        <div className="grid grid-cols-1 gap-6">
                            {standardJobs.map(job => <JobCard key={job.title} job={job} />)}
                        </div>
                   ) : (
                        <div className="text-center py-20 bg-white rounded-lg border">
                            <p className="text-gray-500 text-lg">No jobs found matching your criteria.</p>
                        </div>
                   )}
                </div>
            </div>
        </motion.section>
    );
};

const SubscribeCTA = () => (
    <section className="bg-white py-24">
        <div className="container mx-auto px-6 text-center max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 mb-4">Never Miss a Job</h2>
            <p className="text-lg text-gray-600 mb-8">Create a profile and subscribe to job alerts to get the latest opportunities relevant to your skills delivered straight to your inbox.</p>
            <motion.a href="/register" whileHover={{ scale: 1.05, y: -2 }} className="inline-block bg-gray-800 text-white font-bold px-8 py-3.5 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                Create Profile & Alerts
            </motion.a>
        </div>
    </section>
);


// --- 4. MAIN "JOBS" APP COMPONENT ---

export default function JobsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [locationTerm, setLocationTerm] = useState('');
    const [activeFilters, setActiveFilters] = useState({ type: '', industry: '' });

    const handleFilterChange = (filterName, value) => {
        setActiveFilters(prev => ({ ...prev, [filterName]: value }));
    };
    
    const filteredJobs = useMemo(() => {
        return opportunitiesData.filter(job => {
            const matchesSearch = searchTerm.toLowerCase() === '' || job.title.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesLocation = locationTerm.toLowerCase() === '' || job.location.toLowerCase().includes(locationTerm.toLowerCase());
            const matchesType = activeFilters.type === '' || job.type === activeFilters.type;
            const matchesIndustry = activeFilters.industry === '' || job.industry === activeFilters.industry;
            return matchesSearch && matchesLocation && matchesType && matchesIndustry;
        });
    }, [searchTerm, locationTerm, activeFilters]);

    return (
        <>
            <JobsHero onSearch={setSearchTerm} onLocationChange={setLocationTerm} searchTerm={searchTerm} locationTerm={locationTerm} />
            <FilterBar activeFilters={activeFilters} onFilterChange={handleFilterChange} />
            <JobListing jobs={filteredJobs} />
            <SubscribeCTA />
        </>
    );
}

