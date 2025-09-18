"use client";

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Lightbulb, Search, ChevronLeft, PlusCircle, Users, MessageSquare, DollarSign, BookOpen, Briefcase, TestTube2, HeartPulse, HardHat, Sun, GraduationCap, Code, ArrowRight, User, Calendar, Tag
} from 'lucide-react';

// --- 1. EXPANDED MOCK DATA ---

const ideasData = [
    { 
        id: 1,
        title: "IoT-Based Livestock Tracking System", 
        author: "Fatima Hassan", 
        category: "Technology", 
        summary: "A real-time tracking solution using GPS and IoT sensors to monitor livestock health and location, reducing theft and improving herd management for nomadic communities.",
        details: "The proposed system involves developing low-cost, solar-powered ear tags for livestock. These tags will transmit location and biometric data (like temperature and activity levels) to a central cloud platform. A mobile application will allow herders to view a real-time map of their livestock, receive alerts for sick animals or potential theft, and access historical data to optimize grazing patterns. The business model could be a subscription service per head of livestock, making it affordable for local communities.",
        seeking: ["Co-founder (Hardware)", "Seed Funding", "Advisor"],
        status: "Seeking Collaborators",
        postedDate: "2025-09-12"
    },
    { 
        id: 2,
        title: "Affordable Compressed Earth Bricks (CEB)", 
        author: "Samira Ahmed", 
        category: "Construction", 
        summary: "Developing a low-cost, eco-friendly building material from local soil to create durable and affordable housing, with on-site training for local masons.",
        details: "This project aims to create a mobile, easy-to-operate press for manufacturing Compressed Earth Bricks (CEBs) on-site. By using local soil and a small percentage of a stabilizing agent like cement, we can drastically reduce construction costs and transportation emissions. The project includes a 'train-the-trainer' component to empower local builders with the skills to use this technology, fostering entrepreneurship and sustainable construction practices across the region.",
        seeking: ["Material Scientist", "Testers", "Logistics Partner"],
        status: "Prototyping",
        postedDate: "2025-09-10"
    },
    { 
        id: 3,
        title: "Mobile Clinic Network for Rural Areas", 
        author: "Dr. Ali Ibrahim", 
        category: "Healthcare", 
        summary: "A proposal to equip and operate a fleet of mobile clinics to deliver primary healthcare, vaccinations, and maternal health services to underserved rural populations.",
        details: "This initiative proposes a hub-and-spoke model where fully-equipped vans (the 'spokes') travel on scheduled routes to remote villages, coordinated by a central regional clinic (the 'hub'). Services will include basic diagnostics, maternal and child health check-ups, vaccinations, and a pharmacy for essential medicines. The model will be sustained through a hybrid of government subsidies, international aid grants, and a small fee-for-service where applicable.",
        seeking: ["Logistics Partner", "Grant Funding"],
        status: "Seeking Funding",
        postedDate: "2025-09-08"
    },
     { 
        id: 4,
        title: "Research on Drought-Resistant Crops", 
        author: "Khadra Omar", 
        category: "Research", 
        summary: "A research project to identify and cultivate strains of sorghum and maize that are resilient to Somalia's changing climate, aiming to improve food security.",
        details: "This academic and practical research project will involve field trials in different regions of Somalia to test various cultivars of sorghum, maize, and cowpea for drought and heat tolerance. The project will partner with local universities and farming cooperatives. The end goal is to publish a report identifying the top-performing cultivars and create a seed bank to distribute these resilient seeds to farmers, thereby strengthening the nation's food supply chain against climate shocks.",
        seeking: ["Agronomists", "Research Grants"],
        status: "Research Phase",
        postedDate: "2025-09-05"
    },
    // ... other ideas ...
];

const categories = [
    { name: "All", icon: <Lightbulb size={16}/> },
    { name: "Technology", icon: <Code size={16}/> },
    { name: "Construction", icon: <HardHat size={16}/> },
    { name: "Healthcare", icon: <HeartPulse size={16}/> },
    { name: "Research", icon: <TestTube2 size={16}/> },
    { name: "Renewable Energy", icon: <Sun size={16}/> },
    { name: "Education", icon: <GraduationCap size={16}/> },
];

const categoryStyles = {
    "Technology": "border-t-4 border-blue-500",
    "Construction": "border-t-4 border-orange-500",
    "Healthcare": "border-t-4 border-red-500",
    "Research": "border-t-4 border-purple-500",
    "Renewable Energy": "border-t-4 border-yellow-500",
    "Education": "border-t-4 border-green-500",
};


// --- 2. PAGE VIEWS: HUB, CREATE & DETAIL ---

const IdeaHubView = ({ onShowCreate, onSearch, onFilter, searchTerm, activeFilter, filteredIdeas, onSelectIdea }) => (
    <>
        <section className="bg-gray-50 pt-40 pb-20 md:pt-48 md:pb-24">
            <div className="container mx-auto px-6 text-center">
                <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-4xl md:text-6xl font-extrabold tracking-tighter text-gray-900 mb-4">The Idea Hub</motion.h1>
                <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="max-w-3xl mx-auto text-lg text-gray-600 mb-8">A launchpad for innovation. Share your projects, find collaborators, and turn groundbreaking ideas into reality.</motion.p>
                <motion.button onClick={onShowCreate} whileHover={{ scale: 1.05 }} className="inline-flex items-center gap-2 bg-gray-800 text-white font-bold px-8 py-3.5 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                    <PlusCircle size={20}/> Submit a New Idea
                </motion.button>
            </div>
        </section>

        <section className="py-16 md:py-20 bg-white">
            <div className="container mx-auto px-6 max-w-7xl">
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-12">
                     <div className="relative w-full md:w-1/3">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/>
                        <input type="text" placeholder="Search ideas by title..." value={searchTerm} onChange={(e) => onSearch(e.target.value)} className="w-full h-12 pl-12 pr-4 rounded-lg bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                    </div>
                    <div className="flex flex-wrap gap-2 justify-center">
                        {categories.map(cat => (
                            <button key={cat.name} onClick={() => onFilter(cat.name)} className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${activeFilter === cat.name ? 'bg-blue-600 text-white shadow' : 'bg-white text-gray-700 hover:bg-gray-100 border'}`}>
                                {cat.icon} {cat.name}
                            </button>
                        ))}
                    </div>
                </div>

                <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AnimatePresence>
                        {filteredIdeas.map(idea => (
                            <motion.div layout initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} key={idea.id} whileHover={{y: -8, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'}} className={`bg-white rounded-lg shadow-lg flex flex-col group overflow-hidden cursor-pointer ${categoryStyles[idea.category]}`} onClick={() => onSelectIdea(idea)}>
                               <div className="p-6 flex-grow flex flex-col">
                                 <div className="flex justify-between items-start mb-3">
                                    <span className={`text-xs font-bold py-1 px-3 rounded-full bg-gray-100 text-gray-800`}>{idea.category}</span>
                                    <span className="text-xs font-semibold py-1 px-3 rounded-full bg-blue-100 text-blue-800">{idea.status}</span>
                                 </div>
                                 <h3 className="text-xl font-bold text-gray-900 mb-2">{idea.title}</h3>
                                 <p className="text-sm text-gray-500 mb-4">By {idea.author}</p>
                                 <p className="text-gray-600 text-sm mb-6 flex-grow">{idea.summary}</p>
                                 <div className="mt-auto">
                                    <h4 className="text-xs font-semibold text-gray-500 mb-2 uppercase">Seeking</h4>
                                    <div className="flex flex-wrap gap-2">
                                       {idea.seeking.map(s => <span key={s} className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">{s}</span>)}
                                    </div>
                                 </div>
                               </div>
                               <div className="block w-full text-center font-semibold text-blue-600 bg-gray-50 group-hover:bg-blue-600 group-hover:text-white p-4 transition-colors duration-300">
                                View Details & Collaborate
                               </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            </div>
        </section>
    </>
);

const CreateIdeaView = ({ onShowHub }) => (
    // This component remains unchanged from the previous version
    <section className="bg-gray-50 py-32"> ... </section>
);

const IdeaDetailView = ({ idea, onShowHub }) => (
    <section className="bg-white py-32">
        <div className="container mx-auto px-6 max-w-6xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="mb-8">
                    <button onClick={onShowHub} className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-blue-600">
                        <ChevronLeft size={16}/> Back to Idea Hub
                    </button>
                </div>

                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <div className="prose max-w-none">
                            <span className="text-sm font-bold uppercase text-blue-600">{idea.category}</span>
                            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mt-2 mb-4">{idea.title}</h1>
                            <p className="text-lg text-gray-600 leading-relaxed">{idea.details || idea.summary}</p>
                        </div>
                    </div>
                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-28 space-y-6">
                            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                                <h3 className="text-lg font-bold mb-4">Key Information</h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex items-center gap-3"><User size={16} className="text-gray-500"/> <span className="font-semibold">{idea.author}</span></div>
                                    <div className="flex items-center gap-3"><Calendar size={16} className="text-gray-500"/> <span>Posted on {idea.postedDate || "Not available"}</span></div>
                                    <div className="flex items-center gap-3"><Tag size={16} className="text-gray-500"/> <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">{idea.status}</span></div>
                                </div>
                            </div>
                            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                                <h3 className="text-lg font-bold mb-4">Seeking Collaborators & Support</h3>
                                <div className="flex flex-wrap gap-2">
                                    {idea.seeking.map(s => <span key={s} className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">{s}</span>)}
                                </div>
                            </div>
                            <motion.button whileHover={{ scale: 1.05 }} className="w-full flex items-center justify-center gap-2 bg-gray-800 text-white font-bold py-4 px-6 rounded-lg hover:bg-black transition-colors">
                                Collaborate on this Idea <ArrowRight size={18}/>
                            </motion.button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    </section>
);


// --- 3. MAIN PAGE COMPONENT ---

export default function IdeaHubPage() {
    const [view, setView] = useState('hub'); // 'hub', 'create', or 'detail'
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');
    const [selectedIdea, setSelectedIdea] = useState(null);
    
    const pageVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.5 } },
        exit: { opacity: 0, transition: { duration: 0.3 } }
    };

    const filteredIdeas = useMemo(() => {
        return ideasData.filter(idea => 
            (activeFilter === 'All' || idea.category === activeFilter) &&
            (searchTerm === '' || idea.title.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [searchTerm, activeFilter]);

    const handleSelectIdea = (idea) => {
        setSelectedIdea(idea);
        setView('detail');
        window.scrollTo(0, 0);
    };

    const handleShowHub = () => {
        setSelectedIdea(null);
        setView('hub');
    };

    const handleShowCreate = () => {
        setSelectedIdea(null);
        setView('create');
        window.scrollTo(0, 0);
    };


    return (
        <AnimatePresence mode="wait">
             {view === 'hub' && (
                 <motion.div key="hub" variants={pageVariants} initial="hidden" animate="visible" exit="exit">
                    <IdeaHubView 
                        onShowCreate={handleShowCreate} 
                        onSearch={setSearchTerm}
                        onFilter={setActiveFilter}
                        searchTerm={searchTerm}
                        activeFilter={activeFilter}
                        filteredIdeas={filteredIdeas}
                        onSelectIdea={handleSelectIdea}
                    />
                 </motion.div>
             )}
             {view === 'create' && (
                  <motion.div key="create" variants={pageVariants} initial="hidden" animate="visible" exit="exit">
                    <CreateIdeaView onShowHub={handleShowHub} />
                 </motion.div>
             )}
              {view === 'detail' && selectedIdea && (
                  <motion.div key="detail" variants={pageVariants} initial="hidden" animate="visible" exit="exit">
                    <IdeaDetailView idea={selectedIdea} onShowHub={handleShowHub} />
                 </motion.div>
             )}
        </AnimatePresence>
    );
}

