"use client";

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
    Users, Briefcase, Star, Search, MapPin, Building, Globe2, Landmark
} from 'lucide-react';

// --- 1. MOCK DATA FOR GOVERNMENTS & NGOS PAGE ---

const institutionsData = [
    { name: "Ministry of Public Works, Reconstruction & Housing", type: "Government", location: "Mogadishu", summary: "The federal government body responsible for planning, developing, and maintaining public infrastructure across Somalia.", activeProjects: 22, featured: true, logo: "https://i.imgur.com/sH8l9l8.png" },
    { name: "UN Development Programme (UNDP)", type: "NGO", location: "Mogadishu", summary: "The UN's global development network, working on the ground to eradicate poverty and reduce inequalities.", activeProjects: 15, featured: true, logo: "https://logo.clearbit.com/undp.org" },
    { name: "Mercy Corps", type: "NGO", location: "Baidoa", summary: "A global humanitarian organization empowering people to survive through crisis, build better lives and transform their communities for good.", activeProjects: 11, featured: true, logo: "https://logo.clearbit.com/mercycorps.org" },
    { name: "Somaliland Development Fund (SDF)", type: "Government Partner", location: "Hargeisa", summary: "A multi-donor fund supporting the Government of Somaliland in delivering infrastructure projects that are relevant to the needs of its people.", activeProjects: 18, featured: true, logo: "https://logo.clearbit.com/somalilanddevelopmentfund.org" },
    { name: "Ministry of Planning, Investment and Economic Development", type: "Government", location: "Mogadishu", summary: "Coordinates national development planning, investment promotion, and economic policy formulation.", activeProjects: 12, featured: false, logo: "https://i.imgur.com/sH8l9l8.png" },
    { name: "Norwegian Refugee Council (NRC)", type: "NGO", location: "Kismayo", summary: "An independent humanitarian organisation helping people forced to flee. They protect displaced people and support them as they build a new future.", activeProjects: 9, featured: false, logo: "https://logo.clearbit.com/nrc.no" },
    { name: "City of Hargeisa", type: "Government", location: "Hargeisa", summary: "The municipal government responsible for urban planning, waste management, and public services in the capital city.", activeProjects: 7, featured: false, logo: "https://i.imgur.com/9dLLg5g.png" },
];

const typesData = [
    { name: 'All Bodies', icon: <Building size={16}/>, type: 'All' },
    { name: 'Government', icon: <Landmark size={16}/>, type: 'Government' },
    { name: 'NGO', icon: <Globe2 size={16}/>, type: 'NGO' },
    { name: 'Government Partner', icon: <Users size={16}/>, type: 'Government Partner' },
];

// --- 2. REUSABLE UI & ANIMATION COMPONENTS ---

const itemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: 'easeOut' } }
};

// --- 3. PAGE SECTIONS for GOVERNMENTS & NGOS PAGE ---

const GovsNgosHero = ({ onSearch, onLocationChange, searchTerm, locationTerm, onTypeSelect }) => {
    // ... (Hero variants and child variants can be reused here) ...
    return (
        <section className="relative bg-gray-50 pt-40 pb-20 md:pt-48 md:pb-24 overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="w-96 h-96 bg-green-200/30 rounded-full filter blur-3xl opacity-50 animate-blob"></div>
                <div className="w-96 h-96 bg-cyan-200/30 rounded-full filter blur-3xl opacity-50 animate-blob animation-delay-4000 mix-blend-multiply"></div>
            </div>
            <motion.div initial="hidden" animate="visible" className="container mx-auto px-6 text-center relative z-10">
                <motion.h1 variants={itemVariants} className="text-4xl md:text-6xl font-extrabold tracking-tighter text-gray-900 mb-4">
                    Public & Non-Profit Sector
                </motion.h1>
                <motion.p variants={itemVariants} className="max-w-2xl mx-auto text-lg text-gray-600 mb-8">
                    Discover the government bodies and non-governmental organizations leading national development initiatives.
                </motion.p>
                 <motion.div variants={itemVariants} className="max-w-2xl mx-auto bg-white/50 backdrop-blur-sm p-4 rounded-xl shadow-2xl border border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative"><Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input type="text" placeholder="Search by institution name..." value={searchTerm} onChange={(e) => onSearch(e.target.value)} className="w-full h-12 pl-12 pr-4 rounded-lg bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"/></div>
                    <div className="relative"><MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input type="text" placeholder="Filter by location..." value={locationTerm} onChange={(e) => onLocationChange(e.target.value)} className="w-full h-12 pl-12 pr-4 rounded-lg bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"/></div>
                </motion.div>
            </motion.div>
        </section>
    );
};

const FeaturedInstitutions = ({ institutions }) => (
    <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
            <div className="flex items-center mb-12">
                <Star className="w-8 h-8 text-yellow-500 mr-4"/>
                <h2 className="text-3xl font-bold tracking-tight text-gray-900">Featured Partners</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {institutions.map(inst => (
                    <motion.div key={inst.name} variants={itemVariants} whileHover={{y: -10, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'}} className="bg-white rounded-lg shadow-xl border border-gray-200 p-8 flex flex-col text-center items-center group transition-all duration-300">
                        <img src={inst.logo} alt={`${inst.name} logo`} className="h-16 mb-6 grayscale group-hover:grayscale-0 transition-all duration-300" onError={(e) => e.currentTarget.src = `https://placehold.co/128x64/e2e8f0/4a5568?text=${inst.name.charAt(0)}`} />
                        <h3 className="text-xl font-bold text-gray-900">{inst.name}</h3>
                        <p className="text-blue-600 font-semibold text-sm mb-4">{inst.type}</p>
                        <p className="text-gray-600 text-sm flex-grow mb-6">{inst.summary}</p>
                        <a href="#" className="w-full mt-auto bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-300">View Profile & Projects</a>
                    </motion.div>
                ))}
            </div>
        </div>
    </section>
);

const TypeFilter = ({ activeType, onTypeSelect }) => (
    <div className="bg-gray-50 py-6 border-y border-gray-200 sticky top-[72px] z-20">
        <div className="container mx-auto px-6">
            <div className="flex flex-nowrap overflow-x-auto space-x-4 pb-2">
                {typesData.map(type => (
                    <button key={type.name} onClick={() => onTypeSelect(type.type)} className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm transition-all duration-300 ${activeType === type.type ? 'bg-blue-600 text-white shadow' : 'bg-white text-gray-700 hover:bg-gray-100 border'}`}>
                        {type.icon}
                        {type.name}
                    </button>
                ))}
            </div>
        </div>
    </div>
);

const InstitutionsGrid = ({ institutions }) => {
    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.05 });
    
    return (
        <section ref={ref} className="py-24 bg-white">
            <div className="container mx-auto px-6">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-12">All Institutions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AnimatePresence>
                        {institutions.map((inst, index) => (
                            <motion.div key={inst.name} variants={itemVariants} initial="hidden" animate={inView ? "visible" : "hidden"} transition={{ delay: inView ? index * 0.05 : 0 }} className="bg-white rounded-lg border border-gray-200 shadow-lg overflow-hidden flex flex-col group hover:shadow-xl hover:border-blue-300 transition-all duration-300">
                                <div className="p-6">
                                    <div className="flex items-center gap-4 mb-4">
                                        <img src={inst.logo} alt={`${inst.name} logo`} className="h-12 w-12 object-contain rounded-md border p-1" onError={(e) => e.currentTarget.src = `https://placehold.co/64x64/e2e8f0/4a5568?text=${inst.name.charAt(0)}`} />
                                        <div>
                                            <h3 className="font-bold text-gray-900">{inst.name}</h3>
                                            <p className="text-sm text-gray-500">{inst.type}</p>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-4 flex-grow">{inst.summary}</p>
                                </div>
                                <div className="mt-auto border-t border-gray-100 bg-gray-50 grid grid-cols-2 divide-x divide-gray-200 text-center">
                                    <div className="p-3"><p className="font-bold text-sm text-blue-600">{inst.activeProjects}</p><p className="text-xs text-gray-500">Active Projects</p></div>
                                    <div className="flex items-center justify-center p-3 text-sm font-semibold text-blue-600 group-hover:bg-blue-50 transition-colors"><a href="#">View Details</a></div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
                 {institutions.length === 0 && (<div className="text-center py-20"><p className="text-gray-500 text-lg">No institutions found matching your criteria.</p></div>)}
            </div>
        </section>
    );
};

// --- 4. MAIN PAGE COMPONENT ---

export default function GovernmentsNgosPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [locationTerm, setLocationTerm] = useState('');
    const [activeType, setActiveType] = useState('All');

    const featuredInstitutions = useMemo(() => institutionsData.filter(c => c.featured), []);
    
    const standardInstitutions = useMemo(() => {
        return institutionsData.filter(inst => {
            const matchesSearch = searchTerm.toLowerCase() === '' || inst.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesLocation = locationTerm.toLowerCase() === '' || inst.location.toLowerCase().includes(locationTerm.toLowerCase());
            const matchesType = activeType === 'All' || inst.type === activeType;
            return !inst.featured && matchesSearch && matchesLocation && matchesType;
        });
    }, [searchTerm, locationTerm, activeType]);

    const handleTypeSelect = (type: string) => {
        setActiveType(type);
        setSearchTerm('');
        setLocationTerm('');
    }

    return (
        <>
            <GovsNgosHero onSearch={setSearchTerm} onLocationChange={setLocationTerm} searchTerm={searchTerm} locationTerm={locationTerm} onTypeSelect={handleTypeSelect} />
            <FeaturedInstitutions institutions={featuredInstitutions} />
            <TypeFilter activeType={activeType} onTypeSelect={handleTypeSelect} />
            <InstitutionsGrid institutions={standardInstitutions} />
            {/* CTA can be reused from other pages or customized */}
             <style jsx global>{`
              .animation-delay-4000 { animation-delay: -4s; }
              @keyframes blob { 0% { transform: translate(0px, 0px) scale(1); } 33% { transform: translate(30px, -50px) scale(1.1); } 66% { transform: translate(-20px, 20px) scale(0.9); } 100% { transform: translate(0px, 0px) scale(1); } }
              .animate-blob { animation: blob 10s infinite; }
            `}</style>
        </>
    );
}
