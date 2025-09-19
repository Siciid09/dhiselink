// File Path: app/about/page.tsx

"use client";

import { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Handshake, Lightbulb, CheckCircle, Star, Target, Eye, Code } from 'lucide-react';

// --- 1. REUSABLE ANIMATION COMPONENT ---
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } } };
const sectionVariants = { hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut", staggerChildren: 0.2 } } };

const AnimatedSection = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => {
    const controls = useAnimation();
    const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });
    useEffect(() => { if (inView) { controls.start('visible'); } }, [controls, inView]);
    return (
        <motion.section ref={ref} animate={controls} initial="hidden" variants={sectionVariants} className={`py-24 md:py-32 relative ${className}`}>
            <div className="container mx-auto px-6">
                {children}
            </div>
        </motion.section>
    );
};

// --- 2. PAGE-SPECIFIC SECTIONS ---
const AboutHeroSection = () => (
    <section className="relative bg-gray-50 pt-48 pb-32 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-gray-50 -z-10"></div>
        <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-blue-200/50 rounded-full filter blur-3xl opacity-50 animate-blob"></div>
        <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-purple-200/50 rounded-full filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>
        <div className="container mx-auto px-6 relative z-10">
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-4xl md:text-6xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-gray-900 to-gray-600 leading-tight mb-4">
                We are Building the Future of Somaliland, Together.
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="max-w-3xl mx-auto text-lg text-gray-600">
                Dhiselink was born from a simple but powerful idea: to create a central hub where Somaliland&apos;s brightest minds could connect with the opportunities to rebuild and redefine our nation.
            </motion.p>
        </div>
    </section>
);

const MissionVisionSection = () => (
    <AnimatedSection className="bg-white">
        <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div variants={itemVariants}>
                <div className="flex items-center gap-4 mb-4">
                    <Target className="w-10 h-10 text-blue-600"/>
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">Our Mission</h2>
                </div>
                <p className="text-gray-600 text-lg">To accelerate Somaliland&apos;s development by creating a transparent, efficient, and collaborative digital ecosystem that connects skilled professionals with impactful opportunities across all sectors.</p>
            </motion.div>
            <motion.div variants={itemVariants}>
                <div className="flex items-center gap-4 mb-4">
                    <Eye className="w-10 h-10 text-blue-600"/>
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">Our Vision</h2>
                </div>
                <p className="text-gray-600 text-lg">To be the foundational platform for nation-building in Somaliland, fostering innovation, retaining local talent, and enabling the successful execution of projects that lead to a prosperous and sustainable future.</p>
            </motion.div>
        </div>
    </AnimatedSection>
);

const StorySection = () => (
     <AnimatedSection className="bg-gray-50">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            <motion.div variants={itemVariants} className="lg:w-1/2">
                <img src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=800&auto=format&fit=crop" alt="Team of builders and planners collaborating on a project" className="rounded-lg shadow-2xl w-full h-full object-cover" />
            </motion.div>
            <motion.div variants={itemVariants} className="lg:w-1/2">
                 <h2 className="text-4xl font-bold tracking-tight text-gray-900 mb-6">The Spark Behind Dhiselink</h2>
                 <p className="text-gray-600 mb-4 text-lg">For years, we witnessed a disconnect. On one side, a generation of talented Somali architects, project managers, and tech developers were eager to contribute but lacked visibility. On the other, institutions struggled to find the right local expertise for critical development projects.</p>
                 <p className="text-gray-600 text-lg">Dhiselink was created to be that bridge. We built a platform founded on trust and technology to make finding opportunities and talent not just easier, but more effective. We are more than a job board; we are a catalyst for progress.</p>
            </motion.div>
        </div>
     </AnimatedSection>
);

const coreValues = [
    { icon: <Handshake className="w-10 h-10 text-blue-600"/>, title: "Collaboration", description: "We believe that rebuilding a nation is a collective effort, designed to break down silos and foster powerful partnerships." },
    { icon: <Star className="w-10 h-10 text-blue-600"/>, title: "Excellence", description: "We are committed to connecting our partners with the highest caliber of professional talent to ensure projects are executed to the highest standard." },
    { icon: <Lightbulb className="w-10 h-10 text-blue-600"/>, title: "Innovation", description: "We leverage technology to solve real-world challenges, creating an efficient and transparent ecosystem for development and growth." },
    { icon: <CheckCircle className="w-10 h-10 text-blue-600"/>, title: "Integrity", description: "We operate with transparency and a commitment to ethical practices, building a trustworthy platform for all stakeholders." }
];

const ValuesSection = () => (
    <AnimatedSection className="bg-white">
        <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight text-gray-900">Our Core Values</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">The principles that guide every decision we make and feature we build.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {coreValues.map(value => (
                <motion.div key={value.title} variants={itemVariants} className="bg-gray-50 p-8 rounded-lg border border-gray-200/80 text-center">
                    <div className="inline-block bg-blue-100 p-4 rounded-full mb-4">{value.icon}</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{value.title}</h3>
                    <p className="text-gray-600 text-sm">{value.description}</p>
                </motion.div>
            ))}
        </div>
    </AnimatedSection>
);

// --- 3. MAIN PAGE COMPONENT ---
export default function AboutPage() {
    return (
        <>
            <AboutHeroSection />
            <MissionVisionSection />
            <StorySection />
            <ValuesSection />
            <style jsx global>{`
              .animation-delay-4000 { animation-delay: -4s; }
              @keyframes blob { 0% { transform: translate(0px, 0px) scale(1); } 33% { transform: translate(30px, -50px) scale(1.1); } 66% { transform: translate(-20px, 20px) scale(0.9); } 100% { transform: translate(0px, 0px) scale(1); } }
              .animate-blob { animation: blob 10s infinite; }
            `}</style>
        </>
    );
}
