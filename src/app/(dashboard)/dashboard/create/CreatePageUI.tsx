"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User } from '@supabase/supabase-js';
import { Briefcase, BookOpen, Handshake, Shield, Heart, Lightbulb, Camera, LucideProps } from 'lucide-react';
import { formConfigurations } from './form-config';
import { createOpportunity } from './actions';
import { CreateForm } from './CreateForm';

// This map translates icon names from the config into actual components
const iconMap: Record<string, React.ElementType<LucideProps>> = {
    Briefcase, BookOpen, Handshake, Shield, Heart, Lightbulb, Camera
};

interface Option {
    type: string;
    title: string;
    description: string;
    icon: string;
}

interface CreatePageUIProps {
    user: User;
    options: Option[];
}

export default function CreatePageUI({ user, options }: CreatePageUIProps) {
    const [selectedType, setSelectedType] = useState<string | null>(null);

    // --- Chooser Menu View ---
    if (!selectedType) {
        return (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 rounded-2xl shadow-sm border">
                <div className="text-center">
                    <h1 className="text-3xl font-extrabold text-slate-900">Create New Content</h1>
                    <p className="text-slate-600 mt-2">What would you like to add to the platform today?</p>
                </div>
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {options.map((opt, index) => {
                        const Icon = iconMap[opt.icon];
                        if (!Icon) return null;
                        return (
                            <motion.button
                                key={opt.type}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                onClick={() => setSelectedType(opt.type)}
                                className="group p-6 bg-slate-50 rounded-xl border-2 border-transparent text-left hover:border-sky-500 hover:bg-white transition-all"
                            >
                                <div className="p-3 bg-white rounded-lg border w-fit mb-3">
                                    <Icon className="h-6 w-6 text-sky-600" />
                                </div>
                                <h3 className="font-bold text-slate-800">{opt.title}</h3>
                                <p className="text-sm text-slate-500">{opt.description}</p>
                            </motion.button>
                        )
                    })}
                </div>
            </motion.div>
        );
    }

    // --- Form View ---
    const config = formConfigurations[selectedType];
    if (!config) {
        return (
            <div className="text-center p-10 bg-white rounded-lg shadow-sm border">
                <p className="text-red-600 font-semibold">Error: Form configuration not found.</p>
                <button onClick={() => setSelectedType(null)} className="mt-4 text-sm font-semibold text-sky-600">
                    &larr; Go Back
                </button>
            </div>
        );
    }

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white p-8 rounded-2xl shadow-sm border">
            <h1 className="text-3xl font-extrabold text-slate-900 mb-6">{config.title}</h1>
            <CreateForm 
                config={config} 
                action={createOpportunity}
                user={user}
                onBack={() => setSelectedType(null)} 
            />
        </motion.div>
    );
}