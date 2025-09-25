"use client";

import React, { useState, useEffect, FC, useRef, ReactNode } from 'react';
import { motion, useAnimation, AnimatePresence, animate, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
    Users, Briefcase, Handshake, Rocket, Code,
    Quote, ArrowRight, ChevronLeft, ChevronRight, ChevronUp, ChevronDown,
    Wrench, Zap, Atom, Wind, Shield, DraftingCompass, Home, Building,
    UserPlus, Search, Link as LinkIcon,
    Plus, Rss, Newspaper, Trophy
} from 'lucide-react';

// =================================================================================================
// 1. MOCK DATA
// =================================================================================================

const heroContent = [
    { tagline: "Building a Stronger Nation", title: "Pioneering Civil & Structural Engineering", subtitle: "From towering structures to resilient infrastructure, find the civil engineers shaping our nation's foundation.", hat: "civil" },
    { tagline: "The Digital Revolution is Here", title: "Innovate with World-Class Tech Talent", subtitle: "Find the nation's brightest developers, IT experts, and digital innovators to build a thriving digital economy.", hat: "tech" },
    { tagline: "Safety & Sustainability First", title: "Leading in Environmental & Safety Roles", subtitle: "Connect with safety officers and environmental experts dedicated to building a sustainable and secure future.", hat: "safety" }
];
const partners = [
    { name: "Ministry of Public Works", logoUrl: `https://logo.clearbit.com/somalilanddevelopmentfund.org?size=100` }, { name: "SIMAD University", logoUrl: `https://logo.clearbit.com/simad.edu.so?size=100` }, { name: "University of Mogadishu", logoUrl: `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGBLjNILyuhtmvqy-IaYCqSThtbma2vO84kQ&s?size=100` }, { name: "Premier Bank", logoUrl: `https://logo.clearbit.com/premierbank.so?size=100` }, { name: "UN Development Programme", logoUrl: `https://logo.clearbit.com/undp.org?size=100` }, { name: "Dahabshiil Group", logoUrl: `https://logo.clearbit.com/dahabshiil.com?size=100` }, { name: "Hormuud Telecom", logoUrl: `https://logo.clearbit.com/hormuud.com?size=100` }, { name: "World Bank", logoUrl: `https://logo.clearbit.com/worldbank.org?size=100` }, { name: "Golis Telecom", logoUrl: `https://logo.clearbit.com/golis.so?size=100` },
];
const ecosystemStats = [
    { value: 2500, label: "Professionals", suffix: "+", icon: <Users /> }, { value: 620, label: "Opportunities", suffix: "+", icon: <Briefcase /> }, { value: 150, label: "Institutions", suffix: "+", icon: <Handshake /> }, { value: 85, label: "Projects", suffix: "+", icon: <Rocket /> },
];
const sectorsData = [
    { name: "Civil Engineering", icon: Building, description: "Designing and constructing public works like roads, bridges, and water systems.", stat: "80+ Projects" }, { name: "Software Development", icon: Code, description: "Building the digital backbone of the nation, from fintech to cloud computing.", stat: "120+ Opportunities" }, { name: "Electrical Engineering", icon: Zap, description: "Powering industries with skilled electricians and power systems specialists.", stat: "70+ Partners" }, { name: "Mechanical Engineering", icon: Wrench, description: "Developing machines, tools, and systems for manufacturing and industrial processes.", stat: "50+ Roles" }, { name: "Environmental & Safety", icon: Shield, description: "Ensuring sustainable practices and workplace safety across all sectors.", stat: "45+ Certifications" }, { name: "Urban Planning", icon: Home, description: "Shaping the growth of cities with strategic design and sustainable development.", stat: "30+ Initiatives" }, { name: "Renewable Energy", icon: Wind, description: "Harnessing wind, solar, and other green resources to power the future.", stat: "25+ Plants" }, { name: "Chemical Engineering", icon: Atom, description: "Transforming raw materials into valuable products for industrial and consumer use.", stat: "20+ Facilities" }, { name: "Architecture & Design", icon: DraftingCompass, description: "Creating innovative and functional spaces for living and working.", stat: "60+ Firms" },
];
const opportunities = [
    { type: 'GOV', title: 'Senior Urban Planner', org: 'Ministry of Public Works', location: 'Mogadishu' }, { type: 'NGO', title: 'Water & Sanitation Engineer', org: 'Mercy Corps', location: 'Baidoa' }, { type: 'JOB', title: 'Lead Full-Stack Developer', org: 'Premier Bank', location: 'Hargeisa' }, { type: 'JOB', title: 'Frontend Developer', org: 'Hormuud Telecom', location: 'Mogadishu' }, { type: 'NGO', title: 'Project Manager - Education', org: 'UNICEF', location: 'Garowe' },
];
const testimonialsData = [
    { name: 'Asha Hussein', role: 'Project Manager, Ministry of Public Works', quote: "Dhiselink is the critical link we needed. It connects public sector projects with the private sector expertise required to execute them efficiently. It's accelerating national progress." }, { name: 'Dr. Ahmed Jama', role: 'Director, National Planning Institute', quote: "Our graduates have a direct bridge to impactful careers. Dhiselink is vital for retaining our nation's top talent and preventing brain drain." }, { name: "Omar Yusuf", role: "Founder, Saafi Solar", quote: "Through the platform, we found two brilliant renewable energy engineers who are now core members of our startup. The talent pool here is exceptional and highly specialized." }, { name: 'Fatima Ali', role: 'Lead Architect, Urban Planners Inc.', quote: "Finding qualified architects with local knowledge used to be a challenge. This platform has become our go-to source for every new project." }
];
const faqData = [
    { q: "Who can join Dhiselink?", a: "Dhiselink is for professionals, companies, NGOs, and government bodies involved in building Somaliland's future across all development sectors." }, { q: "Is this platform only for engineers?", a: "Not at all. We serve architects, planners, project managers, policy makers, tech innovators, and many other professions essential for national development." }, { q: "How are opportunities verified?", a: "Our team verifies all institutions and postings to ensure they are legitimate and meet our quality standards, providing a safe and reliable environment." }, { q: "Can international organizations post jobs?", a: "Yes, we welcome both national and international organizations that are contributing to development projects within Somaliland." }, { q: "Is there a fee to join?", a: "Creating a professional profile and browsing opportunities is completely free. We offer premium features for institutions for enhanced recruitment and visibility." }
];
const featuredCompanies = [
    { name: "Dahabshiil Group", logoUrl: `https://logo.clearbit.com/dahabshiil.com?size=150`, description: "A global leader in finance and remittances, constantly innovating in the fintech space.", jobs: 12 }, { name: "Hormuud Telecom", logoUrl: `https://logo.clearbit.com/hormuud.com?size=150`, description: "The nation's largest telecommunications provider, expanding into mobile technology and IoT.", jobs: 8 }, { name: "Premier Bank", logoUrl: `https://logo.clearbit.com/premierbank.so?size=150`, description: "A pioneering financial institution driving economic growth through modern banking solutions.", jobs: 5 }, { name: "Ministry of Public Works", logoUrl: `https://logo.clearbit.com/somalilanddevelopmentfund.org?size=150`, description: "Responsible for national infrastructure projects, from roads and bridges to public buildings.", jobs: 25 }
];
const resourcesData = {
    ideas: [
        { title: "Smart City Grid for Mogadishu", category: "Infrastructure", imageUrl: "https://images.unsplash.com/photo-1611071534353-c4083a4b46b1?q=80&w=800" },
        { title: "Mobile-First Digital ID System", category: "Technology", imageUrl: "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?q=80&w=800" },
        { title: "Community-Owned Solar Farms", category: "Sustainability", imageUrl: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9c?q=80&w=800" },
    ],
    jobs: [
        { title: "Lead Civil Engineer", category: "Government", imageUrl: "https://images.unsplash.com/photo-1542892942-00d99534b159?q=80&w=800" },
        { title: "Senior React Native Developer", category: "Fintech", imageUrl: "https://images.unsplash.com/photo-1607706189992-eae578626c86?q=80&w=800" },
        { title: "Environmental Impact Assessor", category: "NGO", imageUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=800" },
    ],
    heritage: [
        { title: "Restoration of the Laas Geel Caves", category: "Antiquity", imageUrl: "https://images.unsplash.com/photo-1629551229232-2a54a05898d2?q=80&w=800" },
        { title: "Digital Archive of Somali Poetry", category: "Culture", imageUrl: "https://images.unsplash.com/photo-1456324504439-367cee3b3c32?q=80&w=800" },
        { title: "Architectural Revival in the Old City", category: "Preservation", imageUrl: "https://images.unsplash.com/photo-1568288599427-838636a0666b?q=80&w=800" },
    ]
};


// =================================================================================================
// 2. UTILITY & REUSABLE ANIMATION COMPONENTS
// =================================================================================================

const cn = (...classes: (string | boolean | undefined)[]) => classes.filter(Boolean).join(' ');
const sectionVariants = { hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut", staggerChildren: 0.2 } } };
const AnimatedSection: FC<{ id?: string, children: ReactNode, className?: string }> = ({ id, children, className = '' }) => { const controls = useAnimation(); const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true }); useEffect(() => { if (inView) { controls.start('visible'); } }, [controls, inView]); return ( <motion.section ref={ref} animate={controls} initial="hidden" variants={sectionVariants} id={id} className={cn("py-20 md:py-28", className)}> <div className="container mx-auto px-6"> {children} </div> </motion.section> ); };
const AnimatedCounter: FC<{ value: number, className?: string }> = ({ value, className }) => { const [count, setCount] = useState(0); const { ref, inView } = useInView({ threshold: 0.5, triggerOnce: true }); useEffect(() => { if (inView) { const controls = animate(0, value, { duration: 2, ease: "easeOut", onUpdate: (latest) => setCount(Math.floor(latest)), }); return () => controls.stop(); } }, [inView, value]); return <span ref={ref} className={className}>{count}</span>; };

// =================================================================================================
// 3. PAGE SECTION COMPONENTS
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
        };
        const colors = hatColors[type] || hatColors.civil;
        return (
            <motion.g initial={{ opacity: 0, y: -20, rotate: -5 }} animate={{ opacity: 1, y: 0, rotate: 0 }} exit={{ opacity: 0, y: -20, rotate: 5 }} transition={{ duration: 0.4, ease: "easeOut" }} >
                <path d="M 140 90 Q 150 50 200 40 Q 250 50 260 90 L 265 100 L 135 100 L 140 90 Z" fill={colors.fill} stroke={colors.stroke} strokeWidth="2" />
                <path d="M 135 100 A 70 20 0 0 1 265 100 Z" fill={colors.fill} stroke={colors.stroke} strokeWidth="2" />
                <rect x="190" y="55" width="20" height="8" rx="2" fill={colors.stroke} />
            </motion.g>
        );
    };

    return (
        <motion.div className="relative w-full max-w-sm sm:max-w-md mx-auto" onHoverStart={() => setIsHovered(true)} onHoverEnd={() => setIsHovered(false)} >
            <motion.div
                className="absolute inset-0 bg-red-400/30 -z-10 rounded-full"
                style={{ filter: 'blur(80px)' }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.8 }}
                transition={{ duration: 0.4 }}
            />
            <svg ref={svgRef} viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto cursor-pointer">
                <defs>
                    <radialGradient id="headGradient" cx="0.4" cy="0.4" r="0.6">
                        <stop offset="0%" stopColor="#FFFFFF" />
                        <stop offset="100%" stopColor="#E5E7EB" />
                    </radialGradient>
                    <linearGradient id="bodyGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#D1D5DB" />
                        <stop offset="100%" stopColor="#9CA3AF" />
                    </linearGradient>
                    <filter id="eyeGlow">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                    <filter id="robotShadow">
                        <feDropShadow dx="5" dy="10" stdDeviation="5" floodColor="#000000" floodOpacity="0.2" />
                    </filter>
                </defs>
                <motion.g animate={{ y: [0, -4, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} filter="url(#robotShadow)" >
                    <path d="M 200,320 C 150,320 120,280 120,230 L 120,190 H 280 L 280,230 C 280,280 250,320 200,320 Z" fill="url(#bodyGradient)" />
                    <rect x="180" y="170" width="40" height="20" fill="#9CA3AF" />
                    <rect x="175" y="175" width="50" height="4" fill="#6B7280" rx="2" />
                    <motion.g transformOrigin="115 190" animate={{ rotate: isHovered ? armRotation.left : 0 }} transition={{ type: "spring", stiffness: 300, damping: 20 }} >
                        <rect x="100" y="190" width="30" height="80" rx="10" fill="#A0AEC0" />
                        <circle cx="115" cy="190" r="15" fill="#6B7280" />
                        <rect x="90" y="260" width="40" height="20" rx="5" fill="#6B7280" />
                    </motion.g>
                    <motion.g transformOrigin="285 190" animate={{ rotate: isHovered ? armRotation.right : 0 }} transition={{ type: "spring", stiffness: 300, damping: 20 }} >
                        <rect x="270" y="190" width="30" height="80" rx="10" fill="#A0AEC0" />
                        <circle cx="285" cy="190" r="15" fill="#6B7280" />
                        <rect x="270" y="260" width="40" height="20" rx="5" fill="#6B7280" />
                    </motion.g>
                    <circle cx="200" cy="120" r="60" fill="url(#headGradient)" stroke="#9CA3AF" strokeWidth="2" />
                    <motion.path d="M 175 110 L 190 108" stroke="#4B5563" strokeWidth="4" strokeLinecap="round" />
                    <motion.path d="M 210 108 L 225 110" stroke="#4B5563" strokeWidth="4" strokeLinecap="round" />
                    <motion.g animate={{ x: eyeOffset.x, y: eyeOffset.y }} transition={{ type: 'spring', stiffness: 400, damping: 25 }} >
                        <g filter="url(#eyeGlow)">
                            <circle cx="180" cy="125" r="8" fill="#3B82F6" />
                            <circle cx="220" cy="125" r="8" fill="#3B82F6" />
                        </g>
                        <motion.rect x="172" y="113" width="16" rx="2" fill="#D1D5DB" initial={{ height: 0 }} animate={{ height: isBlinking ? 24 : 0 }} transition={{ duration: 0.075 }} />
                        <motion.rect x="212" y="113" width="16" rx="2" fill="#D1D5DB" initial={{ height: 0 }} animate={{ height: isBlinking ? 24 : 0 }} transition={{ duration: 0.075 }} />
                    </motion.g>
                    <motion.path stroke="#6B7280" strokeWidth="3" fill="none" strokeLinecap="round" initial={{ d: "M 192 150 Q 200 155 208 150" }} animate={{ d: isHovered ? "M 195 155 L 205 155" : "M 192 150 Q 200 155 208 150" }} transition={{ type: "spring", stiffness: 400, damping: 15 }} />
                    <AnimatePresence mode="wait">
                        <Hat key={hatType} type={hatType} />
                    </AnimatePresence>
                </motion.g>
            </svg>
        </motion.div>
    );
};
const ParticleBackground: FC<{ theme?: 'light' | 'dark' }> = ({ theme = 'light' }) => { const particles = Array.from({ length: 25 }); const particleColor = theme === 'light' ? 'bg-gray-500/20' : 'bg-white/20'; return ( <div className="absolute inset-0 z-0 overflow-hidden"> {particles.map((_, i) => { const size = Math.random() * 8 + 4; const duration = Math.random() * 20 + 15; const delay = Math.random() * -duration; const xStart = Math.random() * 100; const yStart = Math.random() * 100; const xEnd = Math.random() * 100; const yEnd = Math.random() * 100; return ( <motion.div key={i} className={cn("absolute rounded-full", particleColor)} style={{ width: size, height: size, top: `${yStart}%`, left: `${xStart}%` }} animate={{ x: [`${xStart}%`, `${xEnd}%`, `${xStart}%`], y: [`${yStart}%`, `${yEnd}%`, `${yStart}%`], }} transition={{ duration, ease: "linear", repeat: Infinity, delay }} /> ); })} </div> ); };
const HeroSection: FC = () => { const [index, setIndex] = useState(0); useEffect(() => { const timer = setInterval(() => { setIndex((prevIndex) => (prevIndex + 1) % heroContent.length); }, 6000); return () => clearInterval(timer); }, []); const currentContent = heroContent[index]; return ( <section className="relative min-h-screen flex flex-col justify-center bg-gray-50 text-gray-900 overflow-hidden pt-20 sm:pt-0"> <ParticleBackground theme='light' /> <div className="absolute inset-0 -z-10"> <motion.div className="absolute top-[10%] left-[5%] w-60 h-60 bg-violet-200/50 rounded-full" style={{ filter: 'blur(80px)'}} animate={{ x: [0, -30, 50, 0], y: [0, 40, -20, 0], scale: [1, 1.1, 1] }} transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }} /> <motion.div className="absolute bottom-[15%] right-[10%] w-52 h-52 bg-blue-200/50 rounded-full" style={{ filter: 'blur(80px)'}} animate={{ x: [0, 40, -30, 0], y: [0, -50, 20, 0], rotate: [0, 90, 0] }} transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut', delay: 5 }} /> </div> <div className="container mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-x-12 items-center"> <div className="text-center lg:text-left"> <AnimatePresence> <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0, transition: { staggerChildren: 0.1, duration: 0.5, ease: "easeOut" } }} exit={{ opacity: 0, position: 'absolute', y: -20, transition: { duration: 0.4 } }} className="w-full" > <motion.div variants={sectionVariants} className="inline-block px-3 py-1 mb-4 border border-gray-200 bg-white/50 backdrop-blur-lg rounded-full text-sm font-medium text-gray-700"> {currentContent.tagline} </motion.div> <div className="min-h-[200px] sm:min-h-[240px]"> <motion.h1 variants={sectionVariants} className="text-4xl md:text-6xl font-extrabold tracking-tighter text-gray-900 mb-6"> {currentContent.title} </motion.h1> <motion.p variants={sectionVariants} className="text-lg text-gray-600 max-w-lg mx-auto lg:mx-0"> {currentContent.subtitle} </motion.p> </div> </motion.div> </AnimatePresence> <motion.div className="flex flex-col sm:flex-row justify-center lg:justify-start items-center gap-4 mt-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} > <motion.a href="#jobs" className="group w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-lg shadow-blue-500/30" whileHover={{ scale: 1.05, y: -3, boxShadow: "0 10px 20px rgba(59, 130, 246, 0.4)" }} transition={{ type: "spring", stiffness: 300, damping: 15 }} > Explore Opportunities <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" /> </motion.a> <motion.a href="#professionals" className="group w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-gray-800 text-white font-bold rounded-lg" whileHover={{ scale: 1.05, y: -3 }} transition={{ type: "spring", stiffness: 300, damping: 15 }} > Find Talent </motion.a> </motion.div> </div> <div className="flex justify-center items-center mt-12 lg:mt-0"> <FuturisticRobot hatType={currentContent.hat} /> </div> </div> </section> ); };
const TrustedBySection: FC = () => { const duplicatedPartners = [...partners, ...partners]; return ( <div className="py-20 bg-white"> <div className="container mx-auto px-6"> <h2 className="text-3xl font-bold text-gray-700 text-center mb-12"> Trusted by the Nation's Leading Organizations </h2> <div className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]"> <motion.ul className="flex items-center justify-center md:justify-start [&_li]:mx-8 [&_img]:max-w-none animate-infinite-scroll" animate={{ x: ["0%", "-50%"] }} transition={{ ease: "linear", duration: 60, repeat: Infinity }} > {duplicatedPartners.map((partner, index) => ( <li key={index} className="flex-shrink-0"> <img src={partner.logoUrl} alt={partner.name} className="h-10 object-contain filter grayscale hover:grayscale-0 transition-all duration-300" /> </li> ))} </motion.ul> </div> </div> </div> ); };
const HowItWorksSection: FC = () => { const steps = [ { icon: UserPlus, title: "Create Your Profile", description: "Sign up as a professional or an institution and showcase your skills, projects, and goals." }, { icon: Search, title: "Discover Opportunities", description: "Browse a verified list of jobs, projects, and tenders, or search for specialized talent." }, { icon: LinkIcon, title: "Connect & Collaborate", description: "Connect directly with organizations and individuals to start building the future, together." }, ]; return ( <AnimatedSection id="how-it-works" className="bg-gray-50"> <motion.h2 variants={sectionVariants} className="text-4xl md:text-5xl font-bold text-gray-800 text-center mb-4"> Get Started in 3 Simple Steps </motion.h2> <motion.p variants={sectionVariants} className="text-lg text-gray-600 text-center max-w-2xl mx-auto mb-16"> Joining the nation's premier development network is quick and easy. </motion.p> <div className="grid md:grid-cols-3 gap-10"> {steps.map((step, index) => ( <motion.div key={index} variants={sectionVariants} className="text-center"> <div className="relative flex items-center justify-center w-24 h-24 bg-white border-2 border-dashed border-gray-300 rounded-full mx-auto mb-6"> <div className="flex items-center justify-center w-20 h-20 bg-blue-100 text-blue-600 rounded-full"> <step.icon size={32} /> </div> <div className="absolute -top-3 -right-3 flex items-center justify-center w-8 h-8 bg-blue-600 text-white font-bold text-sm rounded-full border-4 border-gray-50"> {index + 1} </div> </div> <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3> <p className="text-gray-600">{step.description}</p> </motion.div> ))} </div> </AnimatedSection> ); };
const CoreSectorsSection: FC = () => { const targetRef = useRef<HTMLDivElement>(null); const { scrollYProgress } = useScroll({ target: targetRef, offset: ["start end", "end start"] }); const color = useTransform( scrollYProgress, [0.1, 0.5, 0.9], ["#9ca3af", "#1e40af", "#9ca3af"] ); return ( <div ref={targetRef}> <AnimatedSection id="sectors" className="bg-white"> <motion.h2 variants={sectionVariants} className="text-4xl md:text-5xl font-bold text-center mb-4"> <motion.span style={{ color }}>Core Development Sectors</motion.span> </motion.h2> <motion.p variants={sectionVariants} className="text-lg text-gray-600 text-center max-w-2xl mx-auto mb-16"> Explore the key disciplines driving Somaliland’s growth. </motion.p> <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"> {sectorsData.map(sector => ( <motion.div key={sector.name} variants={sectionVariants} whileHover={{ y: -8, boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)", zIndex: 10 }} transition={{ type: 'spring', stiffness: 300 }} className="relative p-8 bg-gray-50 rounded-2xl border border-gray-200 group" > <div className="mb-4"> <sector.icon className="h-10 w-10 text-blue-600 group-hover:text-violet-600 transition-colors" /> </div> <h3 className="text-xl font-bold text-gray-900 mb-2">{sector.name}</h3> <p className="text-gray-600 mb-4">{sector.description}</p> <span className="font-semibold text-blue-700 bg-blue-100 px-3 py-1 rounded-full text-sm">{sector.stat}</span> </motion.div> ))} </div> </AnimatedSection> </div> ) };
const BentoGridSection: FC = () => { const [currentIndex, setCurrentIndex] = useState(0); const typeStyles: { [key: string]: string } = { 'GOV': 'bg-blue-100 text-blue-800', 'NGO': 'bg-green-100 text-green-800', 'JOB': 'bg-orange-100 text-orange-800' }; const nextJob = () => setCurrentIndex((prev) => (prev + 1) % opportunities.length); const prevJob = () => setCurrentIndex((prev) => (prev - 1 + opportunities.length) % opportunities.length); useEffect(() => { const timer = setInterval(nextJob, 5000); return () => clearInterval(timer); }, []); const otherJobs = opportunities.slice(1, 3); return ( <AnimatedSection id="jobs" className="bg-gray-50"> <motion.h2 variants={sectionVariants} className="text-4xl md:text-5xl font-bold text-gray-800 text-center mb-16"> A Thriving National Ecosystem </motion.h2> <div className="grid grid-cols-1 lg:grid-cols-4 gap-6"> <motion.div variants={sectionVariants} className="relative lg:col-span-2 lg:row-span-2 bg-white border rounded-2xl p-6 flex flex-col group shadow-sm overflow-hidden"> <AnimatePresence initial={false}> <motion.div key={currentIndex} initial={{ x: "100%", opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: "-100%", opacity: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }} className="absolute inset-0 p-6 flex flex-col" > <span className={`text-xs font-bold py-1 px-3 rounded-full self-start ${typeStyles[opportunities[currentIndex].type]}`}>{opportunities[currentIndex].type}</span> <h3 className="text-2xl font-bold my-3 text-gray-900 flex-grow">{opportunities[currentIndex].title}</h3> <p className="text-md text-gray-500 mb-4">{opportunities[currentIndex].org} &bull; {opportunities[currentIndex].location}</p> <a href="#" className="font-semibold text-blue-600 flex items-center gap-2"> View Details <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" /> </a> </motion.div> </AnimatePresence> <div className="absolute bottom-4 right-4 flex gap-2"> <button onClick={prevJob} className="p-2 rounded-full bg-black/5 hover:bg-black/10 transition"><ChevronLeft size={16}/></button> <button onClick={nextJob} className="p-2 rounded-full bg-black/5 hover:bg-black/10 transition"><ChevronRight size={16}/></button> </div> </motion.div> {ecosystemStats.map(stat => ( <motion.div key={stat.label} variants={sectionVariants} className="bg-blue-600 text-white rounded-2xl p-6 text-left flex flex-col justify-between shadow-lg shadow-blue-500/30"> <div>{React.cloneElement(stat.icon, { size: 32, strokeWidth: 1.5, className: "text-blue-200" })}</div> <div> <h3 className="text-4xl font-bold"><AnimatedCounter value={stat.value} />{stat.suffix}</h3> <p className="text-blue-100">{stat.label}</p> </div> </motion.div> ))} {otherJobs.map((job, i) => ( <motion.div key={i} variants={sectionVariants} className="lg:col-span-1 bg-white border rounded-2xl p-6 group shadow-sm"> <span className={`text-xs font-bold py-1 px-3 rounded-full ${typeStyles[job.type]}`}>{job.type}</span> <h3 className="text-lg font-bold my-2 text-gray-900">{job.title}</h3> <p className="text-sm text-gray-500 mb-3">{job.org} &bull; {job.location}</p> <a href="#" className="font-semibold text-sm text-blue-600 flex items-center gap-1"> Details <ArrowRight size={14} /> </a> </motion.div> ))} </div> <motion.div variants={sectionVariants} className="text-center mt-12"> <a href="/opportunities" className="font-bold text-blue-600 text-lg hover:underline">View All Opportunities</a> </motion.div> </AnimatedSection> ); };
const MapSection: FC = () => { const cities = [ { name: "Hargeisa", pos: { top: "25%", left: "30%" } }, { name: "Borama", pos: { top: "28%", left: "18%" } }, { name: "Berbera", pos: { top: "18%", left: "38%" } }, { name: "Burco", pos: { top: "30%", left: "50%" } }, { name: "Ceerigaabo", pos: { top: "20%", left: "60%" } }, { name: "Laascaanood", pos: { top: "38%", left: "58%" } }, ]; return ( <AnimatedSection id="map" className="bg-white"> <motion.h2 variants={sectionVariants} className="text-4xl md:text-5xl font-bold text-gray-800 text-center mb-4"> Connecting Talent Across the Nation </motion.h2> <motion.p variants={sectionVariants} className="text-lg text-gray-600 text-center max-w-2xl mx-auto mb-16"> Our network spans all major hubs, linking professionals and projects nationwide. </motion.p> <div className="relative max-w-4xl mx-auto p-4 bg-dots-pattern rounded-2xl"> <img src="https://upload.wikimedia.org/wikipedia/commons/8/8f/Somalia-Map-Icon.svg" alt="Map of Somalia" className="w-full h-auto opacity-10" /> {cities.map(city => ( <div key={city.name} className="absolute" style={city.pos}> <motion.div className="absolute w-4 h-4 bg-blue-600/50 rounded-full" animate={{ scale: [1, 3, 1], opacity: [1, 0, 1] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: Math.random() * 2 }} /> <div className="absolute w-3 h-3 bg-blue-600 rounded-full transform -translate-x-1/2 -translate-y-1/2 border-2 border-white"></div> <span className="absolute transform translate-x-3 -translate-y-6 bg-white px-2 py-1 text-xs font-bold rounded shadow-lg ring-1 ring-gray-200">{city.name}</span> </div> ))} </div> </AnimatedSection> ); }
const FeaturedCompaniesSection: FC = () => { return ( <AnimatedSection id="companies" className="bg-gray-50"> <motion.h2 variants={sectionVariants} className="text-4xl md:text-5xl font-bold text-gray-800 text-center mb-4"> Hiring Spotlight </motion.h2> <motion.p variants={sectionVariants} className="text-lg text-gray-600 text-center max-w-2xl mx-auto mb-16"> Meet some of the leading institutions actively building their teams on our platform. </motion.p> <div className="grid md:grid-cols-2 gap-8"> {featuredCompanies.map(company => ( <motion.div key={company.name} variants={sectionVariants} className="bg-white p-6 rounded-2xl border border-gray-200 flex flex-col sm:flex-row items-center gap-6"> <img src={company.logoUrl} alt={company.name} className="w-24 h-24 object-contain flex-shrink-0" /> <div> <h3 className="text-xl font-bold text-gray-900">{company.name}</h3> <p className="text-gray-600 mt-1 mb-3">{company.description}</p> <a href="#" className="font-semibold text-blue-600 bg-blue-100 px-4 py-2 rounded-lg inline-block">View {company.jobs} open positions</a> </div> </motion.div> ))} </div> <motion.div variants={sectionVariants} className="text-center mt-12"> <a href="/institutions" className="font-bold text-blue-600 text-lg hover:underline">Explore All Institutions</a> </motion.div> </AnimatedSection> ) }
const VerticalSlideshowCard: FC<{ items: { title: string, category: string, imageUrl: string }[] }> = ({ items }) => { const [index, setIndex] = useState(0); const next = () => setIndex(prev => (prev + 1) % items.length); const prev = () => setIndex(prev => (prev - 1 + items.length) % items.length); useEffect(() => { const timer = setInterval(next, 4000); return () => clearInterval(timer); }, []); return ( <div className="relative h-96 bg-gray-100 rounded-2xl overflow-hidden border border-gray-200 group"> <AnimatePresence initial={false}> <motion.div key={index} initial={{ y: "100%", opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: "-100%", opacity: 0 }} transition={{ type: "spring", stiffness: 400, damping: 40 }} className="absolute inset-0" > <img src={items[index].imageUrl} alt={items[index].title} className="w-full h-full object-cover"/> <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"/> <div className="absolute bottom-0 left-0 p-6 text-white"> <p className="text-sm font-semibold opacity-80 mb-1">{items[index].category}</p> <h3 className="text-lg font-bold">{items[index].title}</h3> </div> </motion.div> </AnimatePresence> <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity"> <button onClick={prev} className="p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition"><ChevronUp size={16}/></button> <button onClick={next} className="p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition"><ChevronDown size={16}/></button> </div> </div> ) }
const MobileResourceTabs: FC = () => { const [activeTab, setActiveTab] = useState<'ideas' | 'jobs' | 'heritage'>('ideas'); const [index, setIndex] = useState(0); const tabs = [ { id: 'ideas', label: 'Ideas', icon: Rss }, { id: 'jobs', label: 'Jobs', icon: Briefcase }, { id: 'heritage', label: 'Heritage', icon: Trophy }, ]; useEffect(() => { setIndex(0); const timer = setInterval(() => { setIndex(prev => (prev + 1) % resourcesData[activeTab].length); }, 4000); return () => clearInterval(timer); }, [activeTab]); const currentItem = resourcesData[activeTab][index]; return ( <div className="w-full"> <div className="flex justify-center gap-2 mb-6"> {tabs.map(tab => ( <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={cn("px-4 py-2 text-sm font-semibold rounded-full transition-colors flex items-center gap-2", activeTab === tab.id ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-200" )}> <tab.icon size={16}/> {tab.label} </button> ))} </div> <div className="relative h-80 rounded-2xl overflow-hidden border border-gray-200"> <AnimatePresence> <motion.div key={activeTab + index} initial={{ opacity: 0.5, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, ease: 'easeInOut' }} className="absolute inset-0" > <img src={currentItem.imageUrl} alt={currentItem.title} className="w-full h-full object-cover"/> <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"/> <div className="absolute bottom-0 left-0 p-6 text-white"> <p className="text-sm font-semibold opacity-80 mb-1">{currentItem.category}</p> <h3 className="text-lg font-bold">{currentItem.title}</h3> </div> </motion.div> </AnimatePresence> </div> </div> ) }
const CareerResourcesSection: FC = () => { return ( <AnimatedSection id="resources" className="bg-white"> <motion.h2 variants={sectionVariants} className="text-4xl md:text-5xl font-bold text-gray-800 text-center mb-4"> Career Resources & Insights </motion.h2> <motion.p variants={sectionVariants} className="text-lg text-gray-600 text-center max-w-2xl mx-auto mb-16"> Stay ahead with expert advice, industry trends, and success stories from our community. </motion.p> <div className="hidden md:grid md:grid-cols-3 gap-8"> <motion.div variants={sectionVariants}><VerticalSlideshowCard items={resourcesData.ideas} /></motion.div> <motion.div variants={sectionVariants}><VerticalSlideshowCard items={resourcesData.jobs} /></motion.div> <motion.div variants={sectionVariants}><VerticalSlideshowCard items={resourcesData.heritage} /></motion.div> </div> <div className="md:hidden"> <MobileResourceTabs /> </div> </AnimatedSection> ) };
const TestimonialsSection: FC = () => { const [index, setIndex] = useState(0); const nextTestimonial = () => { setIndex((prev) => (prev + 1) % testimonialsData.length); }; const prevTestimonial = () => { setIndex((prev) => (prev - 1 + testimonialsData.length) % testimonialsData.length); }; useEffect(() => { const slideTimer = setInterval(nextTestimonial, 5000); return () => clearInterval(slideTimer); }, []); return ( <AnimatedSection id="testimonials" className="bg-gray-50"> <div className="relative max-w-3xl mx-auto text-center"> <div className="overflow-hidden relative h-[320px] sm:h-[280px]"> <AnimatePresence initial={false}> <motion.div key={index} initial={{ x: "100%", opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: "-100%", opacity: 0 }} transition={{ type: "spring", stiffness: 300, damping: 30 }} className="absolute inset-0 bg-white p-8 rounded-2xl shadow-lg border border-gray-200" > <Quote className="w-12 h-12 text-gray-200 mx-auto mb-4" /> <p className="text-lg italic font-medium text-gray-700 mb-6">&quot;{testimonialsData[index].quote}&quot;</p> <h4 className="font-bold text-gray-900">{testimonialsData[index].name}</h4> <p className="text-sm text-blue-600 font-medium">{testimonialsData[index].role}</p> </motion.div> </AnimatePresence> </div> <button onClick={prevTestimonial} className="absolute top-1/2 -translate-y-1/2 -left-4 sm:-left-12 bg-white/80 backdrop-blur-sm border rounded-full p-2 shadow-md hover:bg-white transition" > <ChevronLeft className="text-gray-600"/> </button> <button onClick={nextTestimonial} className="absolute top-1/2 -translate-y-1/2 -right-4 sm:-right-12 bg-white/80 backdrop-blur-sm border rounded-full p-2 shadow-md hover:bg-white transition" > <ChevronRight className="text-gray-600"/> </button> <div className="flex justify-center gap-3 mt-8"> {testimonialsData.map((_, i) => ( <button key={i} onClick={() => setIndex(i)} className={`w-3 h-3 rounded-full transition-all duration-300 ${index === i ? 'bg-blue-600 scale-125' : 'bg-gray-300'}`} /> ))} </div> </div> </AnimatedSection> ); };
const FAQSection: FC = () => { const [openIndex, setOpenIndex] = useState<number | null>(0); const AccordionItem: FC<{ item: { q: string, a: string }, isOpen: boolean, onClick: () => void }> = ({ item, isOpen, onClick }) => ( <motion.div layout className="border-b border-gray-200 py-6"> <motion.button layout onClick={onClick} className="w-full flex justify-between items-center text-left"> <span className="text-lg font-medium text-gray-900">{item.q}</span> <motion.div animate={{ rotate: isOpen ? 45 : 0 }}><Plus className="text-blue-600" /></motion.div> </motion.button> <AnimatePresence> {isOpen && ( <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden pt-4 text-gray-600" > {item.a} </motion.div> )} </AnimatePresence> </motion.div> ); return ( <AnimatedSection id="faq" className="bg-white"> <motion.h2 variants={sectionVariants} className="text-4xl md:text-5xl font-bold text-gray-800 text-center mb-16">Common Questions</motion.h2> <div className="max-w-4xl mx-auto"> {faqData.map((item, index) => <AccordionItem key={index} item={item} isOpen={openIndex === index} onClick={() => setOpenIndex(openIndex === index ? null : index)} />)} </div> </AnimatedSection> ); };
const CTASection: FC = () => ( <div className="py-20 md:py-28 bg-gray-50"> <div className="container mx-auto px-6"> <div className="relative bg-gradient-to-br from-blue-700 to-violet-800 rounded-3xl p-12 text-center overflow-hidden"> <motion.div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url('/diagonal-lines.svg')" }} animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }} transition={{ duration: 20, repeat: Infinity, ease: 'linear', repeatType: 'mirror' }} /> <div className="relative z-10"> <motion.h2 initial={{opacity:0, y:20}} whileInView={{opacity:1, y:0}} viewport={{ once: true }} transition={{delay:0.2}} className="text-4xl md:text-5xl font-extrabold text-white mb-4"> Join the Movement to Build a Better Somaliland </motion.h2> <motion.p initial={{opacity:0, y:20}} whileInView={{opacity:1, y:0}} viewport={{ once: true }} transition={{delay:0.3}} className="text-lg text-blue-200 max-w-xl mx-auto mb-8"> Register today and become part of the development revolution. </motion.p> <motion.div initial={{opacity:0, y:20}} whileInView={{opacity:1, y:0}} viewport={{ once: true }} transition={{delay:0.4}} className="flex flex-col sm:flex-row justify-center items-center gap-4"> <motion.a whileHover={{ scale: 1.05, y: -2 }} href="/signup" className="w-full sm:w-auto bg-white text-blue-700 font-bold px-8 py-4 rounded-xl shadow-lg"> Join as a Professional </motion.a> <motion.a whileHover={{ scale: 1.05, y: -2 }} href="/signup" className="w-full sm:w-auto bg-transparent border-2 border-white text-white font-bold px-8 py-4 rounded-xl"> Register an Institution </motion.a> </motion.div> </div> </div> </div> </div> );

// =================================================================================================
// 4. MAIN PAGE COMPONENT
// =================================================================================================

export default function HomePage() {
    return (
        <main>
            <HeroSection />
            <TrustedBySection />
            <HowItWorksSection />
            <CoreSectorsSection />
            <BentoGridSection />
            <MapSection />
            <FeaturedCompaniesSection />
            <CareerResourcesSection />
            <TestimonialsSection />
            <FAQSection />
            <CTASection />
        </main>
    );
}