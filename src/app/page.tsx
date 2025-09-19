// File Path: app/page.tsx

"use client";

import React, { useState, useEffect, FC } from 'react';
import { motion, useAnimation, AnimatePresence, animate } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
    Users, Briefcase, Handshake, Rocket, Code, HardHat, GitBranch,
    Zap, Quote, Plus, ArrowRight, Globe2
} from 'lucide-react';

// --- 1. DATA ---

const partners = [
    { name: "Ministry of Public Works", logoUrl: `https://logo.clearbit.com/somalilanddevelopmentfund.org?size=100&greyscale=true` },
    { name: "SIMAD University", logoUrl: `https://logo.clearbit.com/simad.edu.so?size=100&greyscale=true` },
    { name: "University of Mogadishu", logoUrl: `https://logo.clearbit.com/mogadishuuniversity.edu.so?size=100&greyscale=true`},
    { name: "Premier Bank", logoUrl: `https://logo.clearbit.com/premierbank.so?size=100&greyscale=true` },
    { name: "UN Development Programme", logoUrl: `https://logo.clearbit.com/undp.org?size=100&greyscale=true` },
    { name: "Dahabshiil Group", logoUrl: `https://logo.clearbit.com/dahabshiil.com?size=100&greyscale=true` },
    { name: "Hormuud Telecom", logoUrl: `https://logo.clearbit.com/hormuud.com?size=100&greyscale=true` },
];

const ecosystemStats = [
    { value: 2500, label: "Professionals", suffix: "+", icon: <Users/> },
    { value: 620, label: "Opportunities", suffix: "+", icon: <Briefcase/> },
    { value: 150, label: "Institutions", suffix: "+", icon: <Handshake/> },
    { value: 85, label: "Projects", suffix: "+", icon: <Rocket/> },
];

const sectorsData = [
    {
        name: "Infrastructure & Construction",
        icon: <HardHat className="text-blue-500"/>,
        description: "Building the nation's foundational structures, from public works and transport to commercial real estate.",
        imageUrls: [
            "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1522202685239-4434255a77c2?q=80&w=800&auto=format&fit=crop"
        ],
        stats: [
            { subField: "Construction Management", opportunities: 180 },
            { subField: "Urban Planning & Design", opportunities: 90 },
            { subField: "Water & Sanitation Works", opportunities: 80 },
        ]
    },
    {
        name: "Software & Digital Systems",
        icon: <Code className="text-green-500"/>,
        description: "Building the digital backbone of the nation, from mobile applications and fintech to cloud computing.",
        imageUrls: [
            "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800&auto=format&fit=crop"
        ],
        stats: [
            { subField: "Fintech & Mobile Apps", opportunities: 120 },
            { subField: "Cybersecurity & Networks", opportunities: 70 },
            { subField: "Cloud & DevOps", opportunities: 60 },
        ]
    }
];

const heroImages = [
    "https://images.unsplash.com/photo-1581092916322-3c34a2e28892?q=80&w=1920&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1920&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=1920&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1518152006812-edab29b069ac?q=80&w=1920&auto=format&fit=crop",
];

const heroContent = [
    { tagline: "Engineering a Stronger Nation", title: "Powering National Infrastructure.", subtitle: "Connecting engineers, managers, and planners to the projects that shape our cities and supply lines." },
    { tagline: "The Digital Revolution is Here", title: "Innovate with Somaliland Tech Talent.", subtitle: "Find the nation's brightest developers, IT experts, and digital innovators to build a thriving digital economy." },
    { tagline: "Designing Our Future Cities", title: "Shaping Tomorrow's Urban Landscapes.", subtitle: "From sustainable architecture to smart city planning, discover the talent defining our urban future." },
    { tagline: "Sustainable Energy for All", title: "Leading the Charge in Green Energy.", subtitle: "Explore opportunities in renewable energy and connect with experts driving Somaliland's green transition." }
];

const opportunities = [
    { type: 'GOV', title: 'Senior Urban Planner', org: 'Ministry of Public Works', location: 'Mogadishu' },
    { type: 'NGO', title: 'Water & Sanitation Engineer', org: 'Mercy Corps', location: 'Baidoa' },
    { type: 'JOB', title: 'Lead Full-Stack Developer (Fintech)', org: 'Premier Bank', location: 'Hargeisa' },
];

const testimonialsData = [
   { name: 'Asha Hussein', role: 'Project Manager, Ministry of Public Works', quote: "Dhiselink is the critical link we needed. It connects public sector projects with the private sector expertise required to execute them efficiently. It&apos;s accelerating national progress." },
   { name: 'Dr. Ahmed Jama', role: 'Director, National Planning Institute', quote: "Our graduates have a direct bridge to impactful careers. Dhiselink is vital for retaining our nation&apos;s top talent." },
   { name: 'Omar Yusuf', role: 'Founder, Saafi Solar', quote: "Through the platform, we found two brilliant engineers who are now core members of our startup. The talent here is exceptional." }
];

const faqData = [
    { q: "Who can join Dhiselink?", a: "Dhiselink is for professionals, companies, NGOs, and government bodies involved in building Somaliland&apos;s future across all development sectors." },
    { q: "Is this platform only for engineers?", a: "Not at all. We serve architects, planners, project managers, policy makers, tech innovators, and many other professions essential for national development." },
    { q: "How are opportunities verified?", a: "Our team verifies all institutions and postings to ensure they are legitimate and meet our quality standards, providing a safe and reliable environment." },
];

// --- 2. REUSABLE UI & ANIMATION COMPONENTS ---
const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut", staggerChildren: 0.2 } }
};

const AnimatedSection: FC<{ id?: string, children: React.ReactNode, className?: string }> = ({ id, children, className = '' }) => {
    const controls = useAnimation();
    const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });

    useEffect(() => {
        if (inView) { controls.start('visible'); }
    }, [controls, inView]);

    return (
        <section id={id} className={`py-16 md:py-20 relative ${className}`}>
            <motion.div ref={ref} animate={controls} initial="hidden" variants={sectionVariants} className="container mx-auto px-6">
                {children}
            </motion.div>
        </section>
    );
};

const AnimatedCounter: FC<{ value: number, className?: string }> = ({ value, className }) => {
    const [count, setCount] = useState(0);
    const { ref, inView } = useInView({ threshold: 0.5, triggerOnce: true });

    useEffect(() => {
        if (inView) {
            const controls = animate(0, value, {
                duration: 2.5,
                ease: "easeOut",
                onUpdate: (latest) => setCount(Math.floor(latest)),
            });
            return () => controls.stop();
        }
    }, [inView, value]);
    
    return <span ref={ref} className={className}>{count}</span>;
};

// --- 3. PAGE SECTION COMPONENTS ---

const HeroSection = () => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const currentContent = heroContent[currentImageIndex];

    return (
        <section id="home" className="relative h-[90vh] md:h-screen flex items-center justify-center text-center overflow-hidden">
            <AnimatePresence>
                <motion.div
                    key={currentImageIndex}
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 1.1, opacity: 0 }}
                    transition={{ duration: 1.5, ease: [0.43, 0.13, 0.23, 0.96] }}
                    style={{ backgroundImage: `url(${heroImages[currentImageIndex]})` }}
                    className="absolute inset-0 bg-cover bg-center"
                >
                    <div className="absolute inset-0 bg-black/60"></div>
                </motion.div>
            </AnimatePresence>
            
            <div className="container mx-auto px-6 relative z-10">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentImageIndex}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeInOut", staggerChildren: 0.2 } }}
                        exit={{ opacity: 0, y: -20, transition: { duration: 0.4 } }}
                        className="max-w-4xl mx-auto"
                    >
                        <motion.div variants={itemVariants} className="inline-block bg-white/10 text-white text-sm font-semibold px-4 py-1.5 rounded-full mb-4 border border-white/20">
                            {currentContent.tagline}
                        </motion.div>
                        <motion.h1 variants={itemVariants} className="text-4xl md:text-6xl font-extrabold tracking-tighter text-white leading-tight mb-6 shadow-2xl">
                            {currentContent.title}
                        </motion.h1>
                        <motion.p variants={itemVariants} className="max-w-3xl mx-auto text-base md:text-lg text-gray-200 mb-10">
                            {currentContent.subtitle}
                        </motion.p>
                        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-center items-center gap-4">
                            <motion.a href="/opportunities" whileHover={{ scale: 1.05 }} className="w-full sm:w-auto bg-blue-600 text-white font-bold px-8 py-3.5 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                                Explore Jobs
                            </motion.a>
                            <motion.a href="/professionals" whileHover={{ scale: 1.05 }} className="w-full sm:w-auto bg-white/10 backdrop-blur-sm text-white font-semibold px-8 py-3.5 rounded-lg border border-white/20 hover:bg-white/20 transition-all duration-300">
                                Find Talent
                            </motion.a>
                        </motion.div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </section>
    );
};

const PartnersSection = () => (
    <section className="py-12 bg-white">
        <div className="container mx-auto px-6">
            <p className="text-center font-semibold text-gray-500 mb-8 uppercase tracking-wider text-sm">Trusted by leading organizations in the public & private sectors</p>
            <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6">
                {partners.map((partner) => (
                    <img key={partner.name} src={partner.logoUrl} alt={partner.name} className="h-8 object-contain" />
                ))}
            </div>
        </div>
    </section>
);

const EcosystemSection = () => (
    <AnimatedSection id="ecosystem" className="bg-gray-50">
        <div className="text-center mb-12">
            <motion.h2 variants={itemVariants} className="text-3xl lg:text-5xl font-bold tracking-tight text-gray-900">A Thriving National Ecosystem</motion.h2>
            <motion.p variants={itemVariants} className="mt-4 text-base md:text-lg text-gray-600 max-w-2xl mx-auto">Our platform is the trusted engine for the nation&apos;s brightest minds and most impactful institutions.</motion.p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {ecosystemStats.map((stat) => (
                <motion.div key={stat.label} variants={itemVariants} className="bg-white p-4 md:p-6 rounded-lg border border-gray-200/80 text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <div className="mx-auto w-12 h-12 md:w-14 md:h-14 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full mb-3">
                        {React.cloneElement(stat.icon, { size: 28 })}
                    </div>
                    <h3 className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-900">
                        <AnimatedCounter value={stat.value} />{stat.suffix}
                    </h3>
                    <p className="mt-1 text-xs md:text-sm text-gray-500">{stat.label}</p>
                </motion.div>
            ))}
        </div>
    </AnimatedSection>
);

const SectorsSection = () => {
    const [activeSectorIndex, setActiveSectorIndex] = useState(0);
    const [currentSubIndex, setCurrentSubIndex] = useState(0);

    const activeSector = sectorsData[activeSectorIndex];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSubIndex(prev => (prev + 1) % activeSector.stats.length);
        }, 3500);
        return () => clearInterval(timer);
    }, [activeSectorIndex, activeSector.stats.length]);
    
    const currentStat = activeSector.stats[currentSubIndex];
    const currentImage = activeSector.imageUrls[currentSubIndex];
    
    return (
        <AnimatedSection id="sectors" className="bg-white">
            <div className="text-center mb-12">
                <motion.h2 variants={itemVariants} className="text-3xl lg:text-5xl font-bold tracking-tight text-gray-900">Core Development Sectors</motion.h2>
                <motion.p variants={itemVariants} className="mt-4 text-base md:text-lg text-gray-600 max-w-3xl mx-auto">Explore the key disciplines driving Somaliland&apos;s growth, find specific opportunities, and connect with sector leaders.</motion.p>
            </div>
            <div className="grid lg:grid-cols-3 gap-8">
                <motion.div variants={itemVariants} className="lg:col-span-1">
                    <ul className="space-y-2">
                        {sectorsData.map((sector, index) => (
                            <li key={sector.name}>
                                <button
                                    onClick={() => { setActiveSectorIndex(index); setCurrentSubIndex(0); }}
                                    className={`w-full text-left p-4 rounded-lg transition-all duration-300 flex items-start gap-4 ${activeSectorIndex === index ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-100 hover:bg-gray-200'}`}
                                >
                                    <div className="flex-shrink-0 mt-1">{sector.icon}</div>
                                    <div>
                                        <h3 className="font-bold">{sector.name}</h3>
                                        <p className={`text-sm ${activeSectorIndex === index ? 'text-blue-200' : 'text-gray-500'}`}>{sector.description}</p>
                                    </div>
                                </button>
                            </li>
                        ))}
                    </ul>
                </motion.div>
                <motion.div variants={itemVariants} className="lg:col-span-2">
                    <div className="bg-gray-100 rounded-lg overflow-hidden h-full flex flex-col shadow-xl">
                         <div className="h-64 w-full overflow-hidden relative">
                             <AnimatePresence>
                                <motion.img
                                    key={currentImage}
                                    src={currentImage}
                                    alt={activeSector.name}
                                    initial={{ opacity: 0, scale: 1.1 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.7, ease: 'easeInOut' }}
                                    className="w-full h-full object-cover absolute inset-0"
                                />
                             </AnimatePresence>
                        </div>
                        <div className="p-8 flex flex-col flex-grow">
                            <h3 className="text-2xl font-bold mb-4">{activeSector.name}</h3>
                            <AnimatePresence mode="wait">
                                <motion.div key={currentStat.subField} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                                    <p className="text-2xl font-bold text-blue-600">{currentStat.opportunities}+</p>
                                    <p className="text-lg font-semibold text-gray-800">{currentStat.subField}</p>
                                </motion.div>
                            </AnimatePresence>
                            <motion.a 
                                key={activeSector.name}
                                href="#" 
                                whileHover={{ scale: 1.05 }}
                                className="w-full text-center bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-300 block mt-auto"
                             >
                                Explore {activeSector.name}
                            </motion.a>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatedSection>
    );
};

const OpportunitiesSection = () => {
    const typeStyles: { [key: string]: string } = {
        'JOB': 'bg-blue-100 text-blue-800', 'NGO': 'bg-yellow-100 text-yellow-800', 'GOV': 'bg-gray-200 text-gray-800',
    };
    return (
        <AnimatedSection id="opportunities" className="bg-gray-50">
            <div className="text-center">
                <motion.h2 variants={itemVariants} className="text-3xl lg:text-5xl font-bold tracking-tight mb-4">Latest Jobs</motion.h2>
                <motion.p variants={itemVariants} className="text-gray-600 mb-12 max-w-2xl mx-auto">Discover curated roles from leading institutions across all sectors.</motion.p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {opportunities.map((item, i) => (
                    <motion.div variants={itemVariants} whileHover={{ y: -5, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }} key={`${item.title}-${i}`} className="bg-white border border-gray-200 rounded-lg p-6 group transition-all duration-300 shadow-lg">
                        <span className={`text-xs font-bold py-1 px-3 rounded-full ${typeStyles[item.type]}`}>{item.type}</span>
                        <h3 className="text-lg font-bold my-3 text-gray-900">{item.title}</h3>
                        <p className="text-sm text-gray-500 mb-4">{item.org} &bull; {item.location}</p>
                        <a href="#" className="font-semibold text-blue-600 flex items-center gap-2">View Details <ArrowRight size={16} /></a>
                    </motion.div>
                ))}
            </div>
             <motion.div variants={itemVariants} className="text-center mt-12">
                <a href="/opportunities" className="bg-blue-600 text-white font-bold px-8 py-3.5 rounded-lg hover:bg-blue-700 transition-all duration-300">View All Jobs</a>
            </motion.div>
        </AnimatedSection>
    );
};

const TestimonialsSection = () => (
    <AnimatedSection id="testimonials" className="bg-white">
        <div className="relative">
            <Quote className="absolute top-0 left-0 text-gray-100 w-32 h-32 opacity-75 transform -translate-x-12 -translate-y-12" />
            <div className="text-center mb-12 relative z-10">
                <motion.h2 variants={itemVariants} className="text-3xl lg:text-5xl font-bold tracking-tight">Voices from Our Community</motion.h2>
                <motion.p variants={itemVariants} className="text-gray-600 mt-4 max-w-xl mx-auto">Hear how Dhiselink is making a tangible impact on careers and projects.</motion.p>
            </div>
            <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">{testimonialsData.map((t) => (
                <motion.div key={t.name} variants={itemVariants} className="bg-gray-50 p-8 rounded-lg border border-gray-200 shadow-xl">
                    <p className="text-gray-700 italic mb-6">&quot;{t.quote}&quot;</p>
                    <div>
                        <h4 className="font-bold text-gray-900">{t.name}</h4>
                        <p className="text-sm text-blue-600 font-medium">{t.role}</p>
                    </div>
                </motion.div>
            ))}</div>
        </div>
    </AnimatedSection>
);

const FAQSection = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);
    const AccordionItem: FC<{ item: { q: string, a: string }, isOpen: boolean, onClick: () => void }> = ({ item, isOpen, onClick }) => (
        <motion.div variants={itemVariants} className="border-b border-gray-200/80 py-6">
            <button onClick={onClick} className="w-full flex justify-between items-center text-left">
                <span className="text-lg font-medium text-gray-900">{item.q}</span>
                <motion.div animate={{ rotate: isOpen ? 45 : 0 }}><Plus className="text-blue-600" /></motion.div>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginTop: '16px' }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        className="overflow-hidden text-gray-600"
                    >
                        {item.a}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );

    return (
        <AnimatedSection id="faq" className="bg-gray-50">
            <div className="max-w-4xl mx-auto">
                 <div className="text-center mb-12">
                      <motion.h2 variants={itemVariants} className="text-3xl lg:text-5xl font-bold tracking-tight">Common Questions</motion.h2>
                      <motion.p variants={itemVariants} className="text-gray-600 mt-4">Find answers to common questions about Dhiselink.</motion.p>
                 </div>
                 <div className="mt-8 bg-white p-8 rounded-lg shadow-xl border border-gray-200/80">
                      {faqData.map((item, index) => (<AccordionItem key={index} item={item} isOpen={openIndex === index} onClick={() => setOpenIndex(openIndex === index ? null : index)} />))}
                 </div>
            </div>
        </AnimatedSection>
    );
};

const CTASection = () => (
    <AnimatedSection id="contact" className="bg-white !pt-12 !pb-16">
        <div className="relative bg-gray-800 rounded-lg p-12 text-center overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
            <motion.h2 variants={itemVariants} className="text-3xl md:text-5xl font-extrabold text-white tracking-tighter mb-4 relative z-10">Join the Movement to Build a Better Somaliland</motion.h2>
            <motion.p variants={itemVariants} className="text-gray-300 max-w-xl mx-auto mb-8 relative z-10">Register as a professional or an institution and become part of Somaliland&apos;s development revolution.</motion.p>
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-center items-center gap-4 relative z-10">
                <motion.a whileHover={{ scale: 1.05 }} href="/register" className="w-full sm:w-auto bg-blue-600 text-white font-bold px-8 py-3.5 rounded-lg hover:bg-blue-700 transition-all duration-300">
                    Register as a Professional
                </motion.a>
                <motion.a whileHover={{ scale: 1.05 }} href="/register" className="w-full sm:w-auto bg-gray-700 text-white font-semibold px-8 py-3.5 rounded-lg hover:bg-gray-600 transition-all duration-300">
                    Register an Institution
                </motion.a>
            </motion.div>
        </div>
    </AnimatedSection>
);

// --- 4. MAIN APP COMPONENT ---

export default function HomePage() {
    return (
        <>
            <HeroSection />
            <PartnersSection />
            <EcosystemSection />
            <SectorsSection />
            <OpportunitiesSection />
            <TestimonialsSection />
            <FAQSection />
            <CTASection />
        </>
    );
}