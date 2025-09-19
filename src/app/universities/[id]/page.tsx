// File Path: app/universities/[id]/page.tsx

"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Users, BookOpen } from 'lucide-react';

export default function UniversityDetailPage({ params }: { params: { id: string } }) {
    const [university, setUniversity] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!params.id) return;
        
        const fetchUniversityDetails = async () => {
            try {
                const response = await fetch(`/api/universities/${params.id}`);
                if (!response.ok) throw new Error('University not found');
                const data = await response.json();
                setUniversity(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchUniversityDetails();
    }, [params.id]);

    if (loading) {
        return <div className="pt-40 text-center">Loading university profile...</div>;
    }

    if (!university) {
        return <div className="pt-40 text-center">University not found.</div>;
    }

    return (
        <div className="bg-white">
            <div className="relative h-96 w-full">
                <img src={university.image_url} alt={`${university.name} campus`} className="w-full h-full object-cover"/>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-12 text-white">
                    <h1 className="text-5xl font-extrabold tracking-tight">{university.name}</h1>
                    <p className="flex items-center gap-2 mt-2 text-lg"><MapPin size={18}/> {university.location}</p>
                </div>
            </div>

            <div className="container mx-auto px-6 py-16">
                <div className="grid md:grid-cols-3 gap-12">
                    <div className="md:col-span-2">
                        <h2 className="text-2xl font-bold mb-4">About {university.name}</h2>
                        <p className="text-gray-600 leading-relaxed">{university.summary}</p>
                    </div>
                    <div className="space-y-6">
                        <div className="bg-gray-50 p-6 rounded-lg border">
                            <h3 className="font-bold text-lg mb-4">Key Information</h3>
                            <div className="space-y-3">
                                <p className="flex items-center gap-3"><Users size={16} className="text-gray-500"/> <strong>{university.student_count}</strong> Students</p>
                                <p className="flex items-center gap-3"><BookOpen size={16} className="text-gray-500"/> <strong>{university.programs_offered}+</strong> Programs</p>
                            </div>
                        </div>
                         <div className="bg-gray-50 p-6 rounded-lg border">
                            <h3 className="font-bold text-lg mb-4">Specializations</h3>
                            <div className="flex flex-wrap gap-2">
                               {university.specializations?.map((spec: string) => (
                                   <span key={spec} className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">{spec}</span>
                               ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}