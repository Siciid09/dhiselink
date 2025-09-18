"use client";

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
    Users, Briefcase, Star, Search, MapPin, SlidersHorizontal, HardHat, Code, Globe2, ArrowRight
} from 'lucide-react';

// --- 1. MOCK DATA ---

const professionalsData = [
    { name: "Amina Yusuf", title: "Architect & Urban Planner", field: "Construction & Design", skills: ["AutoCAD", "Urban Design", "Sustainability", "GIS"], location: "Mogadishu", experience: "12+ Years", summary: "Lead architect focused on sustainable urban development and public space revitalization projects." },
    { name: "Hassan Mohamed", title: "NGO Program Director", field: "Development & Policy", skills: ["Development Policy", "Grant Management", "Stakeholder Engagement"], location: "Baidoa", experience: "15+ Years", summary: "Expert in managing large-scale humanitarian and development programs for international NGOs." },
    { name: "Samira Ahmed", title: "Construction Manager", field: "Construction & Design", skills: ["Site Management", "Budgeting", "Safety Compliance"], location: "Hargeisa", experience: "10+ Years", summary: "Manages infrastructure projects from foundation to completion, ensuring on-time and on-budget delivery." },
    { name: "Fatima Hassan", title: "Lead Software Developer", field: "Technology", skills: ["React", "Node.js", "AWS", "Fintech"], location: "Mogadishu", experience: "8+ Years", summary: "Builds scalable financial technology solutions for one of Somalia's leading telecom companies." },
    { name: "Ali Ibrahim", title: "Water Resource Engineer", field: "Engineering", skills: ["Hydrology", "WASH", "Project Management"], location: "Kismayo", experience: "7+ Years", summary: "Specializes in water, sanitation, and hygiene (WASH) projects for arid environments." },
    { name: "Khadra Omar", title: "Public Policy Advisor", field: "Development & Policy", skills: ["Economic Policy", "Governance", "Research"], location: "Garowe", experience: "9+ Years", summary: "Advises government ministries on economic policy and good governance initiatives." },
];

const fieldsData = [
    { name: 'All Professionals', icon: <Users size={16}/>, field: 'All' },
    { name: 'Engineering', icon: <HardHat size={16}/>, field: 'Engineering' },
    { name: 'Technology', icon: <Code size={16}/>, field: 'Technology' },
    { name: 'Construction & Design', icon: <Briefcase size={16}/>, field: 'Construction & Design' },
    { name: 'Development & Policy', icon: <Globe2 size={16}/>, field: 'Development & Policy' },
];

// --- 2. REUSABLE UI & ANIMATION COMPONENTS ---

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
};

// --- 3. PAGE SECTIONS ---

const ProfessionalsHero = ({ onSearch, onSkillFilterChange, onLocationChange, searchTerm, locationTerm, activeSkillFilters }) => {
    // ... (This component remains the same)
    const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
    
    const allSkills = useMemo(() => {
        const skills = new Set<string>();
        professionalsData.forEach(p => p.skills.forEach(s => skills.add(s)));
        return Array.from(skills).sort();
    }, []);

    return (
        <section className="relative bg-gray-50 pt-40 pb-20 md:pt-48 md:pb-24">
            <div className="container mx-auto px-6 text-center">
                <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-4xl md:text-6xl font-extrabold tracking-tighter text-gray-900 mb-4">
                    Find the Professionals Building Somalia
                </motion.h1>
                <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="max-w-2xl mx-auto text-lg text-gray-600 mb-8">
                    Explore our network of verified architects, project managers, policy advisors, developers, and more.
                </motion.p>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="max-w-3xl mx-auto bg-white p-4 rounded-xl shadow-2xl border border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-2 relative">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name or title..."
                            value={searchTerm}
                            onChange={(e) => onSearch(e.target.value)}
                            className="w-full h-12 pl-12 pr-4 rounded-lg bg-gray-100 border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                     <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Filter by location..."
                            value={locationTerm}
                            onChange={(e) => onLocationChange(e.target.value)}
                            className="w-full h-12 pl-12 pr-4 rounded-lg bg-gray-100 border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)} className="md:absolute md:right-3 md:top-1/2 md:-translate-y-1/2 h-12 md:h-10 md:w-auto px-6 bg-blue-600 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors">
                        <SlidersHorizontal size={16} />
                        <span className="hidden md:inline">Skills</span>
                    </button>
                    <AnimatePresence>
                        {isFilterMenuOpen && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="md:absolute top-full left-0 w-full mt-2 bg-white p-6 rounded-xl shadow-2xl border border-gray-200 text-left col-span-full z-10">
                                <h4 className="font-semibold mb-4">Filter by Skills</h4>
                                <div className="flex flex-wrap gap-2">
                                    {allSkills.map(skill => (
                                        <button 
                                            key={skill}
                                            onClick={() => onSkillFilterChange(skill)}
                                            className={`px-3 py-1 text-sm rounded-full transition-colors ${activeSkillFilters.includes(skill) ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                                        >
                                            {skill}
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </section>
    );
};

const FieldFilter = ({ activeField, onFieldSelect }) => (
     <div className="bg-gray-50 pb-12">
        <div className="container mx-auto px-6">
            <div className="flex overflow-x-auto space-x-4 pb-4">
                {fieldsData.map(field => (
                    <button
                        key={field.name}
                        onClick={() => onFieldSelect(field.field)}
                        className={`flex-shrink-0 flex items-center gap-2 px-4 py-3 rounded-lg font-semibold text-sm transition-all duration-300 ${activeField === field.field ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-gray-700 hover:bg-gray-100 hover:-translate-y-1 shadow-md border'}`}
                    >
                        {field.icon}
                        {field.name}
                    </button>
                ))}
            </div>
        </div>
    </div>
);


// --- REDESIGNED PROFESSIONALS GRID ---
const ProfessionalsGrid = ({ professionals }) => {
    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.05,
    });
    
    return (
        <section ref={ref} className="py-24 bg-white">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AnimatePresence>
                        {professionals.map((pro, index) => (
                            <motion.div 
                                key={pro.name}
                                variants={itemVariants}
                                initial="hidden"
                                animate={inView ? "visible" : "hidden"}
                                transition={{ delay: inView ? index * 0.05 : 0 }}
                                className="bg-white rounded-lg border border-gray-200/80 shadow-lg overflow-hidden flex flex-col group hover:shadow-2xl hover:border-blue-500 transition-all duration-300"
                            >
                                <div className="p-6">
                                    <div className="flex items-center gap-4 mb-5">
                                        <img 
                                            src={`https://ui-avatars.com/api/?name=${pro.name.replace(' ', '+')}&background=EBF4FF&color=3B82F6&bold=true`} 
                                            alt={pro.name} 
                                            className="w-20 h-20 rounded-full border-4 border-white shadow-md"
                                        />
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-gray-900">{pro.name}</h3>
                                            <p className="text-blue-600 font-medium text-sm">{pro.title}</p>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-5 h-20 overflow-hidden">{pro.summary}</p>
                                    <div>
                                        <div className="flex flex-wrap gap-2">
                                            {pro.skills.slice(0, 3).map(skill => (
                                                <span key={skill} className="bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1 rounded-full">{skill}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-auto border-t border-gray-100 bg-gray-50 p-4 flex justify-between items-center">
                                    <p className="text-sm font-semibold text-gray-600">{pro.experience} Exp.</p>
                                    <a href="#" className="flex items-center gap-1 font-bold text-blue-600 group-hover:gap-2 transition-all duration-300">
                                        View Profile <ArrowRight size={16} />
                                    </a>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
                 {professionals.length === 0 && (
                     <div className="text-center py-20">
                         <p className="text-gray-500 text-lg">No professionals found matching your criteria.</p>
                     </div>
                )}
            </div>
        </section>
    );
};

const JoinCTASection = () => (
    <section className="bg-gray-50 py-24">
        <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 mb-4">Are You a Professional Ready to Make an Impact?</h2>
            <p className="max-w-2xl mx-auto text-lg text-gray-600 mb-8">Join our growing network to get discovered by top institutions, access exclusive opportunities, and collaborate on projects that are rebuilding Somalia.</p>
            <motion.a 
                href="/register" 
                whileHover={{ scale: 1.05, y: -2 }}
                className="inline-block bg-gray-800 text-white font-bold px-8 py-3.5 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
                Create Your Profile Today
            </motion.a>
        </div>
    </section>
);

// --- 4. MAIN "PROFESSIONALS" APP COMPONENT ---

export default function ProfessionalsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [locationTerm, setLocationTerm] = useState('');
    const [activeSkillFilters, setActiveSkillFilters] = useState<string[]>([]);
    const [activeField, setActiveField] = useState('All');

    const handleSkillFilterChange = (skill: string) => {
        setActiveSkillFilters(prev => 
            prev.includes(skill) 
            ? prev.filter(s => s !== skill) 
            : [...prev, skill]
        );
    };

    const filteredProfessionals = useMemo(() => {
        return professionalsData.filter(pro => {
            const matchesSearch = searchTerm.toLowerCase() === '' ||
                                  pro.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  pro.title.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesLocation = locationTerm.toLowerCase() === '' ||
                                      pro.location.toLowerCase().includes(locationTerm.toLowerCase());
            
            const matchesField = activeField === 'All' || pro.field === activeField;

            const matchesSkills = activeSkillFilters.length === 0 ||
                                  activeSkillFilters.every(filter => pro.skills.includes(filter));

            return matchesSearch && matchesLocation && matchesField && matchesSkills;
        });
    }, [searchTerm, locationTerm, activeSkillFilters, activeField]);

    return (
        <>
            <ProfessionalsHero 
                onSearch={setSearchTerm}
                onSkillFilterChange={handleSkillFilterChange}
                onLocationChange={setLocationTerm}
                searchTerm={searchTerm}
                locationTerm={locationTerm}
                activeSkillFilters={activeSkillFilters}
            />
            <FieldFilter activeField={activeField} onFieldSelect={setActiveField} />
            <ProfessionalsGrid professionals={filteredProfessionals} />
            <JoinCTASection />
        </>
    );
}

