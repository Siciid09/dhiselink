"use client";

import React, { useState, useEffect, FC, useRef, ReactNode } from 'react';
import { motion, useAnimation, AnimatePresence, animate, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { supabase } from '@/lib/utils/supabase/client';
import {
    Users, Briefcase, Handshake, Rocket, Code,
    Quote, ArrowRight, ChevronLeft, ChevronRight, ChevronUp, ChevronDown,
    Wrench, Zap, Atom, Wind, Shield, DraftingCompass, Home, Building,
    UserPlus, Search, Link as LinkIcon,
    Plus, Rss, Newspaper, Trophy
} from 'lucide-react';

// =================================================================================================
// 2. UTILITY & REUSABLE ANIMATION COMPONENTS
// =================================================================================================

const cn = (...classes: (string | boolean | undefined)[]) => classes.filter(Boolean).join(' ');
const sectionVariants = { hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut", staggerChildren: 0.2 } } };
const AnimatedSection: FC<{ id?: string, children: ReactNode, className?: string }> = ({ id, children, className = '' }) => { const controls = useAnimation(); const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true }); useEffect(() => { if (inView) { controls.start('visible'); } }, [controls, inView]); return ( <motion.section ref={ref} animate={controls} initial="hidden" variants={sectionVariants} id={id} className={cn("py-12", className)}> <div className="container mx-auto px-6"> {children} </div> </motion.section> ); };
const AnimatedCounter: FC<{ value: number, className?: string }> = ({ value, className }) => { const [count, setCount] = useState(0); const { ref, inView } = useInView({ threshold: 0.5, triggerOnce: true }); useEffect(() => { if (inView) { const controls = animate(0, value, { duration: 2, ease: "easeOut", onUpdate: (latest) => setCount(Math.floor(latest)), }); return () => controls.stop(); } }, [inView, value]); return <span ref={ref} className={className}>{count}</span>; };

// =================================================================================================
// 3. PAGE SECTION COMPONENTS (NOW DYNAMIC)
// =================================================================================================

const FuturisticRobot: FC<{ hatType: string }> = ({ hatType }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isBlinking, setIsBlinking] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!svgRef.current) return;
            const rect = svgRef.current.getBoundingClientRect();
            const svgX = (e.clientX - rect.left) * (400 / rect.width);
            const svgY = (e.clientY - rect.top) * (400 / rect.height);
            setMousePos({ x: svgX, y: svgY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    useEffect(() => {
        const blinkTimer = setInterval(() => {
            setIsBlinking(true);
            setTimeout(() => setIsBlinking(false), 150);
        }, Math.random() * 4000 + 3000);
        return () => clearInterval(blinkTimer);
    }, []);

    const robotCenter = { x: 200, y: 125 };
    const deltaX = mousePos.x - robotCenter.x;
    const deltaY = mousePos.y - robotCenter.y;
    const angle = Math.atan2(deltaY, deltaX);
    const distance = Math.min(10, Math.sqrt(deltaX ** 2 + deltaY ** 2) / 20);
    const eyeOffset = { x: distance * Math.cos(angle), y: distance * Math.sin(angle) };
    const leftShoulder = { x: 115, y: 190 };
    const rightShoulder = { x: 285, y: 190 };
    const leftArmAngle = Math.atan2(mousePos.y - leftShoulder.y, mousePos.x - leftShoulder.x) * (180 / Math.PI) + 90;
    const rightArmAngle = Math.atan2(mousePos.y - rightShoulder.y, mousePos.x - rightShoulder.x) * (180 / Math.PI) + 90;
    const armRotation = {
        left: Math.max(-45, Math.min(135, leftArmAngle)),
        right: Math.max(-135, Math.min(45, rightArmAngle)),
    };

    const Hat: FC<{ type: string }> = ({ type }) => {
        const hatColors: { [key: string]: { fill: string, stroke: string } } = {
            civil: { fill: "#FBBF24", stroke: "#F59E0B" },
            tech: { fill: "#3B82F6", stroke: "#2563EB" },
            safety: { fill: "#22C55E", stroke: "#16A34A" },
            electrical: { fill: "#EF4444", stroke: "#DC2626" },
            chemical: { fill: "#8B5CF6", stroke: "#7C3AED" },
            white: { fill: "#FFFFFF", stroke: "#D1D5DB" },
        };
        const colors = hatColors[type] || hatColors.civil;
        
        // MODIFIED: Use a custom path for the 'civil' hat to make it look like a hard hat
        const hatPath = type === 'civil'
            ? "M 130 100 C 130 60, 270 60, 270 100 L 280 100 Q 280 105, 270 105 L 130 105 Q 120 105, 120 100 Z"
            : "M 140 90 Q 150 50 200 40 Q 250 50 260 90 L 265 100 L 135 100 L 140 90 Z";
        
        return (
            <motion.g initial={{ opacity: 0, y: -20, rotate: -5 }} animate={{ opacity: 1, y: 0, rotate: 0 }} exit={{ opacity: 0, y: -20, rotate: 5 }} transition={{ duration: 0.4, ease: "easeOut" }} >
                <path d={hatPath} fill={colors.fill} stroke={colors.stroke} strokeWidth="2" />
                {type !== 'civil' && <path d="M 135 100 A 70 20 0 0 1 265 100 Z" fill={colors.fill} stroke={colors.stroke} strokeWidth="2" />}
                <rect x="190" y="55" width="20" height="8" rx="2" fill={colors.stroke} />
            </motion.g>
        );
    };

    return (
        <motion.div className="relative w-full max-w-sm sm:max-w-md mx-auto" onHoverStart={() => setIsHovered(true)} onHoverEnd={() => setIsHovered(false)} >
            <motion.div className="absolute inset-0 -z-10" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.8 }} transition={{ duration: 0.4 }} >
                <svg viewBox="0 0 400 400" className="w-full h-full" style={{ filter: 'blur(80px)' }}>
                    <path fill="#F97316" opacity="0.5" d="M364.4,86.6c28.4,46.8,40,103.4,26.6,155.4c-13.3,52-51.6,99.4-98.4,129.3c-46.8,29.9-102.1,42.3-151.2,29.9C92.3,389,49.1,351.8,24.9,306.7C0.7,261.6,-4.6,208.4,11.2,160.7C27,113,63.8,70.8,109.9,45.3C156,19.8,211.4,11,263.8,24.4C316.2,37.8,345.3,73.2,364.4,116.6Z" transform="scale(0.8) translate(50, 50)" />
                </svg>
            </motion.div>
            <svg ref={svgRef} viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto cursor-pointer">
                <defs>
                    <radialGradient id="headGradient" cx="0.4" cy="0.4" r="0.6"><stop offset="0%" stopColor="#FFFFFF" /><stop offset="100%" stopColor="#E5E7EB" /></radialGradient>
                    <linearGradient id="bodyGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#D1D5DB" /><stop offset="100%" stopColor="#9CA3AF" /></linearGradient>
                    <filter id="eyeGlow"><feGaussianBlur stdDeviation="3" result="coloredBlur" /><feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
                    <filter id="robotShadow"><feDropShadow dx="5" dy="10" stdDeviation="5" floodColor="#000000" floodOpacity="0.2" /></filter>
                </defs>
                <motion.g animate={{ y: [0, -4, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} filter="url(#robotShadow)" >
                    <path d="M 200,320 C 150,320 120,280 120,230 L 120,190 H 280 L 280,230 C 280,280 250,320 200,320 Z" fill="url(#bodyGradient)" />
                    <rect x="180" y="170" width="40" height="20" fill="#9CA3AF" /><rect x="175" y="175" width="50" height="4" fill="#6B7280" rx="2" />
                    <motion.g transformOrigin="115 190" animate={{ rotate: isHovered ? armRotation.left : 0 }} transition={{ type: "spring", stiffness: 300, damping: 20 }} ><rect x="100" y="190" width="30" height="80" rx="10" fill="#A0AEC0" /><circle cx="115" cy="190" r="15" fill="#6B7280" /><rect x="90" y="260" width="40" height="20" rx="5" fill="#6B7280" /></motion.g>
                    <motion.g transformOrigin="285 190" animate={{ rotate: isHovered ? armRotation.right : 0 }} transition={{ type: "spring", stiffness: 300, damping: 20 }} ><rect x="270" y="190" width="30" height="80" rx="10" fill="#A0AEC0" /><circle cx="285" cy="190" r="15" fill="#6B7280" /><rect x="270" y="260" width="40" height="20" rx="5" fill="#6B7280" /></motion.g>
                    <circle cx="200" cy="120" r="60" fill="url(#headGradient)" stroke="#9CA3AF" strokeWidth="2" />
                    <motion.path d="M 175 110 L 190 108" stroke="#4B5563" strokeWidth="4" strokeLinecap="round" /><motion.path d="M 210 108 L 225 110" stroke="#4B5563" strokeWidth="4" strokeLinecap="round" />
                    <motion.g animate={{ x: eyeOffset.x, y: eyeOffset.y }} transition={{ type: 'spring', stiffness: 400, damping: 25 }} >
                        <g filter="url(#eyeGlow)"><circle cx="180" cy="125" r="8" fill="#F97316" /><circle cx="220" cy="125" r="8" fill="#F97316" /></g>
                        <motion.rect x="172" y="113" width="16" rx="2" fill="#D1D5DB" initial={{ height: 0 }} animate={{ height: isBlinking ? 24 : 0 }} transition={{ duration: 0.075 }} />
                        <motion.rect x="212" y="113" width="16" rx="2" fill="#D1D5DB" initial={{ height: 0 }} animate={{ height: isBlinking ? 24 : 0 }} transition={{ duration: 0.075 }} />
                    </motion.g>
                    <motion.path stroke="#6B7280" strokeWidth="3" fill="none" strokeLinecap="round" initial={{ d: "M 192 150 Q 200 155 208 150" }} animate={{ d: isHovered ? "M 195 155 L 205 155" : "M 192 150 Q 200 155 208 150" }} transition={{ type: "spring", stiffness: 400, damping: 15 }} />
                    <AnimatePresence mode="wait"><Hat key={hatType} type={hatType} /></AnimatePresence>
                </motion.g>
            </svg>
        </motion.div>
    );
};

const HeroSection: FC = () => {
    const heroContent = [
        { tagline: "Foundation of Progress", title: "Pioneering Civil & Structural Engineering", subtitle: "From towering structures to resilient infrastructure, find the civil engineers shaping our nation's foundation.", hat: "civil" },
        { tagline: "The Digital Frontier", title: "Innovate with World-Class Tech Talent", subtitle: "Find the nation's brightest developers and IT experts to build a thriving digital economy.", hat: "tech" },
        { tagline: "Powering the Future", title: "Excellence in Electrical & Mechanical Roles", subtitle: "Connect with specialists engineering the vital systems that power our homes and industries.", hat: "electrical" },
        { tagline: "Sustainable Development", title: "Leading in Environmental & Safety", subtitle: "Meet the experts dedicated to building a sustainable and secure future for all.", hat: "safety" },
        { tagline: "Blueprints for Tomorrow", title: "Uniting Architects & Urban Planners", subtitle: "A hub for the visionaries designing the spaces where communities live, work, and thrive.", hat: "white" },
        { tagline: "Innovations in Science", title: "Advancing Chemical & Process Engineering", subtitle: "Discover the scientific minds driving industrial innovation and material science.", hat: "chemical" },
    ];
    const [index, setIndex] = useState(0); useEffect(() => { const timer = setInterval(() => { setIndex((prevIndex) => (prevIndex + 1) % heroContent.length); }, 6000); return () => clearInterval(timer); }, []); const currentContent = heroContent[index]; return ( <section className="relative min-h-screen flex flex-col justify-center bg-gray-50 text-gray-900 overflow-hidden pt-20 sm:pt-0"> <div className="absolute inset-0 z-0 overflow-hidden"> {Array.from({ length: 25 }).map((_, i) => { const size = Math.random() * 8 + 4; const duration = Math.random() * 20 + 15; const delay = Math.random() * -duration; const xStart = Math.random() * 100; const yStart = Math.random() * 100; const xEnd = Math.random() * 100; const yEnd = Math.random() * 100; return ( <motion.div key={i} className="absolute rounded-full bg-gray-500/20" style={{ width: size, height: size, top: `${yStart}%`, left: `${xStart}%` }} animate={{ x: [`${xStart}%`, `${xEnd}%`, `${xStart}%`], y: [`${yStart}%`, `${yEnd}%`, `${yStart}%`], }} transition={{ duration, ease: "linear", repeat: Infinity, delay }} /> ); })} </div> <div className="absolute inset-0 -z-10"> <motion.div className="absolute top-[10%] left-[5%] w-60 h-60 bg-amber-200/50 rounded-full" style={{ filter: 'blur(80px)'}} animate={{ x: [0, -30, 50, 0], y: [0, 40, -20, 0], scale: [1, 1.1, 1] }} transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }} /> <motion.div className="absolute bottom-[15%] right-[10%] w-52 h-52 bg-orange-200/50 rounded-full" style={{ filter: 'blur(80px)'}} animate={{ x: [0, 40, -30, 0], y: [0, -50, 20, 0], rotate: [0, 90, 0] }} transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut', delay: 5 }} /> </div> <div className="container mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-x-12 items-center"> <div className="text-center lg:text-left"> <AnimatePresence mode="wait"> <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0, transition: { staggerChildren: 0.1, duration: 0.5, ease: "easeOut" } }} exit={{ opacity: 0, y: -20, transition: { duration: 0.4 } }} className="w-full" > <motion.div variants={sectionVariants} className="inline-block px-3 py-1 mb-4 border border-gray-200 bg-white/50 backdrop-blur-lg rounded-full text-sm font-medium text-gray-700"> {currentContent.tagline} </motion.div> <div className="min-h-[220px] sm:min-h-[240px]"> <motion.h1 variants={sectionVariants} className="text-4xl md:text-6xl font-extrabold tracking-tighter text-gray-900 mb-6"> {currentContent.title} </motion.h1> <motion.p variants={sectionVariants} className="text-lg text-gray-600 max-w-lg mx-auto lg:mx-0"> {currentContent.subtitle} </motion.p> </div> </motion.div> </AnimatePresence> <motion.div className="flex flex-col sm:flex-row justify-center lg:justify-start items-center gap-4 mt-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} > <motion.a href="#jobs" className="group w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-orange-500 text-white font-bold rounded-lg shadow-lg shadow-orange-500/30" whileHover={{ scale: 1.05, y: -3, boxShadow: "0 10px 20px rgba(249, 115, 22, 0.4)" }} transition={{ type: "spring", stiffness: 300, damping: 15 }} > Explore Opportunities <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" /> </motion.a> <motion.a href="#professionals" className="group w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-gray-800 text-white font-bold rounded-lg" whileHover={{ scale: 1.05, y: -3 }} transition={{ type: "spring", stiffness: 300, damping: 15 }} > Find Talent </motion.a> </motion.div> </div> <div className="flex justify-center items-center mt-12 lg:mt-0"> <FuturisticRobot hatType={currentContent.hat} /> </div> </div> </section> ); };

const CoreSectorsSection: FC = () => {
    // MODIFIED: Added descriptions back to the sectors data
    const sectors = [
        { name: "Civil Engineering", description: "Building the foundations of our nation, from roads to reservoirs." },
        { name: "IT & Software", description: "Driving digital transformation with code and cutting-edge technology." },
        { name: "Energy & Utilities", description: "Powering progress by managing and innovating our energy resources." },
        { name: "Architecture", description: "Designing the aesthetic and functional spaces for communities to thrive." },
        { name: "Environmental", description: "Protecting and sustaining our natural resources for future generations." },
        { name: "Mechanical", description: "Engineering the machinery and systems that keep industries moving." },
        { name: "Surveying", description: "Mapping our land to provide the blueprint for all development." },
        { name: "Research", description: "Advancing knowledge and innovation through scientific discovery." },
    ];
    const iconMap: { [key: string]: React.ElementType } = { Building, Code, Zap, Home, Shield, Wrench, DraftingCompass, Atom };

    return (
        <AnimatedSection id="sectors" className="bg-white">
            <motion.h2 variants={sectionVariants} className="text-4xl md:text-5xl font-bold text-center mb-4 text-gray-800">Core Development Sectors</motion.h2>
            <motion.p variants={sectionVariants} className="text-lg text-gray-600 text-center max-w-2xl mx-auto mb-16"> Explore the key disciplines driving national growth. </motion.p>
            {/* MODIFIED: Grid changed to 2/4 columns and cards updated to include description */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {sectors.map(sector => {
                    const IconComponent = iconMap[sector.name.split(' ')[0]] || Atom;
                    return (
                        <motion.div key={sector.name} variants={sectionVariants} className="p-6 bg-gray-50 rounded-2xl border border-gray-200 group hover:bg-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                            <div className="flex items-center justify-center w-16 h-16 bg-orange-100 text-orange-500 rounded-full mb-4">
                                <IconComponent className="h-8 w-8" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">{sector.name}</h3>
                            <p className="text-sm text-gray-600 mt-2">{sector.description}</p>
                        </motion.div>
                    )
                })}
            </div>
        </AnimatedSection>
    )
};

const FeaturedCompaniesSection: FC = () => {
    const [companies, setCompanies] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // MODIFIED: Fetch 8 companies instead of 4
        const fetchCompanies = async () => {
            const { data, error } = await supabase.from('profiles').select('organization_name, id').not('organization_name', 'is', null).limit(8);
            if (error) { console.error("Error fetching companies", error); setLoading(false); return; }
            const companiesWithJobs = await Promise.all(
                data.map(async (company) => {
                    const { count } = await supabase.from('jobs').select('*', { count: 'exact', head: true }).eq('organization_name', company.organization_name);
                    return { ...company, jobs: count || 0, logoUrl: `https://logo.clearbit.com/${company.organization_name.toLowerCase().replace(/ /g, '')}.com?size=150`, description: "A leading institution driving economic growth and innovation in the region." };
                })
            );
            setCompanies(companiesWithJobs);
            setLoading(false);
        };
        fetchCompanies();
    }, []);

    if (loading) return <div className="py-20 bg-gray-50 text-center">Loading featured companies...</div>;

    return (
        <AnimatedSection id="companies" className="bg-gray-50">
            {/* MODIFIED: Title changed */}
            <motion.h2 variants={sectionVariants} className="text-4xl md:text-5xl font-bold text-gray-800 text-center mb-4"> Our Top Organizations </motion.h2>
            <motion.p variants={sectionVariants} className="text-lg text-gray-600 text-center max-w-2xl mx-auto mb-16"> Meet some of the leading institutions actively building their teams. </motion.p>
            {/* MODIFIED: New grid and card layout */}
            <div className="grid md:grid-cols-2 gap-6">
                {companies.map(company => (
                    <motion.div key={company.id} variants={sectionVariants} className="bg-white p-6 rounded-2xl border border-gray-200 flex items-start gap-5">
                        <img src={company.logoUrl} alt={company.organization_name} className="w-16 h-16 object-contain flex-shrink-0" onError={(e) => { (e.target as HTMLImageElement).src = 'https://logo.clearbit.com/clearbit.com?size=150' }} />
                        <div className="flex-grow">
                            <h3 className="text-xl font-bold text-gray-900">{company.organization_name}</h3>
                            <p className="text-gray-600 mt-1 mb-4 text-sm">{company.description}</p>
                            <a href="#" className="font-semibold text-orange-500 bg-orange-100 px-4 py-2 rounded-lg inline-block text-sm">View {company.jobs} open positions</a>
                        </div>
                    </motion.div>
                ))}
            </div>
        </AnimatedSection>
    )
}

const CareerResourcesSection: FC = () => {
    type ResourceItem = { title: string; category: string; cover_image_url: string };
    const [resources, setResources] = useState<{ ideas: ResourceItem[]; jobs: ResourceItem[]; heritage: ResourceItem[] }>({ ideas: [], jobs: [], heritage: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResources = async () => {
            const [{data: ideasData}, {data: jobsData}, {data: heritageData}] = await Promise.all([
                supabase.from('ideas').select('title, category, cover_image_url').order('created_at', { ascending: false }).limit(5),
                supabase.from('jobs').select('title, category, cover_image_url').order('created_at', { ascending: false }).limit(5),
                supabase.from('heritage_sites').select('title, category, cover_image_url').order('created_at', { ascending: false }).limit(5)
            ]);
            setResources({ ideas: ideasData || [], jobs: jobsData || [], heritage: heritageData || [] });
            setLoading(false);
        };
        fetchResources();
    }, []);

    if (loading) return <div className="py-20 bg-white text-center">Loading resources...</div>;

    const VerticalSlideshowCard: FC<{ items: ResourceItem[] }> = ({ items }) => { const [index, setIndex] = useState(0); const next = () => setIndex(prev => (prev + 1) % items.length); const prev = () => setIndex(prev => (prev - 1 + items.length) % items.length); useEffect(() => { if (items.length <= 1) return; const timer = setInterval(next, 4000); return () => clearInterval(timer); }, [items]); if (items.length === 0) return <div className="h-96 bg-gray-100 rounded-2xl border flex items-center justify-center text-gray-500">No items to display.</div>; return ( <div className="relative h-96 bg-gray-100 rounded-2xl overflow-hidden border border-gray-200 group"> <AnimatePresence initial={false}> <motion.div key={index} initial={{ y: "100%", opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: "-100%", opacity: 0 }} transition={{ type: "spring", stiffness: 400, damping: 40 }} className="absolute inset-0" > <img src={items[index].cover_image_url} alt={items[index].title} className="w-full h-full object-cover"/> <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"/> <div className="absolute bottom-0 left-0 p-6 text-white"> <p className="text-sm font-semibold opacity-80 mb-1">{items[index].category}</p> <h3 className="text-lg font-bold">{items[index].title}</h3> </div> </motion.div> </AnimatePresence> <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity"> <button onClick={prev} className="p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition"><ChevronUp size={16}/></button> <button onClick={next} className="p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition"><ChevronDown size={16}/></button> </div> </div> ) }
    const MobileResourceTabs: FC<{resources: any}> = ({resources}) => { const [activeTab, setActiveTab] = useState<'ideas' | 'jobs' | 'heritage'>('ideas'); const [index, setIndex] = useState(0); const tabs = [ { id: 'ideas', label: 'Ideas', icon: Rss }, { id: 'jobs', label: 'Jobs', icon: Briefcase }, { id: 'heritage', label: 'Heritage', icon: Trophy }, ]; useEffect(() => { setIndex(0); if (!resources[activeTab] || resources[activeTab].length === 0) return; const timer = setInterval(() => { setIndex(prev => (prev + 1) % resources[activeTab].length); }, 4000); return () => clearInterval(timer); }, [activeTab, resources]); if (!resources[activeTab] || resources[activeTab].length === 0) return <div className="h-80 rounded-2xl border flex items-center justify-center text-gray-500">No items in this category.</div>; const currentItem = resources[activeTab][index]; return ( <div className="w-full"> <div className="flex justify-center gap-2 mb-6"> {tabs.map(tab => ( <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={cn("px-4 py-2 text-sm font-semibold rounded-full transition-colors flex items-center gap-2", activeTab === tab.id ? "bg-orange-500 text-white" : "bg-white text-gray-700 hover:bg-gray-200" )}> <tab.icon size={16}/> {tab.label} </button> ))} </div> <div className="relative h-80 rounded-2xl overflow-hidden border border-gray-200"> <AnimatePresence> <motion.div key={activeTab + index} initial={{ opacity: 0.5, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, ease: 'easeInOut' }} className="absolute inset-0" > <img src={currentItem.cover_image_url} alt={currentItem.title} className="w-full h-full object-cover"/> <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"/> <div className="absolute bottom-0 left-0 p-6 text-white"> <p className="text-sm font-semibold opacity-80 mb-1">{currentItem.category}</p> <h3 className="text-lg font-bold">{currentItem.title}</h3> </div> </motion.div> </AnimatePresence> </div> </div> ) }

    return (
        <AnimatedSection id="resources" className="bg-white">
            <motion.h2 variants={sectionVariants} className="text-4xl md:text-5xl font-bold text-gray-800 text-center mb-4"> Career Resources & Insights </motion.h2>
            <motion.p variants={sectionVariants} className="text-lg text-gray-600 text-center max-w-2xl mx-auto mb-16"> Stay ahead with expert advice, industry trends, and success stories. </motion.p>
            {/* MODIFIED: Added titles above each card */}
            <div className="hidden md:grid md:grid-cols-3 gap-8">
                <div>
                    <h3 className="text-2xl font-bold text-center mb-4 text-gray-800">Ideas</h3>
                    <motion.div variants={sectionVariants}><VerticalSlideshowCard items={resources.ideas} /></motion.div>
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-center mb-4 text-gray-800">Jobs</h3>
                    <motion.div variants={sectionVariants}><VerticalSlideshowCard items={resources.jobs} /></motion.div>
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-center mb-4 text-gray-800">Heritage</h3>
                    <motion.div variants={sectionVariants}><VerticalSlideshowCard items={resources.heritage} /></motion.div>
                </div>
            </div>
            <div className="md:hidden">
                <MobileResourceTabs resources={resources} />
            </div>
        </AnimatedSection>
    )
};

const CTASection: FC = () => (
    <div className="bg-gray-900">
        <div className="container mx-auto px-6 py-20 md:py-28">
            <div className="relative text-center">
                <motion.h2 initial={{opacity:0, y:20}} whileInView={{opacity:1, y:0}} viewport={{ once: true }} transition={{delay:0.2}} className="text-4xl md:text-5xl font-extrabold text-white mb-4"> Join the Movement to Build a Better Somaliland </motion.h2>
                <motion.p initial={{opacity:0, y:20}} whileInView={{opacity:1, y:0}} viewport={{ once: true }} transition={{delay:0.3}} className="text-lg text-gray-300 max-w-xl mx-auto mb-8"> Register today and become part of the development revolution. </motion.p>
                <motion.div initial={{opacity:0, y:20}} whileInView={{opacity:1, y:0}} viewport={{ once: true }} transition={{delay:0.4}} className="flex flex-col sm:flex-row justify-center items-center gap-4">
                    <motion.a whileHover={{ scale: 1.05, y: -2 }} href="/register" className="w-full sm:w-auto bg-white text-gray-900 font-bold px-8 py-4 rounded-xl shadow-lg"> Join as a Professional </motion.a>
                    <motion.a whileHover={{ scale: 1.05, y: -2 }} href="/register" className="w-full sm:w-auto bg-transparent border-2 border-gray-500 text-white font-bold px-8 py-4 rounded-xl"> Register an Institution </motion.a>
                </motion.div>
            </div>
        </div>
    </div>
);

// =================================================================================================
// 4. MAIN PAGE COMPONENT
// =================================================================================================

export default function HomePage() {
    return (
        <>
            <HeroSection />
            <CoreSectorsSection />
            <FeaturedCompaniesSection />
            <CareerResourcesSection />
            <CTASection />
        </>
    );
}