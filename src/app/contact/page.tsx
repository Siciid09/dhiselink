"use client";

import { motion } from 'framer-motion';
import { MapPin, Phone, Send, Mail } from 'lucide-react';

// --- 1. MOCK DATA FOR CONTACT PAGE ---

const contactDetails = [
    { icon: <MapPin/>, title: "Our Office", line1: "Waaheen, Main Road #1", line2: "Hargeisa, Somaliland" },
    { icon: <Mail/>, title: "Email Us", line1: "info@dhiselink.so", line2: "partnerships@dhiselink.so" },
    { icon: <Phone/>, title: "Call Us", line1: "+252 61 123 4567", line2: "+252 61 765 4321" },
];

// --- 2. PAGE SECTIONS for CONTACT PAGE ---

const ContactHero = () => (
    <section className="bg-gray-50 pt-40 pb-20 md:pt-48 md:pb-24">
        <div className="container mx-auto px-6 text-center">
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-4xl md:text-6xl font-extrabold tracking-tighter text-gray-900 mb-4">Get In Touch</motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="max-w-2xl mx-auto text-lg text-gray-600">We’re here to help and answer any question you might have. We look forward to hearing from you.</motion.p>
        </div>
    </section>
);

const ContactFormSection = () => (
    <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-start">
                {/* Contact Info Column */}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.4 }}>
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-8">Contact Information</h2>
                    <div className="space-y-8">
                        {contactDetails.map((detail, index) => (
                            <div key={index} className="flex items-start gap-4">
                                <div className="flex-shrink-0 bg-blue-100 text-blue-600 rounded-lg p-3">{detail.icon}</div>
                                <div>
                                    <h3 className="font-semibold text-lg text-gray-900">{detail.title}</h3>
                                    <p className="text-gray-600">{detail.line1}</p>
                                    <p className="text-gray-600">{detail.line2}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Contact Form Column */}
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.6 }} className="bg-gray-50 p-8 rounded-lg border border-gray-200">
                    <form className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <input type="text" id="name" name="name" className="w-full h-12 px-4 rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <input type="email" id="email" name="email" className="w-full h-12 px-4 rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                            <input type="text" id="subject" name="subject" className="w-full h-12 px-4 rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                            <textarea id="message" name="message" rows={5} className="w-full p-4 rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                        </div>
                        <div>
                            <motion.button type="submit" whileHover={{ scale: 1.05 }} className="w-full flex items-center justify-center gap-2 bg-gray-800 text-white font-semibold py-3 px-6 rounded-lg hover:bg-black transition-colors duration-300">
                                <Send size={18}/> Send Message
                            </motion.button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    </section>
);

const MapSection = () => (
    <div className="bg-white pb-24">
        <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-8 text-center">Our Location</h2>
             <div className="rounded-lg overflow-hidden border-2 border-gray-200 shadow-lg h-96">
                 <img src="https://placehold.co/1200x400/e2e8f0/4a5568?text=Map+of+Hargeisa+Office" alt="Map showing Dhiselink office location" className="w-full h-full object-cover" />
             </div>
        </div>
    </div>
);


// --- 3. MAIN PAGE COMPONENT ---

export default function ContactPage() {
    return (
        <>
            <ContactHero />
            <ContactFormSection />
            <MapSection />
        </>
    );
}

