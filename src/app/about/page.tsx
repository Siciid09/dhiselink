"use client";

import { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Handshake, Lightbulb, CheckCircle, Target, Eye, Users, ArrowRight, Globe, BarChart3, Building, Search, ShieldCheck, Zap, Star } from 'lucide-react';

// --- ANIMATION & LAYOUT UTILITIES ---
const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut", staggerChildren: 0.2 } }
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

const AnimatedSection = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });
  useEffect(() => { if (inView) { controls.start('visible'); } }, [controls, inView]);

  return (
    <motion.section ref={ref} animate={controls} initial="hidden" variants={sectionVariants} className={`relative py-28 md:py-40 ${className}`}>
      <div className="container mx-auto px-6">{children}</div>
    </motion.section>
  );
};

// --- SUPER MODERN PAGE SECTIONS ---

const AboutHeroSection = () => (
  <section className="relative bg-slate-900 pt-56 pb-48 text-center overflow-hidden">
    <div className="absolute inset-0 bg-grid-slate-800 [mask-image:linear-gradient(to_bottom,white_10%,transparent)]"></div>
    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent"></div>
    <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-500/20 rounded-full filter blur-3xl opacity-60 animate-blob"></div>
    <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-500/20 rounded-full filter blur-3xl opacity-60 animate-blob animation-delay-4000"></div>
    <div className="container mx-auto px-6 relative z-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
        <h1 className="text-5xl md:text-8xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-300 leading-tight mb-6">
          The OS for Nation-Building.
        </h1>
        <p className="max-w-4xl mx-auto text-lg md:text-xl text-slate-400">
          Dhiselink is a high-trust digital ecosystem engineered to connect elite talent with critical development projects, starting in Somaliland and scaling across its neighborhoods.
        </p>
      </motion.div>
    </div>
  </section>
);

const ProblemSection = () => (
    <AnimatedSection className="bg-white">
        <div className="text-center mb-16">
            <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900">The Paradox of Development</motion.h2>
            <motion.p variants={itemVariants} className="mt-4 text-lg text-slate-600 max-w-3xl mx-auto">In Somaliland and its neighborhoods, a critical disconnect stalls progress, creating a cycle of dependency and inefficiency.</motion.p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div variants={itemVariants} className="bg-slate-50 p-8 rounded-2xl border border-slate-200/80">
                <h3 className="text-2xl font-bold text-slate-800 mb-3">Underutilized Local Talent</h3>
                <p className="text-slate-600 text-lg leading-relaxed">Nations are rich with brilliant, highly-skilled professionals, yet these experts often remain invisible to the market, leading to a "brain drain" and a reliance on expensive foreign contractors.</p>
            </motion.div>
            <motion.div variants={itemVariants} className="bg-slate-50 p-8 rounded-2xl border border-slate-200/80">
                <h3 className="text-2xl font-bold text-slate-800 mb-3">Inefficient Project Staffing</h3>
                <p className="text-slate-600 text-lg leading-relaxed">Organizations and governments spend billions on development projects, but without a transparent talent marketplace, they face costly delays, operational risks, and suboptimal project outcomes.</p>
            </motion.div>
        </div>
    </AnimatedSection>
);

const SolutionSection = () => (
    <AnimatedSection className="bg-slate-900 text-white">
         <div className="absolute inset-0 bg-grid-slate-800/80 [mask-image:linear-gradient(to_bottom,white_10%,transparent_90%)]"></div>
         <div className="relative text-center mb-20">
            <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-300">Our Solution: A Digital Trust Ecosystem</motion.h2>
            <motion.p variants={itemVariants} className="mt-4 text-lg text-slate-400 max-w-3xl mx-auto">Dhiselink is not a job board. It is a high-trust, data-driven infrastructure designed to make local expertise the primary engine of development.</motion.p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div variants={itemVariants} className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700 backdrop-blur-sm">
                <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400 inline-block mb-4"><ShieldCheck className="w-8 h-8"/></div>
                <h3 className="text-2xl font-bold text-white mb-2">Verification & Credentialing</h3>
                <p className="text-slate-400">We employ a rigorous vetting process, verifying qualifications and experience to create a pool of elite, project-ready professionals.</p>
            </motion.div>
            <motion.div variants={itemVariants} className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700 backdrop-blur-sm">
                <div className="p-3 bg-indigo-500/10 rounded-lg text-indigo-400 inline-block mb-4"><Zap className="w-8 h-8"/></div>
                <h3 className="text-2xl font-bold text-white mb-2">Intelligent Matching Engine</h3>
                <p className="text-slate-400">Our proprietary algorithms match project requirements with professional skill sets, ensuring optimal team assembly and reducing hiring timelines.</p>
            </motion.div>
            <motion.div variants={itemVariants} className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700 backdrop-blur-sm">
                <div className="p-3 bg-green-500/10 rounded-lg text-green-400 inline-block mb-4"><BarChart3 className="w-8 h-8"/></div>
                <h3 className="text-2xl font-bold text-white mb-2">Performance Analytics</h3>
                <p className="text-slate-400">We provide stakeholders with real-time data on talent availability and project milestones, enabling data-driven strategic decisions.</p>
            </motion.div>
        </div>
    </AnimatedSection>
);

const StorySection = () => (
    <AnimatedSection className="bg-white">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <motion.div variants={itemVariants} className="lg:w-1/2">
                <img src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=800&auto=format&fit=crop" alt="Team collaborating on a project" className="rounded-2xl shadow-2xl w-full h-full object-cover" />
            </motion.div>
            <motion.div variants={itemVariants} className="lg:w-1/2">
               <h2 className="text-4xl font-bold tracking-tight text-slate-900 mb-6">The Spark Behind Dhiselink</h2>
               <p className="text-slate-600 mb-4 text-lg leading-relaxed">Dhiselink was born from a direct observation: Somaliland possesses a deep well of brilliant, ambitious professionals eager to build their nation. Yet, they lacked a unified platform to connect their skills with the critical projects that needed them most.</p>
               <p className="text-slate-600 text-lg leading-relaxed">We created Dhiselink to be that essential bridge. It is a catalyst designed to systematically dismantle the barriers between local talent and opportunity, ensuring that the architects of our future come from within our own communities.</p>
            </motion.div>
        </div>
    </AnimatedSection>
);

const ValuesSection = () => (
    <AnimatedSection className="bg-slate-50">
        <div className="text-center mb-16">
            <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900">Our Core Values</motion.h2>
            <motion.p variants={itemVariants} className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">The principles that guide every decision we make, every feature we build, and every partnership we forge.</motion.p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div variants={itemVariants} className="bg-white p-8 rounded-2xl border border-slate-200/80 text-center transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                <div className="inline-block bg-blue-100 p-4 rounded-full mb-5 text-blue-600"><Handshake className="w-10 h-10"/></div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Collaboration</h3>
                <p className="text-slate-600">We engineer powerful partnerships to break down silos and accelerate collective progress.</p>
            </motion.div>
            <motion.div variants={itemVariants} className="bg-white p-8 rounded-2xl border border-slate-200/80 text-center transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                <div className="inline-block bg-indigo-100 p-4 rounded-full mb-5 text-indigo-600"><Star className="w-10 h-10"/></div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Excellence</h3>
                <p className="text-slate-600">We are committed to connecting partners with the highest caliber of talent to ensure world-class execution.</p>
            </motion.div>
            <motion.div variants={itemVariants} className="bg-white p-8 rounded-2xl border border-slate-200/80 text-center transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                <div className="inline-block bg-amber-100 p-4 rounded-full mb-5 text-amber-600"><Lightbulb className="w-10 h-10"/></div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Innovation</h3>
                <p className="text-slate-600">We leverage technology to solve real-world challenges, creating an efficient ecosystem for growth.</p>
            </motion.div>
            <motion.div variants={itemVariants} className="bg-white p-8 rounded-2xl border border-slate-200/80 text-center transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                <div className="inline-block bg-green-100 p-4 rounded-full mb-5 text-green-600"><CheckCircle className="w-10 h-10"/></div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Integrity</h3>
                <p className="text-slate-600">We operate with total transparency to build a trustworthy platform for all stakeholders.</p>
            </motion.div>
        </div>
    </AnimatedSection>
);


const WhoWeServeSection = () => (
    <AnimatedSection className="bg-white">
        <div className="text-center mb-16">
            <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900">An Ecosystem for Growth</motion.h2>
            <motion.p variants={itemVariants} className="mt-4 text-lg text-slate-600 max-w-3xl mx-auto">Dhiselink is engineered to serve the core pillars of national development, creating strategic value for every stakeholder.</motion.p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <motion.div variants={itemVariants} className="bg-slate-50 p-8 rounded-2xl border border-slate-200/80 transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:border-blue-300">
                <div className="p-3 bg-blue-100 rounded-lg text-blue-600 inline-block mb-4"><Users className="w-8 h-8"/></div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">For Professionals</h3>
                <p className="text-slate-600">Access a curated pipeline of high-impact projects. Showcase your skills, build your portfolio, and become a key player in shaping the future of your nation and beyond.</p>
            </motion.div>
            <motion.div variants={itemVariants} className="bg-slate-50 p-8 rounded-2xl border border-slate-200/80 transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:border-indigo-300">
                <div className="p-3 bg-indigo-100 rounded-lg text-indigo-600 inline-block mb-4"><Building className="w-8 h-8"/></div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">For Organizations</h3>
                <p className="text-slate-600">Discover and hire elite, vetted local talent with unparalleled speed and efficiency. Reduce risk, cut costs, and ensure your projects are executed with the highest degree of local expertise.</p>
            </motion.div>
            <motion.div variants={itemVariants} className="bg-slate-50 p-8 rounded-2xl border border-slate-200/80 transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:border-green-300">
                <div className="p-3 bg-green-100 rounded-lg text-green-600 inline-block mb-4"><Handshake className="w-8 h-8"/></div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">For Government & NGOs</h3>
                <p className="text-slate-600">Gain unprecedented transparency into the talent market. Identify skill gaps, track project progress, and make data-driven decisions to optimize national development strategies.</p>
            </motion.div>
        </div>
    </AnimatedSection>
);

const CtaSection = () => (
    <section className="bg-slate-900">
        <div className="container mx-auto px-6 py-24 text-center">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.8 }}
            >
                <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-300 mb-4">Architect the Future With Us.</h2>
                <p className="text-slate-400 max-w-2xl mx-auto text-lg mb-8">
                    Whether you are an expert ready to build, or an organization with a vision to realize, your journey into the future of development starts here.
                </p>
                <a href="/register" className="bg-white text-slate-900 font-bold py-4 px-8 rounded-full text-lg transition-transform transform hover:scale-105 inline-flex items-center gap-2 shadow-2xl shadow-blue-500/20">
                    Join The Dhiselink Platform <ArrowRight />
                </a>
            </motion.div>
        </div>
    </section>
);


// --- MAIN PAGE COMPONENT ---
export default function AboutPage() {
    return (
        <div className="bg-white">
            <AboutHeroSection />
            <ProblemSection />
            <SolutionSection />
            <StorySection />
            <ValuesSection />
            <WhoWeServeSection />
            <CtaSection />
            <style jsx global>{`
                .animation-delay-4000 { animation-delay: -4s; }
                @keyframes blob { 
                    0% { transform: translate(0px, 0px) scale(1); } 
                    33% { transform: translate(30px, -50px) scale(1.1); } 
                    66% { transform: translate(-20px, 20px) scale(0.9); } 
                    100% { transform: translate(0px, 0px) scale(1); } 
                }
                .animate-blob { animation: blob 10s infinite; }
                .bg-grid-slate-800 {
                    background-image: linear-gradient(white 1px, transparent 1px), linear-gradient(to right, white 1px, transparent 1px);
                    background-size: 4rem 4rem;
                    background-position: center center;
                    opacity: 0.1;
                }
            `}</style>
        </div>
    );
}

