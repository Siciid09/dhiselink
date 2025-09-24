"use client";

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Briefcase, BookOpen, Handshake, Shield, Heart, LucideProps } from 'lucide-react';

// This map translates the string names from the config into actual components
const iconMap: Record<string, React.ElementType<LucideProps>> = {
    Briefcase,
    BookOpen,
    Handshake,
    Shield,
    Heart
};

// The interface now correctly expects the icon name as a string
interface ChooserOption {
    type: string;
    title: string;
    description: string;
    icon: string;
}

export default function ChooserMenu({ options }: { options: ChooserOption[] }) {
    const router = useRouter();

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-xl border p-8">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">What would you like to create?</h1>
                <p className="mt-2 text-gray-600">Your role allows you to create the following content types.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {options.map((option: ChooserOption, index) => {
                    // Look up the component from the map
                    const IconComponent = iconMap[option.icon];

                    return (
                        <motion.button
                            key={option.type}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            onClick={() => router.push(`/dashboard/create?type=${option.type}`)}
                            className="text-left p-6 border-2 rounded-xl hover:border-sky-500 hover:bg-sky-50 transition-all w-full"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-lg bg-gray-100 text-gray-700">
                                    {/* Render the looked-up component */}
                                    {IconComponent && <IconComponent size={24} />}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">{option.title}</h3>
                                    <p className="text-sm text-gray-600">{option.description}</p>
                                </div>
                            </div>
                        </motion.button>
                    );
                })}
            </div>
        </motion.div>
    );
}