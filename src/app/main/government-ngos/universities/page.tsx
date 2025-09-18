"use client";

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
    Users, Briefcase, Menu, X, Star, Search, MapPin, Building, BookOpen, FlaskConical, Stethoscope, Code, HardHat
} from 'lucide-react';

// --- 1. MOCK DATA FOR UNIVERSITIES PAGE ---

const universitiesData = [
    { 
        name: "SIMAD University", 
        location: "Mogadishu", 
        summary: "A leading private university renowned for its strong programs in technology, management sciences, and engineering.", 
        studentCount: "8000+", 
        programsOffered: 45, 
        featured: true, 
        logo: "https://logo.clearbit.com/simad.edu.so",
        image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=800&auto=format&fit=crop",
        specializations: ["Technology", "Business", "Engineering"]
    },
    { 
        name: "University of Hargeisa", 
        location: "Hargeisa", 
        summary: "A major public university offering a wide range of undergraduate and postgraduate programs, with a strong focus on medicine and law.", 
        studentCount: "7500+", 
        programsOffered: 50, 
        featured: true, 
        logo: "https://logo.clearbit.com/uoh.edu.so",
        image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=800&auto=format&fit=crop",
        specializations: ["Medicine", "Law", "Business"]
    },
     { 
        name: "Mogadishu University", 
        location: "Mogadishu", 
        summary: "A non-governmental university that is a member of the Association of Arab Universities, offering robust humanities and sciences programs.", 
        studentCount: "10000+", 
        programsOffered: 60, 
        featured: true, 
        logo: "https://logo.clearbit.com/mogadishuuniversity.edu.so",
        image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop",
        specializations: ["Humanities", "Sciences", "Technology"]
    },
    { 
        name: "Puntland State University", 
        location: "Garowe", 
        summary: "A key institution in Puntland, providing vital education in areas such as public administration, economics, and computer science.", 
        studentCount: "4000+", 
        programsOffered: 30, 
        featured: false, 
        logo: "https://logo.clearbit.com/psu.edu.so",
        specializations: ["Business", "Technology", "Public Administration"]
    },
    { 
        name: "Amoud University", 
        location: "Borama", 
        summary: "One of the first post-conflict private universities, with acclaimed faculties in education, business, and health sciences.", 
        studentCount: "5000+", 
        programsOffered: 35, 
        featured: false, 
        logo: "https://logo.clearbit.com/amouduniversity.org",
        specializations: ["Medicine", "Business", "Education"]
    },
     { 
        name: "Benadir University", 
        location: "Mogadishu", 
        summary: "Primarily known for its strong focus on medical and health sciences, training the next generation of Somalia's healthcare professionals.", 
        studentCount: "6000+", 
        programsOffered: 25, 
        featured: false, 
        logo: "https://logo.clearbit.com/benadiruniversity.net",
        specializations: ["Medicine", "Health Sciences"]
    },
];

const specializationsData = [
    { name: 'All Specializations', icon: <BookOpen size={16}/>, specialization: 'All' },
    { name: 'Technology', icon: <Code size={16}/>, specialization: 'Technology' },
    { name: 'Engineering', icon: <HardHat size={16}/>, specialization: 'Engineering' },
    { name: 'Medicine & Health', icon: <Stethoscope size={16}/>, specialization: 'Medicine' },
    { name: 'Business & Finance', icon: <Briefcase size={16}/>, specialization: 'Business' },
    { name: 'Sciences', icon: <FlaskConical size={16}/>, specialization: 'Sciences' },
];


// --- 2. REUSABLE UI & ANIMATION COMPONENTS ---

const itemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: 'easeOut' } }
};


// --- 3. PAGE SECTIONS for UNIVERSITIES PAGE ---

const UniversitiesHero = ({ onSearch, onLocationChange, searchTerm, locationTerm }) => (
    <section className="relative bg-gray-50 pt-40 pb-20 md:pt-48 md:pb-24 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"><div className="w-96 h-96 bg-blue-200/30 rounded-full filter blur-3xl opacity-50 animate-blob"></div><div className="w-96 h-96 bg-purple-200/30 rounded-full filter blur-3xl opacity-50 animate-blob animation-delay-4000 mix-blend-multiply"></div></div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container mx-auto px-6 text-center relative z-10">
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-4xl md:text-6xl font-extrabold tracking-tighter text-gray-900 mb-4">Fostering Somalia's Future Leaders</motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="max-w-2xl mx-auto text-lg text-gray-600 mb-8">Explore the academic institutions training the next generation of professionals to build the nation.</motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="max-w-2xl mx-auto bg-white/50 backdrop-blur-sm p-4 rounded-xl shadow-2xl border border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative"><Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input type="text" placeholder="Search by university name..." value={searchTerm} onChange={(e) => onSearch(e.target.value)} className="w-full h-12 pl-12 pr-4 rounded-lg bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"/></div>
                <div className="relative"><MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input type="text" placeholder="Filter by location..." value={locationTerm} onChange={(e) => onLocationChange(e.target.value)} className="w-full h-12 pl-12 pr-4 rounded-lg bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"/></div>
            </motion.div>
        </motion.div>
    </section>
);

const FeaturedUniversities = ({ universities }) => (
    <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
            <div className="flex items-center mb-12"><Star className="w-8 h-8 text-yellow-500 mr-4"/><h2 className="text-3xl font-bold tracking-tight text-gray-900">Featured Universities</h2></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {universities.map(uni => (
                    <motion.div key={uni.name} variants={itemVariants} whileHover={{y: -10, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'}} className="bg-white rounded-2xl shadow-xl border border-gray-200 flex flex-col group transition-all duration-300 overflow-hidden">
                        <div className="h-48 overflow-hidden"><img src={uni.image} alt={`${uni.name} campus`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/></div>
                        <div className="p-6 flex flex-col flex-grow">
                            <img src={uni.logo} alt={`${uni.name} logo`} className="h-16 w-16 mb-4 rounded-md border p-1 bg-white shadow-md -mt-12 z-10"/>
                            <h3 className="text-xl font-bold text-gray-900">{uni.name}</h3>
                            <p className="text-gray-500 text-sm mb-4">{uni.location}</p>
                            <p className="text-gray-600 text-sm flex-grow mb-6">{uni.summary}</p>
                            <a href="#" className="w-full bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-300">Learn More</a>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    </section>
);

const SpecializationFilter = ({ activeSpecialization, onSpecializationSelect }) => (
    <div className="bg-gray-50 py-6 border-y border-gray-200 sticky top-[72px] z-20">
        <div className="container mx-auto px-6"><div className="flex flex-nowrap overflow-x-auto space-x-4 pb-2">{specializationsData.map(spec => (<button key={spec.name} onClick={() => onSpecializationSelect(spec.specialization)} className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm transition-all duration-300 ${activeSpecialization === spec.specialization ? 'bg-blue-600 text-white shadow' : 'bg-white text-gray-700 hover:bg-gray-100 border'}`}>{spec.icon}{spec.name}</button>))}</div></div>
    </div>
);

const UniversitiesGrid = ({ universities }) => {
    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.05 });
    
    return (
        <section ref={ref} className="py-24 bg-white">
            <div className="container mx-auto px-6">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-12">All Universities</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AnimatePresence>
                        {universities.map((uni, index) => (
                            <motion.div key={uni.name} variants={itemVariants} initial="hidden" animate={inView ? "visible" : "hidden"} transition={{ delay: inView ? index * 0.05 : 0 }} className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden flex flex-col group hover:shadow-xl hover:border-blue-300 transition-all duration-300">
                                <div className="p-6">
                                    <div className="flex items-center gap-4 mb-4">
                                        <img src={uni.logo} alt={`${uni.name} logo`} className="h-12 w-12 object-contain rounded-md border p-1" />
                                        <div><h3 className="font-bold text-gray-900">{uni.name}</h3><p className="text-sm text-gray-500">{uni.location}</p></div>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-4 flex-grow">{uni.summary}</p>
                                </div>
                                <div className="mt-auto border-t border-gray-100 bg-gray-50 grid grid-cols-2 divide-x divide-gray-200 text-center">
                                    <div className="p-3"><p className="font-bold text-sm text-gray-800">{uni.programsOffered}+</p><p className="text-xs text-gray-500">Programs</p></div>
                                    <div className="p-3"><p className="font-bold text-sm text-gray-800">{uni.studentCount}</p><p className="text-xs text-gray-500">Students</p></div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
                 {universities.length === 0 && (<div className="text-center py-20"><p className="text-gray-500 text-lg">No universities found matching your criteria.</p></div>)}
            </div>
        </section>
    );
};

const PartnerCTASection = () => (
    <section className="bg-gray-50 py-24">
        <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 mb-4">Partner with Dhiselink</h2>
            <p className="max-w-2xl mx-auto text-lg text-gray-600 mb-8">Showcase your institution, connect your graduates with top employers, and become a key partner in building Somalia's professional future.</p>
            <motion.a href="/register" whileHover={{ scale: 1.05, y: -2 }} className="inline-block bg-gray-800 text-white font-bold px-8 py-3.5 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">Become a Partner</motion.a>
        </div>
    </section>
);


// --- 4. MAIN "UNIVERSITIES" APP COMPONENT ---

export default function UniversitiesPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [locationTerm, setLocationTerm] = useState('');
    const [activeSpecialization, setActiveSpecialization] = useState('All');

    const featuredUniversities = useMemo(() => universitiesData.filter(u => u.featured), []);
    
    const standardUniversities = useMemo(() => {
        return universitiesData.filter(uni => {
            const matchesSearch = searchTerm.toLowerCase() === '' || uni.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesLocation = locationTerm.toLowerCase() === '' || uni.location.toLowerCase().includes(locationTerm.toLowerCase());
            const matchesSpecialization = activeSpecialization === 'All' || uni.specializations.includes(activeSpecialization);
            return !uni.featured && matchesSearch && matchesLocation && matchesSpecialization;
        });
    }, [searchTerm, locationTerm, activeSpecialization]);

    return (
        <>
            <UniversitiesHero onSearch={setSearchTerm} onLocationChange={setLocationTerm} searchTerm={searchTerm} locationTerm={locationTerm} />
            <FeaturedUniversities universities={featuredUniversities} />
            <SpecializationFilter activeSpecialization={activeSpecialization} onSpecializationSelect={setActiveSpecialization} />
            <UniversitiesGrid universities={standardUniversities} />
            <PartnerCTASection />
            <style jsx global>{`
                .animation-delay-4000 { animation-delay: -4s; }
                @keyframes blob { 0% { transform: translate(0px, 0px) scale(1); } 33% { transform: translate(30px, -50px) scale(1.1); } 66% { transform: translate(-20px, 20px) scale(0.9); } 100% { transform: translate(0px, 0px) scale(1); } }
                .animate-blob { animation: blob 10s infinite; }
            `}</style>
        </>
    );
}

