"use client";

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
    Users, Briefcase, Star, Search, MapPin, Building, HardHat, Code, Globe2
} from 'lucide-react';

// --- 1. MOCK DATA FOR COMPANIES PAGE ---

const companiesData = [
    { name: "Hormuud Telecom", industry: "Technology", location: "Mogadishu", summary: "Somalia's leading telecommunications provider, driving digital transformation and connectivity.", employeeCount: "5000+", activeJobs: 12, featured: true, logo: "https://logo.clearbit.com/hormuud.com" },
    { name: "BECO Group", industry: "Construction", location: "Hargeisa", summary: "A premier construction and engineering firm responsible for major infrastructure projects across the region.", employeeCount: "1200+", activeJobs: 8, featured: true, logo: "https://logo.clearbit.com/beco.so" },
    { name: "Premier Bank", industry: "Finance", location: "Mogadishu", summary: "A leading financial institution offering innovative banking solutions to individuals and businesses.", employeeCount: "800+", activeJobs: 5, featured: true, logo: "https://logo.clearbit.com/premierbank.so" },
    { name: "Dahabshiil Group", industry: "Finance", location: "Hargeisa", summary: "A multinational company with interests in financial services, banking, telecommunications, and more.", employeeCount: "10000+", activeJobs: 10, featured: true, logo: "https://logo.clearbit.com/dahabshiil.com"},
    { name: "UNDP Somalia", industry: "NGO & Development", location: "Mogadishu", summary: "The UN's global development network, working on the ground to eradicate poverty and reduce inequalities.", employeeCount: "300+", activeJobs: 15, featured: false, logo: "https://logo.clearbit.com/undp.org" },
    { name: "Ministry of Public Works", industry: "Government", location: "Mogadishu", summary: "The government body responsible for the planning, construction, and maintenance of public infrastructure.", employeeCount: "N/A", activeJobs: 22, featured: false, logo: "https://logo.clearbit.com/un.org" },
    { name: "Saafi Solar", industry: "Renewable Energy", location: "Garowe", summary: "An innovative startup providing affordable and reliable solar energy solutions to rural communities.", employeeCount: "50+", activeJobs: 3, featured: false, logo: "https://logo.clearbit.com/saafisolar.com" },
    { name: "Golis Telecom", industry: "Technology", location: "Hargeisa", summary: "A key player in the telecommunications sector, expanding mobile and internet access.", employeeCount: "1500+", activeJobs: 7, featured: false, logo: "https://logo.clearbit.com/golis.so" },
    { name: "Mercy Corps", industry: "NGO & Development", location: "Baidoa", summary: "A global humanitarian organization empowering people to survive through crisis and build better lives.", employeeCount: "200+", activeJobs: 11, featured: false, logo: "https://logo.clearbit.com/mercycorps.org" },
];

const industriesData = [
    { name: 'All Industries', icon: <Building size={16}/>, industry: 'All' },
    { name: 'Technology', icon: <Code size={16}/>, industry: 'Technology' },
    { name: 'Construction', icon: <HardHat size={16}/>, industry: 'Construction' },
    { name: 'NGO & Development', icon: <Globe2 size={16}/>, industry: 'NGO & Development' },
    { name: 'Government', icon: <Briefcase size={16}/>, industry: 'Government' },
    { name: 'Finance', icon: <Users size={16}/>, industry: 'Finance' },
];

// --- 2. REUSABLE UI & ANIMATION COMPONENTS ---

const itemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: 'easeOut' } }
};

// --- 3. PAGE SECTIONS for COMPANIES PAGE ---

const CompaniesHero = ({ onSearch, onLocationChange, searchTerm, locationTerm, onIndustrySelect }) => {
    const heroVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
    };
    
    const childVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
    };

    return (
        <section className="relative bg-gray-50 pt-40 pb-20 md:pt-48 md:pb-24 overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="w-96 h-96 bg-blue-200/30 rounded-full filter blur-3xl opacity-50 animate-blob"></div>
                <div className="w-96 h-96 bg-purple-200/30 rounded-full filter blur-3xl opacity-50 animate-blob animation-delay-4000 mix-blend-multiply"></div>
            </div>
            <motion.div variants={heroVariants} initial="hidden" animate="visible" className="container mx-auto px-6 text-center relative z-10">
                <motion.h1 variants={childVariants} className="text-4xl md:text-6xl font-extrabold tracking-tighter text-gray-900 mb-4">
                    Meet the Institutions Building Somalia
                </motion.h1>
                <motion.p variants={childVariants} className="max-w-2xl mx-auto text-lg text-gray-600 mb-8">
                    Discover the leading companies, NGOs, and government bodies driving development and innovation.
                </motion.p>
                <motion.div variants={childVariants} className="max-w-2xl mx-auto bg-white/50 backdrop-blur-sm p-4 rounded-xl shadow-2xl border border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative"><Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input type="text" placeholder="Search by company name..." value={searchTerm} onChange={(e) => onSearch(e.target.value)} className="w-full h-12 pl-12 pr-4 rounded-lg bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"/></div>
                    <div className="relative"><MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input type="text" placeholder="Filter by location..." value={locationTerm} onChange={(e) => onLocationChange(e.target.value)} className="w-full h-12 pl-12 pr-4 rounded-lg bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"/></div>
                </motion.div>
                <motion.div variants={childVariants} className="mt-6 text-sm text-gray-500">
                    <span className="font-semibold">Trending Searches:</span>
                    <button onClick={() => onIndustrySelect("Technology")} className="ml-2 hover:text-blue-600 transition-colors">Technology</button>,
                    <button onClick={() => onIndustrySelect("Construction")} className="ml-2 hover:text-blue-600 transition-colors">Construction</button>,
                    <button onClick={() => onIndustrySelect("NGO & Development")} className="ml-2 hover:text-blue-600 transition-colors">NGOs</button>
                </motion.div>
            </motion.div>
        </section>
    );
};

const FeaturedCompanies = ({ companies }) => (
    <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
            <div className="flex items-center mb-12">
                <Star className="w-8 h-8 text-yellow-500 mr-4"/>
                <h2 className="text-3xl font-bold tracking-tight text-gray-900">Featured Partners</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {companies.map(company => (
                    <motion.div key={company.name} variants={itemVariants} whileHover={{y: -10, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'}} className="bg-white rounded-lg shadow-xl border border-gray-200 p-8 flex flex-col text-center items-center group transition-all duration-300">
                        <img src={company.logo} alt={`${company.name} logo`} className="h-16 mb-6 grayscale group-hover:grayscale-0 transition-all duration-300" onError={(e) => e.currentTarget.src = `https://placehold.co/128x64/e2e8f0/4a5568?text=${company.name.charAt(0)}`} />
                        <h3 className="text-xl font-bold text-gray-900">{company.name}</h3>
                        <p className="text-blue-600 font-semibold text-sm mb-4">{company.industry}</p>
                        <p className="text-gray-600 text-sm flex-grow mb-6">{company.summary}</p>
                        <a href="#" className="w-full mt-auto bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-300">View Profile & Jobs</a>
                    </motion.div>
                ))}
            </div>
        </div>
    </section>
);

const IndustryFilter = ({ activeIndustry, onIndustrySelect }) => (
    <div className="bg-gray-50 py-6 border-y border-gray-200 sticky top-[72px] z-20">
        <div className="container mx-auto px-6">
            <div className="flex flex-nowrap overflow-x-auto space-x-4 pb-2">
                {industriesData.map(industry => (
                    <button key={industry.name} onClick={() => onIndustrySelect(industry.industry)} className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm transition-all duration-300 ${activeIndustry === industry.industry ? 'bg-blue-600 text-white shadow' : 'bg-white text-gray-700 hover:bg-gray-100 border'}`}>
                        {industry.icon}
                        {industry.name}
                    </button>
                ))}
            </div>
        </div>
    </div>
);

const CompaniesGrid = ({ companies }) => {
    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.05 });
    
    return (
        <section ref={ref} className="py-24 bg-white">
            <div className="container mx-auto px-6">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-12">All Registered Institutions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AnimatePresence>
                        {companies.map((company, index) => (
                            <motion.div key={company.name} variants={itemVariants} initial="hidden" animate={inView ? "visible" : "hidden"} transition={{ delay: inView ? index * 0.05 : 0 }} className="bg-white rounded-lg border border-gray-200 shadow-lg overflow-hidden flex flex-col group hover:shadow-xl hover:border-blue-300 transition-all duration-300">
                                <div className="p-6">
                                    <div className="flex items-center gap-4 mb-4">
                                        <img src={company.logo} alt={`${company.name} logo`} className="h-12 w-12 object-contain rounded-md border p-1" onError={(e) => e.currentTarget.src = `https://placehold.co/64x64/e2e8f0/4a5568?text=${company.name.charAt(0)}`} />
                                        <div>
                                            <h3 className="font-bold text-gray-900">{company.name}</h3>
                                            <p className="text-sm text-gray-500">{company.industry}</p>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-4 flex-grow">{company.summary}</p>
                                </div>
                                <div className="mt-auto border-t border-gray-100 bg-gray-50 grid grid-cols-3 divide-x divide-gray-200 text-center">
                                    <div className="p-3"><p className="font-bold text-sm text-gray-800">{company.employeeCount}</p><p className="text-xs text-gray-500">Employees</p></div>
                                    <div className="p-3"><p className="font-bold text-sm text-blue-600">{company.activeJobs}</p><p className="text-xs text-gray-500">Active Jobs</p></div>
                                    <div className="flex items-center justify-center p-3 text-sm font-semibold text-blue-600 group-hover:bg-blue-50 transition-colors"><a href="#">View</a></div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
                 {companies.length === 0 && (<div className="text-center py-20"><p className="text-gray-500 text-lg">No companies found matching your criteria.</p></div>)}
            </div>
        </section>
    );
};

const RegisterCTASection = () => (
    <section className="bg-gray-50 py-24">
        <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 mb-4">Is Your Institution Ready to Lead?</h2>
            <p className="max-w-2xl mx-auto text-lg text-gray-600 mb-8">Join Dhiselink to access Somalia's top talent, post opportunities, and position your organization at the forefront of national development.</p>
            <motion.a href="/register" whileHover={{ scale: 1.05, y: -2 }} className="inline-block bg-gray-800 text-white font-bold px-8 py-3.5 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">Register Your Institution</motion.a>
        </div>
    </section>
);


// --- 4. MAIN "COMPANIES" APP COMPONENT ---

export default function CompaniesPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [locationTerm, setLocationTerm] = useState('');
    const [activeIndustry, setActiveIndustry] = useState('All');

    const featuredCompanies = useMemo(() => companiesData.filter(c => c.featured), []);
    
    const standardCompanies = useMemo(() => {
        return companiesData.filter(company => {
            const matchesSearch = searchTerm.toLowerCase() === '' || company.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesLocation = locationTerm.toLowerCase() === '' || company.location.toLowerCase().includes(locationTerm.toLowerCase());
            const matchesIndustry = activeIndustry === 'All' || company.industry === activeIndustry;
            return !company.featured && matchesSearch && matchesLocation && matchesIndustry;
        });
    }, [searchTerm, locationTerm, activeIndustry]);

    const handleIndustrySelect = (industry: string) => {
        setActiveIndustry(industry);
        setSearchTerm('');
        setLocationTerm('');
    }

    return (
        <>
            <CompaniesHero onSearch={setSearchTerm} onLocationChange={setLocationTerm} searchTerm={searchTerm} locationTerm={locationTerm} onIndustrySelect={handleIndustrySelect} />
            <FeaturedCompanies companies={featuredCompanies} />
            <IndustryFilter activeIndustry={activeIndustry} onIndustrySelect={handleIndustrySelect} />
            <CompaniesGrid companies={standardCompanies} />
            <RegisterCTASection />
            <style jsx global>{`
              .animation-delay-4000 { animation-delay: -4s; }
              @keyframes blob { 0% { transform: translate(0px, 0px) scale(1); } 33% { transform: translate(30px, -50px) scale(1.1); } 66% { transform: translate(-20px, 20px) scale(0.9); } 100% { transform: translate(0px, 0px) scale(1); } }
              .animate-blob { animation: blob 10s infinite; }
            `}</style>
        </>
    );
}

