"use client";

import React, { useState, useEffect, FC, useRef } from 'react';
import { motion, useAnimation, AnimatePresence, animate } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
    Users, Briefcase, Handshake, Rocket, Code,
    Quote, ArrowRight, MoveDown,
    Wrench, Zap, Atom, Wind, Shield, DraftingCompass, Home, Building
} from 'lucide-react';

// --- 1. EXPANDED DATA & HERO CONTENT FOR ROBOT ---

const heroContent = [
    {
        tagline: "Building a Stronger Nation",
        title: "Pioneering Civil & Structural Engineering",
        subtitle: "From towering structures to resilient infrastructure, find the civil engineers shaping our nation's foundation.",
        hat: "civil"
    },
    {
        tagline: "The Digital Revolution is Here",
        title: "Innovate with World-Class Tech Talent",
        subtitle: "Find the nation's brightest developers, IT experts, and digital innovators to build a thriving digital economy.",
        hat: "tech"
    },
    {
        tagline: "Safety & Sustainability First",
        title: "Leading in Environmental & Safety Roles",
        subtitle: "Connect with safety officers and environmental experts dedicated to building a sustainable and secure future.",
        hat: "safety"
    }
];

const partners = [
    { name: "Ministry of Public Works", logoUrl: `https://logo.clearbit.com/somalilanddevelopmentfund.org?size=100` },
    { name: "SIMAD University", logoUrl: `https://logo.clearbit.com/simad.edu.so?size=100` },
    { name: "University of Mogadishu", logoUrl: `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGBLjNILyuhtmvqy-IaYCqSThtbma2vO84kQ&s?size=100` },
    { name: "Premier Bank", logoUrl: `https://logo.clearbit.com/premierbank.so?size=100` },
    { name: "UN Development Programme", logoUrl: `https://logo.clearbit.com/undp.org?size=100` },
    { name: "Dahabshiil Group", logoUrl: `https://logo.clearbit.com/dahabshiil.com?size=100` },
    { name: "Hormuud Telecom", logoUrl: `https://logo.clearbit.com/hormuud.com?size=100` },
];

const ecosystemStats = [
    { value: 2500, label: "Professionals", suffix: "+", icon: <Users /> },
    { value: 620, label: "Opportunities", suffix: "+", icon: <Briefcase /> },
    { value: 150, label: "Institutions", suffix: "+", icon: <Handshake /> },
    { value: 85, label: "Projects", suffix: "+", icon: <Rocket /> },
];

const sectorsData = [
    { name: "Civil Engineering", icon: Building, description: "Designing and constructing public works like roads, bridges, and water systems.", stat: "80+ Projects" },
    { name: "Software Development", icon: Code, description: "Building the digital backbone of the nation, from fintech to cloud computing.", stat: "120+ Opportunities" },
    { name: "Electrical Engineering", icon: Zap, description: "Powering industries with skilled electricians and power systems specialists.", stat: "70+ Partners" },
    { name: "Mechanical Engineering", icon: Wrench, description: "Developing machines, tools, and systems for manufacturing and industrial processes.", stat: "50+ Roles" },
    { name: "Environmental & Safety", icon: Shield, description: "Ensuring sustainable practices and workplace safety across all sectors.", stat: "45+ Certifications" },
    { name: "Urban Planning", icon: Home, description: "Shaping the growth of cities with strategic design and sustainable development.", stat: "30+ Initiatives" },
    { name: "Renewable Energy", icon: Wind, description: "Harnessing wind, solar, and other green resources to power the future.", stat: "25+ Plants" },
    { name: "Chemical Engineering", icon: Atom, description: "Transforming raw materials into valuable products for industrial and consumer use.", stat: "20+ Facilities" },
    { name: "Architecture & Design", icon: DraftingCompass, description: "Creating innovative and functional spaces for living and working.", stat: "60+ Firms" },
];

const opportunities = [
    { type: 'GOV', title: 'Senior Urban Planner', org: 'Ministry of Public Works', location: 'Mogadishu' },
    { type: 'NGO', title: 'Water & Sanitation Engineer', org: 'Mercy Corps', location: 'Baidoa' },
    { type: 'JOB', title: 'Lead Full-Stack Developer', org: 'Premier Bank', location: 'Hargeisa' },
];

const testimonialsData = [
   { name: 'Asha Hussein', role: 'Project Manager, Ministry of Public Works', quote: "Dhiselink is the critical link we needed. It connects public sector projects with the private sector expertise required to execute them efficiently. It's accelerating national progress.", avatarUrl: 'https://randomuser.me/api/portraits/women/68.jpg' },
   { name: 'Dr. Ahmed Jama', role: 'Director, National Planning Institute', quote: "Our graduates have a direct bridge to impactful careers. Dhiselink is vital for retaining our nation's top talent.", avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg' },
   { name: 'Omar Yusuf', role: 'Founder, Saafi Solar', quote: "Through the platform, we found two brilliant engineers who are now core members of our startup. The talent here is exceptional.", avatarUrl: 'https://randomuser.me/api/portraits/men/46.jpg' }
];

const faqData = [
    { q: "Who can join Dhiselink?", a: "Dhiselink is for professionals, companies, NGOs, and government bodies involved in building Somaliland's future across all development sectors." },
    { q: "Is this platform only for engineers?", a: "Not at all. We serve architects, planners, project managers, policy makers, tech innovators, and many other professions essential for national development." },
    { q: "How are opportunities verified?", a: "Our team verifies all institutions and postings to ensure they are legitimate and meet our quality standards, providing a safe and reliable environment." },
    { q: "Can international organizations post jobs?", a: "Yes, we welcome both national and international organizations that are contributing to development projects within Somaliland." },
];

// --- 2. REUSABLE & CORE ANIMATION COMPONENTS ---

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
        <motion.section ref={ref} animate={controls} initial="hidden" variants={sectionVariants} id={id} className={`py-20 md:py-28 ${className}`}>
            <div className="container mx-auto px-6">
                {children}
            </div>
        </motion.section>
    );
};

const AnimatedCounter: FC<{ value: number, className?: string }> = ({ value, className }) => {
    const [count, setCount] = useState(0);
    const { ref, inView } = useInView({ threshold: 0.5, triggerOnce: true });

    useEffect(() => {
        if (inView) {
            const controls = animate(0, value, {
                duration: 2, ease: "easeOut",
                onUpdate: (latest) => setCount(Math.floor(latest)),
            });
            return () => controls.stop();
        }
    }, [inView, value]);

    return <span ref={ref} className={className}>{count}</span>;
};


// --- 3. NEW & REDESIGNED PAGE SECTION COMPONENTS ---

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
    const distance = Math.min(10, Math.sqrt(deltaX**2 + deltaY**2) / 20);
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
            <motion.g
                initial={{ opacity: 0, y: -20, rotate: -5 }}
                animate={{ opacity: 1, y: 0, rotate: 0 }}
                exit={{ opacity: 0, y: -20, rotate: 5 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
            >
                <path d="M 140 90 Q 150 50 200 40 Q 250 50 260 90 L 265 100 L 135 100 L 140 90 Z" 
                      fill={colors.fill} stroke={colors.stroke} strokeWidth="2"/>
                <path d="M 135 100 A 70 20 0 0 1 265 100 Z" fill={colors.fill} stroke={colors.stroke} strokeWidth="2"/>
                <rect x="190" y="55" width="20" height="8" rx="2" fill={colors.stroke}/>
            </motion.g>
        );
    };

    return (
        <motion.div
            className="relative w-full max-w-lg mx-auto cursor-pointer"
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
        >
            <motion.div
                className="absolute inset-0 bg-red-500/50 -z-10 rounded-full"
                style={{ filter: 'blur(80px)' }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.8 }}
                transition={{ duration: 0.4 }}
            />

            <svg ref={svgRef} viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
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
                        <feDropShadow dx="5" dy="10" stdDeviation="5" floodColor="#000000" floodOpacity="0.3"/>
                    </filter>
                </defs>

                <motion.g 
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    filter="url(#robotShadow)"
                >
                    <path d="M 200,320 C 150,320 120,280 120,230 L 120,190 H 280 L 280,230 C 280,280 250,320 200,320 Z" fill="url(#bodyGradient)" />
                    <rect x="180" y="170" width="40" height="20" fill="#9CA3AF" />
                    <rect x="175" y="175" width="50" height="4" fill="#6B7280" rx="2" />
                    <motion.g 
                        transformOrigin="115 190"
                        animate={{ rotate: isHovered ? armRotation.left : 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                        <rect x="100" y="190" width="30" height="80" rx="10" fill="#A0AEC0" />
                        <circle cx="115" cy="190" r="15" fill="#6B7280" />
                        <rect x="90" y="260" width="40" height="20" rx="5" fill="#6B7280" />
                    </motion.g>
                    <motion.g 
                        transformOrigin="285 190"
                        animate={{ rotate: isHovered ? armRotation.right : 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                        <rect x="270" y="190" width="30" height="80" rx="10" fill="#A0AEC0" />
                        <circle cx="285" cy="190" r="15" fill="#6B7280" />
                        <rect x="270" y="260" width="40" height="20" rx="5" fill="#6B7280" />
                    </motion.g>
                    <circle cx="200" cy="120" r="60" fill="url(#headGradient)" stroke="#9CA3AF" strokeWidth="2" />
                    <motion.path d="M 175 110 L 190 108" stroke="#4B5563" strokeWidth="4" strokeLinecap="round" />
                    <motion.path d="M 210 108 L 225 110" stroke="#4B5563" strokeWidth="4" strokeLinecap="round" />
                    <motion.g 
                        animate={{ x: eyeOffset.x, y: eyeOffset.y }} 
                        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    >
                        <g filter="url(#eyeGlow)">
                            <circle cx="180" cy="125" r="8" fill="#3B82F6" />
                            <circle cx="220" cy="125" r="8" fill="#3B82F6" />
                        </g>
                        <motion.rect x="172" y="113" width="16" rx="2" fill="#D1D5DB"
                            initial={{ height: 0 }}
                            animate={{ height: isBlinking ? 24 : 0 }}
                            transition={{ duration: 0.075 }}
                        />
                        <motion.rect x="212" y="113" width="16" rx="2" fill="#D1D5DB"
                            initial={{ height: 0 }}
                            animate={{ height: isBlinking ? 24 : 0 }}
                            transition={{ duration: 0.075 }}
                        />
                    </motion.g>
                    <motion.path 
                        stroke="#6B7280" strokeWidth="3" fill="none" strokeLinecap="round"
                        initial={{ d: "M 192 150 Q 200 155 208 150" }}
                        animate={{ d: isHovered ? "M 195 155 L 205 155" : "M 192 150 Q 200 155 208 150" }}
                        transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    />
                    <AnimatePresence mode="wait">
                        <Hat key={hatType} type={hatType} />
                    </AnimatePresence>
                </motion.g>
            </svg>
        </motion.div>
    );
};


const HeroSection: FC = () => {
    const [index, setIndex] = useState(0);
    
    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prevIndex) => (prevIndex + 1) % heroContent.length);
        }, 6000);
        return () => clearInterval(timer);
    }, []);

    const currentContent = heroContent[index];

    return (
        <section className="relative min-h-screen flex items-center bg-gray-50 overflow-hidden">
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "url('/grid.svg')", backgroundSize: "40px 40px" }}></div>
            <div className="absolute inset-0 -z-10">
                <motion.div 
                    className="absolute top-[20%] left-[10%] w-48 h-48 bg-violet-200/50 rounded-full"
                    style={{ filter: 'blur(60px)'}}
                    animate={{ x: [0, -30, 50, 0], y: [0, 40, -20, 0] }}
                    transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
                />
                <motion.div 
                    className="absolute bottom-[25%] right-[15%] w-40 h-40 bg-blue-200/50 rounded-full"
                    style={{ filter: 'blur(60px)'}}
                    animate={{ x: [0, 40, -30, 0], y: [0, -50, 20, 0] }}
                    transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
                />
                 <motion.div 
                    className="absolute top-[15%] right-[25%] w-24 h-24 bg-red-100/60 rounded-full hidden md:block"
                    style={{ filter: 'blur(40px)'}}
                    animate={{ x: [0, -20, 30, 0], y: [0, 30, -40, 0] }}
                    transition={{ duration: 35, repeat: Infinity, ease: 'easeInOut', delay: 10 }}
                />
            </div>
            
            <div className="container mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
                <div className="text-center lg:text-left">
                    {/* FIXED: Removed mode="wait" for smooth cross-fade transition */}
                    <AnimatePresence>
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0, transition: { staggerChildren: 0.1, duration: 0.5, ease: "easeOut" } }}
                            exit={{ opacity: 0, y: -20, transition: { duration: 0.4 } }}
                            className="relative" // Use relative positioning for smooth transitions
                        >
                            <motion.div variants={sectionVariants} className="inline-block px-4 py-2 mb-6 border border-gray-200 bg-white/50 backdrop-blur-lg rounded-full text-gray-700 font-medium">
                                {currentContent.tagline}
                            </motion.div>
                            <motion.h1 variants={sectionVariants} className="text-4xl md:text-6xl font-extrabold tracking-tighter text-gray-900 mb-6">
                                {currentContent.title}
                            </motion.h1>
                            <motion.p variants={sectionVariants} className="text-lg text-gray-600 max-w-lg mx-auto lg:mx-0 mb-10">
                                {currentContent.subtitle}
                            </motion.p>
                        </motion.div>
                    </AnimatePresence>

                    <motion.div 
                        className="flex flex-col sm:flex-row justify-center lg:justify-start items-center gap-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        {/* UPDATED: Modern CTA Buttons */}
                        <motion.a 
                            href="#jobs" 
                            className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg"
                            whileHover={{ scale: 1.05, y: -2, filter: "brightness(1.1)", boxShadow: "0 10px 20px rgba(59, 130, 246, 0.5)" }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            Explore Jobs
                        </motion.a>
                        <motion.a 
                            href="#professionals" 
                            className="w-full sm:w-auto px-8 py-4 bg-gray-900 text-white font-bold rounded-xl"
                            whileHover={{ scale: 1.05, y: -2, backgroundColor: "#000000" }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            Find Talent
                        </motion.a>
                    </motion.div>
                </div>

                <div className="hidden lg:flex justify-center items-center">
                    <FuturisticRobot hatType={currentContent.hat} />
                </div>
            </div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="absolute bottom-10 left-1/2 -translate-x-1/2">
                <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}>
                    <MoveDown className="text-gray-400" />
                </motion.div>
            </motion.div>
        </section>
    );
};

// ... (The rest of the components remain unchanged)

const TrustedBySection: FC = () => {
    const duplicatedPartners = [...partners, ...partners];
    return (
        <div className="py-20 bg-white">
            <div className="container mx-auto px-6">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-800 text-center mb-16">
                    Trusted by the Nation's Leading Organizations
                </h2>
                <div className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
                    <motion.ul 
                        className="flex items-center justify-center md:justify-start [&_li]:mx-8 [&_img]:max-w-none animate-infinite-scroll"
                        animate={{ x: ["0%", "-50%"] }}
                        transition={{ ease: "linear", duration: 40, repeat: Infinity }}
                    >
                        {duplicatedPartners.map((partner, index) => (
                            <li key={index} className="flex-shrink-0">
                                <img src={partner.logoUrl} alt={partner.name} className="h-10 object-contain filter grayscale hover:grayscale-0 transition-all duration-300" />
                            </li>
                        ))}
                    </motion.ul>
                </div>
            </div>
        </div>
    );
};

const ImpactStatsSection: FC = () => (
    <div className="relative py-20 md:py-28 bg-gradient-to-br from-indigo-900 to-blue-900 text-white">
        <div className="absolute inset-0 opacity-10 bg-[url('/dots.svg')]"></div>
        <div className="container mx-auto px-6 relative z-10">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={sectionVariants}>
                <motion.h2 variants={sectionVariants} className="text-4xl md:text-5xl font-bold text-center mb-4">A Thriving National Ecosystem</motion.h2>
                <motion.p variants={sectionVariants} className="text-lg text-indigo-200 text-center max-w-3xl mx-auto mb-16">
                    Our platform is the trusted engine for the nation's brightest minds and most impactful institutions.
                </motion.p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {ecosystemStats.map(stat => (
                        <motion.div key={stat.label} variants={sectionVariants} className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 text-center">
                            <div className="text-blue-300 mb-2">{React.cloneElement(stat.icon, { size: 40, strokeWidth: 1.5 })}</div>
                            <h3 className="text-4xl md:text-6xl font-bold my-2">
                                <AnimatedCounter value={stat.value} />{stat.suffix}
                            </h3>
                            <p className="text-indigo-200">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </div>
    </div>
);

const CoreSectorsSection: FC = () => (
    <AnimatedSection id="sectors" className="bg-white">
        <motion.h2 variants={sectionVariants} className="text-4xl md:text-5xl font-bold text-gray-800 text-center mb-4">
            Core Development Sectors
        </motion.h2>
        <motion.p variants={sectionVariants} className="text-lg text-gray-600 text-center max-w-2xl mx-auto mb-16">
            Explore the key disciplines driving Somaliland’s growth.
        </motion.p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sectorsData.map(sector => (
                <motion.div 
                    key={sector.name}
                    variants={sectionVariants}
                    whileHover={{ y: -8, boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)" }}
                    className="p-8 bg-gray-50 rounded-2xl border border-gray-200 group transition-all duration-300"
                >
                    <div className="mb-4">
                        <sector.icon className="h-10 w-10 text-blue-600 group-hover:text-violet-600 transition-colors" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{sector.name}</h3>
                    <p className="text-gray-600 mb-4">{sector.description}</p>
                    <span className="font-semibold text-blue-700 bg-blue-100 px-3 py-1 rounded-full text-sm">{sector.stat}</span>
                </motion.div>
            ))}
        </div>
    </AnimatedSection>
);

const LatestJobsSection: FC = () => {
    const typeStyles: { [key: string]: string } = {
        'GOV': 'bg-blue-100 text-blue-800', 'NGO': 'bg-green-100 text-green-800', 'JOB': 'bg-orange-100 text-orange-800',
    };
    return (
        <AnimatedSection id="jobs" className="bg-gray-50">
            <div className="text-center mb-16">
                <motion.h2 variants={sectionVariants} className="text-4xl md:text-5xl font-bold text-gray-800 inline-block relative">
                    Latest Jobs
                    <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-2/3 h-1 bg-gradient-to-r from-blue-500 to-violet-500 rounded-full"></span>
                </motion.h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                {opportunities.map((item, i) => (
                    <motion.div 
                        variants={sectionVariants} 
                        whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }}
                        key={i} 
                        className="bg-white border border-gray-200 rounded-xl p-6 group transition-all duration-300 shadow-sm"
                    >
                        <span className={`text-xs font-bold py-1 px-3 rounded-full ${typeStyles[item.type]}`}>{item.type}</span>
                        <h3 className="text-lg font-bold my-3 text-gray-900">{item.title}</h3>
                        <p className="text-sm text-gray-500 mb-4">{item.org} &bull; {item.location}</p>
                        <a href="#" className="font-semibold text-blue-600 flex items-center gap-2">
                            View Details <ArrowRight size={16} />
                        </a>
                    </motion.div>
                ))}
            </div>
            <motion.div variants={sectionVariants} className="text-center">
                <a href="/opportunities" className="font-bold text-blue-600 text-lg">View All Jobs</a>
            </motion.div>
        </AnimatedSection>
    );
};

const TestimonialsSection: FC = () => {
    const [index, setIndex] = useState(0);

    const paginate = (newIndex: number) => {
        setIndex(newIndex);
    };

    return (
        <AnimatedSection id="testimonials" className="bg-white">
            <div className="relative max-w-3xl mx-auto text-center">
                <div className="overflow-hidden relative h-[420px]">
                    <AnimatePresence initial={false}>
                        <motion.div
                            key={index}
                            initial={{ x: "100%", opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: "-100%", opacity: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="absolute inset-0 bg-white p-8 rounded-2xl shadow-2xl border border-gray-200"
                        >
                            <Quote className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                            <p className="text-xl italic font-medium text-gray-700 mb-6">&quot;{testimonialsData[index].quote}&quot;</p>
                            <img src={testimonialsData[index].avatarUrl} alt={testimonialsData[index].name} className="w-16 h-16 rounded-full mx-auto mb-2 object-cover" />
                            <h4 className="font-bold text-gray-900">{testimonialsData[index].name}</h4>
                            <p className="text-sm text-blue-600 font-medium">{testimonialsData[index].role}</p>
                        </motion.div>
                    </AnimatePresence>
                </div>

                <div className="flex justify-center gap-3 mt-8">
                    {testimonialsData.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => paginate(i)}
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${index === i ? 'bg-blue-600 scale-125' : 'bg-gray-300'}`}
                        />
                    ))}
                </div>
            </div>
        </AnimatedSection>
    );
};

const FAQSection: FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const AccordionItem: FC<{ item: { q: string, a: string }, isOpen: boolean, onClick: () => void }> = ({ item, isOpen, onClick }) => (
        <motion.div layout className="border-b border-gray-200 py-6">
            <motion.button layout onClick={onClick} className="w-full flex justify-between items-center text-left">
                <span className="text-lg font-medium text-gray-900">{item.q}</span>
                <motion.div animate={{ rotate: isOpen ? 90 : 0 }}><ArrowRight className="text-blue-600" /></motion.div>
            </motion.button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden pt-4 text-gray-600"
                    >
                        {item.a}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );

    return (
        <AnimatedSection id="faq" className="bg-gray-50">
            <motion.h2 variants={sectionVariants} className="text-4xl md:text-5xl font-bold text-gray-800 text-center mb-16">Common Questions</motion.h2>
            <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-x-12">
                <div>{faqData.slice(0, 2).map((item, index) => <AccordionItem key={index} item={item} isOpen={openIndex === index} onClick={() => setOpenIndex(openIndex === index ? null : index)} />)}</div>
                <div>{faqData.slice(2, 4).map((item, index) => <AccordionItem key={index + 2} item={item} isOpen={openIndex === index + 2} onClick={() => setOpenIndex(openIndex === index + 2 ? null : index + 2)} />)}</div>
            </div>
        </AnimatedSection>
    );
};

const CTASection: FC = () => (
    <div className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-6">
            <div className="relative bg-gradient-to-br from-blue-700 to-violet-800 rounded-3xl p-12 text-center overflow-hidden">
                <motion.div 
                    className="absolute inset-0 opacity-10" 
                    style={{ backgroundImage: "url('/diagonal-lines.svg')" }}
                    animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear', repeatType: 'mirror' }}
                />
                
                <div className="relative z-10">
                    <motion.h2 initial={{opacity:0, y:20}} whileInView={{opacity:1, y:0}} viewport={{ once: true }} transition={{delay:0.2}} className="text-4xl md:text-5xl font-extrabold text-white mb-4">
                        Join the Movement to Build a Better Somaliland
                    </motion.h2>
                    <motion.p initial={{opacity:0, y:20}} whileInView={{opacity:1, y:0}} viewport={{ once: true }} transition={{delay:0.3}} className="text-lg text-blue-200 max-w-xl mx-auto mb-8">
                        Register as a professional or an institution and become part of the development revolution.
                    </motion.p>
                    <motion.div initial={{opacity:0, y:20}} whileInView={{opacity:1, y:0}} viewport={{ once: true }} transition={{delay:0.4}} className="flex flex-col sm:flex-row justify-center items-center gap-4">
                        <motion.a whileHover={{ scale: 1.05, y: -2 }} href="/register" className="w-full sm:w-auto bg-white text-blue-700 font-bold px-8 py-4 rounded-xl shadow-lg">
                            Register as a Professional
                        </motion.a>
                        <motion.a whileHover={{ scale: 1.05, y: -2 }} href="/register" className="w-full sm:w-auto bg-transparent border-2 border-white text-white font-bold px-8 py-4 rounded-xl">
                            Register an Institution
                        </motion.a>
                    </motion.div>
                </div>
            </div>
        </div>
    </div>
);

export default function HomePage() {
    return (
        <main>
            <HeroSection />
            <TrustedBySection />
            <ImpactStatsSection />
            <CoreSectorsSection />
            <LatestJobsSection />
            <TestimonialsSection />
            <FAQSection />
            <CTASection />
        </main>
    );
}