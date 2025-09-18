"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown } from 'lucide-react';

// Restructured Nav Links for a dropdown menu structure
const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    {
        name: "Community",
        isDropdown: true,
        dropdownLinks: [
            { name: "Professionals", href: "/professionals", description: "Discover top-tier talent." },
            { name: "Companies", href: "/companies", description: "Find leading institutions." },
            { name: "Universities", href: "/universities", description: "Explore academic partners." },
            { name: "Governments & NGOs", href: "/government-ngos", description: "View public sector entities." },
        ]
    },
    {
        name: "Opportunities",
        isDropdown: true,
        dropdownLinks: [
            { name: "Jobs", href: "/opportunities", description: "Find your next career move." },
            { name: "Idea Hub", href: "/ideas", description: "Collaborate on new ventures." },
        ]
    },
    { name: "Contact", href: "/contact" },
];

const dropdownVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2, ease: "easeIn" } }
};

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [mobileSubMenu, setMobileSubMenu] = useState<string | null>(null);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-b border-gray-200/80">
            <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
                <a href="/" className="text-2xl font-black tracking-tighter text-gray-900">
                    Dhiselink
                </a>

                {/* Desktop Navigation */}
                <div className="hidden lg:flex items-center space-x-10" onMouseLeave={() => setOpenDropdown(null)}>
                    {navLinks.map((link) => (
                        <div key={link.name} className="relative" onMouseEnter={() => link.isDropdown && setOpenDropdown(link.name)}>
                            <div
                                className="flex items-center gap-1 text-md font-bold text-gray-700 hover:text-blue-600 transition-colors duration-300 cursor-pointer"
                            >
                               {link.isDropdown ? (
                                    <span>{link.name}</span>
                                ) : (
                                    <a href={link.href}>{link.name}</a>
                                )}
                                {link.isDropdown && <ChevronDown size={16} />}
                            </div>
                            <AnimatePresence>
                                {link.isDropdown && openDropdown === link.name && (
                                    <motion.div
                                        variants={dropdownVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                        className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-max bg-white rounded-md shadow-2xl border border-gray-100"
                                    >
                                        <div className="p-2">
                                            {link.dropdownLinks?.map(dLink => (
                                                <a key={dLink.name} href={dLink.href} className="block p-3 hover:bg-gray-50 rounded-md transition-colors">
                                                    <p className="font-bold text-gray-800">{dLink.name}</p>
                                                    <p className="text-sm text-gray-500">{dLink.description}</p>
                                                </a>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
                
                <div className="hidden lg:flex items-center">
                    <motion.a href="/register" whileHover={{ scale: 1.05 }} className="bg-blue-600 text-white text-sm font-bold px-6 py-3 rounded-md shadow-lg shadow-blue-500/20 hover:shadow-xl transition-all duration-300">
                        Join Dhiselink
                    </motion.a>
                </div>
                
                {/* Mobile Menu Button */}
                <button
                    aria-label="Toggle mobile menu"
                    className="lg:hidden text-gray-800 focus:outline-none z-[60] p-2 -mr-2"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </nav>
            
            {/* Mobile Menu Panel */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: "0%" }}
                        exit={{ x: "100%" }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className="lg:hidden fixed top-0 left-0 w-full h-screen bg-white z-50"
                    >
                         <div className="flex flex-col h-full">
                            {/* Mobile Header inside the panel */}
                            <div className="flex justify-between items-center p-6 border-b border-gray-200 flex-shrink-0">
                                <a href="/" className="text-2xl font-black tracking-tighter text-gray-900">Dhiselink</a>
                            </div>
                            
                            <div className="flex flex-col p-6 space-y-2 overflow-y-auto">
                                {navLinks.map(link => (
                                    <div key={link.name}>
                                        <button 
                                            onClick={() => {
                                                if (link.isDropdown) {
                                                    setMobileSubMenu(mobileSubMenu === link.name ? null : link.name);
                                                } else {
                                                    setIsMenuOpen(false);
                                                    window.location.href = link.href;
                                                }
                                            }} 
                                            className="w-full text-left flex items-center justify-between text-2xl font-extrabold text-gray-800 hover:bg-gray-100 p-4 rounded-lg transition-colors"
                                        >
                                            {link.name}
                                            {link.isDropdown && <motion.div animate={{ rotate: mobileSubMenu === link.name ? 90 : 0 }}><ChevronDown size={20} /></motion.div>}
                                        </button>
                                       
                                        {link.isDropdown && mobileSubMenu === link.name && (
                                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden pl-6 mt-2">
                                                {link.dropdownLinks?.map(dLink => (
                                                     <a key={dLink.name} href={dLink.href} onClick={() => setIsMenuOpen(false)} className="block py-3 px-4 text-lg font-semibold text-gray-600 hover:bg-gray-100 rounded-lg">{dLink.name}</a>
                                                ))}
                                            </motion.div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="mt-auto p-6 border-t border-gray-200">
                                <a href="/register" className="w-full text-center bg-blue-600 text-white font-bold px-6 py-4 rounded-lg hover:bg-blue-700 transition-all duration-300 block">Join Dhiselink</a>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}

