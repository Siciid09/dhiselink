"use client";

import React, { useEffect, useRef } from 'react';
import { motion, useAnimation, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Briefcase, Users, Link, Check, TrendingUp } from 'lucide-react';

// --- ANIMATION & LAYOUT UTILITIES ---
const sectionVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1, ease: [0.22, 1, 0.36, 1], staggerChildren: 0.3 } }
};
const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.22, 1, 0.36, 1] } }
};
const AnimatedSection = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => {
    const controls = useAnimation();
    const [ref, inView] = useInView({ threshold: 0.2, triggerOnce: true });
    useEffect(() => { if (inView) { controls.start('visible'); } }, [controls, inView]);
    return <motion.div ref={ref} animate={controls} initial="hidden" variants={sectionVariants} className={className}>{children}</motion.div>;
};

// --- CORE VISUAL COMPONENTS ---
const AnimatedWord = ({ text }: { text: string }) => {
    const words = text.split(" ");
    return (
        <span style={{ display: 'inline-block', overflow: 'hidden' }}>
            {words.map((word, i) => (
                <motion.span
                    key={i}
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 + i * 0.1 }}
                    className="inline-block"
                    style={{ marginRight: '0.25em' }}
                >
                    {word}
                </motion.span>
            ))}
        </span>
    );
};

const HorizontalLine = () => (
    <motion.div
        className="h-[1px] w-full bg-gradient-to-r from-transparent via-slate-300 to-transparent"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 1, ease: 'easeOut' }}
    />
);


// --- 1. THE OVERTURE: A POWERFUL HOOK ---
const OvertureSection = () => (
    <div className="relative min-h-screen flex flex-col justify-center items-center text-center">
        <h1 className="text-6xl md:text-9xl font-bold tracking-tighter text-slate-900 leading-none">
            <AnimatedWord text="Potential. Progress." />
        </h1>
        <h2 className="text-4xl md:text-7xl font-bold tracking-tight text-slate-500 mt-4">
             <AnimatedWord text="And the space between." />
        </h2>
    </div>
);


// --- 2. THE THESIS: ANCHORED MANIFESTO ---
const ThesisSection = () => {
    const targetRef = useRef<HTMLDivElement | null>(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start end", "end start"]
    });

    const opacity = useTransform(scrollYProgress, [0, 0.1, 0.8, 1], [0, 1, 1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.1], [0.9, 1]);
    const stickyOpacity = useTransform(scrollYProgress, [0.15, 0.2, 0.7, 0.75], [0, 1, 1, 0]);

    return (
        <div ref={targetRef} className="relative h-[300vh]">
            <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
                <motion.div style={{ opacity, scale }} className="absolute inset-0 bg-white" />
                <div className="relative container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16">
                    <motion.div style={{ opacity: stickyOpacity }} className="hidden lg:flex items-center">
                        <h2 className="text-6xl font-bold tracking-tighter text-slate-900">
                            We exist to close that space.
                        </h2>
                    </motion.div>
                    <div className="prose prose-xl text-slate-700 leading-relaxed space-y-8 py-20">
                        <p>In Hargeisa, a paradox slows our nation's ascent. We see a generation of brilliant minds—engineers, developers, planners—possessing world-class skills, yet disconnected from the critical projects shaping our skyline and infrastructure.</p>
                        <p className="font-semibold text-indigo-700">This is <span className="italic">The Great Disconnect</span>: the gap between local talent and local opportunity. It’s the primary obstacle to a truly self-reliant Somaliland.</p>
                        <p>Dhiselink is not merely a platform. It is the bridge. We are the architects of a new professional ecosystem, engineered to ensure the builders of our future come from within our borders.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};


// --- 3. THE MECHANISM: INTERACTIVE REVEAL ---
const MechanismSection = () => (
    <AnimatedSection className="max-w-4xl mx-auto space-y-32">
        <div className="text-center">
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-slate-900">
                Our System for Progress
            </h2>
        </div>
        <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div variants={itemVariants}>
                <div className="flex items-center gap-4 mb-4">
                    <div className="p-4 bg-slate-100 rounded-full border border-slate-200 text-blue-600"><Check className="w-8 h-8" /></div>
                    <h3 className="text-3xl font-bold text-slate-900">1. Trust, Verified.</h3>
                </div>
                <p className="text-xl text-slate-600 leading-relaxed">Our ecosystem is built on a foundation of absolute trust. Every professional undergoes a rigorous verification of credentials, portfolio, and references. This isn't just a profile; it's a vetted, proven record of excellence.</p>
            </motion.div>
            <motion.div variants={itemVariants} className="h-64 bg-slate-100 rounded-2xl border border-slate-200">
                {/* Placeholder for abstract visual */}
            </motion.div>
        </div>
        <HorizontalLine />
        <div className="grid md:grid-cols-2 gap-12 items-center">
             <motion.div variants={itemVariants} className="h-64 bg-slate-100 rounded-2xl border border-slate-200 md:order-last">
                {/* Placeholder for abstract visual */}
            </motion.div>
            <motion.div variants={itemVariants}>
                <div className="flex items-center gap-4 mb-4">
                    <div className="p-4 bg-slate-100 rounded-full border border-slate-200 text-indigo-600"><Link className="w-8 h-8" /></div>
                    <h3 className="text-3xl font-bold text-slate-900">2. Opportunity, Matched.</h3>
                </div>
                <p className="text-xl text-slate-600 leading-relaxed">Using proprietary algorithms, we move beyond keywords to match deep skill sets with complex project needs. This intelligent connection reduces hiring from months to days, assembling optimal teams with precision.</p>
            </motion.div>
        </div>
        <HorizontalLine />
        <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div variants={itemVariants}>
                <div className="flex items-center gap-4 mb-4">
                    <div className="p-4 bg-slate-100 rounded-full border border-slate-200 text-green-600"><TrendingUp className="w-8 h-8" /></div>
                    <h3 className="text-3xl font-bold text-slate-900">3. Progress, Measured.</h3>
                </div>
                <p className="text-xl text-slate-600 leading-relaxed">We provide all stakeholders with transparent, real-time analytics. From talent deployment to project milestones, our data empowers strategic decisions and ensures accountability from start to finish.</p>
            </motion.div>
            <motion.div variants={itemVariants} className="h-64 bg-slate-100 rounded-2xl border border-slate-200">
                {/* Placeholder for abstract visual */}
            </motion.div>
        </div>
    </AnimatedSection>
);

// --- 4. THE HORIZON: TRANSITION TO CTA ---
const HorizonSection = () => {
    const targetRef = useRef<HTMLDivElement | null>(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start end", "end end"]
    });
    const bgColor = useTransform(scrollYProgress, [0.3, 1], ["#FFFFFF", "#0F172A"]); // White to slate-900
    const textColor = useTransform(scrollYProgress, [0.3, 1], ["#0F172A", "#FFFFFF"]); // slate-900 to White

    return (
        <div ref={targetRef} className="relative h-[200vh]">
            <div className="sticky top-0 h-screen flex flex-col justify-center items-center text-center overflow-hidden">
                <motion.div style={{ backgroundColor: bgColor }} className="absolute inset-0" />
                <div className="container mx-auto px-6 relative z-10">
                    <motion.h2
                        style={{ color: textColor }}
                        className="text-5xl md:text-8xl font-bold tracking-tighter"
                    >
                        The Next Chapter is Yours.
                    </motion.h2>
                    <motion.div
                        className="mt-16 flex flex-col sm:flex-row justify-center items-center gap-4"
                        initial={{ opacity: 0 }}
                        style={{ opacity: useTransform(scrollYProgress, [0.8, 1], [0, 1]) }}
                    >
                         <a href="/register-professional" className="w-full sm:w-auto bg-white text-slate-900 font-bold py-4 px-8 rounded-full text-lg transition-transform transform hover:scale-105 inline-flex items-center justify-center gap-2">
                            <Briefcase className="w-5 h-5"/> I'm a Professional
                        </a>
                        <a href="/register-organization" className="w-full sm:w-auto text-white font-bold py-4 px-8 rounded-full text-lg transition-colors transform hover:bg-slate-800 inline-flex items-center justify-center gap-2 border border-slate-700">
                            <Users className="w-5 h-5"/> I'm an Organization
                        </a>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};


// --- MAIN PAGE COMPONENT ---
export default function AboutPage() {
    return (
        <main className="bg-white antialiased">
            <style jsx global>{`
              body {
                background-color: #0F172A; /* Fallback for smooth transition end */
              }
            `}</style>
            <OvertureSection />
            <ThesisSection />
            <MechanismSection />
            <HorizonSection />
        </main>
    );
}