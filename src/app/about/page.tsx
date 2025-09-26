"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Feather, Layers, Shield, Globe, Users } from "lucide-react";

// Utility
const cn = (...classes: string[]) => classes.filter(Boolean).join(" ");

// --- Animated Background ---
const AnimatedHeroBackground = () => (
  <div className="absolute inset-0 z-0 overflow-hidden bg-[#FDFBF9]">
    <motion.div
      className="absolute top-[5%] left-[10%] w-[500px] h-[500px] bg-amber-100/50 rounded-full"
      animate={{ scale: [1, 1.3, 1], rotate: [0, 90, 0] }}
      transition={{ duration: 40, ease: "easeInOut", repeat: Infinity }}
      style={{ filter: "blur(120px)" }}
    />
    <motion.div
      className="absolute bottom-[10%] right-[5%] w-[400px] h-[400px] bg-amber-100/60 rounded-full"
      animate={{ scale: [1, 1.2, 1], rotate: [0, -90, 0] }}
      transition={{
        duration: 50,
        ease: "easeInOut",
        repeat: Infinity,
        delay: -10,
      }}
      style={{ filter: "blur(120px)" }}
    />
  </div>
);

// --- Pillar Card ---
type PillarCardProps = {
  icon: React.ComponentType<{ className?: string; size?: string | number }>;
  title: string;
  description: string;
  delay?: number;
};

const PillarCard = ({ icon: Icon, title, description, delay }: PillarCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.5 }}
    transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    className="p-10 rounded-3xl bg-white/60 backdrop-blur-md shadow-md hover:shadow-2xl transition-all duration-500 group"
  >
    <div className="flex items-center gap-5">
      <div className="bg-amber-100/90 p-4 rounded-xl group-hover:scale-110 transition-transform">
        <Icon className="text-amber-600" size={32} />
      </div>
      <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
    </div>
    <p className="mt-6 text-lg text-gray-600 leading-relaxed">{description}</p>
  </motion.div>
);

// --- Call To Action Button ---
type CTAButtonProps = {
  href: string;
  children: React.ReactNode;
  primary?: boolean;
};

const CTAButton = ({ href, children, primary = false }: CTAButtonProps) => {
  const base =
    "inline-block px-10 py-5 text-lg font-semibold rounded-2xl overflow-hidden relative transform hover:-translate-y-1 transition-all duration-300 shadow";
  const primaryClasses = "bg-[#2D2D2D] text-white";
  const secondaryClasses =
    "bg-transparent border border-gray-300 hover:bg-gray-100/80";

  return (
    <a href={href} className={cn(base, primary ? primaryClasses : secondaryClasses)}>
      <span className="relative z-10 flex items-center justify-center gap-2 transition-colors">
        {children}
      </span>
      {primary && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-amber-500 to-amber-700"
          initial={{ y: "100%" }}
          whileHover={{ y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        />
      )}
    </a>
  );
};

// --- Main Page ---
export default function AboutUsModernPage() {
  const scrollRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start end", "end start"],
  });

  const parallaxY = useTransform(scrollYProgress, [0, 1], ["-25%", "25%"]);
  const parallaxOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.1, 1, 0.1]);

  const pillars = [
    {
      icon: Layers,
      title: "Progress",
      description:
        "We champion sustainable, iterative growth. Our ecosystem thrives on constant evolution—delivering value today while building a stronger tomorrow.",
    },
    {
      icon: Feather,
      title: "Community",
      description:
        "Every line of code and every project is a reflection of the people behind it. Dhiselink is designed by and for professionals, visionaries, and institutions of Somaliland.",
    },
    {
      icon: Shield,
      title: "Integrity",
      description:
        "Trust is our backbone. We commit to a transparent, verified, and fair environment—ensuring every interaction adds credibility to our shared mission.",
    },
  ];

  return (
    <main
      ref={scrollRef}
      className="bg-[#FDFBF9] text-[#3D3D3D] antialiased relative"
    >
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center text-center overflow-hidden">
        <AnimatedHeroBackground />
        <div className="relative z-10 p-6 flex flex-col items-center max-w-5xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-6xl md:text-8xl lg:text-9xl font-extrabold tracking-tighter leading-tight text-amber-600"
          >
            Architecting Progress.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="mt-10 max-w-3xl text-xl md:text-2xl text-gray-700 leading-relaxed"
          >
            A new era begins here. We’re more than a platform—we’re the bridge
            between ambition and achievement, the spark that connects talent with
            transformative projects.
          </motion.p>
        </div>
      </section>

      {/* Divider */}
      <div className="h-[2px] bg-gradient-to-r from-transparent via-amber-400/40 to-transparent mx-auto w-2/3" />

      {/* Our Blueprint Section */}
      <section className="py-36 md:py-48 relative">
        <motion.h2
          style={{ y: parallaxY, opacity: parallaxOpacity }}
          className="absolute -top-20 left-0 w-full text-center text-[140px] md:text-[200px] font-extrabold text-amber-500/10 tracking-tighter -z-0"
        >
          Our Blueprint
        </motion.h2>
        <div className="max-w-5xl mx-auto text-center relative z-10 px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1 }}
          >
            <p className="text-2xl md:text-4xl leading-relaxed text-gray-800">
              In the heart of Hargeisa, where ideas flow endlessly and projects
              ignite daily, a question remained unanswered:{" "}
              <span className="text-amber-600 font-semibold">
                how do we connect the dots?
              </span>
            </p>
            <p className="my-12 text-3xl md:text-5xl leading-relaxed font-semibold italic text-amber-600">
              Talent was here. Opportunity was here. The missing piece? The Link.
            </p>
            <p className="text-xl md:text-2xl leading-relaxed text-gray-600">
              Dhiselink exists as that critical link—an ecosystem where local
              brilliance meets national development. Together, we accelerate
              progress, empower experts, and weave a stronger fabric for our
              nation’s future.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Core Pillars Section */}
      <section className="py-36 md:py-48 bg-white/40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-extrabold text-amber-600">
              Our Core Pillars
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
              The timeless principles guiding every connection, decision, and
              milestone we shape together.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            {pillars.map((pillar, index) => (
              <PillarCard key={pillar.title} delay={index * 0.2} {...pillar} />
            ))}
          </div>
        </div>
      </section>

      {/* Equation Section */}
      <section className="py-40 md:py-56 bg-[#181818] text-white relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-center text-5xl md:text-8xl font-bold tracking-tight relative z-10"
        >
          <span>BUILD</span>
          <span className="mx-6 text-gray-500">+</span>
          <span>CONNECT</span>
          <span className="mx-6 text-gray-500">=</span>
          <span className="text-amber-500">PROGRESS</span>
        </motion.div>
      </section>

      {/* Call to Action */}
      <section className="py-36 md:py-48 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <h2 className="text-5xl md:text-7xl font-bold text-amber-600">
              Let’s Build the Future Together
            </h2>
            <p className="mt-8 max-w-2xl mx-auto text-xl md:text-2xl text-gray-600 leading-relaxed">
              Whether you’re a visionary professional or a pioneering
              institution, your contribution fuels the collective progress of a
              nation. Together, we create, we grow, and we leave a lasting
              impact.
            </p>
            <div className="mt-16 flex flex-col sm:flex-row justify-center items-center gap-8">
              <CTAButton href="/signup" primary>
                Join as a Professional <ArrowRight size={20} />
              </CTAButton>
              <CTAButton href="/signup">
                Register an Institution
              </CTAButton>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
