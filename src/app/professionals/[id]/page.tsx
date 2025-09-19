// File Path: app/professionals/[id]/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { Briefcase, MapPin, Star, GraduationCap } from 'lucide-react';

export default function ProfessionalDetailPage({ params }: { params: { id: string } }) {
    const [professional, setProfessional] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!params.id) return;
        
        const fetchProfessionalDetails = async () => {
            try {
                const response = await fetch(`/api/professionals/${params.id}`);
                if (!response.ok) throw new Error('Professional not found');
                const data = await response.json();
                setProfessional(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfessionalDetails();
    }, [params.id]);

    if (loading) {
        return <div className="pt-40 text-center">Loading professional profile...</div>;
    }

    if (!professional) {
        return <div className="pt-40 text-center">Professional not found.</div>;
    }

    return (
        <div className="bg-gray-50 min-h-screen pt-32 pb-12">
            <div className="container mx-auto px-6 max-w-3xl">
                <div className="bg-white p-8 rounded-lg shadow-lg border">
                    <div className="flex flex-col sm:flex-row items-start gap-6 mb-6">
                        <img 
                            src={`https://ui-avatars.com/api/?name=${professional.name.replace(' ', '+')}&background=EBF4FF&color=3B82F6&bold=true&size=128`} 
                            alt={professional.name} 
                            className="w-32 h-32 rounded-full border-4 border-white shadow-md flex-shrink-0"
                        />
                        <div className="flex-1">
                            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">{professional.name}</h1>
                            <p className="text-xl font-medium text-blue-600 mt-1">{professional.title}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-500 mt-3">
                                <span className="flex items-center gap-1.5"><MapPin size={14} /> {professional.location}</span>
                                <span className="flex items-center gap-1.5"><Briefcase size={14} /> {professional.experience} Experience</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-lg font-bold mb-2 text-gray-800">Summary</h2>
                        <p className="text-gray-600 mb-6">{professional.summary}</p>
                        
                        <h2 className="text-lg font-bold mb-3 text-gray-800">Skills</h2>
                        <div className="flex flex-wrap gap-2">
                            {professional.skills?.map((skill: string) => (
                                <span key={skill} className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">{skill}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
