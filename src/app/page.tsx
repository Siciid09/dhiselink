"use client";

import React, { useState, useEffect, FC } from 'react';
import { motion, useAnimation, AnimatePresence, animate } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
    Users, Briefcase, Handshake, Rocket, Code, HardHat,
    Quote, Plus, ArrowRight, MapPin, Building, ChevronRight, ChevronLeft, MoveDown,
    Wrench, Zap, Atom, Wind, Shield, DraftingCompass, Home
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
    { name: "University of Mogadishu", logoUrl: `https://logo.clearbit.com/mogadishuuniversity.edu.so?size=100` },
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

/**
 * Advanced Futuristic Robot Component
 * Features changing hats, eye animations, and a sleek design.
 * NOW WITH: Red eyes, blinking, looking around, eyebrows that shift, smile on hover, red shadow on hover.
 */
const FuturisticRobot: FC<{ hatType: string }> = ({ hatType }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isBlinking, setIsBlinking] = useState(false);
    const [eyeOffset, setEyeOffset] = useState([0, 0]); // x, y for looking around
    const [eyebrowAngle, setEyebrowAngle] = useState(0); // For shifting eyebrows

    // Eye blinking
    useEffect(() => {
        const blinkTimer = setInterval(() => {
            setIsBlinking(true);
            setTimeout(() => setIsBlinking(false), 100); // Blink duration
        }, Math.random() * 3000 + 2000); // Blink every 2-5 seconds
        return () => clearInterval(blinkTimer);
    }, []);

    // Eye looking around
    useEffect(() => {
        const lookTimer = setInterval(() => {
            setEyeOffset([Math.random() * 4 - 2, Math.random() * 4 - 2]); // -2 to 2 offset
        }, Math.random() * 5000 + 3000); // Look around every 3-8 seconds
        return () => clearInterval(lookTimer);
    }, []);

    // Eyebrow shifting
    useEffect(() => {
        const eyebrowTimer = setInterval(() => {
            setEyebrowAngle(Math.random() * 10 - 5); // -5 to 5 degrees
        }, Math.random() * 6000 + 4000); // Shift every 4-10 seconds
        return () => clearInterval(eyebrowTimer);
    }, []);

    const Hat: FC<{ type: string }> = ({ type }) => {
        let hatPath, hatColor;
        switch (type) {
            case 'civil':
                hatPath = "M 170 80 Q 200 60 230 80 L 240 90 L 160 90 Z";
                hatColor = "#FBBF24"; // Yellow
                break;
            case 'tech':
                hatPath = "M 180 85 h 40 v -10 a 20 20 0 0 0 -40 0 z";
                hatColor = "#3B82F6"; // Blue
                break;
            case 'safety':
                hatPath = "M 175 85 C 175 70, 225 70, 225 85 H 175 Z";
                hatColor = "#22C55E"; // Green
                break;
            default:
                hatPath = "";
                hatColor = "transparent";
        }
        return (
            <motion.path
                d={hatPath}
                fill={hatColor}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
            />
        );
    };

    return (
        <motion.div 
            className="relative w-full max-w-lg mx-auto"
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
        >
            {/* Red Shadow/Glow on hover */}
            <motion.div
                className="absolute inset-0 bg-red-500/80 -z-10 rounded-full"
                style={{ filter: 'blur(40px)' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.4 }}
            />

            <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <filter id="soft-glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="8" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Body */}
                <path d="M 200,320 C 150,320 120,280 120,230 L 120,180 L 280,180 L 280,230 C 280,280 250,320 200,320 Z" fill="#E5E7EB" />
                <path d="M 160,180 L 240,180 L 240,170 L 160,170 Z" fill="#9CA3AF" />

                {/* Head */}
                <circle cx="200" cy="120" r="60" fill="#F3F4F6" />
                <circle cx="200" cy="120" r="55" fill="#FFFFFF" />

                {/* Eyebrows */}
                <motion.path 
                    d="M 170 105 L 190 105" 
                    stroke="#111827" strokeWidth="3" fill="none" strokeLinecap="round"
                    animate={{ y: eyebrowAngle, rotate: -eyebrowAngle/2 }} // Shift and slight rotate
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                />
                <motion.path 
                    d="M 210 105 L 230 105" 
                    stroke="#111827" strokeWidth="3" fill="none" strokeLinecap="round"
                    animate={{ y: eyebrowAngle, rotate: eyebrowAngle/2 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                />

                {/* Eyes - Red and Blinking */}
                <motion.g animate={{ x: eyeOffset[0], y: eyeOffset[1] }}>
                    <circle cx="180" cy="120" r="10" fill="#FF0000" />
                    {isBlinking && <rect x="170" y="118" width="20" height="4" fill="#FFFFFF" />} {/* Blink effect */}
                </motion.g>
                <motion.g animate={{ x: eyeOffset[0], y: eyeOffset[1] }}>
                    <circle cx="220" cy="120" r="10" fill="#FF0000" />
                    {isBlinking && <rect x="210" y="118" width="20" height="4" fill="#FFFFFF" />} {/* Blink effect */}
                </motion.g>
                
                {/* Mouth - Smiles on Hover */}
                <motion.path 
                    d="M 190 140 Q 200 150 210 140" 
                    stroke="#9CA3AF" strokeWidth="2" fill="none" 
                    animate={{ d: isHovered ? "M 190 145 Q 200 155 210 145" : "M 190 140 Q 200 150 210 140" }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                />
                
                {/* Hat */}
                <AnimatePresence mode="wait">
                    <Hat key={hatType} type={hatType} />
                </AnimatePresence>
            </svg>
        </motion.div>
    );
};

/**
 * Hero Section
 * NOW WITH: Floating circles and blurred gradients at edges.
 */
const HeroSection: FC = () => {
    const [index, setIndex] = useState(0);
    
    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prevIndex) => (prevIndex + 1) % heroContent.length);
        }, 6000); // Cycle every 6 seconds
        return () => clearInterval(timer);
    }, []);

    const currentContent = heroContent[index];

    // Floating circles animation variants
    const circleVariants = {
        animate: (i: number) => ({
            x: [0, 100 - Math.random() * 200],
            y: [0, 100 - Math.random() * 200],
            scale: [0.5, 1.5],
            opacity: [0, 0.5, 0],
            transition: {
                duration: Math.random() * 8 + 5, // 5-13 seconds
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.5 // Stagger initial animation
            }
        })
    };

    return (
        <section className="relative min-h-screen flex items-center bg-gradient-to-br from-white to-gray-100 overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "url('/grid.svg')", backgroundSize: "40px 40px" }}></div>
            
            {/* Left Blurred Gradient */}
            <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-blue-100/50 to-transparent blur-3xl z-0"></div>
            {/* Right Blurred Gradient */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-violet-100/50 to-transparent blur-3xl z-0"></div>

            {/* Floating Circles */}
            {[...Array(8)].map((_, i) => (
                <motion.div
                    key={i}
                    custom={i}
                    variants={circleVariants}
                    animate="animate"
                    className="absolute bg-blue-300/30 rounded-full"
                    style={{
                        width: Math.random() * 30 + 10, // 10-40px
                        height: Math.random() * 30 + 10,
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                    }}
                />
            ))}
            
            <div className="container mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
                <div className="text-center lg:text-left">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0, transition: { staggerChildren: 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] } }}
                            exit={{ opacity: 0, y: -30 }}
                        >
                            <motion.div variants={sectionVariants} className="inline-block px-4 py-2 mb-6 border border-white/50 bg-white/50 backdrop-blur-lg rounded-full text-gray-700 font-medium">
                                {currentContent.tagline}
                            </motion.div>
                            <motion.h1 variants={sectionVariants} className="text-4xl md:text-6xl font-extrabold tracking-tighter text-gray-900 mb-6">
                                {currentContent.title}
                            </motion.h1>
                            <motion.p variants={sectionVariants} className="text-lg text-gray-600 max-w-lg mx-auto lg:mx-0 mb-10">
                                {currentContent.subtitle}
                            </motion.p>
                            <motion.div variants={sectionVariants} className="flex flex-col sm:flex-row justify-center lg:justify-start items-center gap-4">
                                <motion.a href="#jobs" className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-bold rounded-xl shadow-lg"
                                    whileHover={{ scale: 1.05, y: -2, boxShadow: "0 10px 20px rgba(96, 165, 250, 0.5)" }}
                                    transition={{ type: "spring", stiffness: 300 }}>
                                    Explore Jobs
                                </motion.a>
                                <motion.a href="#professionals" className="w-full sm:w-auto px-8 py-4 text-gray-700 font-bold rounded-xl border-2 border-gray-300"
                                    whileHover={{ scale: 1.05, y: -2, backgroundColor: "#F3F4F6" }}
                                    transition={{ type: "spring", stiffness: 300 }}>
                                    Find Talent
                                </motion.a>
                            </motion.div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                <motion.div 
                    className="hidden lg:block"
                    whileHover={{ scale: 1.05, rotate: -2 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                >
                    <FuturisticRobot hatType={currentContent.hat} />
                </motion.div>
            </div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="absolute bottom-10 left-1/2 -translate-x-1/2">
                <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}>
                    <MoveDown className="text-gray-400" />
                </motion.div>
            </motion.div>
        </section>
    );
};

/**
 * Trusted By Section (Infinite Logo Scroller)
 */
const TrustedBySection: FC = () => {
    const duplicatedPartners = [...partners, ...partners];
    return (
        <div className="py-20 bg-gradient-to-b from-gray-100 to-white">
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

/**
 * Impact Stats Section (Modernized Icons)
 */
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

/**
 * Core Development Sectors Section (Expanded to 9)
 */
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

/**
 * Latest Jobs Section
 */
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

/**
 * Testimonials Section (Upgraded with Dots)
 */
const TestimonialsSection: FC = () => {
    const [index, setIndex] = useState(0);

    const paginate = (newIndex: number) => {
        setIndex(newIndex);
    };

    return (
        <AnimatedSection id="testimonials" className="bg-gradient-to-b from-light-blue-50 to-white">
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

                {/* Navigation Dots */}
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


/**
 * FAQ Section
 */
const FAQSection: FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const AccordionItem: FC<{ item: { q: string, a: string }, isOpen: boolean, onClick: () => void }> = ({ item, isOpen, onClick }) => (
        <motion.div layout className="border-b border-gray-200 py-6">
            <motion.button layout onClick={onClick} className="w-full flex justify-between items-center text-left">
                <span className="text-lg font-medium text-gray-900">{item.q}</span>
                <motion.div animate={{ rotate: isOpen ? 90 : 0 }}><ChevronRight className="text-blue-600" /></motion.div>
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
        <AnimatedSection id="faq" className="bg-white">
            <motion.h2 variants={sectionVariants} className="text-4xl md:text-5xl font-bold text-gray-800 text-center mb-16">Common Questions</motion.h2>
            <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-x-12">
                <div>{faqData.slice(0, 2).map((item, index) => <AccordionItem key={index} item={item} isOpen={openIndex === index} onClick={() => setOpenIndex(openIndex === index ? null : index)} />)}</div>
                <div>{faqData.slice(2, 4).map((item, index) => <AccordionItem key={index + 2} item={item} isOpen={openIndex === index + 2} onClick={() => setOpenIndex(openIndex === index + 2 ? null : index + 2)} />)}</div>
            </div>
        </AnimatedSection>
    );
};


/**
 * Call to Action Section
 */
const CTASection: FC = () => (
    <div className="py-20 md:py-28">
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


// --- 4. MAIN PAGE COMPONENT ---

export default function HomePage() {
    return (
        <main className="bg-white">
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